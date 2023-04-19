import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React, { useState } from "react";
import TreeView, { INode, ITreeViewProps } from "..";
import { NodeId, TreeViewData } from "../TreeView";

describe("Async MultiSelectCheckboxTree", () => {
  let treeData: INode[] = [];
  let initialData: TreeViewData;
  beforeEach(() => {
    treeData = [
      {
        name: "",
        id: 0,
        children: [1, 2, 3],
        parent: null,
      },
      {
        name: "Fruits",
        children: [],
        id: 1,
        parent: 0,
        isBranch: true,
      },
      {
        name: "Drinks",
        children: [4, 5],
        id: 2,
        parent: 0,
        isBranch: true,
      },
      {
        name: "Vegetables",
        children: [],
        id: 3,
        parent: 0,
      },
      {
        name: "Pine colada",
        children: [],
        id: 4,
        parent: 2,
      },
      {
        name: "Water",
        children: [],
        id: 5,
        parent: 2,
      },
    ];
    initialData = new Map(treeData.map((node, index) => [index, node]));
  });


  function AsyncMultiSelectCheckbox() {
    const [data, setData] = useState<TreeViewData>(initialData);

    const updateTreeData = (
      list: TreeViewData,
      id: NodeId,
      children: INode[]
    ) => {
      const data = Array.from(list).map(([,node]) => {
        if (node.id === id) {
          node.children = children.map((el) => {
            return el.id;
          });
        }
        return node;
      });
      const newMapData = new Map();
      data.concat(children).forEach((node) => newMapData.set(node.id, node));
  
      return newMapData;
    };

    const onLoadData: ITreeViewProps["onLoadData"] = ({ element }) => {
      return new Promise<void>((resolve) => {
        if (element.children.length > 0) {
          resolve();
          return;
        }
        setTimeout(() => {
          setData((value) =>
            updateTreeData(value, element.id, [
              {
                name: "Child Node",
                children: [],
                id: value.size,
                parent: element.id,
                isBranch: true,
              },
              {
                name: "Another Child Node",
                children: [],
                id: value.size + 1,
                parent: element.id,
              },
            ])
          );
          resolve();
        }, 1000);
      });
    };
    return (
      <div>
        <div className="checkbox">
          <TreeView
            data={data}
            aria-label="Checkbox tree"
            onLoadData={onLoadData}
            multiSelect
            togglableSelect
            propagateSelect
            propagateSelectUpwards
            nodeRenderer={({
              element,
              isBranch,
              isExpanded,
              isHalfSelected,
              getNodeProps,
              level,
              handleExpand,
              handleSelect,
            }) => {
              const testBranchNode = (isExpanded: boolean, element: INode) => {
                return isExpanded && element.children.length === 0 ? (
                  <div>loading</div>
                ) : (
                  <div className="branch-node">{isExpanded}</div>
                );
              };
              return (
                <div
                  {...getNodeProps({ onClick: handleExpand })}
                  className={`${isHalfSelected ? "half-selected" : ""}`}
                  data-testid={`node_${level}`}
                >
                  {isBranch && testBranchNode(isExpanded, element)}
                  <div
                    className="checkbox-icon"
                    onClick={(e) => {
                      handleSelect(e);
                      e.stopPropagation();
                    }}
                  />
                  <span className="name">{element && element.name}</span>
                </div>
              );
            }}
          />
        </div>
      </div>
    );
  }

  test("Should render a branch node when isBranch is set in INode", () => {
    const { queryAllByRole } = render(<AsyncMultiSelectCheckbox />);

    const nodes = queryAllByRole("treeitem");
    expect(nodes[0].firstElementChild?.firstElementChild).toHaveClass(
      "branch-node"
    );
    expect(nodes[0].firstElementChild?.lastElementChild).toHaveTextContent(
      "Fruits"
    );
  });

  test("Should render after data is loaded", async () => {
    const { getAllByRole, rerender } = render(<AsyncMultiSelectCheckbox />);

    const nodes = getAllByRole("treeitem");
    nodes[0].focus();
    if (document.activeElement == null)
      throw new Error(
        `Expected to find an active element on the document (after focusing the first element with role["treeitem"]), but did not.`
      );

    fireEvent.keyDown(nodes[0], { key: "ArrowRight" });

    //before data is loaded
    expect(nodes[0].firstElementChild?.firstElementChild).toHaveTextContent(
      "loading"
    );
    //after data is loaded
    await waitFor(() => {
      expect(screen.findByText("Child Node")).not.toBeNull();
      expect(screen.findByText("Another Child Node")).not.toBeNull();
    });
    rerender(<AsyncMultiSelectCheckbox />);
  });

  test("Should propagate select for children after loading if parent is selected", async () => {
    const { getAllByRole, container } = render(<AsyncMultiSelectCheckbox />);

    const nodes = getAllByRole("treeitem");
    nodes[0].focus();
    if (document.activeElement == null)
      throw new Error(
        `Expected to find an active element on the document (after focusing the first element with role["treeitem"]), but did not.`
      );

    fireEvent.keyDown(nodes[0], { key: "Enter" });
    fireEvent.keyDown(nodes[0], { key: "ArrowRight" });

    //before data is loaded
    expect(nodes[0].firstElementChild?.firstElementChild).toHaveTextContent(
      "loading"
    );
    //after data is loaded
    await waitFor(() => {
      expect(screen.findByText("Child Node")).not.toBeNull();
      expect(screen.findByText("Another Child Node")).not.toBeNull();
    });
    //ensure all children are propagrate when parent is selected
    const childNodes = container.querySelectorAll(
      '[role="treeitem"][aria-level="2"]'
    );
    childNodes.forEach((x) =>
      expect(x).toHaveAttribute("aria-selected", "true")
    );
  });

  test("Should expand all branch and load data when asterisk is pressed", async () => {
    const { getAllByRole, container } = render(<AsyncMultiSelectCheckbox />);

    const nodes = getAllByRole("treeitem");
    nodes[0].focus();
    if (document.activeElement == null)
      throw new Error(
        `Expected to find an active element on the document (after focusing the first element with role["treeitem"]), but did not.`
      );

    const rootNodes = container.querySelectorAll(
      '.tree-branch-wrapper[role="treeitem"][aria-level="1"]'
    );
    expect(rootNodes.length).toBeTruthy();
    rootNodes.forEach((x) =>
      expect(x).toHaveAttribute("aria-expanded", "false")
    );
    fireEvent.keyDown(nodes[0], { key: "*" });

    //before data is loaded
    expect(nodes[0].firstElementChild?.firstElementChild).toHaveTextContent(
      "loading"
    );
    rootNodes.forEach((x) =>
      expect(x).toHaveAttribute("aria-expanded", "true")
    );
    //ensure data is loaded
    await waitFor(() => {
      expect(screen.findByText("Child Node")).not.toBeNull();
      expect(screen.findByText("Another Child Node")).not.toBeNull();
    });
  });
});
