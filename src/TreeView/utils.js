import { useRef, useEffect } from "react";
export const composeHandlers = (...handlers) => event => {
    console.log(handlers)
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
  for (const x of data.values()) {
    if (x.children && x.children.includes(id)) {
      return x.id;
    }
  }
  return null;
};

export const getDescendants = (data, id) => {
  const descendants = [];
  const getDescendantsHelper = (data, id) => {
    const node = data[id];
    for (const childId of node.children || []) {
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
