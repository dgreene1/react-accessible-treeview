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
  focusRef
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
  toggle: "TOGGLE",
  toggleSelect: "TOGGLE_SELECT",
  changeSelectMany: "SELECT_MANY",
  focus: "FOCUS"
};

const treeReducer = (state, action) => {
  switch (action.type) {
    case treeTypes.collapse: {
      const newSet = new Set(state.expandedIds);
      newSet.delete(action.id);
      return {
        ...state,
        expandedIds: newSet,
        focusableId: action.id
      };
    }
    case treeTypes.collapseMany: {
      const newSet = new Set(state.expandedIds);
      for (const id of action.ids) {
        newSet.delete(id);
      }
      return {
        ...state,
        expandedIds: newSet
      };
    }
    case treeTypes.expand: {
      const newSet = new Set(state.expandedIds);
      newSet.add(action.id);
      return {
        ...state,
        expandedIds: newSet,
        focusableId: action.id
      };
    }
    case treeTypes.expandMany: {
      const newSet = new Set([...state.expandedIds, ...action.ids]);
      return {
        ...state,
        expandedIds: newSet
      };
    }
    case treeTypes.toggle: {
      const newSet = new Set(state.expandedIds);
      if (state.expandedIds.has(action.id)) newSet.delete(action.id);
      else newSet.add(action.id);
      return {
        ...state,
        expandedIds: newSet,
        focusableId: action.id
      };
    }
    case treeTypes.toggleSelect: {
      let newSet;
      const isSelected = state.selectedIds.has(action.id);
      if (action.multiSelect) {
        newSet = new Set(state.selectedIds);
        if (isSelected) newSet.delete(action.id);
        else newSet.add(action.id);
      } else {
        newSet = new Set();
        if (!isSelected) newSet.add(action.id);
      }
      return {
        ...state,
        selectedIds: newSet,
        focusableId: action.id
      };
    }
    case treeTypes.changeSelectMany: {
      let newSet;
      if (action.select) {
        newSet = new Set([...state.selectedIds, ...action.ids]);
      } else {
        newSet = difference(state.selectedIds, new Set(action.ids));
      }
      return {
        ...state,
        selectedIds: newSet
      };
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
  onChange
}) => {
  const [state, dispatch] = useReducer(treeReducer, {
    selectedIds: new Set(defaultSelectedIds),
    focusableId: data[0].children[0],
    expandedIds: new Set(defaultExpandedIds)
  });

  const { selectedIds, expandedIds, focusableId } = state;
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
          expandedIds: Array.from(expandedIds),
          selectedIds: Array.from(selectedIds)
        });
      }
    }
  }, [data, selectedIds, expandedIds, isBranchNode]);

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
    onChange
  });

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
        dispatch,
        nodeRefs,
        propagateCollapse,
        propagateSelect,
        multiSelect
      })}
      {...other}
    >
      {data[0].children.map((x, index) => (
        <Node
          key={x}
          selectedIds={state.selectedIds}
          focusableId={state.focusableId}
          expandedIds={state.expandedIds}
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
  nodeRefs,
  baseClassNames,
  nodeRenderer,
  setsize,
  posinset,
  level,
  propagateCollapse,
  propagateSelect,
  multiSelect
}) => {
  const handleBranchClick = () => {
    dispatch({
      type: treeTypes.toggleSelect,
      id: element.id,
      multiSelect
    });
    propagateSelect &&
      dispatch({
        type: treeTypes.changeSelectMany,
        ids: getDescendants(data, element.id),
        select: !selectedIds.has(element.id)
      });

    if (expandedIds.has(element.id) && propagateCollapse) {
      const ids = [element.id, ...getDescendants(data, element.id)];
      dispatch({ type: treeTypes.collapseMany, ids });
    } else {
      dispatch({ type: treeTypes.toggle, id: element.id });
    }
  };

  const handleLeafClick = () => {
    dispatch({
      type: treeTypes.toggleSelect,
      id: element.id,
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
      onClick: composeHandlers(onClick, handleLeafClick),
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
        focusableId,
        isExpanded: expandedIds.has(element.id),
        dispatch,
        getNodeProps: getBranchProps,
        setsize,
        posinset,
        level
      })}
      {expandedIds.has(element.id) && (
        <ul role="group" className={getClasses(baseClassNames.nodeGroup)}>
          {element.children.map((x, index) => (
            <Node
              key={x}
              selectedIds={selectedIds}
              focusableId={focusableId}
              expandedIds={expandedIds}
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
        dispatch,
        getNodeProps: getLeafProps,
        setsize,
        posinset,
        level
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
  nodeRefs
}) => event => {
  const element = data[focusableId];
  const id = element.id;
  switch (event.key) {
    case "ArrowDown": {
      event.preventDefault();
      const next = getNextAccessible(data, id, expandedIds);
      if (next != null) {
        dispatch({ type: treeTypes.focus, id: next, nodeRefs });
      }
      break;
    }
    case "ArrowUp": {
      event.preventDefault();
      const previous = getPreviousAccessible(data, id, expandedIds);
      if (previous != null) {
        dispatch({ type: treeTypes.focus, id: previous, nodeRefs });
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
          dispatch({ type: treeTypes.focus, id: parentId, nodeRefs });
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
            id: element.children[0],
            nodeRefs
          });
        } else {
          dispatch({ type: treeTypes.expand, id });
        }
      }
      break;
    }
    case "Home":
      event.preventDefault();
      dispatch({ type: treeTypes.focus, id: data[0].children[0], nodeRefs });
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
      dispatch({
        type: treeTypes.toggleSelect,
        id: element.id,
        multiSelect
      });
      propagateSelect &&
        dispatch({
          type: treeTypes.changeSelectMany,
          ids: getDescendants(data, element.id),
          select: !selectedIds.has(element.id)
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
