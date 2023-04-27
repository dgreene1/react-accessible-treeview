import { INode } from "../TreeView/types";
import { validateTreeViewData } from "../TreeView/utils";

test("Should error when more then one parent node", () => {
  const treeViewData: INode[] = [
    { name: "Fruits", id: 0, parent: null, children: [] },
    { name: "Vegetables", id: 3, parent: 0, children: [] },
    { name: "Drinks", id: 14, parent: null, children: [] }, // second root node
  ];
  const expected = () => validateTreeViewData(treeViewData);
  expect(expected).toThrow("TreeView can have only one root node.");
});

test("Should error when node's parent reference to node", () => {
  const treeViewData: INode[] = [
    { name: "Fruits", id: 0, parent: null, children: [] },
    { name: "Vegetables", id: 3, parent: 0, children: [] },
    { name: "Drinks", id: 14, parent: 14, children: [] }, // node.id === node.parent
    { name: "Berries", id: 5, parent: 0, children: [] },
  ];
  const expected = () => validateTreeViewData(treeViewData);
  expect(expected).toThrow("Node with id=14 has parent reference to itself.");
});

test("Should error when node children have duplicated ids", () => {
  const treeViewData: INode[] = [
    { name: "", id: 0, parent: null, children: [3, 14, 5, 14] },
    { name: "Vegetables", id: 3, parent: 0, children: [] },
    { name: "Drinks", id: 14, parent: 0, children: [] },
    { name: "Fruits", id: 5, parent: 0, children: [] },
  ];
  const expected = () => validateTreeViewData(treeViewData);
  expect(expected).toThrow(
    "Node with id=0 contains duplicate ids in its children."
  );
});

test("Should error when id isn't unique", () => {
  const treeViewData: INode[] = [
    { name: "", id: 0, parent: null, children: [3, 5] },
    { name: "Vegetables", id: 3, parent: 0, children: [] },
    { name: "Drinks", id: 5, parent: 0, children: [] },
    { name: "Fruits", id: 5, parent: 0, children: [] },
  ];
  const expected = () => validateTreeViewData(treeViewData);
  expect(expected).toThrow(
    "Multiple TreeView nodes have the same ID. IDs must be unique."
  );
});
