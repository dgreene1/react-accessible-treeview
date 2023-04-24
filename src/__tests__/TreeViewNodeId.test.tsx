import "@testing-library/jest-dom/extend-expect";
import React from "react";
import TreeView, { INode, TreeViewData } from "../TreeView";
import { render } from "@testing-library/react";
import { flattenTree } from "../TreeView/utils";

const initialTreeNode = {
  name: "",
  id: 12,
  children: [
    {
      name: "Fruits",
      id: 54,
      children: [
        { name: "Avocados", id: 98 },
        { name: "Bananas", id: 789 },
      ],
    },
    {
      id: 888,
      name: "Drinks",
      children: [
        { name: "Apple Juice", id: 990 },
        { name: "Coffee", id: 9 },
        {
          id: 43,
          name: "Tea",
          children: [
            { name: "Black Tea", id: 4 },
            { name: "Green Tea", id: 44 },
            {
              id: 53,
              name: "Matcha",
              children: [{ name: "Matcha 1", id: 2 }],
            },
          ],
        },
      ],
    },
    {
      id: 24,
      name: "Vegetables",
    },
  ],
};

const nodeDataWithIds = [
  { id: 12, name: "", parent: null, children: [54, 888, 24] },
  { id: 54, name: "Fruits", children: [98, 789], parent: 12 },
  { id: 98, name: "Avocados", children: [], parent: 54 },
  { id: 789, name: "Bananas", children: [], parent: 54 },
  { id: 888, name: "Drinks", children: [990, 9, 43], parent: 12 },
  { id: 990, name: "Apple Juice", children: [], parent: 888 },
  { id: 9, name: "Coffee", children: [], parent: 888 },
  { id: 43, name: "Tea", children: [4, 44, 53], parent: 888 },
  { id: 4, name: "Black Tea", children: [], parent: 43 },
  { id: 44, name: "Green Tea", children: [], parent: 43 },
  { id: 53, name: "Matcha", children: [2], parent: 43 },
  { id: 2, name: "Matcha 1", children: [], parent: 53 },
  { id: 24, name: "Vegetables", children: [], parent: 12 },
];

const mapDataType = flattenTree(initialTreeNode);

interface TreeViewDataTypeProps {
  data: INode[] | TreeViewData;
}

function TreeViewDataType(props: TreeViewDataTypeProps) {
  const { data } = props;
  return (
    <div>
      <TreeView
        data={data}
        aria-label="Data type"
        multiSelect
        defaultExpandedIds={[54, 88]}
        propagateSelect
        propagateSelectUpwards
        togglableSelect
        nodeAction="check"
        nodeRenderer={({
          element,
          getNodeProps,
          handleSelect,
          handleExpand,
        }) => {
          return (
            <div {...getNodeProps({ onClick: handleExpand })}>
              <div
                className="checkbox-icon"
                onClick={(e) => {
                  handleSelect(e);
                  e.stopPropagation();
                }}
              />
              <span className="element">
                {element.name}-{element.id}
              </span>
            </div>
          );
        }}
      />
    </div>
  );
}

test("TreeView should render tree when data is INode array with ids", () => {
  const { queryAllByRole } = render(
    <TreeViewDataType data={nodeDataWithIds} />
  );

  const nodes = queryAllByRole("treeitem");

  nodeDataWithIds.forEach(nodeData => {
    const node = nodes.find((x) => x.innerHTML.includes(`${nodeData.name}-${nodeData.id}`));
    expect(node).toBeDefined;
  })
});
test("Treeview should render tree when data is Map", () => {
  const { queryAllByRole } = render(<TreeViewDataType data={mapDataType} />);

  const nodes = queryAllByRole("treeitem");

  mapDataType.forEach(nodeData => {
    const node = nodes.find((x) => x.innerHTML.includes(`${nodeData.name}-${nodeData.id}`));
    expect(node).toBeDefined;
  })
});
