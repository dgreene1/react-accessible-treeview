export type NodeId = number | string;

export interface INode {
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
}
export type INodeRef = HTMLLIElement | HTMLDivElement;
export type INodeRefs = null | React.RefObject<{
  [key: NodeId]: INodeRef;
}>;

export type TreeViewData = INode[];

export type EventCallback = <T, E>(
  event: React.MouseEvent<T, E> | React.KeyboardEvent<T>
) => void;
