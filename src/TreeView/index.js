import React, { useReducer, useRef, useEffect } from "react";
import cx from "classnames";
import PropTypes from "prop-types";
import {
  difference,
  symmetricDifference,
  usePrevious,
  getDescendants,
  getLastAccessible,
  getNextAccessible,
  getParent,
  getPreviousAccessible,
  isBranchNode,
  composeHandlers,
  focusRef,
  propagateSelectChange,
  getAccessibleRange,
  getAriaSelected,
  propagatedIds
} from "./utils";

//TODO: add a better way to style focus i.e. using a classname with the modifier
// implement non selectable nodes
const baseClassNames = {
  root: "tree",
  node: "tree-node",
  branch: "tree-node__branch",
  branchWrapper: "tree-branch-wrapper",
  leafListItem: "tree-leaf-list-item",
  leaf: "tree-node__leaf",
  nodeGroup: "tree-node-group"
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
  disable: "DISABLE",
  enable: "ENABLE"
};

const treeReducer = (state, action) => {
  switch (action.type) {
    case treeTypes.collapse: {
      const expandedIds = new Set(state.expandedIds);
      expandedIds.delete(action.id);
      return {
        ...state,
        expandedIds,
        tabbableId: action.id,
        lastAction: action.type,
        lastInteractedWith: action.lastInteractedWith
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
        lastInteractedWith: action.lastInteractedWith
      };
    }
    case treeTypes.expand: {
      const expandedIds = new Set(state.expandedIds);
      expandedIds.add(action.id);
      return {
        ...state,
        expandedIds,
        tabbableId: action.id,
        lastAction: action.type,
        lastInteractedWith: action.lastInteractedWith
      };
    }
    case treeTypes.expandMany: {
      const expandedIds = new Set([...state.expandedIds, ...action.ids]);
      return {
        ...state,
        expandedIds,
        lastAction: action.type,
        lastInteractedWith: action.lastInteractedWith
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
        lastAction: action.type,
        lastInteractedWith: action.lastInteractedWith
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
        lastInteractedWith: action.lastInteractedWith
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
        lastStandardSelect: action.NotUserAction
          ? state.lastStandardSelect
          : action.id,
        lastAction: action.type,
        lastInteractedWith: action.lastInteractedWith
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
        lastStandardSelect: action.NotUserAction
          ? state.lastStandardSelect
          : action.id,
        lastAction: action.type,
        lastInteractedWith: action.lastInteractedWith
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
        lastStandardSelect: action.NotUserAction
          ? state.lastStandardSelect
          : action.id,
        lastAction: action.type,
        lastInteractedWith: action.lastInteractedWith
      };
    }
    case treeTypes.changeSelectMany: {
      let selectedIds;
      const ids = action.ids.filter(id => !state.disabledIds.has(id));
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
          lastInteractedWith: action.lastInteractedWith
        };
      }
      return state;
    }
    case treeTypes.exclusiveChangeSelectMany: {
      let selectedIds;
      const ids = action.ids.filter(id => !state.disabledIds.has(id));
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
          lastInteractedWith: action.lastInteractedWith
        };
      }
      return state;
    }
    case treeTypes.focus:
      return {
        ...state,
        tabbableId: action.id,
        lastAction: action.type,
        lastInteractedWith: action.lastInteractedWith
      };
    case treeTypes.disable: {
      const disabledIds = new Set(state.disabledIds);
      disabledIds.add(action.id);
      return {
        ...state,
        disabledIds
      };
    }
    case treeTypes.enable: {
      const disabledIds = new Set(state.disabledIds);
      disabledIds.delete(action.id);
      return {
        ...state,
        disabledIds
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
  propagateSelectUpwards
}) => {
  const [state, dispatch] = useReducer(treeReducer, {
    selectedIds: new Set(defaultSelectedIds),
    tabbableId: data[0].children[0],
    expandedIds: new Set(defaultExpandedIds),
    halfSelectedIds: new Set(),
    lastStandardSelect: data[0].children[0],
    lastInteractedWith: null,
    disabledIds: new Set(defaultDisabledIds)
  });

  const {
    selectedIds,
    expandedIds,
    disabledIds,
    tabbableId,
    halfSelectedIds,
    lastAction,
    lastInteractedWith
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
          selectedIds,
          expandedIds,
          tabbableId,
          halfSelectedIds
        });
      }
    }
  }, [
    data,
    selectedIds,
    expandedIds,
    tabbableId,
    halfSelectedIds,
    toggledIds,
    onSelect,
    lastInteractedWith
  ]);

  const prevExpandedIds = usePrevious(expandedIds) || new Set();
  useEffect(() => {
    const toggledExpandIds = difference(expandedIds, prevExpandedIds);
    if (onExpand !== noop) {
      for (const id of toggledExpandIds) {
        onExpand({
          element: data[id],
          isBranch: true,
          isExpanded: true,
          selectedIds,
          expandedIds,
          tabbableId,
          halfSelectedIds
        });
      }
    }
  }, [
    data,
    selectedIds,
    expandedIds,
    tabbableId,
    halfSelectedIds,
    onSelect,
    onExpand,
    prevExpandedIds,
    lastInteractedWith
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
            lastInteractedWith
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
            lastInteractedWith
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
            lastInteractedWith
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
    lastInteractedWith
  ]);

  //Focus
  const hasUserInteractedRef = useRef(false);
  useEffect(() => {
    if (!hasUserInteractedRef.current) hasUserInteractedRef.current = true;
    else if (tabbableId != null) {
      const tabbableNode = nodeRefs.current[tabbableId];
      focusRef(tabbableNode);
    }
  }, [tabbableId, nodeRefs, hasUserInteractedRef]);

  return [state, dispatch];
};

const clickActions = {
  select: "SELECT",
  focus: "FOCUS",
  exclusiveSelect: "EXCLUSIVE_SELECT"
};

const noop = () => {};
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
    ...other
  },
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
    propagateSelectUpwards
  });
  propagateSelect = propagateSelect && multiSelect;

  return (
    <ul
      className={cx(baseClassNames.root, className)}
      role="tree"
      aria-multiselectable={multiSelect}
      ref={ref}
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
        togglableSelect
      })}
      {...other}
    >
      {data[0].children.map((x, index) => (
        <Node
          key={x}
          selectedIds={state.selectedIds}
          tabbableId={state.tabbableId}
          expandedIds={state.expandedIds}
          disabledIds={state.disabledIds}
          halfSelectedIds={state.halfSelectedIds}
          lastStandardSelect={state.lastStandardSelect}
          lastInteractedWith={state.lastInteractedWith}
          dispatch={dispatch}
          data={data}
          element={data[x]}
          nodeRefs={nodeRefs}
          baseClassNames={baseClassNames}
          nodeRenderer={nodeRenderer}
          setsize={data[0].children.length}
          posinset={index + 1}
          level={1}
          propagateCollapse={propagateCollapse}
          propagateSelect={propagateSelect}
          multiSelect={multiSelect}
          togglableSelect={togglableSelect}
          clickAction={clickAction}
        />
      ))}
    </ul>
  );
});

const Node = ({
  element,
  dispatch,
  data,
  selectedIds,
  tabbableId,
  expandedIds,
  disabledIds,
  halfSelectedIds,
  lastStandardSelect,
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
  lastInteractedWith
}) => {
  const handleExpand = event => {
    if (event.ctrlKey || event.altKey || event.shiftKey) return;
    if (expandedIds.has(element.id) && propagateCollapse) {
      const ids = [element.id, ...getDescendants(data, element.id, [])];
      dispatch({
        type: treeTypes.collapseMany,
        ids,
        lastInteractedWith: element.id
      });
    } else {
      dispatch({
        type: treeTypes.toggle,
        id: element.id,
        lastInteractedWith: element.id
      });
    }
  };

  const handleFocus = () => {
    dispatch({
      type: treeTypes.focus,
      id: element.id,
      lastInteractedWith: element.id
    });
  };

  const handleSelect = event => {
    if (event.shiftKey) {
      let ids = getAccessibleRange({
        data,
        expandedIds,
        from: lastStandardSelect,
        to: element.id,
        lastInteractedWith: element.id
      }).filter(id => !disabledIds.has(id));
      ids = propagateSelect ? propagatedIds(data, ids, disabledIds) : ids;
      dispatch({
        type: treeTypes.exclusiveChangeSelectMany,
        select: true,
        multiSelect,
        ids,
        lastInteractedWith: element.id
      });
    } else if (event.ctrlKey || clickAction === clickActions.select) {
      //Select
      dispatch({
        type: togglableSelect ? treeTypes.toggleSelect : treeTypes.select,
        id: element.id,
        multiSelect,
        lastInteractedWith: element.id
      });
      propagateSelect &&
        !disabledIds.has(element.id) &&
        dispatch({
          type: treeTypes.changeSelectMany,
          ids: propagatedIds(data, [element.id], disabledIds),
          select: togglableSelect ? !selectedIds.has(element.id) : true,
          multiSelect,
          lastInteractedWith: element.id
        });
    } else if (clickAction === clickActions.exclusiveSelect) {
      dispatch({
        type: togglableSelect ? treeTypes.toggleSelect : treeTypes.select,
        id: element.id,
        multiSelect: false,
        lastInteractedWith: element.id
      });
    } else if (clickAction === clickActions.focus) {
      dispatch({
        type: treeTypes.focus,
        id: element.id,
        lastInteractedWith: element.id
      });
    }
  };

  const getClasses = className => {
    return cx(className, {
      [`${className}--expanded`]: expandedIds.has(element.id),
      [`${className}--selected`]: selectedIds.has(element.id)
    });
  };

  const getLeafProps = ({ onClick } = {}) => {
    return {
      role: "treeitem",
      tabIndex: tabbableId === element.id ? 0 : -1,
      onClick: composeHandlers(onClick, handleFocus),
      ref: x => (nodeRefs.current[element.id] = x),
      className: cx(getClasses(baseClassNames.node), baseClassNames.leaf),
      "aria-setsize": setsize,
      "aria-posinset": posinset,
      "aria-level": level,
      "aria-selected": getAriaSelected(selectedIds.has(element.id), multiSelect)
    };
  };

  const getBranchProps = ({ onClick } = {}) => {
    return {
      onClick: composeHandlers(onClick, handleExpand, handleFocus),
      className: getClasses(baseClassNames.branchWrapper)
    };
  };

  return isBranchNode(data, element.id) ? (
    <li
      role="treeitem"
      aria-expanded={expandedIds.has(element.id)}
      aria-selected={getAriaSelected(selectedIds.has(element.id), multiSelect)}
      aria-setsize={setsize}
      aria-posinset={posinset}
      aria-level={level}
      tabIndex={tabbableId === element.id ? 0 : -1}
      ref={x => (nodeRefs.current[element.id] = x)}
      className={cx(getClasses(baseClassNames.node), baseClassNames.branch)}
    >
      {nodeRenderer({
        element,
        isBranch: isBranchNode(data, element.id),
        isSelected: selectedIds.has(element.id),
        isHalfSelected: halfSelectedIds.has(element.id),
        isExpanded: expandedIds.has(element.id),
        isDisabled: disabledIds.has(element.id),
        tabbableId,
        dispatch,
        getNodeProps: getBranchProps,
        setsize,
        posinset,
        level,
        handleSelect,
        handleExpand
      })}
      {expandedIds.has(element.id) && (
        <ul role="group" className={getClasses(baseClassNames.nodeGroup)}>
          {element.children.map((x, index) => (
            <Node
              key={x}
              selectedIds={selectedIds}
              tabbableId={tabbableId}
              expandedIds={expandedIds}
              halfSelectedIds={halfSelectedIds}
              disabledIds={disabledIds}
              lastStandardSelect={lastStandardSelect}
              dispatch={dispatch}
              data={data}
              element={data[x]}
              nodeRefs={nodeRefs}
              baseClassNames={baseClassNames}
              nodeRenderer={nodeRenderer}
              setsize={element.children.length}
              posinset={index + 1}
              level={level + 1}
              propagateCollapse={propagateCollapse}
              propagateSelect={propagateSelect}
              multiSelect={multiSelect}
              togglableSelect={togglableSelect}
              clickAction={clickAction}
              lastInteractedWith={lastInteractedWith}
            />
          ))}
        </ul>
      )}
    </li>
  ) : (
    <li role="none" className={getClasses(baseClassNames.leafListItem)}>
      {nodeRenderer({
        element,
        isBranch: isBranchNode(data, element.id),
        isSelected: selectedIds.has(element.id),
        isHalfSelected: halfSelectedIds.has(element.id),
        isExpanded: expandedIds.has(element.id),
        isDisabled: disabledIds.has(element.id),
        tabbableId,
        dispatch,
        getNodeProps: getLeafProps,
        setsize,
        posinset,
        level,
        handleSelect,
        handleExpand
      })}
    </li>
  );
};

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
  togglableSelect
}) => event => {
  const element = data[tabbableId];
  const id = element.id;
  if (event.ctrlKey) {
    if (event.key === "a") {
      event.preventDefault();
      const { 0: root, ...dataWithoutRoot } = data;
      const ids = Object.values(dataWithoutRoot)
        .map(x => x.id)
        .filter(id => !disabledIds.has(id));
      dispatch({
        type: treeTypes.changeSelectMany,
        multiSelect,
        select:
          Array.from(selectedIds).filter(id => !disabledIds.has(id)).length !==
          ids.length,
        ids,
        lastInteractedWith: element.id
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
        to: newId
      }).filter(id => !disabledIds.has(id));
      dispatch({
        type: treeTypes.changeSelectMany,
        multiSelect,
        select: true,
        ids: propagateSelect ? propagatedIds(data, range, disabledIds) : range
      });
      dispatch({
        type: treeTypes.focus,
        id: newId,
        lastInteractedWith: newId
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
            lastInteractedWith: previous
          });
          dispatch({
            type: treeTypes.focus,
            id: previous,
            lastInteractedWith: previous
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
            lastInteractedWith: next
          });
          dispatch({
            type: treeTypes.focus,
            id: next,
            lastInteractedWith: next
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
          lastInteractedWith: next
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
          lastInteractedWith: previous
        });
      }
      return;
    }
    case "ArrowLeft": {
      event.preventDefault();
      if (isBranchNode(data, id) && expandedIds.has(tabbableId)) {
        if (propagateCollapse) {
          const ids = [id, ...getDescendants(data, id, [])];
          dispatch({
            type: treeTypes.collapseMany,
            ids,
            lastInteractedWith: element.id
          });
        } else {
          dispatch({
            type: treeTypes.collapse,
            id,
            lastInteractedWith: id
          });
        }
      } else {
        const isRoot = data[0].children.includes(id);
        if (!isRoot) {
          const parentId = getParent(data, id);
          dispatch({
            type: treeTypes.focus,
            id: parentId,
            lastInteractedWith: parentId
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
            lastInteractedWith: element.children[0]
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
        lastInteractedWith: data[0].children[0]
      });
      break;
    case "End": {
      event.preventDefault();
      const lastAccessible = getLastAccessible(data, data[0].id, expandedIds);
      dispatch({
        type: treeTypes.focus,
        id: lastAccessible,
        lastInteractedWith: lastAccessible
      });
      return;
    }
    case "*": {
      event.preventDefault();
      const nodes = data[getParent(data, id)].children.filter(x =>
        isBranchNode(data, x)
      );
      dispatch({
        type: treeTypes.expandMany,
        ids: nodes,
        lastInteractedWith: id
      });
      return;
    }
    //IE11 uses "Spacebar"
    case "Enter":
    case " ":
    case "Spacebar":
      event.preventDefault();
      !disabledIds.has(id) &&
        dispatch({
          type: treeTypes.changeSelectMany,
          ids: propagateSelect ? propagatedIds(data, [id], disabledIds) : [id],
          select: togglableSelect ? !selectedIds.has(id) : true,
          multiSelect,
          lastInteractedWith: id
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
              lastInteractedWith: id
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
  clickAction: PropTypes.oneOf(Object.values(clickActions))
};

export default TreeView;
