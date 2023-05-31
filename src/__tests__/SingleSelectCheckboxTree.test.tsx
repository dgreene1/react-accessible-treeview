import { fireEvent, render } from "@testing-library/react";
import React from "react";
import TreeView, { INode, NodeId, flattenTree } from "..";

const folder = {
  name: "",
  children: [
    {
      name: "Fruits",
      children: [
        { name: "Avocados" },
        { name: "Bananas" },
        { name: "Berries" },
        { name: "Oranges" },
        { name: "Pears" },
      ],
    },
    {
      name: "Drinks",
      children: [
        { name: "Apple Juice" },
        { name: "Chocolate" },
        { name: "Coffee" },
        {
          name: "Tea",
          children: [
            { name: "Black Tea" },
            { name: "Green Tea" },
            { name: "Red Tea" },
            { name: "Matcha" },
          ],
        },
      ],
    },
    {
      name: "Vegetables",
      children: [{ name: "Beets" }],
    },
  ],
};

const initialData = flattenTree(folder);

function SingleSelectCheckboxTree({
  selectedIds = [],
  defaultExpandedIds = [],
  data = initialData,
}: {
  selectedIds?: NodeId[];
  defaultExpandedIds?: NodeId[];
  data?: INode[];
}) {
  return (
    <div>
      <div className="checkbox">
        <TreeView
          data={data}
          aria-label="Single select"
          multiSelect={false}
          defaultExpandedIds={defaultExpandedIds}
          selectedIds={selectedIds}
          propagateSelect
          propagateSelectUpwards
          togglableSelect
          nodeAction="check"
          nodeRenderer={({
            element,
            getNodeProps,
            handleSelect,
            handleExpand,
            isHalfSelected,
          }) => {
            return (
              <div
                {...getNodeProps({ onClick: handleExpand })}
                className={`${isHalfSelected ? "half-selected" : ""}`}
              >
                <div
                  className="checkbox-icon"
                  onClick={(e) => {
                    handleSelect(e);
                    e.stopPropagation();
                  }}
                />
                <span className="name">{element.name}</span>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}

describe("Single select", () => {
  test("PropagateSelectUpwards works correctly in single select", () => {
    const { queryAllByRole, container } = render(<SingleSelectCheckboxTree />);
    const nodes = queryAllByRole("treeitem");
    nodes[1].focus();
    if (document.activeElement == null)
      throw new Error(
        `Expected to find an active element on the document (after focusing the second element with role["treeitem"]), but did not.`
      );
    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" }); // Drinks
    fireEvent.keyDown(document.activeElement, { key: "ArrowRight" }); // Drinks group
    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" }); // Apple Juice
    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" }); // Chocolate
    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" }); // Coffee
    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" }); // Tea
    fireEvent.keyDown(document.activeElement, { key: "ArrowRight" }); // Tea group
    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" }); // Black Tea
    fireEvent.keyDown(document.activeElement, { key: "Enter" });

    expect(container.querySelectorAll("[aria-checked='true']").length).toBe(1); // Black Tea
    expect(container.querySelectorAll(".half-selected").length).toBe(2); // Drinks, Tea

    //After selecting 1st level parent (Drinks) it should unselect 2nd (Tea) and 3rd level (Black Tea)
    fireEvent.keyDown(document.activeElement, { key: "ArrowLeft" }); // Tea
    fireEvent.keyDown(document.activeElement, { key: "ArrowLeft" }); // Tea collapsed
    fireEvent.keyDown(document.activeElement, { key: "ArrowLeft" }); // Drinks group
    fireEvent.keyDown(document.activeElement, { key: "ArrowLeft" }); // Drinks
    fireEvent.keyDown(document.activeElement, { key: "Enter" });

    expect(nodes[1]).toHaveAttribute("aria-checked", "true");
    expect(container.querySelectorAll("[aria-checked='true']").length).toBe(1);
    expect(container.querySelectorAll(".half-selected").length).toBe(0);
  });

  test("propagateSelectUpward should select parent when the only child is selected", () => {
    const { queryAllByRole, container } = render(<SingleSelectCheckboxTree />);
    const nodes = queryAllByRole("treeitem");

    expect(nodes.length).toBe(3);

    nodes[0].focus();
    if (document.activeElement == null)
      throw new Error(
        `Expected to find an active element on the document (after focusing the second element with role["treeitem"]), but did not.`
      );
    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" }); // Fruits
    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" }); // Drinks
    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" }); // Vegetables
    fireEvent.keyDown(document.activeElement, { key: "ArrowRight" }); // Vegetables group
    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" }); // Beets
    fireEvent.keyDown(document.activeElement, { key: "Enter" });

    const expandedNodes = queryAllByRole("treeitem");

    expect(expandedNodes[2].innerHTML).toContain("Vegetables");
    expect(expandedNodes[3].innerHTML).toContain("Beets");
    expect(expandedNodes[2]).toHaveAttribute("aria-checked", "true");
    expect(expandedNodes[3]).toHaveAttribute("aria-checked", "true");
    expect(container.querySelectorAll("[aria-checked='true']").length).toBe(2);
  });

  test("should unselect selected with propagation parent if it has only one selected child", () => {
    const { queryAllByRole, container } = render(<SingleSelectCheckboxTree />);
    const nodes = queryAllByRole("treeitem");

    nodes[0].focus();
    if (document.activeElement == null)
      throw new Error(
        `Expected to find an active element on the document (after focusing the second element with role["treeitem"]), but did not.`
      );
    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" }); // Fruits
    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" }); // Drinks
    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" }); // Vegetables
    fireEvent.keyDown(document.activeElement, { key: "ArrowRight" }); // Vegetables group
    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" }); // Beets
    fireEvent.keyDown(document.activeElement, { key: "Enter" });

    const expandedNodes = queryAllByRole("treeitem");

    expect(expandedNodes[2]).toHaveAttribute("aria-checked", "true");
    expect(expandedNodes[3]).toHaveAttribute("aria-checked", "true");
    expect(container.querySelectorAll("[aria-checked='true']").length).toBe(2);

    fireEvent.keyDown(document.activeElement, { key: "ArrowUp" }); // Vegetables
    fireEvent.keyDown(document.activeElement, { key: "Enter" });

    const uncheckedNodes = queryAllByRole("treeitem");

    expect(uncheckedNodes[2]).not.toHaveAttribute("aria-checked");
    expect(uncheckedNodes[3]).not.toHaveAttribute("aria-checked");
    expect(container.querySelectorAll("[aria-checked='true']").length).toBe(0);
  });

  test("should select only one node in a tree", () => {
    const { queryAllByRole, container } = render(<SingleSelectCheckboxTree />);
    const nodes = queryAllByRole("treeitem");
    nodes[0].focus();
    if (document.activeElement == null)
      throw new Error(
        `Expected to find an active element on the document (after focusing the second element with role["treeitem"]), but did not.`
      );
    fireEvent.keyDown(document.activeElement, { key: "Enter" });

    expect(nodes[0]).toHaveAttribute("aria-checked", "true");
    expect(container.querySelectorAll("[aria-checked='true']").length).toBe(1);

    fireEvent.keyDown(document.activeElement, { key: "ArrowRight" }); // Fruits Group
    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" }); // Avocados
    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" }); // Bananas
    fireEvent.keyDown(document.activeElement, { key: "Enter" });

    const newNodes = queryAllByRole("treeitem");

    newNodes.forEach((node) => console.log(node.innerHTML));

    expect(newNodes.length).toBe(8);
    expect(newNodes[0]).toHaveAttribute("aria-checked", "mixed");
    expect(newNodes[2]).toHaveAttribute("aria-checked", "true");
    expect(container.querySelectorAll("[aria-checked='true']").length).toBe(1);
  });

  test("should set and clear selectedIds", () => {
    const { queryAllByRole, rerender, container } = render(
      <SingleSelectCheckboxTree selectedIds={[1]} />
    );
    const nodes = queryAllByRole("treeitem");

    expect(nodes[0]).toHaveAttribute("aria-checked", "true");

    rerender(<SingleSelectCheckboxTree selectedIds={[]} />);

    expect(container.querySelectorAll("[aria-checked='true']").length).toBe(0);
  });

  test("should select one node and all parents in the middle of nested one child branch", () => {
    const testData = {
      name: "",
      children: [
        {
          name: "Drinks",
          children: [
            {
              name: "Hot drinks",
              children: [
                {
                  name: "Non-alcohol",
                  children: [
                    {
                      name: "Tea",
                      children: [
                        {
                          name: "Black Tea",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "Vegetables",
          children: [{ name: "Beets" }],
        },
      ],
    };
    const { queryAllByRole, container } = render(
      <SingleSelectCheckboxTree data={flattenTree(testData)} defaultExpandedIds={[1,2,3,4]} />
    );
    const nodes = queryAllByRole("treeitem");

    nodes[0].focus();
    if (document.activeElement == null)
      throw new Error(
        `Expected to find an active element on the document (after focusing the second element with role["treeitem"]), but did not.`
      );
    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" });//Hot drinks
    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" });//Non-alcohol
    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" });//Tea
    fireEvent.keyDown(document.activeElement, { key: "Enter" });

    expect(container.querySelectorAll("[aria-checked='true']").length).toBe(4);
  });
});
