import { useEffect, useRef } from "react";
import { EventCallback, INode, INodeRef, NodeId } from "./types";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};

export const composeHandlers = (
  ...handlers: EventCallback[]
): EventCallback => (event): void => {
  for (const handler of handlers) {
    handler && handler(event);
    if (event.defaultPrevented) {
      break;
    }
  }
};

export const difference = (a: Set<NodeId>, b: Set<NodeId>) => {
  const s = new Set<NodeId>();
  for (const v of a) {
    if (!b.has(v)) {
      s.add(v);
    }
  }
  return s;
};

export const symmetricDifference = (a: Set<NodeId>, b: Set<NodeId>) => {
  return new Set<NodeId>([...difference(a, b), ...difference(b, a)]);
};

export const usePrevious = (x: Set<NodeId>) => {
  const ref = useRef<Set<NodeId>>();
  useEffect(() => {
    ref.current = x;
  }, [x]);
  return ref.current;
};

export const usePreviousData = (value: INode[]) => {
  const ref = useRef<INode[]>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const isBranchNode = (data: INode[], i: NodeId) => {
  const node = getTreeNode(data, i);
  return !!node.children?.length;
};

export const scrollToRef = (ref: INodeRef) => {
  if (ref != null && ref.scrollIntoView) {
    ref.scrollIntoView({ block: "nearest" });
  }
};

export const focusRef = (ref: INodeRef) => {
  if (ref != null && ref.focus) {
    ref.focus({ preventScroll: true });
  }
};

export const getParent = (data: INode[], id: NodeId) => {
  return getTreeNode(data, id).parent;
};

export const getAncestors = (
  data: INode[],
  childId: NodeId,
  disabledIds: Set<NodeId>
) => {
  let currentId = childId;
  const ancestors: NodeId[] = [];
  while (true) {
    const parent = getParent(data, currentId);
    if (
      parent === 0 ||
      parent == null ||
      (parent != null && disabledIds.has(parent))
    ) {
      break;
    }
    ancestors.push(parent);

    currentId = parent;
  }
  return ancestors;
};

export const getDescendants = (
  data: INode[],
  id: NodeId,
  disabledIds: Set<NodeId>
) => {
  const descendants: NodeId[] = [];
  const getDescendantsHelper = (data: INode[], id: NodeId) => {
    const node = getTreeNode(data, id);
    if (node.children == null) return;
    for (const childId of node.children.filter((x) => !disabledIds.has(x))) {
      descendants.push(childId);
      getDescendantsHelper(data, childId);
    }
  };
  getDescendantsHelper(data, id);
  return descendants;
};

export const getChildren = (data: INode[], id: NodeId) => {
  const children: NodeId[] = [];
  const node = getTreeNode(data, id);
  return node.children == null ? children : node.children;
};

export const getSibling = (data: INode[], id: NodeId, diff: number) => {
  const parentId = getParent(data, id);
  if (parentId != null) {
    const parent = getTreeNode(data, parentId);
    const index = parent.children.indexOf(id);
    const siblingIndex = index + diff;
    if (parent.children[siblingIndex]) {
      return parent.children[siblingIndex];
    }
  }
  return null;
};

export const getLastAccessible = (
  data: INode[],
  id: NodeId,
  expandedIds: Set<NodeId>
) => {
  let node = getTreeNode(data, id);
  const isRoot = getTreeParent(data).id === id;
  if (isRoot) {
    node = getTreeNode(
      data,
      getTreeNode(data, id).children[getTreeNode(data, id).children.length - 1]
    );
  }
  while (expandedIds.has(node.id) && isBranchNode(data, node.id)) {
    node = getTreeNode(data, node.children[node.children.length - 1]);
  }
  return node.id;
};

export const getPreviousAccessible = (
  data: INode[],
  id: NodeId,
  expandedIds: Set<NodeId>
) => {
  if (id === getTreeParent(data).children[0]) {
    return null;
  }
  const previous = getSibling(data, id, -1);
  if (previous == null) {
    return getParent(data, id);
  }
  return getLastAccessible(data, previous, expandedIds);
};

export const getNextAccessible = (
  data: INode[],
  id: NodeId,
  expandedIds: Set<NodeId>
) => {
  let nodeId: NodeId | null = getTreeNode(data, id).id;
  if (isBranchNode(data, nodeId) && expandedIds.has(nodeId)) {
    return getTreeNode(data, nodeId).children[0];
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

export const propagateSelectChange = (
  data: INode[],
  ids: Set<NodeId>,
  selectedIds: Set<NodeId>,
  disabledIds: Set<NodeId>,
  halfSelectedIds: Set<NodeId>,
  multiSelect?: boolean
) => {
  const changes = {
    every: new Set<NodeId>(),
    some: new Set<NodeId>(),
    none: new Set<NodeId>(),
  };
  for (const id of ids) {
    let currentId = id;
    while (true) {
      const parent = getParent(data, currentId);
      if (
        parent === 0 ||
        parent == null ||
        (parent != null && disabledIds.has(parent))
      ) {
        break;
      }
      const enabledChildren = getTreeNode(data, parent).children.filter(
        (x) => !disabledIds.has(x)
      );
      if (enabledChildren.length === 0) break;
      const some = enabledChildren.some(
        (x) =>
          selectedIds.has(x) || changes.some.has(x) || halfSelectedIds.has(x)
      );
      if (!some) {
        const selectedAncestorId = getAncestors(
          data,
          currentId,
          disabledIds
        ).find((id) => {
          return selectedIds.has(id);
        });
        if (!multiSelect && selectedAncestorId) {
          const descendants = getDescendants(
            data,
            selectedAncestorId,
            disabledIds
          );
          descendants.forEach((id) => {
            halfSelectedIds.has(id) && changes.none.add(id);
          });
          break;
        } else {
          changes.none.add(parent);
        }
      } else {
        if (enabledChildren.every((x) => selectedIds.has(x))) {
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

export const getAccessibleRange = ({
  data,
  expandedIds,
  from,
  to,
}: {
  data: INode[];
  expandedIds: Set<NodeId>;
  from: NodeId;
  to: NodeId;
}) => {
  const range: NodeId[] = [];
  const max_loop = data.length;
  let count = 0;
  let currentId: NodeId | null = from;
  range.push(from);
  if (from < to) {
    while (count < max_loop) {
      currentId = getNextAccessible(data, currentId, expandedIds);
      currentId != null && range.push(currentId);
      if (currentId == null || currentId === to) break;
      count += 1;
    }
  } else if (from > to) {
    while (count < max_loop) {
      currentId = getPreviousAccessible(data, currentId, expandedIds);
      currentId != null && range.push(currentId);
      if (currentId == null || currentId === to) break;
      count += 1;
    }
  }

  return range;
};

/**
 * This is to help consumers to understand that we do not currently support metadata that is a nested object. If this is needed, make an issue in Github
 */
export type IFlatMetadata = Record<string, string | number | undefined | null>;

interface ITreeNode<M extends IFlatMetadata> {
  id?: NodeId;
  name: string;
  children?: ITreeNode<M>[];
  metadata?: M;
}

export const flattenTree = <M extends IFlatMetadata>(tree: ITreeNode<M>): INode<M>[] => {
  let internalCount = 0;
  const flattenedTree: INode<M>[] = [];

  const flattenTreeHelper = (tree: ITreeNode<M>, parent: NodeId | null) => {
    const node: INode<M> = {
      id: tree.id || internalCount,
      name: tree.name,
      children: [],
      parent,
      metadata: tree.metadata ? { ...tree.metadata} : undefined
    };

    if (flattenedTree.find((x) => x.id === node.id)) {
      throw Error(
        `Multiple TreeView nodes have the same ID (${node.id}). IDs must be unique.`
      );
    }

    flattenedTree.push(node);
    internalCount += 1;
    if (!tree.children?.length) return;
    for (const child of tree.children) {
      flattenTreeHelper(child, node.id);
    }
    for (const child of flattenedTree.values()) {
      if (child.parent === node.id) {
        node.children.push(child.id);
      }
    }
  };

  flattenTreeHelper(tree, null);
  return flattenedTree;
};

export const getAriaSelected = ({
  isSelected,
  isDisabled,
  multiSelect,
}: {
  isSelected: boolean;
  isDisabled: boolean;
  multiSelect: boolean;
}): boolean | undefined => {
  if (isDisabled) return isSelected;
  if (multiSelect) return isSelected;
  return isSelected ? true : undefined;
};

export const getAriaChecked = ({
  isSelected,
  isDisabled,
  isHalfSelected,
  multiSelect,
}: {
  isSelected: boolean;
  isDisabled: boolean;
  isHalfSelected: boolean;
  multiSelect: boolean;
}): boolean | undefined | "mixed" => {
  if (isDisabled) return isSelected;
  if (isHalfSelected) return "mixed";
  if (multiSelect) return isSelected;
  return isSelected ? true : undefined;
};

export const propagatedIds = (
  data: INode[],
  ids: NodeId[],
  disabledIds: Set<NodeId>
) =>
  ids.concat(
    ...ids
      .filter((id) => isBranchNode(data, id))
      .map((id) => getDescendants(data, id, disabledIds))
  );

const isIE = () => window.navigator.userAgent.match(/Trident/);

export const onComponentBlur = (
  event: React.FocusEvent,
  treeNode: HTMLUListElement | null,
  callback: () => void
) => {
  if (treeNode == null) {
    console.warn("ref not set on <ul>");
    return;
  }
  if (isIE()) {
    setTimeout(
      () => !treeNode.contains(document.activeElement) && callback(),
      0
    );
  } else {
    !treeNode.contains(event.nativeEvent.relatedTarget as Node) && callback();
  }
};

export const isBranchSelectedAndHasSelectedDescendants = (
  data: INode[],
  elementId: NodeId,
  selectedIds: Set<NodeId>
) => {
  return (
    isBranchNode(data, elementId) &&
    selectedIds.has(elementId) &&
    getDescendants(data, elementId, new Set<number>()).some((item) =>
      selectedIds.has(item)
    )
  );
};

export const isBranchNotSelectedAndHasAllSelectedDescendants = (
  data: INode[],
  elementId: NodeId,
  selectedIds: Set<NodeId>
) => {
  return (
    isBranchNode(data, elementId) &&
    !selectedIds.has(elementId) &&
    getDescendants(data, elementId, new Set<number>()).every((item) =>
      selectedIds.has(item)
    )
  );
};

export const isBranchNotSelectedAndHasOnlySelectedChild = (
  data: INode[],
  elementId: NodeId,
  selectedIds: Set<NodeId>
) => {
  const nodeChildren = getChildren(data, elementId);
  return (
    isBranchNode(data, elementId) &&
    !selectedIds.has(elementId) &&
    nodeChildren.length === 1 &&
    nodeChildren.every((item) => selectedIds.has(item))
  );
};

export const isBranchSelectedAndHasOnlySelectedChild = (
  data: INode[],
  elementId: NodeId,
  selectedIds: Set<NodeId>
) => {
  const nodeChildren = getChildren(data, elementId);
  return (
    isBranchNode(data, elementId) &&
    selectedIds.has(elementId) &&
    nodeChildren.length === 1 &&
    nodeChildren.every((item) => selectedIds.has(item))
  );
};

export const getTreeParent = (data: INode[]): INode => {
  const parentNode: INode | undefined = data.find(
    (node) => node.parent === null
  );

  if (!parentNode) {
    throw Error("TreeView data must contain parent node.");
  }

  return parentNode;
};

export const getTreeNode = (data: INode[], id: NodeId): INode => {
  const treeNode = data.find((node) => node.id === id);

  if (treeNode == null) {
    throw Error(`Node with id=${id} doesn't exist in the tree.`);
  }

  return treeNode;
};

const hasDuplicates = (ids: NodeId[]): boolean => {
  const uniqueIds = Array.from(new Set(ids));
  return ids.length !== uniqueIds.length;
};

/**
 * We need to validate a tree data for 
 * - duplicates
 * - node references to itself
 * - node has duplicated children
 * - no root node in a tree
 * - more then one root node in a tree
 * */
export const validateTreeViewData = (data: INode[]): void => {
  if (hasDuplicates(data.map((node) => node.id))) {
    throw Error(
      `Multiple TreeView nodes have the same ID. IDs must be unique.`
    );
  }

  data.forEach((node) => {
    if (node.id === node.parent) {
      throw Error(`Node with id=${node.id} has parent reference to itself.`);
    }
    if (hasDuplicates(node.children)) {
      throw Error(
        `Node with id=${node.id} contains duplicate ids in its children.`
      );
    }
  });

  if (data.filter((node) => node.parent === null).length === 0) {
    throw Error(`TreeView must have one root node.`);
  }

  if (data.filter((node) => node.parent === null).length > 1) {
    throw Error(`TreeView can have only one root node.`);
  }

  return;
};
