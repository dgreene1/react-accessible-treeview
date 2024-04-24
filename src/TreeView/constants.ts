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

export const treeTypes = {
  collapse: "COLLAPSE",
  collapseMany: "COLLAPSE_MANY",
  expand: "EXPAND",
  expandMany: "EXPAND_MANY",
  halfSelect: "HALF_SELECT",
  select: "SELECT",
  deselect: "DESELECT",
  toggle: "TOGGLE",
  toggleSelect: "TOGGLE_SELECT",
  changeSelectMany: "SELECT_MANY",
  exclusiveChangeSelectMany: "EXCLUSIVE_CHANGE_SELECT_MANY",
  focus: "FOCUS",
  clearFocus: "CLEAR_FOCUS",
  blur: "BLUR",
  disable: "DISABLE",
  enable: "ENABLE",
  clearLastManuallyToggled: "CLEAR_MANUALLY_TOGGLED",
  controlledSelectMany: "CONTROLLED_SELECT_MANY",
  updateTreeStateWhenDataChanged: "UPDATE_TREE_STATE_WHEN_DATA_CHANGED",
} as const;
