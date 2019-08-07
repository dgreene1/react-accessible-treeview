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
  getAccesibleRange
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
  focus: "FOCUS"
};

const treeReducer = (state, action) => {
  switch (action.type) {
    case treeTypes.collapse: {
      const expandedIds = new Set(state.expandedIds);
      expandedIds.delete(action.id);
      return {
        ...state,
        expandedIds,
        focusableId: action.id,
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
        focusableId: action.id,
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
        focusableId: action.id,
        lastAction: action.type,
        lastInteractedWith: action.lastInteractedWith
      };
    }
    case treeTypes.halfSelect: {
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
        focusableId: action.keepFocus ? state.focusableId : action.id,
        lastStandardSelect: action.NotUserAction
          ? state.lastStandardSelect
          : action.id,
        lastAction: action.type,
        lastInteractedWith: action.lastInteractedWith
      };
    }
    case treeTypes.deselect: {
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
        focusableId: action.id,
        focusableId: action.keepFocus ? state.focusableId : action.id,
        lastStandardSelect: action.NotUserAction
          ? state.lastStandardSelect
          : action.id,
        lastAction: action.type,
        lastInteractedWith: action.lastInteractedWith
      };
    }
    case treeTypes.toggleSelect: {
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
        focusableId: action.id,
        lastStandardSelect: action.NotUserAction
          ? state.lastStandardSelect
          : action.id,
        lastAction: action.type,
        lastInteractedWith: action.lastInteractedWith
      };
    }
    case treeTypes.changeSelectMany: {
      let selectedIds;
      if (action.multiSelect) {
        if (action.select) {
          selectedIds = new Set([...state.selectedIds, ...action.ids]);
        } else {
          selectedIds = difference(state.selectedIds, new Set(action.ids));
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
      if (action.multiSelect) {
        if (action.select) {
          selectedIds = new Set(action.ids);
        } else {
          selectedIds = difference(state.selectedIds, new Set(action.ids));
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
        focusableId: action.id,
        lastAction: action.type,
        lastInteractedWith: action.lastInteractedWith
      };
    default:
      throw new Error("Invalid action passed to the reducer");
  }
};

const useTree = ({
  data,
  defaultExpandedIds,
  defaultSelectedIds,
  nodeRefs,
  onChange,
  multiSelect,
  propagateSelectUpwards
}) => {
  const [state, dispatch] = useReducer(treeReducer, {
    selectedIds: new Set(defaultSelectedIds),
    focusableId: data[0].children[0],
    expandedIds: new Set(defaultExpandedIds),
    halfSelectedIds: new Set(),
    lastStandardSelect: data[0].children[0],
    lastInteractedWith: null
  });

  const {
    selectedIds,
    expandedIds,
    focusableId,
    halfSelectedIds,
    lastAction,
    lastInteractedWith
  } = state;
  const prevSelectedIds = usePrevious(selectedIds) || [];
  const toggledIds = symmetricDifference(selectedIds, prevSelectedIds);

  //Toggles
  useEffect(() => {
    if (onChange) {
      for (const toggledId of toggledIds) {
        const isBranch = isBranchNode(data, toggledId);
        onChange({
          element: data[toggledId],
          isBranch: isBranch,
          isExpanded: isBranch ? expandedIds.has(toggledId) : undefined,
          selectedIds,
          expandedIds,
          focusableId,
          halfSelectedIds,
          lastInteractedWith
        });
      }
    }
  }, [
    data,
    selectedIds,
    expandedIds,
    isBranchNode,
    focusableId,
    halfSelectedIds,
    toggledIds,
    onChange,
    treeTypes
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
        selectedIds
      );
      for (const id of every) {
        if (!selectedIds.has(id)) {
          dispatch({
            type: treeTypes.select,
            id,
            multiSelect,
            keepFocus: true,
            userInput: false,
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
    isBranchNode,
    halfSelectedIds,
    lastAction,
    prevSelectedIds,
    propagateSelectChange,
    toggledIds,
    treeTypes,
    lastInteractedWith
  ]);

  //Focus
  const hasUserInteractedRef = useRef(false);
  useEffect(() => {
    if (!hasUserInteractedRef.current) hasUserInteractedRef.current = true;
    else if (focusableId != null) {
      const focusableNode = nodeRefs.current[focusableId];
      focusRef(focusableNode);
    }
  }, [focusableId, focusRef, nodeRefs, hasUserInteractedRef]);

  return [state, dispatch];
};

const clickActions = {
  select: "SELECT",
  focus: "FOCUS",
  exclusiveSelect: "EXCLUSIVE_SELECT"
};

const TreeView = React.forwardRef(function TreeView(
  {
    data,
    onChange,
    className = "",
    nodeRenderer,
    defaultExpandedIds = [],
    defaultSelectedIds = [],
    propagateCollapse = false,
    propagateSelect = false,
    propagateSelectUpwards = false,
    multiSelect = false,
    enterTogglesParents = false,
    togglableSelect = false,
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
    nodeRefs,
    onChange,
    multiSelect,
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
        focusableId: state.focusableId,
        expandedIds: state.expandedIds,
        selectedIds: state.selectedIds,
        halfSelectedIds: state.halfSelectedIds,
        dispatch,
        propagateCollapse,
        propagateSelect,
        multiSelect,
        enterTogglesParents,
        togglableSelect,
        lastInteractedWith: state.lastInteractedWith
      })}
      {...other}
    >
      {data[0].children.map((x, index) => (
        <Node
          key={x}
          selectedIds={state.selectedIds}
          focusableId={state.focusableId}
          expandedIds={state.expandedIds}
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
  focusableId,
  expandedIds,
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
  const handleToggle = event => {
    if (event.ctrlKey || event.altKey || event.shiftKey) return;
    if (expandedIds.has(element.id) && propagateCollapse) {
      const ids = [element.id, ...getDescendants(data, element.id)];
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

  const handleSelect = event => {
    if (event.shiftKey) {
      let ids = getAccesibleRange({
        data,
        expandedIds,
        from: lastStandardSelect,
        to: element.id,
        lastInteractedWith: element.id
      });
      ids = new Set(
        ids.concat(
          ids
            .filter(id => isBranchNode(data, id))
            .flatMap(id => getDescendants(data, id))
        )
      );
      dispatch({
        type: treeTypes.exclusiveChangeSelectMany,
        select: true,
        multiSelect,
        ids,
        lastInteractedWith: element.id
      });
    } else if (event.ctrlKey || clickAction === clickActions.select) {
      //Select
      if (togglableSelect)
        dispatch({ type: treeTypes.toggleSelect, id: element.id, multiSelect });
      else dispatch({ type: treeTypes.select, id: element.id, multiSelect });
      propagateSelect &&
        dispatch({
          type: treeTypes.changeSelectMany,
          ids: getDescendants(data, element.id),
          select: !selectedIds.has(element.id),
          multiSelect,
          lastInteractedWith: element.id
        });
    } else if (clickAction === clickActions.exclusiveSelect) {
      if (togglableSelect)
        dispatch({
          type: treeTypes.toggleSelect,
          id: element.id,
          multiSelect: false,
          lastInteractedWith: element.id
        });
      else
        dispatch({
          type: treeTypes.select,
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
      tabIndex: focusableId === element.id ? 0 : -1,
      onClick: composeHandlers(onClick),
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
      onClick: composeHandlers(onClick, handleToggle),
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
      tabIndex={focusableId === element.id ? 0 : -1}
      ref={x => (nodeRefs.current[element.id] = x)}
      className={cx(getClasses(baseClassNames.node), baseClassNames.branch)}
    >
      {nodeRenderer({
        element,
        isBranch: isBranchNode(data, element.id),
        isSelected: selectedIds.has(element.id),
        isHalfSelected: halfSelectedIds.has(element.id),
        isExpanded: expandedIds.has(element.id),
        focusableId,
        dispatch,
        getNodeProps: getBranchProps,
        setsize,
        posinset,
        level,
        handleSelect,
        handleToggle
      })}
      {expandedIds.has(element.id) && (
        <ul role="group" className={getClasses(baseClassNames.nodeGroup)}>
          {element.children.map((x, index) => (
            <Node
              key={x}
              selectedIds={selectedIds}
              focusableId={focusableId}
              expandedIds={expandedIds}
              halfSelectedIds={halfSelectedIds}
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
        focusableId,
        dispatch,
        getNodeProps: getLeafProps,
        setsize,
        posinset,
        level,
        handleSelect,
        handleToggle
      })}
    </li>
  );
};

const handleKeyDown = ({
  data,
  expandedIds,
  selectedIds,
  focusableId,
  dispatch,
  propagateCollapse,
  propagateSelect,
  multiSelect,
  enterTogglesParents,
  togglableSelect,
  lastInteractedWith
}) => event => {
  const element = data[focusableId];
  const id = element.id;
  if (event.ctrlKey) {
    if (event.key === "a") {
      event.preventDefault();
      const { 0: root, ...dataWithoutRoot } = data;
      const values = Object.values(dataWithoutRoot);
      dispatch({
        type: treeTypes.changeSelectMany,
        multiSelect,
        select: selectedIds.size !== values.length,
        ids: new Set(Object.values(dataWithoutRoot).map(x => x.id)),
        lastInteractedWith: element.id
      });
    }
    return;
  }
  if (event.shiftKey) {
    switch (event.key) {
      case "ArrowUp": {
        event.preventDefault();
        const previous = getPreviousAccessible(data, id, expandedIds);
        previous != null &&
          dispatch({
            type: treeTypes.select,
            id: previous,
            multiSelect,
            lastInteractedWith: previous
          });
        return;
      }
      case "ArrowDown": {
        event.preventDefault();
        const next = getNextAccessible(data, id, expandedIds);
        next != null &&
          dispatch({
            type: treeTypes.select,
            id: next,
            multiSelect,
            lastInteractedWith: next
          });
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
      if (isBranchNode(data, id) && expandedIds.has(focusableId)) {
        if (propagateCollapse) {
          const ids = [id, ...getDescendants(data, id)];
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
        if (expandedIds.has(focusableId)) {
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
      dispatch({ type: treeTypes.focus, id: data[0].children[0] });
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
      if (togglableSelect)
        dispatch({
          type: treeTypes.toggleSelect,
          id,
          multiSelect,
          lastInteractedWith: id
        });
      else
        dispatch({
          type: treeTypes.select,
          id,
          multiSelect,
          lastInteractedWith: id
        });
      enterTogglesParents &&
        dispatch({ type: treeTypes.toggle, id, lastInteractedWith: id });
      propagateSelect &&
        dispatch({
          type: treeTypes.changeSelectMany,
          ids: getDescendants(data, id),
          select: !selectedIds.has(id),
          multiSelect,
          lastInteractedWith: id
        });
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

  /** Callback function on select */
  onChange: PropTypes.func,

  /** className to add to the outermost ul*/
  className: PropTypes.string,

  /** Render prop for the node */
  nodeRenderer: PropTypes.func.isRequired,

  /** Ids of the nodes expanded by default */
  defaultExpandedIds: PropTypes.object,

  /** If true, collapsing a node will also collapse its descendants */
  propagateCollapse: PropTypes.bool
};

export default TreeView;

export const flattenTree = function(tree) {
  let count = 0;
  const flattenedTree = {};

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

const getAriaSelected = (isSelected, multiSelect) => {
  if (multiSelect) {
    return isSelected;
  } else {
    return isSelected ? true : undefined;
  }
};
