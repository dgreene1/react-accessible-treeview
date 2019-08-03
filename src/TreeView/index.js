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
  propagateSelectChange
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
        focusableId: action.id
      };
    }
    case treeTypes.collapseMany: {
      const expandedIds = new Set(state.expandedIds);
      for (const id of action.ids) {
        expandedIds.delete(id);
      }
      return {
        ...state,
        expandedIds
      };
    }
    case treeTypes.expand: {
      const expandedIds = new Set(state.expandedIds);
      expandedIds.add(action.id);
      return {
        ...state,
        expandedIds,
        focusableId: action.id
      };
    }
    case treeTypes.expandMany: {
      const expandedIds = new Set([...state.expandedIds, ...action.ids]);
      return {
        ...state,
        expandedIds
      };
    }
    case treeTypes.toggle: {
      const expandedIds = new Set(state.expandedIds);
      if (state.expandedIds.has(action.id)) expandedIds.delete(action.id);
      else expandedIds.add(action.id);
      return {
        ...state,
        expandedIds,
        focusableId: action.id
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
        halfSelectedIds
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
        focusableId: action.keepFocus ? state.focusableId : action.id
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
        focusableId: action.keepFocus ? state.focusableId : action.id
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
        focusableId: action.id
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
          halfSelectedIds
        };
      }
      return state;
    }
    case treeTypes.focus:
      return {
        ...state,
        focusableId: action.id
      };
    default:
      throw new Error();
  }
};

const useTree = ({
  data,
  defaultExpandedIds,
  defaultSelectedIds,
  nodeRefs,
  onChange,
  multiSelect,
  checkbox
}) => {
  const [state, dispatch] = useReducer(treeReducer, {
    selectedIds: new Set(defaultSelectedIds),
    focusableId: data[0].children[0],
    expandedIds: new Set(defaultExpandedIds),
    halfSelectedIds: new Set()
  });

  const { selectedIds, expandedIds, focusableId, halfSelectedIds } = state;
  const prevSelectedIds = usePrevious(selectedIds) || [];
  useEffect(() => {
    const toggledIds = symmetricDifference(selectedIds, prevSelectedIds);
    if (onChange) {
      for (const toggledId of toggledIds) {
        const isBranch = isBranchNode(data, toggledId);
        onChange({
          element: data[toggledId],
          isBranch: isBranch,
          isExpanded: isBranch ? expandedIds.has(toggledId) : undefined,
          expandedIds,
          selectedIds,
          halfSelectedIds
        });
      }
    }

    if (multiSelect && checkbox) {
      const { every, some, none } = propagateSelectChange(
        data,
        toggledIds,
        selectedIds
      );
      for (const id of every) {
        if (!selectedIds.has(id)) {
          dispatch({
            type: treeTypes.select,
            id,
            multiSelect,
            keepFocus: true
          });
        }
      }
      for (const id of some) {
        if (!halfSelectedIds.has(id))
          dispatch({
            type: treeTypes.halfSelect,
            id,
            multiSelect,
            keepFocus: true
          });
      }
      for (const id of none) {
        if (selectedIds.has(id) || halfSelectedIds.has(id))
          dispatch({
            type: treeTypes.deselect,
            id,
            multiSelect,
            keepFocus: true
          });
      }
    }
  }, [data, selectedIds, expandedIds, isBranchNode, halfSelectedIds]);

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

/**
 * @example ./examples/README.md
 */
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
    multiSelect = false,
    enterTogglesParents = false,
    togglableSelect = false,
    checkbox = true,
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
    checkbox
  });
  togglableSelect = togglableSelect || multiSelect;

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
        togglableSelect
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
  nodeRefs,
  baseClassNames,
  nodeRenderer,
  setsize,
  posinset,
  level,
  propagateCollapse,
  propagateSelect,
  multiSelect,
  togglableSelect
}) => {
  const handleBranchClick = () => {
    if (expandedIds.has(element.id) && propagateCollapse) {
      const ids = [element.id, ...getDescendants(data, element.id)];
      dispatch({ type: treeTypes.collapseMany, ids });
    } else {
      dispatch({ type: treeTypes.toggle, id: element.id });
    }
  };

  const handleSelect = () => {
    if (togglableSelect)
      dispatch({ type: treeTypes.toggleSelect, id: element.id, multiSelect });
    else dispatch({ type: treeTypes.select, id: element.id, multiSelect });
    propagateSelect &&
      dispatch({
        type: treeTypes.changeSelectMany,
        ids: getDescendants(data, element.id),
        select: !selectedIds.has(element.id),
        multiSelect
      });
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
      onClick: composeHandlers(onClick, handleBranchClick),
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
        selectedIds,
        halfSelectedIds,
        focusableId,
        isExpanded: expandedIds.has(element.id),
        dispatch,
        getNodeProps: getBranchProps,
        setsize,
        posinset,
        level,
        handleSelect
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
        selectedIds,
        focusableId,
        expandedIds,
        halfSelectedIds,
        dispatch,
        getNodeProps: getLeafProps,
        setsize,
        posinset,
        level,
        handleSelect
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
  togglableSelect
}) => event => {
  const element = data[focusableId];
  const id = element.id;
  switch (event.key) {
    case "ArrowDown": {
      event.preventDefault();
      const next = getNextAccessible(data, id, expandedIds);
      if (next != null) {
        dispatch({ type: treeTypes.focus, id: next });
      }
      break;
    }
    case "ArrowUp": {
      event.preventDefault();
      const previous = getPreviousAccessible(data, id, expandedIds);
      if (previous != null) {
        dispatch({ type: treeTypes.focus, id: previous });
      }
      break;
    }
    case "ArrowLeft": {
      event.preventDefault();
      if (isBranchNode(data, id) && expandedIds.has(focusableId)) {
        if (propagateCollapse) {
          const ids = [id, ...getDescendants(data, id)];
          dispatch({ type: treeTypes.collapseMany, ids });
        } else {
          dispatch({ type: treeTypes.collapse, id });
        }
      } else {
        const isRoot = data[0].children.includes(id);
        if (!isRoot) {
          const parentId = getParent(data, id);
          dispatch({ type: treeTypes.focus, id: parentId });
        }
      }
      break;
    }
    case "ArrowRight": {
      event.preventDefault();
      if (isBranchNode(data, id)) {
        if (expandedIds.has(focusableId)) {
          dispatch({
            type: treeTypes.focus,
            id: element.children[0]
          });
        } else {
          dispatch({ type: treeTypes.expand, id });
        }
      }
      break;
    }
    case "Home":
      event.preventDefault();
      dispatch({ type: treeTypes.focus, id: data[0].children[0] });
      break;
    case "End": {
      event.preventDefault();
      const lastAccessible = getLastAccessible(data, data[0].id, expandedIds);
      dispatch({ type: treeTypes.focus, id: lastAccessible });
      break;
    }
    case "*": {
      event.preventDefault();
      const nodes = data[getParent(data, id)].children.filter(x =>
        isBranchNode(data, x)
      );
      dispatch({ type: treeTypes.expandMany, ids: nodes });
      break;
    }
    //IE11 uses "Spacebar"
    case "Enter":
    case " ":
    case "Spacebar":
      event.preventDefault();
      if (togglableSelect)
        dispatch({ type: treeTypes.toggleSelect, id: element.id, multiSelect });
      else dispatch({ type: treeTypes.select, id: element.id, multiSelect });
      enterTogglesParents &&
        dispatch({ type: treeTypes.toggle, id: element.id });
      propagateSelect &&
        dispatch({
          type: treeTypes.changeSelectMany,
          ids: getDescendants(data, element.id),
          select: !selectedIds.has(element.id),
          multiSelect
        });
      break;
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
            dispatch({ type: treeTypes.focus, id: currentId });
            break;
          }
          currentId = getNextAccessible(data, currentId, expandedIds);
        }
      }
      break;
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
  defaultExpandedIds: PropTypes.array,

  /** If true, collapsing a node will also collapse its descendants */
  propagateCollapse: PropTypes.bool
};

export default TreeView;

export const flattenTree = function(tree) {
  let count = 0;
  const flattenedTree = [];

  const flattenTreeHelper = function(tree) {
    tree.id = count;
    flattenedTree.push(tree);
    count += 1;
    if (tree.children == null || tree.children.length === 0) return;
    for (const child of tree.children) {
      flattenTreeHelper(child);
    }
    tree.children = tree.children.map(x => x.id);
  };

  flattenTreeHelper(tree);
  return flattenedTree;
};

const getAriaSelected = (isSelected, multiSelect) => {
  if (multiSelect) {
    return isSelected;
  } else {
    return isSelected ? true : undefined;
  }
};
