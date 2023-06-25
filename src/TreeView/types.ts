import { clickActions, nodeActions } from "./constants";
import { ITreeViewState, TreeViewAction } from "./reducer";

export type ValueOf<T> = T[keyof T];
export type ClickActions = ValueOf<typeof clickActions>;

export type NodeAction = ValueOf<typeof nodeActions>;

export type NodeId = number | string;

export type INodeRef = HTMLLIElement | HTMLDivElement;
export type INodeRefs = null | React.RefObject<{
  [key: NodeId]: INodeRef;
}>;

export type EventCallback = <T, E>(
  event: React.MouseEvent<T, E> | React.KeyboardEvent<T>
  ) => void;

export type IMetadata = undefined;

  export interface INode<M = IMetadata> {
    /** A non-negative integer that uniquely identifies the node */
    id: NodeId;
    /** Used to match on key press */
    name: string;
    /** An array with the ids of the children nodes */
    children: NodeId[];
    /** The parent of the node; null for the root node */
    parent: NodeId | null;
    /** Used to indicated whether a node is branch to be able load async data onExpand*/
    isBranch?: boolean;
    /** User-defined metadata */
    metadata?: M;
  }

  export interface INodeRendererProps<M = IMetadata> {
    /** The object that represents the rendered node */
    element: INode<M>;
    /** A function which gives back the props to pass to the node */
    getNodeProps: (args?: {
      onClick?: EventCallback;
    }) => IBranchProps | LeafProps;
    /** Whether the rendered node is a branch node */
    isBranch: boolean;
    /** Whether the rendered node is selected */
    isSelected: boolean;
    /** If the node is a branch node, whether it is half-selected, else undefined */
    isHalfSelected: boolean;
    /** If the node is a branch node, whether it is expanded, else undefined */
    isExpanded: boolean;
    /** Whether the rendered node is disabled */
    isDisabled: boolean;
    /** A positive integer that corresponds to the aria-level attribute */
    level: number;
    /** A positive integer that corresponds to the aria-setsize attribute */
    setsize: number;
    /** A positive integer that corresponds to the aria-posinset attribute */
    posinset: number;
    /** Function to assign to the onClick event handler of the element(s) that will toggle the selected state */
    handleSelect: EventCallback;
    /** Function to assign to the onClick event handler of the element(s) that will toggle the expanded state */
    handleExpand: EventCallback;
    /** Function to dispatch actions */
    dispatch: React.Dispatch<TreeViewAction>;
    /** state of the treeview */
    treeState: ITreeViewState;
  }

  type ActionableNode =
  | {
      "aria-selected": boolean | undefined;
    }
  | {
      "aria-checked": boolean | undefined | "mixed";
    };

  export type LeafProps = ActionableNode & {
    role: string;
    tabIndex: number;
    onClick: EventCallback;
    ref: <T extends INodeRef>(x: T | null) => void;
    className: string;
    "aria-setsize": number;
    "aria-posinset": number;
    "aria-level": number;
    "aria-selected": boolean;
    disabled: boolean;
    "aria-disabled": boolean;
  };
  
  export interface IBranchProps {
    onClick: EventCallback;
    className: string;
  }
