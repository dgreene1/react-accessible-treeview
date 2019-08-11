import { useRef, useEffect } from "react";
import { bigIntLiteral } from "@babel/types";
export const composeHandlers = (...handlers) => event => {
  for (const handler of handlers) {
    handler && handler(event);
    if (event.defaultPrevented) {
      break;
    }
  }
};

export const difference = (a, b) => {
  const s = new Set();
  for (const v of a) {
    if (!b.has(v)) {
      s.add(v);
    }
  }
  return s;
};

export const symmetricDifference = (a, b) => {
  return new Set([...difference(a, b), ...difference(b, a)]);
};

export const usePrevious = x => {
  const ref = useRef();
  useEffect(() => {
    ref.current = x;
  }, [x]);
  return ref.current;
};

export const isBranchNode = (data, i) =>
  data[i].children != null && data[i].children.length > 0;

export const focusRef = ref => {
  if (ref != null && ref.focus) {
    ref.focus();
  }
};

export const getParent = (data, id) => {
  return data[id].parent;
};

export const getDescendants = (data, id, disabledIds) => {
  const descendants = [];
  const getDescendantsHelper = (data, id) => {
    const node = data[id];
    if (node.children == null) return;
    for (const childId of node.children.filter(x => !disabledIds.has(x))) {
      descendants.push(childId);
      getDescendantsHelper(data, childId);
    }
  };
  getDescendantsHelper(data, id);
  return descendants;
};

export const getSibling = (data, id, diff) => {
  const parentId = getParent(data, id);
  if (parentId != null) {
    const parent = data[parentId];
    const index = parent.children.indexOf(id);
    const siblingIndex = index + diff;
    if (parent.children[siblingIndex]) {
      return parent.children[siblingIndex];
    }
  }
  return null;
};

export const getLastAccessible = (data, id, expandedIds) => {
  let node = data[id];
  const isRoot = data[0].id === id;
  if (isRoot) {
    node = data[data[id].children[data[id].children.length - 1]];
  }
  while (expandedIds.has(node.id) && isBranchNode(data, node.id)) {
    node = data[node.children[node.children.length - 1]];
  }
  return node.id;
};

export const getPreviousAccessible = (data, id, expandedIds) => {
  if (id === data[0].children[0]) {
    return null;
  }
  const previous = getSibling(data, id, -1);
  if (previous == null) {
    return getParent(data, id);
  }
  return getLastAccessible(data, previous, expandedIds);
};

export const getNextAccessible = (data, id, expandedIds) => {
  let nodeId = data[id].id;
  if (isBranchNode(data, nodeId) && expandedIds.has(nodeId)) {
    return data[nodeId].children[0];
  }
  while (true) {
    const next = getSibling(data, nodeId, 1);
    if (next != null) {
      return next;
    }
    nodeId = getParent(data, nodeId);

    //we have reached the root so there is no next accessible node
    if (nodeId == null) {
      return null;
    }
  }
};

export const propagateSelectChange = (data, ids, selectedIds, disabledIds) => {
  const changes = { every: new Set(), some: new Set(), none: new Set() };
  for (const id of ids) {
    let currentId = id;
    while (true) {
      const parent = getParent(data, currentId);
      if (parent === 0 || disabledIds.has(parent)) break;
      const enabledChildren = data[parent].children.filter(
        x => !disabledIds.has(x)
      );
      if (enabledChildren.length === 0) break;
      const some = enabledChildren.some(x => selectedIds.has(x));
      if (!some) {
        changes.none.add(parent);
      } else {
        if (enabledChildren.every(x => selectedIds.has(x))) {
          changes.every.add(parent);
        } else {
          changes.some.add(parent);
        }
      }
      currentId = parent;
    }
  }
  return changes;
};

export const getAccessibleRange = ({ data, expandedIds, from, to }) => {
  let range = [];
  let max_loop = Object.keys(data).length;
  let count = 0;
  let currentId = from;
  range.push(from);
  if (from < to) {
    while (count < max_loop) {
      currentId = getNextAccessible(data, currentId, expandedIds);
      range.push(currentId);
      if (currentId == null || currentId === to) break;
      count += 1;
    }
  } else if (from > to) {
    while (count < max_loop) {
      currentId = getPreviousAccessible(data, currentId, expandedIds);
      range.push(currentId);
      if (currentId == null || currentId === to) break;
      count += 1;
    }
  }
  return range;
};

export const flattenTree = function(tree) {
  let count = 0;
  const flattenedTree = [];

  const flattenTreeHelper = function(tree, parent) {
    tree.id = count;
    tree.parent = parent;
    flattenedTree[count] = tree;
    count += 1;
    if (tree.children == null || tree.children.length === 0) return;
    for (const child of tree.children) {
      flattenTreeHelper(child, tree.id);
    }
    tree.children = tree.children.map(x => x.id);
  };

  flattenTreeHelper(tree, null);
  return flattenedTree;
};

export const getAriaSelected = (isSelected, multiSelect) => {
  if (multiSelect) {
    return isSelected;
  } else {
    return isSelected ? true : undefined;
  }
};

export const propagatedIds = (data, ids, disabledIds) =>
  ids.concat(
    ...ids
      .filter(id => isBranchNode(data, id))
      .map(id => getDescendants(data, id, disabledIds))
  );
