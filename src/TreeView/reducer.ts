import { treeTypes } from "./constants";
import { NodeId } from "./types";
import { difference } from "./utils";

export type TreeViewAction =
  | { type: "COLLAPSE"; id: NodeId; lastInteractedWith?: NodeId | null }
  | { type: "COLLAPSE_MANY"; ids: NodeId[]; lastInteractedWith?: NodeId | null }
  | { type: "EXPAND"; id: NodeId; lastInteractedWith?: NodeId | null }
  | { type: "EXPAND_MANY"; ids: NodeId[]; lastInteractedWith?: NodeId | null }
  | {
      type: "HALF_SELECT";
      id: NodeId;
      lastInteractedWith?: NodeId | null;
      lastManuallyToggled?: NodeId | null;
      keepFocus?: boolean;
      NotUserAction?: boolean;
    }
  | {
      type: "SELECT";
      id: NodeId;
      multiSelect?: boolean;
      keepFocus?: boolean;
      NotUserAction?: boolean;
      lastInteractedWith?: NodeId | null;
      lastManuallyToggled?: NodeId | null;
    }
  | {
      type: "DESELECT";
      id: NodeId;
      multiSelect?: boolean;
      keepFocus?: boolean;
      NotUserAction?: boolean;
      lastInteractedWith?: NodeId | null;
      lastManuallyToggled?: NodeId | null;
    }
  | { type: "TOGGLE"; id: NodeId; lastInteractedWith?: NodeId | null }
  | {
      type: "TOGGLE_SELECT";
      id: NodeId;
      multiSelect?: boolean;
      NotUserAction?: boolean;
      lastInteractedWith?: NodeId | null;
      lastManuallyToggled?: NodeId | null;
    }
  | {
      type: "SELECT_MANY";
      ids: NodeId[];
      select?: boolean;
      multiSelect?: boolean;
      lastInteractedWith?: NodeId | null;
      lastManuallyToggled?: NodeId | null;
    }
  | { type: "EXCLUSIVE_SELECT_MANY" }
  | {
      type: "EXCLUSIVE_CHANGE_SELECT_MANY";
      ids: NodeId[];
      select?: boolean;
      multiSelect?: boolean;
      lastInteractedWith?: NodeId | null;
      lastManuallyToggled?: NodeId | null;
    }
  | { type: "FOCUS"; id: NodeId; lastInteractedWith?: NodeId | null }
  | { type: "BLUR" }
  | { type: "DISABLE"; id: NodeId }
  | { type: "ENABLE"; id: NodeId }
  | { type: "CLEAR_MANUALLY_TOGGLED" }
  | {
      type: "CONTROLLED_SELECT_MANY";
      ids: NodeId[];
      multiSelect?: boolean;
    }
  | {
      type: "UPDATE_TREE_STATE_WHEN_DATA_CHANGED";
      tabbableId: NodeId;
      lastInteractedWith?: NodeId | null;
      lastManuallyToggled?: NodeId | null;
      lastUserSelect: NodeId;
    };

export interface ITreeViewState {
  /** Set of the ids of the expanded nodes */
  expandedIds: Set<NodeId>;
  /** Set of the ids of the selected nodes */
  disabledIds: Set<NodeId>;
  /** Set of the ids of the selected nodes */
  halfSelectedIds: Set<NodeId>;
  /** Set of the ids of the selected nodes */
  selectedIds: Set<NodeId>;
  /** Set of the ids of the controlled selected nodes */
  controlledIds: Set<NodeId>;
  /** Id of the node with tabindex = 0 */
  tabbableId: NodeId;
  /** Whether the tree has focus */
  isFocused: boolean;
  /** Last selection made directly by the user */
  lastUserSelect: NodeId;
  /** Last node interacted with */
  lastInteractedWith?: NodeId | null;
  /** Last node manually selected/deselected */
  lastManuallyToggled?: NodeId | null;
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
        tabbableId: action.keepFocus ? state.tabbableId : action.id,
        lastAction: action.type,
        lastInteractedWith: action.lastInteractedWith,
        lastManuallyToggled: action.lastManuallyToggled,
        lastUserSelect: action.NotUserAction ? state.lastUserSelect : action.id,
      };
    }
    case treeTypes.select: {
      if (!action.NotUserAction && state.disabledIds.has(action.id))
        return state;
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
        isFocused: action.NotUserAction !== true,
        lastUserSelect: action.NotUserAction ? state.lastUserSelect : action.id,
        lastAction: action.type,
        lastInteractedWith: action.lastInteractedWith,
        lastManuallyToggled: action.lastManuallyToggled,
      };
    }
    case treeTypes.deselect: {
      if (!action.NotUserAction && state.disabledIds.has(action.id))
        return state;
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
        lastManuallyToggled: action.lastManuallyToggled,
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
        lastManuallyToggled: action.lastManuallyToggled,
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
          lastManuallyToggled: action.lastManuallyToggled,
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
          lastManuallyToggled: action.lastManuallyToggled,
        };
      }
      return state;
    }
    case treeTypes.controlledSelectMany: {
      let selectedIds;
      let lastInteractedWith = state.lastInteractedWith;
      let tabbableId = state.tabbableId;
      if (action.multiSelect) {
        selectedIds = new Set<NodeId>(action.ids);
        if (action.ids.length) {
          lastInteractedWith = action.ids[action.ids.length - 1];
          tabbableId = action.ids[action.ids.length - 1];
        }
      } else {
        selectedIds = new Set<NodeId>();
        if (action.ids.length > 1) {
          console.warn(
            "Tree in singleSelect mode, only the first item from selectedIds will be selected."
          );
        }
        const idToAdd = action.ids[0];
        idToAdd && selectedIds.add(idToAdd);
        lastInteractedWith = idToAdd ?? lastInteractedWith;
        tabbableId = idToAdd ?? lastInteractedWith;
      }

      const halfSelectedIds = new Set<NodeId>(state.halfSelectedIds);
      action.ids.every((id) => halfSelectedIds.delete(id));
      const controlledIds = new Set<NodeId>(action.ids);

      return {
        ...state,
        selectedIds,
        halfSelectedIds,
        controlledIds,
        isFocused: true,
        lastAction: action.type,
        tabbableId,
        lastInteractedWith,
      };
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
    case treeTypes.clearLastManuallyToggled: {
      return {
        ...state,
        lastManuallyToggled: null,
      };
    }
    case treeTypes.updateTreeStateWhenDataChanged: {
      return {
        ...state,
        tabbableId: action.tabbableId,
        lastInteractedWith: action.lastInteractedWith,
        lastManuallyToggled: action.lastManuallyToggled,
        lastUserSelect: action.lastUserSelect,
      };
    }
    default:
      throw new Error("Invalid action passed to the reducer");
  }
};
