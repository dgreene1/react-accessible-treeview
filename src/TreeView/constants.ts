export const baseClassNames = {
  root: "tree",
  node: "tree-node",
  branch: "tree-node__branch",
  branchWrapper: "tree-branch-wrapper",
  leafListItem: "tree-leaf-list-item",
  leaf: "tree-node__leaf",
  nodeGroup: "tree-node-group",
} as const;

export const clickActions = {
  select: "SELECT",
  focus: "FOCUS",
  exclusiveSelect: "EXCLUSIVE_SELECT",
} as const;

export const CLICK_ACTIONS = Object.freeze(Object.values(clickActions));

export const nodeActions = {
  check: "check",
  select: "select",
} as const;

export const NODE_ACTIONS = Object.freeze(Object.values(nodeActions));
