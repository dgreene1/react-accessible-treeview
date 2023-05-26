import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import TreeView from "../TreeView";
import { INode } from "../TreeView/types";
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
}: {
  propagateSelect?: boolean;
  multiSelect?: boolean;
  data?: INode[];
}) {
  return (
    <div>
      <div className="checkbox">
        <TreeView
          data={data}
          aria-label="Checkbox tree"
          multiSelect={multiSelect}
          propagateSelect={propagateSelect}
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
