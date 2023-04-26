import { NodeId } from "./types";
import { difference } from "./utils";

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
  blur: "BLUR",
  disable: "DISABLE",
  enable: "ENABLE",
} as const;

export type TreeViewAction =
  | { type: "COLLAPSE"; id: NodeId; lastInteractedWith?: NodeId | null }
  | { type: "COLLAPSE_MANY"; ids: NodeId[]; lastInteractedWith?: NodeId | null }
  | { type: "EXPAND"; id: NodeId; lastInteractedWith?: NodeId | null }
  | { type: "EXPAND_MANY"; ids: NodeId[]; lastInteractedWith?: NodeId | null }
  | {
      type: "HALF_SELECT";
      id: NodeId;
      lastInteractedWith?: NodeId | null;
    }
  | {
      type: "SELECT";
      id: NodeId;
      multiSelect?: boolean;
      controlled?: boolean;
      keepFocus?: boolean;
      NotUserAction?: boolean;
      lastInteractedWith?: NodeId | null;
    }
  | {
      type: "DESELECT";
      id: NodeId;
      multiSelect?: boolean;
      controlled?: boolean;
      keepFocus?: boolean;
      NotUserAction?: boolean;
      lastInteractedWith?: NodeId | null;
    }
  | { type: "TOGGLE"; id: NodeId; lastInteractedWith?: NodeId | null }
  | {
      type: "TOGGLE_SELECT";
      id: NodeId;
      multiSelect?: boolean;
      NotUserAction?: boolean;
      lastInteractedWith?: NodeId | null;
    }
  | {
      type: "SELECT_MANY";
      ids: NodeId[];
      select?: boolean;
      multiSelect?: boolean;
      lastInteractedWith?: NodeId | null;
    }
  | { type: "EXCLUSIVE_SELECT_MANY" }
  | {
      type: "EXCLUSIVE_CHANGE_SELECT_MANY";
      ids: NodeId[];
      select?: boolean;
      multiSelect?: boolean;
      lastInteractedWith?: NodeId | null;
    }
  | { type: "FOCUS"; id: NodeId; lastInteractedWith?: NodeId | null }
  | { type: "BLUR" }
  | { type: "DISABLE"; id: NodeId }
  | { type: "ENABLE"; id: NodeId };

export interface ITreeViewState {
  /** Set of the ids of the expanded nodes */
  expandedIds: Set<NodeId>;
  /** Set of the ids of the selected nodes */
  disabledIds: Set<NodeId>;
  /** Set of the ids of the selected nodes */
  halfSelectedIds: Set<NodeId>;
  /** Set of the ids of the selected nodes */
  selectedIds: Set<NodeId>;
  /** Id of the node with tabindex = 0 */
  tabbableId: NodeId;
  /** Whether the tree has focus */
  isFocused: boolean;
  /** Last selection made directly by the user */
  lastUserSelect: NodeId;
  /** Last node interacted with */
  lastInteractedWith?: NodeId | null;
  lastAction?: TreeViewAction["type"];
}

export const treeReducer = (
  state: ITreeViewState,
  action: TreeViewAction
): ITreeViewState => {
  switch (action.type) {
    case treeTypes.collapse: {
      const expandedIds = new Set<NodeId>(state.expandedIds);
      expandedIds.delete(action.id);
      return {
        ...state,
        expandedIds,
        tabbableId: action.id,
        isFocused: true,
        lastAction: action.type,
        lastInteractedWith: action.lastInteractedWith,
      };
    }
    case treeTypes.collapseMany: {
      const expandedIds = new Set<NodeId>(state.expandedIds);
      for (const id of action.ids) {
        expandedIds.delete(id);
      }
      return {
        ...state,
        expandedIds,
        lastAction: action.type,
        lastInteractedWith: action.lastInteractedWith,
      };
    }
    case treeTypes.expand: {
      const expandedIds = new Set<NodeId>(state.expandedIds);
      expandedIds.add(action.id);
      return {
        ...state,
        expandedIds,
        tabbableId: action.id,
        isFocused: true,
        lastAction: action.type,
        lastInteractedWith: action.lastInteractedWith,
      };
    }
    case treeTypes.expandMany: {
      const expandedIds = new Set<NodeId>([
        ...state.expandedIds,
        ...action.ids,
      ]);
      return {
        ...state,
        expandedIds,
        lastAction: action.type,
        lastInteractedWith: action.lastInteractedWith,
      };
    }
    case treeTypes.toggle: {
      const expandedIds = new Set<NodeId>(state.expandedIds);
      if (state.expandedIds.has(action.id)) expandedIds.delete(action.id);
      else expandedIds.add(action.id);
      return {
        ...state,
        expandedIds,
        tabbableId: action.id,
        isFocused: true,
        lastAction: action.type,
        lastInteractedWith: action.lastInteractedWith,
      };
    }
    case treeTypes.halfSelect: {
      if (state.disabledIds.has(action.id)) return state;
      const halfSelectedIds = new Set<NodeId>(state.halfSelectedIds);
      const selectedIds = new Set<NodeId>(state.selectedIds);
      halfSelectedIds.add(action.id);
      selectedIds.delete(action.id);
      return {
        ...state,
        selectedIds,
        halfSelectedIds,
        lastAction: action.type,
        lastInteractedWith: action.lastInteractedWith,
      };
    }
    case treeTypes.select: {
      if (!action.controlled && state.disabledIds.has(action.id)) return state;
      let selectedIds;
      if (action.multiSelect) {
        selectedIds = new Set<NodeId>(state.selectedIds);
        selectedIds.add(action.id);
      } else {
        selectedIds = new Set<NodeId>();
        selectedIds.add(action.id);
      }

      const halfSelectedIds = new Set<NodeId>(state.halfSelectedIds);
      halfSelectedIds.delete(action.id);
      return {
        ...state,
        selectedIds,
        halfSelectedIds,
        tabbableId: action.keepFocus ? state.tabbableId : action.id,
        isFocused: true,
        lastUserSelect: action.NotUserAction ? state.lastUserSelect : action.id,
        lastAction: action.type,
        lastInteractedWith: action.lastInteractedWith,
      };
    }
    case treeTypes.deselect: {
      if (!action.controlled && state.disabledIds.has(action.id)) return state;
      const selectedIds = new Set<NodeId>(state.selectedIds);
      selectedIds.delete(action.id);
      let halfSelectedIds;
      if (action.multiSelect) {
        halfSelectedIds = new Set<NodeId>(state.halfSelectedIds);
        halfSelectedIds.delete(action.id);
      } else {
        halfSelectedIds = new Set<NodeId>();
      }

      return {
        ...state,
        selectedIds,
        halfSelectedIds,
        tabbableId: action.keepFocus ? state.tabbableId : action.id,
        isFocused: true,
        lastUserSelect: action.NotUserAction ? state.lastUserSelect : action.id,
        lastAction: action.type,
        lastInteractedWith: action.lastInteractedWith,
      };
    }
    case treeTypes.toggleSelect: {
      if (state.disabledIds.has(action.id)) return state;
      let selectedIds;
      const isSelected = state.selectedIds.has(action.id);
      if (action.multiSelect) {
        selectedIds = new Set<NodeId>(state.selectedIds);
        if (isSelected) selectedIds.delete(action.id);
        else selectedIds.add(action.id);
      } else {
        selectedIds = new Set<NodeId>();
        if (!isSelected) selectedIds.add(action.id);
      }

      const halfSelectedIds = new Set<NodeId>(state.halfSelectedIds);
      halfSelectedIds.delete(action.id);
      return {
        ...state,
        selectedIds,
        halfSelectedIds,
        tabbableId: action.id,
        isFocused: true,
        lastUserSelect: action.NotUserAction ? state.lastUserSelect : action.id,
        lastAction: action.type,
        lastInteractedWith: action.lastInteractedWith,
      };
    }
    case treeTypes.changeSelectMany: {
      let selectedIds: Set<NodeId>;
      const ids = action.ids.filter((id) => !state.disabledIds.has(id));
      if (action.multiSelect) {
        if (action.select) {
          selectedIds = new Set<NodeId>([...state.selectedIds, ...ids]);
        } else {
          selectedIds = difference(state.selectedIds, new Set<NodeId>(ids));
        }
        const halfSelectedIds = difference(state.halfSelectedIds, selectedIds);
        return {
          ...state,
          selectedIds,
          halfSelectedIds,
          lastAction: action.type,
          lastInteractedWith: action.lastInteractedWith,
        };
      }
      return state;
    }
    case treeTypes.exclusiveChangeSelectMany: {
      let selectedIds: Set<NodeId>;
      const ids = action.ids.filter((id) => !state.disabledIds.has(id));
      if (action.multiSelect) {
        if (action.select) {
          selectedIds = new Set<NodeId>(ids);
        } else {
          selectedIds = difference(state.selectedIds, new Set<NodeId>(ids));
        }
        const halfSelectedIds = difference(state.halfSelectedIds, selectedIds);
        return {
          ...state,
          selectedIds,
          halfSelectedIds,
          lastAction: action.type,
          lastInteractedWith: action.lastInteractedWith,
        };
      }
      return state;
    }
    case treeTypes.focus:
      return {
        ...state,
        tabbableId: action.id,
        isFocused: true,
        lastAction: action.type,
        lastInteractedWith: action.lastInteractedWith,
      };
    case treeTypes.blur:
      return {
        ...state,
        isFocused: false,
      };
    case treeTypes.disable: {
      const disabledIds = new Set<NodeId>(state.disabledIds);
      disabledIds.add(action.id);
      return {
        ...state,
        disabledIds,
      };
    }
    case treeTypes.enable: {
      const disabledIds = new Set<NodeId>(state.disabledIds);
      disabledIds.delete(action.id);
      return {
        ...state,
        disabledIds,
      };
    }
    default:
      throw new Error("Invalid action passed to the reducer");
  }
};
