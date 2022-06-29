import cx from "classnames";
import PropTypes from "prop-types";
import React, { useEffect, useReducer, useRef } from "react";
import {
  composeHandlers,
  difference,
  focusRef,
  getAccessibleRange,
  getAriaSelected,
  getDescendants,
  getLastAccessible,
  getNextAccessible,
  getParent,
  getPreviousAccessible,
  isBranchNode,
  onComponentBlur,
  propagatedIds,
  propagateSelectChange,
  symmetricDifference,
  usePrevious,
} from "./utils";

export interface INode {
  /** A non-negative integer that uniquely identifies the node. */
  id: number;
  /** Used to match on key press. */
  name: string;
  /** An array with the ids of the children nodes. */
  children: number[];
  /** The parent of the node. null for the root node. */
  parent: number | null;
}

const baseClassNames = {
  root: "tree",
  node: "tree-node",
  branch: "tree-node__branch",
  branchWrapper: "tree-branch-wrapper",
  leafListItem: "tree-leaf-list-item",
  leaf: "tree-node__leaf",
  nodeGroup: "tree-node-group",
};

const treeTypes = {
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
  exclusiveSelectMany: "EXCLUSIVE_SELECT_MANY",
  exclusiveChangeSelectMany: "EXCLUSIVE_CHANGE_SELECT_MANY",
  focus: "FOCUS",
  blur: "BLUR",
  disable: "DISABLE",
  enable: "ENABLE",
};

const treeReducer = (state: any, action: any) => {
  switch (action.type) {
    case treeTypes.collapse: {
      const expandedIds = new Set(state.expandedIds);
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
      const expandedIds = new Set(state.expandedIds);
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
      const expandedIds = new Set(state.expandedIds);
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
      const expandedIds = new Set([...state.expandedIds, ...action.ids]);
      return {
        ...state,
        expandedIds,
        lastAction: action.type,
        lastInteractedWith: action.lastInteractedWith,
      };
    }
    case treeTypes.toggle: {
      const expandedIds = new Set(state.expandedIds);
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
      const halfSelectedIds = new Set(state.halfSelectedIds);
      const selectedIds = new Set(state.selectedIds);
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
      if (state.disabledIds.has(action.id)) return state;
      let selectedIds;
      if (action.multiSelect) {
        selectedIds = new Set(state.selectedIds);
        selectedIds.add(action.id);
      } else {
        selectedIds = new Set();
        selectedIds.add(action.id);
      }

      const halfSelectedIds = new Set(state.halfSelectedIds);
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
      if (state.disabledIds.has(action.id)) return state;
      let selectedIds;
      if (action.multiSelect) {
        selectedIds = new Set(state.selectedIds);
        selectedIds.delete(action.id);
      } else {
        selectedIds = new Set();
      }
      const halfSelectedIds = new Set(state.halfSelectedIds);
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
    case treeTypes.toggleSelect: {
      if (state.disabledIds.has(action.id)) return state;
      let selectedIds;
      const isSelected = state.selectedIds.has(action.id);
      if (action.multiSelect) {
        selectedIds = new Set(state.selectedIds);
        if (isSelected) selectedIds.delete(action.id);
        else selectedIds.add(action.id);
      } else {
        selectedIds = new Set();
        if (!isSelected) selectedIds.add(action.id);
      }

      const halfSelectedIds = new Set(state.halfSelectedIds);
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
      let selectedIds;
      const ids = action.ids.filter((id: any) => !state.disabledIds.has(id));
      if (action.multiSelect) {
        if (action.select) {
          selectedIds = new Set([...state.selectedIds, ...ids]);
        } else {
          selectedIds = difference(state.selectedIds, new Set(ids));
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
      let selectedIds: any;
      const ids = action.ids.filter((id: any) => !state.disabledIds.has(id));
      if (action.multiSelect) {
        if (action.select) {
          selectedIds = new Set(ids);
        } else {
          selectedIds = difference(state.selectedIds, new Set(ids));
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
      const disabledIds = new Set(state.disabledIds);
      disabledIds.add(action.id);
      return {
        ...state,
        disabledIds,
      };
    }
    case treeTypes.enable: {
      const disabledIds = new Set(state.disabledIds);
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

const useTree = ({
  data,
  defaultExpandedIds,
  defaultSelectedIds,
  defaultDisabledIds,
  nodeRefs,
  onSelect,
  onExpand,
  multiSelect,
  propagateSelectUpwards,
}: any) => {
  const [state, dispatch] = useReducer(treeReducer, {
    selectedIds: new Set(defaultSelectedIds),
    tabbableId: data[0].children[0],
    isFocused: false,
    expandedIds: new Set(defaultExpandedIds),
    halfSelectedIds: new Set(),
    lastUserSelect: data[0].children[0],
    lastInteractedWith: null,
    disabledIds: new Set(defaultDisabledIds),
  });

  const {
    selectedIds,
    expandedIds,
    disabledIds,
    tabbableId,
    halfSelectedIds,
    lastAction,
    lastInteractedWith,
  } = state;
  const prevSelectedIds = usePrevious(selectedIds) || new Set();
  const toggledIds = symmetricDifference(selectedIds, prevSelectedIds);

  useEffect(() => {
    if (onSelect !== noop) {
      for (const toggledId of toggledIds) {
        const isBranch = isBranchNode(data, toggledId);
        onSelect({
          element: data[toggledId],
          isBranch: isBranch,
          isExpanded: isBranch ? expandedIds.has(toggledId) : undefined,
          isSelected: selectedIds.has(toggledId),
          isDisabled: disabledIds.has(toggledId),
          isHalfSelected: isBranch ? halfSelectedIds.has(toggledId) : undefined,
          treeState: state,
        });
      }
    }
  }, [
    data,
    selectedIds,
    expandedIds,
    disabledIds,
    halfSelectedIds,
    toggledIds,
    onSelect,
    state,
  ]);

  const prevExpandedIds = usePrevious(expandedIds) || new Set();
  useEffect(() => {
    const toggledExpandIds = symmetricDifference(expandedIds, prevExpandedIds);
    if (onExpand !== noop) {
      for (const id of toggledExpandIds) {
        onExpand({
          element: data[id],
          isExpanded: expandedIds.has(id),
          isSelected: selectedIds.has(id),
          isDisabled: disabledIds.has(id),
          isHalfSelected: halfSelectedIds.has(id),
          treeState: state,
        });
      }
    }
  }, [
    data,
    selectedIds,
    expandedIds,
    disabledIds,
    halfSelectedIds,
    prevExpandedIds,
    onExpand,
    state,
  ]);

  //Update parent if a child changes
  useEffect(() => {
    if (propagateSelectUpwards && multiSelect) {
      let idsToUpdate = new Set(toggledIds);
      if (lastInteractedWith) {
        idsToUpdate.add(lastInteractedWith);
      }
      const { every, some, none } = propagateSelectChange(
        data,
        idsToUpdate,
        selectedIds,
        disabledIds
      );
      for (const id of every) {
        if (!selectedIds.has(id)) {
          dispatch({
            type: treeTypes.select,
            id,
            multiSelect,
            keepFocus: true,
            NotUserAction: true,
            lastInteractedWith,
          });
        }
      }
      for (const id of some) {
        if (!halfSelectedIds.has(id))
          dispatch({
            type: treeTypes.halfSelect,
            id,
            multiSelect,
            keepFocus: true,
            NotUserAction: true,
            lastInteractedWith,
          });
      }
      for (const id of none) {
        if (selectedIds.has(id) || halfSelectedIds.has(id))
          dispatch({
            type: treeTypes.deselect,
            id,
            multiSelect,
            keepFocus: true,
            NotUserAction: true,
            lastInteractedWith,
          });
      }
    }
  }, [
    data,
    multiSelect,
    propagateSelectUpwards,
    selectedIds,
    expandedIds,
    disabledIds,
    halfSelectedIds,
    lastAction,
    prevSelectedIds,
    toggledIds,
    lastInteractedWith,
  ]);

  //Focus
  useEffect(() => {
    if (lastInteractedWith == null) return;
    else if (tabbableId != null) {
      const tabbableNode = nodeRefs.current[tabbableId];
      focusRef(tabbableNode);
    }
  }, [tabbableId, nodeRefs, lastInteractedWith]);

  return [state, dispatch];
};

type ClickAction = "SELECT" | "FOCUS" | "EXCLUSIVE_SELECT";

const clickActions: Record<string, ClickAction> = {
  select: "SELECT",
  focus: "FOCUS",
  exclusiveSelect: "EXCLUSIVE_SELECT",
};

const noop = () => {};

export interface INodeRendererProps {
  /** The object that represents the rendered node . */
  element: any;
  /** A function which gives back the props to pass to the node. . */
  getNodeProps: Function;
  /** Whether the rendered node is a branch node . */
  isBranch: boolean;
  /** Whether the rendered node is selected . */
  isSelected: boolean;
  /** If the node is a branch node, whether it is half-selected, else undefined . */
  isHalfSelected: boolean;
  /** If the node is a branch node, whether it is expanded, else undefined . */
  isExpanded: boolean;
  /** Whether the rendered node is disabled . */
  isDisabled: boolean;
  /** A positive integer that corresponds to the aria-level attribute . */
  level: number;
  /** A positive integer that corresponds to the aria-setsize attribute . */
  setsize: number;
  /** A positive integer that corresponds to the aria-posinset attribute . */
  posinset: number;
  /** Function to assign to the onClick event handler of the element(s) that will toggle the selected state . */
  handleSelect: Function;
  /** Function to assign to the onClick event handler of the element(s) that will toggle the expanded state . */
  handleExpand: Function;
  /** Function to dispatch actions . */
  dispatch: Function;
  /** state of the treeview . */
  treeState: Function;
}

interface ITreeViewProps {
  /** Tree data*/
  data: INode[];
  /** Function called when a node changes its selected state */
  onSelect?: Function;
  /** Function called when a node changes its expanded state */
  onExpand?: Function;
  /** className to add to the outermost ul*/
  className?: string;
  /** Render prop for the node */
  nodeRenderer: (props: INodeRendererProps) => any;
  /** Array with the ids of the default expanded nodes*/
  defaultExpandedIds?: number[];
  /** Array with the ids of the default selected nodes*/
  defaultSelectedIds?: number[];
  /** Array with the ids of the default disabled nodes*/
  defaultDisabledIds?: number[];
  /** If true, collapsing a node will also collapse its descendants */
  propagateCollapse?: boolean;
  /** If true, selecting a node will also select its descendants */
  propagateSelect?: boolean;
  /** If true, selecting a node will update the state of its parent (e.g. a parent node in a checkbox will be automatically selected if all of its children are selected)*/
  propagateSelectUpwards?: boolean;
  /** Allows multiple nodes to be selected */
  multiSelect?: boolean;
  /** Selecting a node with a keyboard (using Space or Enter) will also toggle its expanded state */
  expandOnKeyboardSelect?: boolean;
  /** Wether the selected state is togglable */
  togglableSelect?: boolean;
  /** action to perform on click */
  clickAction?: ClickAction;
  /** Custom onBlur event that is triggered when focusing out of the component as a whole (moving focus between the nodes won't trigger it). */
  onBlur?: Function;
}

const TreeView = React.forwardRef(function TreeView(
  {
    data,
    nodeRenderer,
    onSelect = noop,
    onExpand = noop,
    className = "",
    multiSelect = false,
    propagateSelect = false,
    propagateSelectUpwards = false,
    propagateCollapse = false,
    expandOnKeyboardSelect = false,
    togglableSelect = false,
    defaultExpandedIds = [],
    defaultSelectedIds = [],
    defaultDisabledIds = [],
    clickAction = clickActions.select,
    onBlur,
    ...other
  }: ITreeViewProps,
  ref
) {
  const nodeRefs = useRef({});
  const [state, dispatch] = useTree({
    data,
    defaultExpandedIds,
    defaultSelectedIds,
    defaultDisabledIds,
    nodeRefs,
    onSelect,
    onExpand,
    multiSelect,
    propagateSelect,
    propagateSelectUpwards,
  });
  propagateSelect = propagateSelect && multiSelect;

  let innerRef: any = useRef();
  if (ref != null) innerRef = ref;

  return (
    <ul
      className={cx(baseClassNames.root, className)}
      role="tree"
      aria-multiselectable={multiSelect}
      ref={innerRef}
      onBlur={(event) => {
        onComponentBlur(event, innerRef.current, () => {
          onBlur &&
            onBlur({
              treeState: state,
              dispatch,
            });
          dispatch({ type: treeTypes.blur });
        });
      }}
      onKeyDown={handleKeyDown({
        data,
        tabbableId: state.tabbableId,
        expandedIds: state.expandedIds,
        selectedIds: state.selectedIds,
        disabledIds: state.disabledIds,
        halfSelectedIds: state.halfSelectedIds,
        dispatch,
        propagateCollapse,
        propagateSelect,
        multiSelect,
        expandOnKeyboardSelect,
        togglableSelect,
      })}
      {...other}
    >
      {data[0].children.map((x, index) => (
        <Node
          key={x}
          data={data}
          element={data[x]}
          setsize={data[0].children.length}
          posinset={index + 1}
          level={1}
          {...state}
          state={state}
          dispatch={dispatch}
          nodeRefs={nodeRefs}
          baseClassNames={baseClassNames}
          nodeRenderer={nodeRenderer}
          propagateCollapse={propagateCollapse}
          propagateSelect={propagateSelect}
          propagateSelectUpwards={propagateSelectUpwards}
          multiSelect={multiSelect}
          togglableSelect={togglableSelect}
          clickAction={clickAction}
        />
      ))}
    </ul>
  );
});

const Node = (props: any) => {
  const {
    element,
    dispatch,
    data,
    selectedIds,
    tabbableId,
    isFocused,
    expandedIds,
    disabledIds,
    halfSelectedIds,
    lastUserSelect,
    nodeRefs,
    baseClassNames,
    nodeRenderer,
    setsize,
    posinset,
    level,
    propagateCollapse,
    propagateSelect,
    multiSelect,
    togglableSelect,
    clickAction,
    state,
  } = props;

  const handleExpand = (event: any) => {
    if (event.ctrlKey || event.altKey || event.shiftKey) return;
    if (expandedIds.has(element.id) && propagateCollapse) {
      const ids = [element.id, ...getDescendants(data, element.id, new Set())];
      dispatch({
        type: treeTypes.collapseMany,
        ids,
        lastInteractedWith: element.id,
      });
    } else {
      dispatch({
        type: treeTypes.toggle,
        id: element.id,
        lastInteractedWith: element.id,
      });
    }
  };

  const handleFocus = () =>
    dispatch({
      type: treeTypes.focus,
      id: element.id,
      lastInteractedWith: element.id,
    });

  const handleSelect = (event: any) => {
    if (event.shiftKey) {
      let ids = getAccessibleRange({
        data,
        expandedIds,
        from: lastUserSelect,
        to: element.id,
      }).filter((id) => !disabledIds.has(id));
      ids = propagateSelect ? propagatedIds(data, ids, disabledIds) : ids;
      dispatch({
        type: treeTypes.exclusiveChangeSelectMany,
        select: true,
        multiSelect,
        ids,
        lastInteractedWith: element.id,
      });
    } else if (event.ctrlKey || clickAction === clickActions.select) {
      //Select
      dispatch({
        type: togglableSelect ? treeTypes.toggleSelect : treeTypes.select,
        id: element.id,
        multiSelect,
        lastInteractedWith: element.id,
      });
      propagateSelect &&
        !disabledIds.has(element.id) &&
        dispatch({
          type: treeTypes.changeSelectMany,
          ids: propagatedIds(data, [element.id], disabledIds),
          select: togglableSelect ? !selectedIds.has(element.id) : true,
          multiSelect,
          lastInteractedWith: element.id,
        });
    } else if (clickAction === clickActions.exclusiveSelect) {
      dispatch({
        type: togglableSelect ? treeTypes.toggleSelect : treeTypes.select,
        id: element.id,
        multiSelect: false,
        lastInteractedWith: element.id,
      });
    } else if (clickAction === clickActions.focus) {
      dispatch({
        type: treeTypes.focus,
        id: element.id,
        lastInteractedWith: element.id,
      });
    }
  };

  const getClasses = (className: string) => {
    return cx(className, {
      [`${className}--expanded`]: expandedIds.has(element.id),
      [`${className}--selected`]: selectedIds.has(element.id),
      [`${className}--focused`]: tabbableId === element.id && isFocused,
    });
  };

  const getLeafProps = ({ onClick }: any = {}) => {
    return {
      role: "treeitem",
      tabIndex: tabbableId === element.id ? 0 : -1,
      onClick:
        onClick == null
          ? composeHandlers(handleSelect, handleFocus)
          : composeHandlers(onClick, handleFocus),
      ref: (x: any) => (nodeRefs.current[element.id] = x),
      className: cx(getClasses(baseClassNames.node), baseClassNames.leaf),
      "aria-setsize": setsize,
      "aria-posinset": posinset,
      "aria-level": level,
      "aria-selected": getAriaSelected({
        isSelected: selectedIds.has(element.id),
        isDisabled: disabledIds.has(element.id),
        multiSelect,
      }),
      disabled: disabledIds.has(element.id),
      "aria-disabled": disabledIds.has(element.id),
    };
  };

  const getBranchProps = ({ onClick }: any = {}) => {
    return {
      onClick:
        onClick == null
          ? composeHandlers(handleSelect, handleExpand, handleFocus)
          : composeHandlers(onClick, handleFocus),
      className: cx(getClasses(baseClassNames.node), baseClassNames.branch),
    };
  };

  return isBranchNode(data, element.id) ? (
    <li
      role="treeitem"
      aria-expanded={expandedIds.has(element.id)}
      aria-selected={getAriaSelected({
        isSelected: selectedIds.has(element.id),
        isDisabled: disabledIds.has(element.id),
        multiSelect,
      })}
      aria-setsize={setsize}
      aria-posinset={posinset}
      aria-level={level}
      aria-disabled={disabledIds.has(element.id)}
      tabIndex={tabbableId === element.id ? 0 : -1}
      ref={(x) => (nodeRefs.current[element.id] = x)}
      className={baseClassNames.branchWrapper}
    >
      {nodeRenderer({
        element,
        isBranch: true,
        isSelected: selectedIds.has(element.id),
        isHalfSelected: halfSelectedIds.has(element.id),
        isExpanded: expandedIds.has(element.id),
        isDisabled: disabledIds.has(element.id),
        dispatch,
        getNodeProps: getBranchProps,
        setsize,
        posinset,
        level,
        handleSelect,
        handleExpand,
        treeState: state,
      })}
      <NodeGroup element={element} getClasses={getClasses} {...props} />
    </li>
  ) : (
    <li role="none" className={getClasses(baseClassNames.leafListItem)}>
      {nodeRenderer({
        element,
        isBranch: false,
        isSelected: selectedIds.has(element.id),
        isHalfSelected: undefined,
        isExpanded: false,
        isDisabled: disabledIds.has(element.id),
        dispatch,
        getNodeProps: getLeafProps,
        setsize,
        posinset,
        level,
        handleSelect,
        handleExpand: noop,
        treeState: state,
      })}
    </li>
  );
};

const NodeGroup = ({
  data,
  element,
  expandedIds,
  getClasses,
  baseClassNames,
  level,
  ...rest
}: any) => (
  <ul role="group" className={getClasses(baseClassNames.nodeGroup)}>
    {expandedIds.has(element.id) &&
      element.children.map((x: any, index: number) => (
        <Node
          data={data}
          expandedIds={expandedIds}
          baseClassNames={baseClassNames}
          key={x}
          element={data[x]}
          setsize={element.children.length}
          posinset={index + 1}
          level={level + 1}
          {...rest}
        />
      ))}
  </ul>
);

const handleKeyDown = ({
  data,
  expandedIds,
  selectedIds,
  disabledIds,
  tabbableId,
  dispatch,
  propagateCollapse,
  propagateSelect,
  multiSelect,
  expandOnKeyboardSelect,
  togglableSelect,
}: any) => (event: any) => {
  const element = data[tabbableId];
  const id = element.id;
  if (event.ctrlKey) {
    if (event.key === "a") {
      event.preventDefault();
      const { 0: root, ...dataWithoutRoot } = data;
      const ids = Object.values(dataWithoutRoot)
        .map((x: any) => x.id)
        .filter((id) => !disabledIds.has(id));
      dispatch({
        type: treeTypes.changeSelectMany,
        multiSelect,
        select:
          Array.from(selectedIds).filter((id) => !disabledIds.has(id))
            .length !== ids.length,
        ids,
        lastInteractedWith: element.id,
      });
    } else if (
      event.shiftKey &&
      (event.key === "Home" || event.key === "End")
    ) {
      const newId =
        event.key === "Home"
          ? data[0].children[0]
          : getLastAccessible(data, id, expandedIds);
      const range = getAccessibleRange({
        data,
        expandedIds,
        from: id,
        to: newId,
      }).filter((id) => !disabledIds.has(id));
      dispatch({
        type: treeTypes.changeSelectMany,
        multiSelect,
        select: true,
        ids: propagateSelect ? propagatedIds(data, range, disabledIds) : range,
      });
      dispatch({
        type: treeTypes.focus,
        id: newId,
        lastInteractedWith: newId,
      });
    }
    return;
  }

  if (event.shiftKey) {
    switch (event.key) {
      case "ArrowUp": {
        event.preventDefault();
        const previous = getPreviousAccessible(data, id, expandedIds);
        if (previous != null || !disabledIds.has(previous)) {
          dispatch({
            type: treeTypes.changeSelectMany,
            ids: propagateSelect
              ? propagatedIds(data, [previous], disabledIds)
              : [previous],
            select: true,
            multiSelect,
            lastInteractedWith: previous,
          });
          dispatch({
            type: treeTypes.focus,
            id: previous,
            lastInteractedWith: previous,
          });
        }
        return;
      }
      case "ArrowDown": {
        event.preventDefault();
        const next = getNextAccessible(data, id, expandedIds);
        if (next != null || !disabledIds.has(next)) {
          dispatch({
            type: treeTypes.changeSelectMany,
            ids: propagateSelect
              ? propagatedIds(data, [next], disabledIds)
              : [next],
            multiSelect,
            select: true,
            lastInteractedWith: next,
          });
          dispatch({
            type: treeTypes.focus,
            id: next,
            lastInteractedWith: next,
          });
        }
        return;
      }
      default:
        break;
    }
  }
  switch (event.key) {
    case "ArrowDown": {
      event.preventDefault();
      const next = getNextAccessible(data, id, expandedIds);
      if (next != null) {
        dispatch({
          type: treeTypes.focus,
          id: next,
          lastInteractedWith: next,
        });
      }
      return;
    }
    case "ArrowUp": {
      event.preventDefault();
      const previous = getPreviousAccessible(data, id, expandedIds);
      if (previous != null) {
        dispatch({
          type: treeTypes.focus,
          id: previous,
          lastInteractedWith: previous,
        });
      }
      return;
    }
    case "ArrowLeft": {
      event.preventDefault();
      if (isBranchNode(data, id) && expandedIds.has(tabbableId)) {
        if (propagateCollapse) {
          const ids = [id, ...getDescendants(data, id, new Set())];
          dispatch({
            type: treeTypes.collapseMany,
            ids,
            lastInteractedWith: element.id,
          });
        } else {
          dispatch({
            type: treeTypes.collapse,
            id,
            lastInteractedWith: id,
          });
        }
      } else {
        const isRoot = data[0].children.includes(id);
        if (!isRoot) {
          const parentId = getParent(data, id);
          dispatch({
            type: treeTypes.focus,
            id: parentId,
            lastInteractedWith: parentId,
          });
        }
      }
      return;
    }
    case "ArrowRight": {
      event.preventDefault();
      if (isBranchNode(data, id)) {
        if (expandedIds.has(tabbableId)) {
          dispatch({
            type: treeTypes.focus,
            id: element.children[0],
            lastInteractedWith: element.children[0],
          });
        } else {
          dispatch({ type: treeTypes.expand, id, lastInteractedWith: id });
        }
      }
      return;
    }
    case "Home":
      event.preventDefault();
      dispatch({
        type: treeTypes.focus,
        id: data[0].children[0],
        lastInteractedWith: data[0].children[0],
      });
      break;
    case "End": {
      event.preventDefault();
      const lastAccessible = getLastAccessible(data, data[0].id, expandedIds);
      dispatch({
        type: treeTypes.focus,
        id: lastAccessible,
        lastInteractedWith: lastAccessible,
      });
      return;
    }
    case "*": {
      event.preventDefault();
      const nodes = data[getParent(data, id)].children.filter((x: any) =>
        isBranchNode(data, x)
      );
      dispatch({
        type: treeTypes.expandMany,
        ids: nodes,
        lastInteractedWith: id,
      });
      return;
    }
    //IE11 uses "Spacebar"
    case "Enter":
    case " ":
    case "Spacebar":
      event.preventDefault();
      dispatch({
        type: togglableSelect ? treeTypes.toggleSelect : treeTypes.select,
        id: id,
        multiSelect,
        lastInteractedWith: id,
      });
      propagateSelect &&
        !disabledIds.has(element.id) &&
        dispatch({
          type: treeTypes.changeSelectMany,
          ids: propagatedIds(data, [id], disabledIds),
          select: togglableSelect ? !selectedIds.has(id) : true,
          multiSelect,
          lastInteractedWith: id,
        });
      expandOnKeyboardSelect &&
        dispatch({ type: treeTypes.toggle, id, lastInteractedWith: id });
      return;
    default:
      if (event.key.length === 1) {
        let currentId = getNextAccessible(data, id, expandedIds);
        while (currentId !== id) {
          if (currentId == null) {
            currentId = data[0].children[0];
            continue;
          }
          if (
            data[currentId].name[0].toLowerCase() === event.key.toLowerCase()
          ) {
            dispatch({
              type: treeTypes.focus,
              id: currentId,
              lastInteractedWith: id,
            });
            return;
          }
          currentId = getNextAccessible(data, currentId, expandedIds);
        }
      }
      return;
  }
};

TreeView.propTypes = {
  /** Tree data*/
  data: PropTypes.array.isRequired,

  /** Function called when a node changes its selected state */
  onSelect: PropTypes.func,

  /** Function called when a node changes its expanded state */
  onExpand: PropTypes.func,

  /** className to add to the outermost ul*/
  className: PropTypes.string,

  /** Render prop for the node */
  nodeRenderer: PropTypes.func.isRequired,

  /** Array with the ids of the default expanded nodes*/
  defaultExpandedIds: PropTypes.array,

  /** Array with the ids of the default selected nodes*/
  defaultSelectedIds: PropTypes.array,

  /** Array with the ids of the default disabled nodes*/
  defaultDisabledIds: PropTypes.array,

  /** If true, collapsing a node will also collapse its descendants */
  propagateCollapse: PropTypes.bool,

  /** If true, selecting a node will also select its descendants */
  propagateSelect: PropTypes.bool,

  /** If true, selecting a node will update the state of its parent (e.g. a parent node in a checkbox will be automatically selected if all of its children are selected)*/
  propagateSelectUpwards: PropTypes.bool,

  /** Allows multiple nodes to be selected */
  multiSelect: PropTypes.bool,

  /** Selecting a node with a keyboard (using Space or Enter) will also toggle its expanded state */
  expandOnKeyboardSelect: PropTypes.bool,

  /** Wether the selected state is togglable */
  togglableSelect: PropTypes.bool,

  /** action to perform on click */
  clickAction: PropTypes.oneOf(Object.values(clickActions)),
};

export default TreeView;
