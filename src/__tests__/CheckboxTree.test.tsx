import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import TreeView from "../TreeView";
import { INode, NodeId } from "../TreeView/types";
import { flattenTree } from "../TreeView/utils";

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
      children: [
        { name: "Beets" },
        { name: "Carrots" },
        { name: "Celery" },
        { name: "Lettuce" },
        { name: "Onions" },
      ],
    },
  ],
};

const initialData = flattenTree(folder);

function CheckboxTree({
  propagateSelect = true,
  multiSelect = true,
  data = initialData,
  defaultSelectedIds = [],
  defaultExpandedIds = [],
  defaultDisabledIds = [],
  selectedIds,
}: {
  defaultSelectedIds?: NodeId[];
  defaultExpandedIds?: NodeId[];
  defaultDisabledIds?: NodeId[];
  propagateSelect?: boolean;
  multiSelect?: boolean;
  data?: INode[];
  selectedIds?: NodeId[];
}) {
  return (
    <div>
      <div className="checkbox">
        <TreeView
          data={data}
          aria-label="Checkbox tree"
          multiSelect={multiSelect}
          propagateSelect={propagateSelect}
          defaultSelectedIds={defaultSelectedIds}
          defaultExpandedIds={defaultExpandedIds}
          defaultDisabledIds={defaultDisabledIds}
          selectedIds={selectedIds}
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
              <div {...getNodeProps({ onClick: handleExpand })}>
                <div className={`${isHalfSelected ? "half-selected" : ""}`}>
                  <div
                    className="checkbox-icon"
                    data-testid="check-box"
                    onClick={(e) => {
                      handleSelect(e);
                      e.stopPropagation();
                    }}
                  />
                  <span className="name">{element.name}</span>
                </div>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}

test("Shift + Up / Down Arrow", () => {
  const { queryAllByRole } = render(<CheckboxTree />);

  const nodes = queryAllByRole("treeitem");
  nodes[0].focus();
  fireEvent.keyDown(nodes[0], { key: "ArrowDown", shiftKey: true });

  expect(document.activeElement).toEqual(nodes[1]);
  expect(nodes[1]).toHaveAttribute("aria-checked", "true");

  fireEvent.keyDown(nodes[0], { key: "ArrowUp", shiftKey: true });
  expect(document.activeElement).toEqual(nodes[0]);
  expect(nodes[0]).toHaveAttribute("aria-checked", "true");
});

test("Shift + Up / Down Arrow", () => {
  const { queryAllByRole } = render(<CheckboxTree />);

  const nodes = queryAllByRole("treeitem");
  nodes[0].focus();
  fireEvent.keyDown(nodes[0], { key: "ArrowDown", shiftKey: true });

  expect(document.activeElement).toEqual(nodes[1]);
  expect(nodes[1]).toHaveAttribute("aria-checked", "true");

  fireEvent.keyDown(nodes[0], { key: "ArrowUp", shiftKey: true });
  expect(document.activeElement).toEqual(nodes[0]);
  expect(nodes[0]).toHaveAttribute("aria-checked", "true");
});

test("propagateselect selects all child nodes", () => {
  const { queryAllByRole, container } = render(<CheckboxTree />);
  const nodes = queryAllByRole("treeitem");
  nodes[0].focus();
  if (document.activeElement == null)
    throw new Error(
      `Expected to find an active element on the document (after focusing the first element with role["treeitem"]), but did not.`
    );
  fireEvent.keyDown(document.activeElement, { key: "Enter" });
  fireEvent.keyDown(document.activeElement, { key: "ArrowRight" });
  const childNodes = container.querySelectorAll(
    '[role="treeitem"][aria-level="2"]'
  );
  childNodes.forEach((x) => expect(x).toHaveAttribute("aria-checked", "true"));
});

test("expect when nodeAction='check', aria-multiselectable is not set and aria-checked is set", () => {
  const { queryAllByRole } = render(<CheckboxTree />);
  const treeNodes = queryAllByRole("tree");
  expect(treeNodes[0]).not.toHaveAttribute("aria-multiselectable");

  const nodes = queryAllByRole("treeitem");
  nodes.forEach((x) => expect(x).toHaveAttribute("aria-checked"));
});

test("expect when nodeAction='check', parent node indeterminate's state is set when a children node is checked ", () => {
  const { queryAllByRole } = render(<CheckboxTree />);
  const nodes = queryAllByRole("treeitem");
  nodes[0].focus();
  if (document.activeElement == null)
    throw new Error(
      `Expected to find an active element on the document (after focusing the first element with role["treeitem"]), but did not.`
    );

  nodes[0].focus();
  fireEvent.keyDown(nodes[0], { key: "ArrowRight" });
  fireEvent.keyDown(nodes[0], { key: "ArrowDown", shiftKey: true });
  expect(nodes[0]).toHaveAttribute("aria-checked", "mixed");
});

test("propagateSelectUpwards half-selects all parent nodes in multiselect", () => {
  const { queryAllByRole, container } = render(<CheckboxTree />);
  const nodes = queryAllByRole("treeitem");
  nodes[1].focus();
  if (document.activeElement == null)
    throw new Error(
      `Expected to find an active element on the document (after focusing the second element with role["treeitem"]), but did not.`
    );
  fireEvent.keyDown(document.activeElement, { key: "ArrowDown" }); //Drinks
  fireEvent.keyDown(document.activeElement, { key: "ArrowRight" }); //Drinks group
  fireEvent.keyDown(document.activeElement, { key: "ArrowDown" }); //Apple Juice
  fireEvent.keyDown(document.activeElement, { key: "ArrowDown" }); //Chocolate
  fireEvent.keyDown(document.activeElement, { key: "ArrowDown" }); //Coffee
  fireEvent.keyDown(document.activeElement, { key: "ArrowDown" }); //Tea
  fireEvent.keyDown(document.activeElement, { key: "ArrowRight" }); //Tea group
  fireEvent.keyDown(document.activeElement, { key: "ArrowDown" }); //Black Tea
  fireEvent.keyDown(document.activeElement, { key: "Enter" });

  const nodeLevel3Parents = container.querySelectorAll(".half-selected");
  expect(nodeLevel3Parents.length).toBe(2);
});

test("parent with selected descendants should be half-selected or checked in multiselect with propagateSelect={false}", () => {
  const { queryAllByRole, container } = render(
    <CheckboxTree propagateSelect={false} />
  );
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

  fireEvent.keyDown(document.activeElement, { key: "ArrowLeft" }); // Tea
  fireEvent.keyDown(document.activeElement, { key: "Enter" });

  expect(container.querySelectorAll("[aria-checked='true']").length).toBe(2); // Black Tea, Tea
  expect(container.querySelectorAll(".half-selected").length).toBe(1); // Drinks

  fireEvent.keyDown(document.activeElement, { key: "Enter" }); // Tea

  expect(container.querySelectorAll("[aria-checked='true']").length).toBe(1); // Black Tea
  expect(container.querySelectorAll(".half-selected").length).toBe(2); // Drinks, Tea
});

test("should have the correct setsize and posinset values", async () => {
  const { queryAllByRole } = render(<CheckboxTree />);
  const nodes = queryAllByRole("treeitem");
  nodes[0].focus();
  if (document.activeElement == null)
    throw new Error(
      `Expected to find an active element on the document (after focusing the first element with role["treeitem"]), but did not.`
    );
  fireEvent.keyDown(document.activeElement, { key: "ArrowRight" });
  const fruitsSpan = await screen.findByText("Fruits");

  // Ensure that the active element is what we expect at this time
  expect(document.activeElement).toContainHTML(fruitsSpan.outerHTML);
  // Does the first level have right setsize and posinset?
  expect(document.activeElement).toHaveAttribute("aria-posinset", "1");
  expect(document.activeElement).toHaveAttribute("aria-setsize", "3");

  // Now let's check the children of fruit to see if it worked too
  const hopefullyAvocados = document.activeElement.querySelector(
    '[aria-posinset="1"]'
  );
  expect(hopefullyAvocados).toHaveTextContent("Avocados");
  expect(hopefullyAvocados).toHaveAttribute("aria-setsize", "5"); // Now let's check the children of fruit to see if it worked too
  const hopefullyBananas = document.activeElement.querySelector(
    '[aria-posinset="2"]'
  );
  expect(hopefullyBananas).toHaveTextContent("Bananas");
  expect(hopefullyBananas).toHaveAttribute("aria-setsize", "5"); // Now let's check the children of fruit to see if it worked too
  const hopefullyPears = document.activeElement.querySelector(
    '[aria-posinset="5"]'
  );
  expect(hopefullyPears).toHaveTextContent("Pears");
  expect(hopefullyPears).toHaveAttribute("aria-setsize", "5");

  // To be thorough, let's test another category
  fireEvent.keyDown(document.activeElement, { key: "ArrowLeft" });
  fireEvent.keyDown(document.activeElement, { key: "ArrowDown" });
  fireEvent.keyDown(document.activeElement, { key: "ArrowRight" });

  // Ensure that the active element is what we expect at this time
  const drinksSpan = await screen.findByText("Drinks");
  expect(document.activeElement).toContainHTML(drinksSpan.outerHTML);
  expect(document.activeElement).toHaveAttribute("aria-posinset", "2"); // Now let's check the children of fruit to see if it worked too
  expect(document.activeElement).toHaveAttribute("aria-setsize", "3"); // Now let's check the children of fruit to see if it worked too

  // Let's check 2 nested levels
  fireEvent.keyDown(document.activeElement, { key: "ArrowRight" });
  fireEvent.keyDown(document.activeElement, { key: "ArrowDown" });
  fireEvent.keyDown(document.activeElement, { key: "ArrowDown" });
  fireEvent.keyDown(document.activeElement, { key: "ArrowDown" });
  const teaSpan = await screen.findByText("Tea");
  expect(document.activeElement).toContainHTML(teaSpan.outerHTML);
  fireEvent.keyDown(document.activeElement, { key: "ArrowRight" });
  const hopefullyBlackTea = document.activeElement.querySelector(
    '[aria-posinset="1"]'
  );
  expect(hopefullyBlackTea).toHaveTextContent("Black Tea");
  expect(hopefullyBlackTea).toHaveAttribute("aria-setsize", "4");
  const hopefullyMatcha = document.activeElement.querySelector(
    '[aria-posinset="4"]'
  );
  expect(hopefullyMatcha).toHaveTextContent("Matcha");
  expect(hopefullyMatcha).toHaveAttribute("aria-setsize", "4");
});

test("Should not throw error when previous selectedId is not in tree data", () => {
  const { queryAllByRole, container, rerender } = render(<CheckboxTree />);

  const nodes = queryAllByRole("treeitem");

  nodes[0].focus();
  if (document.activeElement == null)
    throw new Error(
      `Expected to find an active element on the document (after focusing the first element with role["treeitem"]), but did not.`
    );
  fireEvent.keyDown(document.activeElement, { key: "ArrowRight" }); //expand Fruits
  fireEvent.keyDown(document.activeElement, { key: "ArrowDown" }); //Avocados
  fireEvent.keyDown(document.activeElement, { key: "ArrowDown" }); //Bananas
  fireEvent.keyDown(document.activeElement, { key: "ArrowDown" }); //Berries
  fireEvent.keyDown(document.activeElement, { key: "Enter" });
  fireEvent.keyDown(document.activeElement, { key: "ArrowDown" }); //Oranges
  fireEvent.keyDown(document.activeElement, { key: "Enter" });

  const expandedNodes = queryAllByRole("treeitem");

  expect(container.querySelectorAll("[aria-checked='true']").length).toBe(2);
  expect(expandedNodes[3]).toHaveAttribute("aria-checked", "true");
  expect(expandedNodes[4]).toHaveAttribute("aria-checked", "true");

  fireEvent.keyDown(document.activeElement, { key: "Enter" });

  expect(container.querySelectorAll("[aria-checked='true']").length).toBe(1);
  expect(expandedNodes[3]).toHaveAttribute("aria-checked", "true");

  const newData = {
    name: "",
    children: [
      {
        name: "Fruits",
        id: 30,
      },
    ],
  };
  rerender(<CheckboxTree data={flattenTree(newData)} />);
  const newNodes = queryAllByRole("treeitem");
  expect(newNodes.length).toBe(1);
});

test("should set tabindex=0 for last interacted element", () => {
  const { queryAllByRole, getAllByTestId } = render(<CheckboxTree />);
  let nodes = queryAllByRole("treeitem");

  nodes[0].focus();
  if (document.activeElement == null)
    throw new Error(
      `Expected to find an active element on the document (after focusing the second element with role["treeitem"]), but did not.`
    );
  const checkableNode = getAllByTestId("check-box");

  fireEvent.click(checkableNode[1]);
  nodes = queryAllByRole("treeitem");
  expect(nodes[0]).toHaveAttribute("tabindex", "-1");
  expect(nodes[1]).toHaveAttribute("tabindex", "0");
  expect(nodes[2]).toHaveAttribute("tabindex", "-1");

  fireEvent.click(checkableNode[0]);
  nodes = queryAllByRole("treeitem");
  expect(nodes[0]).toHaveAttribute("tabindex", "0");
  expect(nodes[1]).toHaveAttribute("tabindex", "-1");
  expect(nodes[2]).toHaveAttribute("tabindex", "-1");

  //deselect
  fireEvent.click(checkableNode[1]);
  nodes = queryAllByRole("treeitem");
  expect(nodes[0]).toHaveAttribute("tabindex", "-1");
  expect(nodes[1]).toHaveAttribute("tabindex", "0");
  expect(nodes[2]).toHaveAttribute("tabindex", "-1");
});

test("should not set focus without interaction with the tree", () => {
  const { queryAllByRole } = render(
    <CheckboxTree
      defaultSelectedIds={[8, 10, 11, 12, 14, 15]}
      defaultExpandedIds={[1, 7, 11, 16]}
      defaultDisabledIds={[9, 13]}
    />
  );

  const nodes = queryAllByRole("treeitem");

  expect(nodes[0]).toHaveAttribute("tabindex", "0");
  expect(nodes[0].childNodes[0]).not.toHaveClass("tree-node--focused");
  expect(nodes[0].childNodes[1]).not.toHaveClass("tree-node-group--focused");
});

test("should set focus on first node if data has changed", () => {
  const firstNodeName = "Beets";
  const vegetables = flattenTree({
    name: "",
    children: [
      { name: firstNodeName },
      { name: "Carrots" },
      { name: "Celery" },
      { name: "Lettuce" },
      { name: "Onions" },
    ],
  });
  const { queryAllByRole, rerender } = render(<CheckboxTree />);

  const nodes = queryAllByRole("treeitem");
  nodes[0].focus();

  if (document.activeElement == null)
    throw new Error(
      `Expected to find an active element on the document (after focusing the second element with role["treeitem"]), but did not.`
    );
  fireEvent.keyDown(document.activeElement, { key: "ArrowDown" }); //focused Drinks

  expect(document.querySelector(".tree-node--focused")?.innerHTML).toContain(
    "Drinks"
  );

  rerender(<CheckboxTree data={vegetables} />);

  expect(document.querySelector(".tree-node--focused")?.innerHTML).toContain(
    firstNodeName
  );
});

test("should preserve focus on node if changed data contains previouslt focused node", () => {
  const filteredData = flattenTree({
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
    ],
  });
  const { queryAllByRole, rerender } = render(<CheckboxTree />);

  const nodes = queryAllByRole("treeitem");
  nodes[0].focus();

  if (document.activeElement == null)
    throw new Error(
      `Expected to find an active element on the document (after focusing the second element with role["treeitem"]), but did not.`
    );
  fireEvent.keyDown(document.activeElement, { key: "ArrowDown" }); //focused Drinks

  expect(document.querySelector(".tree-node--focused")?.innerHTML).toContain(
    "Drinks"
  );

  rerender(<CheckboxTree data={filteredData} />);

  expect(document.querySelector(".tree-node--focused")?.innerHTML).toContain(
    "Drinks"
  );
});

describe("halfSelected parent should change status when propagateSelect={false}", () => {
  const checkSelectionAndHalfSelection = (nodes: HTMLElement[]) => {
    //Initial state
    //[-] Fruits
    //*[ ] Avocados
    //*[+] Bananas
    //*[ ] Berries
    // ...

    expect(nodes[0]).toHaveAttribute("aria-checked", "mixed");
    expect(nodes[2]).toHaveAttribute("aria-checked", "true");

    nodes[0].focus();
    if (document.activeElement == null)
      throw new Error(
        `Expected to find an active element on the document (after focusing the second element with role["treeitem"]), but did not.`
      );
    fireEvent.click(nodes[0].getElementsByClassName("checkbox-icon")[0]); //select Fruits
    //Expected state 1
    //[+] Fruits
    //*[ ] Avocados
    //*[+] Bananas
    //*[ ] Berries
    // ...

    expect(nodes[0]).toHaveAttribute("aria-checked", "true");
    expect(nodes[2]).toHaveAttribute("aria-checked", "true");

    fireEvent.click(nodes[0].getElementsByClassName("checkbox-icon")[0]); //half-select Fruits
    //Expected state 2
    //[-] Fruits
    //*[ ] Avocados
    //*[+] Bananas
    //*[ ] Berries
    // ...
    expect(nodes[0]).toHaveAttribute("aria-checked", "mixed");
    expect(nodes[2]).toHaveAttribute("aria-checked", "true");
  };

  const checkDeselectionAndSelectionOfParent = (nodes: HTMLElement[]) => {
    fireEvent.click(nodes[2].getElementsByClassName("checkbox-icon")[0]); //deselect Bananas
    //Initial state
    //[ ] Fruits
    //*[ ] Avocados
    //*[ ] Bananas
    //*[ ] Berries
    // ...
    expect(nodes[0]).toHaveAttribute("aria-checked", "false");
    expect(nodes[2]).toHaveAttribute("aria-checked", "false");

    fireEvent.click(nodes[0].getElementsByClassName("checkbox-icon")[0]); //select Fruits
    //Expected state 1
    //[+] Fruits
    //*[ ] Avocados
    //*[ ] Bananas
    //*[ ] Berries
    // ...
    expect(nodes[0]).toHaveAttribute("aria-checked", "true");
    expect(nodes[2]).toHaveAttribute("aria-checked", "false");

    fireEvent.click(nodes[0].getElementsByClassName("checkbox-icon")[0]); //deselect Fruits
    //Expected state 1
    //[ ] Fruits
    //*[ ] Avocados
    //*[ ] Bananas
    //*[ ] Berries
    // ...
    expect(nodes[0]).toHaveAttribute("aria-checked", "false");
    expect(nodes[2]).toHaveAttribute("aria-checked", "false");
  };

  test(
    "1. to selected when selection changed manually," +
    "2. to deselected and to selected when no selected children after children where selected manually initially",
    () => {
      const { queryAllByRole } = render(
        <CheckboxTree propagateSelect={false} defaultExpandedIds={[1]} />
      );
      const nodes = queryAllByRole("treeitem");

      nodes[2].focus();
      if (document.activeElement == null)
        throw new Error(
          `Expected to find an active element on the document (after focusing the second element with role["treeitem"]), but did not.`
        );

      fireEvent.click(nodes[2].getElementsByClassName("checkbox-icon")[0]); //select Bananas

      expect(nodes[0]).toHaveAttribute("aria-checked", "mixed");
      expect(nodes[2]).toHaveAttribute("aria-checked", "true");

      checkSelectionAndHalfSelection(nodes);
      checkDeselectionAndSelectionOfParent(nodes);
    }
  );

  test(
    "1. to selected when default selected child and selection changed manually" +
    "2. to deselected and to selected when no selected children after children where selected by default initially",
    () => {
      const { queryAllByRole } = render(
        <CheckboxTree
          propagateSelect={false}
          defaultSelectedIds={[3]}
          defaultExpandedIds={[1]}
        />
      );
      const nodes = queryAllByRole("treeitem");
      checkSelectionAndHalfSelection(nodes);
      checkDeselectionAndSelectionOfParent(nodes);
    }
  );

  test(
    "1. to selected when selection changed controlled and manually" +
    "2. to deselected and to selected when no selected children after children where selected controlled initially",
    () => {
      const { queryAllByRole } = render(
        <CheckboxTree
          propagateSelect={false}
          selectedIds={[3]}
          defaultExpandedIds={[1]}
        />
      );
      const nodes = queryAllByRole("treeitem");
      checkSelectionAndHalfSelection(nodes);
      checkDeselectionAndSelectionOfParent(nodes);
    }
  );
});

test("should render defaultSelectedIds correctly with propagateSelect and verify selection after expanding nodes", () => {
  const { queryAllByRole } = render(
    <CheckboxTree defaultSelectedIds={[2, 7]} />
  );

  let nodes = queryAllByRole("treeitem");

  // Verify initial state
  expect(nodes[0]).toHaveAttribute("aria-checked", "mixed"); // Fruits should be half-selected
  expect(nodes[1]).toHaveAttribute("aria-checked", "true"); // Drinks should be selected
  expect(nodes[2]).toHaveAttribute("aria-checked", "false"); // Vegetables should not be selected

  expect(nodes[0]).toHaveAttribute("aria-expanded", "false"); // Fruits should not be expanded
  expect(nodes[1]).toHaveAttribute("aria-expanded", "false"); // Drinks should not be expanded
  expect(nodes[2]).toHaveAttribute("aria-expanded", "false"); // Vegetables should not be expanded

  // Expand Fruits node
  nodes[0].focus();
  if (document.activeElement == null)
    throw new Error("Expected to find an active element");
  fireEvent.keyDown(document.activeElement, { key: "ArrowRight" });

  nodes = queryAllByRole("treeitem");
  expect(nodes[0]).toHaveAttribute("aria-expanded", "true");

  // Verify Fruits children selection after expanding
  const fruitsChildNodes = nodes.filter(
    (node) => node.getAttribute("aria-level") === "2"
  );

  expect(fruitsChildNodes[0]).toHaveAttribute("aria-checked", "true"); // Avocados (id: 2)
  expect(fruitsChildNodes[1]).toHaveAttribute("aria-checked", "false"); // Bananas
  expect(fruitsChildNodes[2]).toHaveAttribute("aria-checked", "false"); // Berries
  expect(fruitsChildNodes[3]).toHaveAttribute("aria-checked", "false"); // Oranges
  expect(fruitsChildNodes[4]).toHaveAttribute("aria-checked", "false"); // Pears

  // Navigate to and expand Drinks node
  fireEvent.keyDown(document.activeElement, { key: "ArrowLeft" }); // Collapse Fruits
  fireEvent.keyDown(document.activeElement, { key: "ArrowDown" }); // Navigate to Drinks
  fireEvent.keyDown(document.activeElement, { key: "ArrowRight" }); // Expand Drinks

  nodes = queryAllByRole("treeitem");
  const drinksNode = nodes.find((node) => node.textContent?.includes("Drinks"));
  expect(drinksNode).toHaveAttribute("aria-expanded", "true");

  // Verify Drinks children selection after expanding
  const drinksChildNodes = nodes.filter(
    (node) =>
      node.getAttribute("aria-level") === "2" &&
      (node.textContent?.includes("Apple Juice") ||
        node.textContent?.includes("Chocolate") ||
        node.textContent?.includes("Coffee") ||
        node.textContent?.includes("Tea"))
  );

  expect(drinksChildNodes[0]).toHaveAttribute("aria-checked", "true"); // Apple Juice (id: 8)
  expect(drinksChildNodes[1]).toHaveAttribute("aria-checked", "true"); // Chocolate (id: 9)
  expect(drinksChildNodes[2]).toHaveAttribute("aria-checked", "true"); // Coffee (id: 10)
  expect(drinksChildNodes[3]).toHaveAttribute("aria-checked", "true"); // Tea (id: 11)
});

test("should render defaultSelectedIds with nested selections and propagateSelect", () => {
  const { queryAllByRole } = render(
    <CheckboxTree defaultSelectedIds={[12, 13]} defaultExpandedIds={[7, 11]} />
  );

  const nodes = queryAllByRole("treeitem");

  // Verify parent states with nested selections
  expect(nodes[0]).toHaveAttribute("aria-checked", "false"); // Fruits
  expect(nodes[1]).toHaveAttribute("aria-checked", "mixed"); // Drinks should be half-selected
  expect(nodes[2]).toHaveAttribute("aria-checked", "false"); // Vegetables

  // Find Tea node and verify it's half-selected
  const teaNode = nodes.find(
    (node) =>
      node.textContent?.includes("Tea") &&
      node.getAttribute("aria-level") === "2"
  );
  expect(teaNode).toHaveAttribute("aria-checked", "mixed");

  // Verify Tea children
  const teaChildNodes = nodes.filter(
    (node) => node.getAttribute("aria-level") === "3"
  );
  expect(teaChildNodes[0]).toHaveAttribute("aria-checked", "true"); // Green Tea (id: 12)
  expect(teaChildNodes[1]).toHaveAttribute("aria-checked", "true"); // Red Tea (id: 13)
  expect(teaChildNodes[2]).toHaveAttribute("aria-checked", "false"); // Black Tea
  expect(teaChildNodes[3]).toHaveAttribute("aria-checked", "false"); // Matcha
});

test("should render defaultSelectedIds where selecting all children propagates selection to parent", () => {
  const { queryAllByRole } = render(
    <CheckboxTree defaultSelectedIds={[2, 3, 4, 5, 6]} />
  );

  const nodes = queryAllByRole("treeitem");

  // Verify parent is fully selected when all its children are selected
  expect(nodes[0]).toHaveAttribute("aria-checked", "true"); // Fruits should be fully selected
  expect(nodes[1]).toHaveAttribute("aria-checked", "false"); // Drinks should not be selected
  expect(nodes[2]).toHaveAttribute("aria-checked", "false"); // Vegetables should not be selected

  // Expand Fruits to confirm all children are selected
  nodes[0].focus();
  if (document.activeElement == null)
    throw new Error("Expected to find an active element");
  fireEvent.keyDown(document.activeElement, { key: "ArrowRight" });

  // Verify all children of Fruits are selected
  const fruitsChildNodes = nodes.filter(
    (node) => node.getAttribute("aria-level") === "2"
  );
  fruitsChildNodes.forEach((node) => {
    expect(node).toHaveAttribute("aria-checked", "true");
  });
});

test("should render defaultSelectedIds with propagateSelect disabled", () => {
  const { queryAllByRole } = render(
    <CheckboxTree defaultSelectedIds={[2, 8, 16]} propagateSelect={false} />
  );

  let nodes = queryAllByRole("treeitem");

  expect(nodes[0]).toHaveAttribute("aria-checked", "mixed"); // Fruits should be half-selected
  expect(nodes[1]).toHaveAttribute("aria-checked", "mixed"); // Drinks should be half-selected
  expect(nodes[2]).toHaveAttribute("aria-checked", "true"); // Vegetables

  // Expand Fruits to verify only specific child is selected
  nodes[0].focus();
  if (document.activeElement == null)
    throw new Error("Expected to find an active element");
  fireEvent.keyDown(document.activeElement, { key: "ArrowRight" });

  nodes = queryAllByRole("treeitem");
  const fruitsChildNodes = nodes.filter(
    (node) => node.getAttribute("aria-level") === "2"
  );

  expect(fruitsChildNodes[0]).toHaveAttribute("aria-checked", "true"); // Avocados (id: 2)
  expect(fruitsChildNodes[1]).toHaveAttribute("aria-checked", "false"); // Bananas
  expect(fruitsChildNodes[2]).toHaveAttribute("aria-checked", "false"); // Berries
  expect(fruitsChildNodes[3]).toHaveAttribute("aria-checked", "false"); // Oranges
  expect(fruitsChildNodes[4]).toHaveAttribute("aria-checked", "false"); // Pears

  // Expand Vegetables to verify there no children selected
  fireEvent.keyDown(document.activeElement, { key: "ArrowLeft" }); // Collapse Fruits
  fireEvent.keyDown(document.activeElement, { key: "ArrowDown" }); // Navigate to Drinks
  fireEvent.keyDown(document.activeElement, { key: "ArrowDown" }); // Navigate to Vegetables
  fireEvent.keyDown(document.activeElement, { key: "ArrowRight" }); // Expand Vegetables

  nodes = queryAllByRole("treeitem");
  const vegetablesChildNodes = nodes.filter(
    (node) => node.getAttribute("aria-level") === "2"
  );
  expect(vegetablesChildNodes[0]).toHaveAttribute("aria-checked", "false"); // Beets (id: 16)
  expect(vegetablesChildNodes[1]).toHaveAttribute("aria-checked", "false"); // Carrots
  expect(vegetablesChildNodes[2]).toHaveAttribute("aria-checked", "false"); // Celery
  expect(vegetablesChildNodes[3]).toHaveAttribute("aria-checked", "false"); // Lettuce
  expect(vegetablesChildNodes[4]).toHaveAttribute("aria-checked", "false"); // Onions
});

test("should handle empty defaultSelectedIds", () => {
  const { queryAllByRole } = render(<CheckboxTree defaultSelectedIds={[]} />);

  const nodes = queryAllByRole("treeitem");
  nodes.forEach((node) => {
    expect(node).toHaveAttribute("aria-checked", "false");
  });
});
