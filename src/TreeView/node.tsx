import React from "react";
import cx from "classnames";
import { ITreeViewState, TreeViewAction } from "./reducer";
import {
  ClickActions,
  EventCallback,
  INode,
  INodeRef,
  INodeRefs,
  INodeRendererProps,
  NodeAction,
  NodeId,
} from "./types";
import {
  composeHandlers,
  getAccessibleRange,
  getAriaChecked,
  getAriaSelected,
  getDescendants,
  getTreeNode,
  isBranchNode,
  noop,
  propagatedIds,
  getOnSelectTreeAction,
  IFlatMetadata,
} from "./utils";
import { baseClassNames, clickActions, treeTypes } from "./constants";

export interface INodeProps<M extends IFlatMetadata> {
  element: INode<M>;
  dispatch: React.Dispatch<TreeViewAction>;
  data: INode<M>[];
  nodeAction: NodeAction;
  selectedIds: Set<NodeId>;
  tabbableId: NodeId;
  isFocused: boolean;
  expandedIds: Set<NodeId>;
  disabledIds: Set<NodeId>;
  halfSelectedIds: Set<NodeId>;
  lastUserSelect: NodeId;
  nodeRefs: INodeRefs;
  leafRefs: INodeRefs;
  baseClassNames: typeof baseClassNames;
  nodeRenderer: (props: INodeRendererProps<M>) => React.ReactNode;
  setsize: number;
  posinset: number;
  level: number;
  propagateCollapse: boolean;
  propagateSelect: boolean;
  multiSelect: boolean;
  togglableSelect: boolean;
  clickAction?: ClickActions;
  state: ITreeViewState;
  propagateSelectUpwards: boolean;
}

export interface INodeGroupProps<M extends IFlatMetadata>
  extends Omit<INodeProps<M>, "setsize" | "posinset"> {
  getClasses: (className: string) => string;
  /** don't send this. The NodeGroup render function, determines it for you */
  setsize?: undefined;
  /** don't send this. The NodeGroup render function, determines it for you */
  posinset?: undefined;
}

/**
 * It's convenient to pass props down to the child, but we don't want to pass everything since it would create incorrect values for setsize and posinset
 */
const removeIrrelevantGroupProps = <M extends IFlatMetadata,>(
  nodeProps: INodeProps<M>
): Omit<INodeGroupProps<M>, "getClasses"> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { setsize, posinset, ...rest } = nodeProps;
  return rest;
};

export const Node = <M extends IFlatMetadata>(props: INodeProps<M>) => {
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
    leafRefs,
    baseClassNames,
    nodeRenderer,
    nodeAction,
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

  const handleExpand: EventCallback = (event) => {
    if (event.ctrlKey || event.altKey || event.shiftKey) return;
    if (expandedIds.has(element.id) && propagateCollapse) {
      const ids: NodeId[] = [
        element.id,
        ...getDescendants(data, element.id, new Set<NodeId>()),
      ];
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

  const handleFocus = (): void =>
    dispatch({
      type: treeTypes.focus,
      id: element.id,
      lastInteractedWith: element.id,
    });

  const handleSelect: EventCallback = (event) => {
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
        lastManuallyToggled: element.id,
      });
    } else if (event.ctrlKey || clickAction === clickActions.select) {
      //Select
      dispatch({
        type: togglableSelect
          ? getOnSelectTreeAction(data, element.id, selectedIds, disabledIds)
          : treeTypes.select,
        id: element.id,
        multiSelect,
        lastInteractedWith: element.id,
        lastManuallyToggled: element.id,
      });
      propagateSelect &&
        !disabledIds.has(element.id) &&
        dispatch({
          type: treeTypes.changeSelectMany,
          ids: propagatedIds(data, [element.id], disabledIds),
          select: togglableSelect ? !selectedIds.has(element.id) : true,
          multiSelect,
          lastInteractedWith: element.id,
          lastManuallyToggled: element.id,
        });
    } else if (clickAction === clickActions.exclusiveSelect) {
      dispatch({
        type: togglableSelect ? treeTypes.toggleSelect : treeTypes.select,
        id: element.id,
        multiSelect: false,
        lastInteractedWith: element.id,
        lastManuallyToggled: element.id,
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
  const ariaActionProp =
    nodeAction === "select"
      ? {
          "aria-selected": getAriaSelected({
            isSelected: selectedIds.has(element.id),
            isDisabled: disabledIds.has(element.id),
            multiSelect,
          }),
        }
      : {
          "aria-checked": getAriaChecked({
            isSelected: selectedIds.has(element.id),
            isDisabled: disabledIds.has(element.id),
            isHalfSelected: halfSelectedIds.has(element.id),
            multiSelect,
          }),
        };
  const getLeafProps = (args: { onClick?: EventCallback } = {}) => {
    const { onClick } = args;
    return {
      role: "treeitem",
      tabIndex: tabbableId === element.id ? 0 : -1,
      onClick:
        onClick == null
          ? composeHandlers(handleSelect, handleFocus)
          : composeHandlers(onClick, handleFocus),
      ref: (x: INodeRef) => {
        if (nodeRefs?.current != null && leafRefs?.current != null) {
          nodeRefs.current[element.id] = x;
          leafRefs.current[element.id] = x;
        }
      },
      className: cx(getClasses(baseClassNames.node), baseClassNames.leaf),
      "aria-setsize": setsize,
      "aria-posinset": posinset,
      "aria-level": level,
      disabled: disabledIds.has(element.id),
      "aria-disabled": disabledIds.has(element.id),
      ...ariaActionProp,
    };
  };

  const getBranchLeafProps = (args: { onClick?: EventCallback } = {}) => {
    const { onClick } = args;
    return {
      onClick:
        onClick == null
          ? composeHandlers(handleSelect, handleExpand, handleFocus)
          : composeHandlers(onClick, handleFocus),
      className: cx(getClasses(baseClassNames.node), baseClassNames.branch),
      ref: (x: INodeRef) => {
        if (leafRefs?.current != null) {
          leafRefs.current[element.id] = x;
        }
      },
    };
  };

  return isBranchNode(data, element.id) || element.isBranch ? (
    <li
      role="treeitem"
      aria-expanded={expandedIds.has(element.id)}
      aria-setsize={setsize}
      aria-posinset={posinset}
      aria-level={level}
      aria-disabled={disabledIds.has(element.id)}
      tabIndex={tabbableId === element.id ? 0 : -1}
      ref={(x) => {
        if (nodeRefs?.current != null && x != null) {
          nodeRefs.current[element.id] = x;
        }
      }}
      className={baseClassNames.branchWrapper}
      {...ariaActionProp}
    >
      <>
        {nodeRenderer({
          element,
          isBranch: true,
          isSelected: selectedIds.has(element.id),
          isHalfSelected: halfSelectedIds.has(element.id),
          isExpanded: expandedIds.has(element.id),
          isDisabled: disabledIds.has(element.id),
          dispatch,
          getNodeProps: getBranchLeafProps,
          setsize,
          posinset,
          level,
          handleSelect,
          handleExpand,
          treeState: state,
        })}
        <NodeGroup
          getClasses={getClasses}
          {...removeIrrelevantGroupProps(props)}
        />
      </>
    </li>
  ) : (
    <li role="none" className={getClasses(baseClassNames.leafListItem)}>
      {nodeRenderer({
        element,
        isBranch: false,
        isSelected: selectedIds.has(element.id),
        isHalfSelected: false,
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

export const NodeGroup = <M extends IFlatMetadata = IFlatMetadata>({
  data,
  element,
  expandedIds,
  getClasses,
  baseClassNames,
  level,
  ...rest
}: INodeGroupProps<M>) => (
  <ul role="group" className={getClasses(baseClassNames.nodeGroup)}>
    {expandedIds.has(element.id) &&
      element.children.length > 0 &&
      element.children.map((x, index) => (
        <Node
          data={data}
          expandedIds={expandedIds}
          baseClassNames={baseClassNames}
          key={`${x}-${typeof x}`}
          element={getTreeNode(data, x) as INode<M>}
          setsize={element.children.length}
          posinset={index + 1}
          level={level + 1}
          {...rest}
        />
      ))}
  </ul>
);
