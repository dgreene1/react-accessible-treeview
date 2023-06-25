import "@testing-library/jest-dom/extend-expect";
import React from "react";
import TreeView from "../TreeView";
import { render } from "@testing-library/react";
import { flattenTree } from "../TreeView/utils";
import { INode } from "../TreeView/types";

const initialTreeNode = {
  name: "",
  id: 12,
  children: [
    {
      name: "Fruits",
      id: 54,
      children: [
        { name: "Avocados", id: 98, metadata: { color: 'green' } },
        { name: "Bananas", id: 789, metadata: { color: 'yellow' } },
      ],
    },
    {
      id: 888,
      name: "Drinks",
      children: [
        { name: "Apple Juice", id: 990, metadata: { color: 'yellow' } },
        { name: "Coffee", id: 9 , metadata: { color: 'brown' }},
        {
          id: 43,
          name: "Tea",
          children: [
            { name: "Black Tea", id: 4,  metadata: { color: 'black' } },
            { name: "Green Tea", id: 44, metadata: { color: 'green' } },
            {
              id: 53,
              name: "Matcha",
              metadata: { color: 'green' },
              children: [{ name: "Matcha 1", id: 2, metadata: { color: 'green' } }],
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
  data: INode<{ color: string }>[];
}

function TreeViewMetadata(props: TreeViewDataTypeProps) {
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
                <span className="element" >
                  { element.metadata ? `-${element.metadata.color}`: `${element.name}-${element.id}` }
                </span>
              </div>
            );
          }}
        />
      </div>
    );
  }
  
  test("Treeview should propogate any meta data that it has", () => {
    const { queryAllByRole } = render(<TreeViewMetadata data={mapDataType} />);
  
    const nodes = queryAllByRole("treeitem");
    
    mapDataType.forEach(nodeData => {
      const thisNodesMetadata = nodeData.metadata;
      if (thisNodesMetadata !== undefined) {
        const node = nodes.find((x) => {
          return x.innerHTML.includes(`${thisNodesMetadata.color}`)
        });
        expect(node).toBeDefined;
     } else {
        const node = nodes.find((x) => x.innerHTML.includes(`${nodeData.name}-${nodeData.id}`));
        expect(node).toBeDefined;
      }
    })
  });
  
