import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, waitFor, act } from "@testing-library/react";
import React, { useState } from "react";
import TreeView, { INode, ITreeViewProps } from "..";
import { NodeId, TreeViewData } from "../TreeView/types";

describe("Async MultiSelectCheckboxTree with controlled selection", () => {
  interface AsyncMultiSelectControlledProps {
    initialData: INode[];
    dataAfterLoad: INode[];
    selectedIds: NodeId[];
    selectedIdsAfterLoad: NodeId[];
    expandedNodes?: NodeId[];
  }
  function AsyncMultiSelectControlled(props: AsyncMultiSelectControlledProps) {
    const {
      initialData,
      dataAfterLoad,
      selectedIds,
      selectedIdsAfterLoad,
      expandedNodes,
    } = props;
    const [data, setData] = useState<TreeViewData>(initialData);
    const [ids, setIds] = useState<NodeId[]>(selectedIds);

    const onLoadData: ITreeViewProps["onLoadData"] = () => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setData(dataAfterLoad);
          setIds(selectedIdsAfterLoad);
          resolve();
        }, 1000);
      });
    };

    return (
      <div>
        <div className="checkbox">
          <TreeView
            data={data}
            expandedIds={expandedNodes}
            aria-label="Checkbox tree"
            nodeAction="check"
            onLoadData={onLoadData}
            selectedIds={ids}
            multiSelect
            togglableSelect
            propagateSelect
            propagateSelectUpwards
            nodeRenderer={({
              element,
              isBranch,
              isExpanded,
              getNodeProps,
              handleExpand,
              handleSelect,
            }) => {
              const testBranchNode = (isExpanded: boolean, element: INode) => {
                return (
                  isExpanded &&
                  element.children.length === 0 && <div>loading</div>
                );
              };
              return (
                <div {...getNodeProps({ onClick: handleExpand })}>
                  {isBranch && testBranchNode(isExpanded, element)}
                  <div
                    className="checkbox-icon"
                    onClick={(e) => {
                      handleSelect(e);
                      e.stopPropagation();
                    }}
                  />
                  <span className="name">
                    {element && element.name}-{element.id}
                  </span>
                </div>
              );
            }}
          />
        </div>
      </div>
    );
  }

  test("Should clear manual selection and apply controlled selection after data is loaded", async () => {
    const initialData = [
      {
        name: "",
        id: 0,
        children: [1, 2],
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
        name: "Vegetables",
        children: [],
        id: 2,
        parent: 0,
      },
    ];
    const dataAfterLoad = [
      {
        name: "",
        id: 0,
        children: [1, 2],
        parent: null,
      },
      {
        name: "Fruits",
        children: [3, 4],
        id: 1,
        parent: 0,
        isBranch: true,
      },
      {
        name: "Yellow fruits",
        children: [],
        id: 3,
        parent: 1,
        isBranch: false,
      },
      {
        name: "Green fruits",
        children: [],
        id: 4,
        parent: 1,
        isBranch: true,
      },
      {
        name: "Vegetables",
        children: [],
        id: 2,
        parent: 0,
      },
    ];

    jest.useFakeTimers();

    const { getAllByRole } = render(
      <AsyncMultiSelectControlled
        initialData={initialData}
        dataAfterLoad={dataAfterLoad}
        selectedIds={[]}
        selectedIdsAfterLoad={[4]}
      />
    );
    const nodes = getAllByRole("treeitem");

    if (document.activeElement == null)
      throw new Error(
        `Expected to find an active element on the document (after focusing the second element with role["treeitem"]), but did not.`
      );

    fireEvent.click(nodes[0].getElementsByClassName("checkbox-icon")[0]);
    expect(nodes[0]).toHaveAttribute("aria-checked", "true");

    fireEvent.keyDown(nodes[0], { key: "ArrowRight" });
    expect(nodes[0]).toHaveAttribute("aria-expanded", "true");
    expect(nodes[0].firstElementChild?.firstElementChild).toHaveTextContent(
      "loading"
    );

    act(() => {
      jest.runOnlyPendingTimers();
    });

    //after data is loaded
    await waitFor(() => {
      const newNodes = getAllByRole("treeitem");
      expect(newNodes[0]).toHaveAttribute("aria-checked", "mixed");
      expect(newNodes[1]).toHaveAttribute("aria-checked", "false");
      expect(newNodes[2]).toHaveAttribute("aria-checked", "true");
    });
  });
  test("Should preserve controlled selection when new data is loaded", async () => {
    const initialData = [
      {
        name: "",
        id: 0,
        children: [1, 2],
        parent: null,
      },
      {
        name: "Fruits",
        children: [3, 4],
        id: 1,
        parent: 0,
        isBranch: true,
      },
      {
        name: "Yellow fruits",
        children: [],
        id: 3,
        parent: 1,
        isBranch: false,
      },
      {
        name: "Green fruits",
        children: [],
        id: 4,
        parent: 1,
        isBranch: true,
      },
      {
        name: "Vegetables",
        children: [],
        id: 2,
        parent: 0,
        isBranch: true,
      },
    ];
    const dataAfterLoad = [
      {
        name: "",
        id: 0,
        children: [1, 2],
        parent: null,
      },
      {
        name: "Fruits",
        children: [3, 4],
        id: 1,
        parent: 0,
        isBranch: true,
      },
      {
        name: "Yellow fruits",
        children: [],
        id: 3,
        parent: 1,
        isBranch: false,
      },
      {
        name: "Green fruits",
        children: [],
        id: 4,
        parent: 1,
        isBranch: true,
      },
      {
        name: "Vegetables",
        children: [5, 6],
        id: 2,
        parent: 0,
        isBranch: true,
      },
      {
        name: "Yellow vegetables",
        children: [],
        id: 5,
        parent: 2,
      },
      {
        name: "Green vegetables",
        children: [],
        id: 6,
        parent: 2,
      },
    ];

    jest.useFakeTimers();

    const { getAllByRole } = render(
      <AsyncMultiSelectControlled
        initialData={initialData}
        dataAfterLoad={dataAfterLoad}
        selectedIds={[4]}
        selectedIdsAfterLoad={[4]}
        expandedNodes={[1]}
      />
    );
    const nodes = getAllByRole("treeitem");

    expect(nodes[0]).toHaveAttribute("aria-checked", "mixed");
    expect(nodes[0]).toHaveAttribute("aria-expanded", "true");
    expect(nodes[1]).toHaveAttribute("aria-checked", "false");
    expect(nodes[2]).toHaveAttribute("aria-checked", "true");
    expect(nodes[3]).toHaveAttribute("aria-expanded", "false");

    if (document.activeElement == null)
      throw new Error(
        `Expected to find an active element on the document (after focusing the second element with role["treeitem"]), but did not.`
      );
    nodes[0].focus(); // Fruits
    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" }); // Yellow Fruits
    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" }); // Green Fruits
    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" }); // Vegetables
    fireEvent.keyDown(document.activeElement, { key: "ArrowRight" });

    expect(nodes[3]).toHaveAttribute("aria-expanded", "true");

    expect(nodes[3].firstElementChild?.firstElementChild).toHaveTextContent(
      "loading"
    );

    act(() => {
      jest.runOnlyPendingTimers();
    });

    //after data is loaded
    await waitFor(() => {
      const newNodes = getAllByRole("treeitem");
      expect(newNodes[0]).toHaveAttribute("aria-checked", "mixed");
      expect(newNodes[1]).toHaveAttribute("aria-checked", "false");
      expect(newNodes[2]).toHaveAttribute("aria-checked", "true");
      expect(newNodes[3]).toHaveAttribute("aria-checked", "false");
      expect(newNodes[4]).toHaveAttribute("aria-checked", "false");
      expect(newNodes[5]).toHaveAttribute("aria-checked", "false");
    });
  });
  test("Should selected parent with propagation when all children selected with controlled selection after data is loaded", async () => {
    const initialData = [
      {
        name: "",
        id: 0,
        children: [1, 2],
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
        name: "Vegetables",
        children: [],
        id: 2,
        parent: 0,
        isBranch: true,
      },
    ];
    const dataAfterLoad = [
      {
        name: "",
        id: 0,
        children: [1, 2],
        parent: null,
      },
      {
        name: "Fruits",
        children: [3, 4],
        id: 1,
        parent: 0,
        isBranch: true,
      },
      {
        name: "Yellow fruits",
        children: [],
        id: 3,
        parent: 1,
        isBranch: false,
      },
      {
        name: "Green fruits",
        children: [],
        id: 4,
        parent: 1,
        isBranch: true,
      },
      {
        name: "Vegetables",
        children: [],
        id: 2,
        parent: 0,
        isBranch: true,
      },
    ];

    jest.useFakeTimers();

    const { getAllByRole } = render(
      <AsyncMultiSelectControlled
        initialData={initialData}
        dataAfterLoad={dataAfterLoad}
        selectedIds={[]}
        selectedIdsAfterLoad={[3, 4]}
      />
    );
    const nodes = getAllByRole("treeitem");

    expect(nodes[0]).toHaveAttribute("aria-checked", "false");
    expect(nodes[0]).toHaveAttribute("aria-expanded", "false");
    expect(nodes[1]).toHaveAttribute("aria-checked", "false");
    expect(nodes[1]).toHaveAttribute("aria-expanded", "false");

    if (document.activeElement == null)
      throw new Error(
        `Expected to find an active element on the document (after focusing the second element with role["treeitem"]), but did not.`
      );
    nodes[0].focus(); // Fruits
    fireEvent.keyDown(document.activeElement, { key: "ArrowRight" });
    expect(nodes[0]).toHaveAttribute("aria-expanded", "true");

    expect(nodes[0].firstElementChild?.firstElementChild).toHaveTextContent(
      "loading"
    );

    act(() => {
      jest.runOnlyPendingTimers();
    });

    //after data is loaded
    await waitFor(() => {
      const newNodes = getAllByRole("treeitem");
      expect(newNodes[0]).toHaveAttribute("aria-checked", "true");
      expect(newNodes[0]).toHaveAttribute("aria-expanded", "true");
      expect(newNodes[1]).toHaveAttribute("aria-checked", "true");
      expect(newNodes[2]).toHaveAttribute("aria-checked", "true");
      expect(newNodes[3]).toHaveAttribute("aria-checked", "false");
      expect(newNodes[3]).toHaveAttribute("aria-expanded", "false");
    });
  });
});
