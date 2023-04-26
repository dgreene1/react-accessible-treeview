import "@testing-library/jest-dom/extend-expect";
import React from "react";
import TreeView from "../TreeView";
import { render } from "@testing-library/react";
import { flattenTree } from "../TreeView/utils";
import { TreeViewData } from "../TreeView/types";

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

const mapDataType = flattenTree(initialTreeNode);

interface TreeViewDataTypeProps {
  data: TreeViewData;
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

test("Treeview should render tree when data is Map", () => {
  const { queryAllByRole } = render(<TreeViewDataType data={mapDataType} />);

  const nodes = queryAllByRole("treeitem");

  mapDataType.forEach(nodeData => {
    const node = nodes.find((x) => x.innerHTML.includes(`${nodeData.name}-${nodeData.id}`));
    expect(node).toBeDefined;
  })
});
