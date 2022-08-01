import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import TreeView, { flattenTree } from "..";

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

const data = flattenTree(folder);

function MultiSelectCheckbox() {
  return (
    <div>
      <div className="checkbox">
        <TreeView
          data={data}
          aria-label="Checkbox tree"
          multiSelect
          propagateSelect
          propagateSelectUpwards
          togglableSelect
          nodeRenderer={({
            element,
            getNodeProps,
            handleSelect,
            handleExpand,
            isHalfSelected,
          }) => {
            return (
              <div {...getNodeProps({ onClick: handleExpand })} className={`${isHalfSelected ? 'half-selected' : ''}`}>
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
  const { queryAllByRole } = render(<MultiSelectCheckbox />);

  const nodes = queryAllByRole("treeitem");
  nodes[0].focus();
  fireEvent.keyDown(nodes[0], { key: "ArrowDown", shiftKey: true });

  expect(document.activeElement).toEqual(nodes[1]);
  expect(nodes[1]).toHaveAttribute("aria-selected", "true");

  fireEvent.keyDown(nodes[0], { key: "ArrowUp", shiftKey: true });
  expect(document.activeElement).toEqual(nodes[0]);
  expect(nodes[0]).toHaveAttribute("aria-selected", "true");
});

test("Shift + Up / Down Arrow", () => {
  const { queryAllByRole } = render(<MultiSelectCheckbox />);

  const nodes = queryAllByRole("treeitem");
  nodes[0].focus();
  fireEvent.keyDown(nodes[0], { key: "ArrowDown", shiftKey: true });

  expect(document.activeElement).toEqual(nodes[1]);
  expect(nodes[1]).toHaveAttribute("aria-selected", "true");

  fireEvent.keyDown(nodes[0], { key: "ArrowUp", shiftKey: true });
  expect(document.activeElement).toEqual(nodes[0]);
  expect(nodes[0]).toHaveAttribute("aria-selected", "true");
});

test("propagateselect selects all child nodes", () => {
  const { queryAllByRole, container } = render(<MultiSelectCheckbox />);
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
  childNodes.forEach((x) => expect(x).toHaveAttribute("aria-selected", "true"));
});

test("propagateselectupwards half-selects all parent nodes", () => {
  const { queryAllByRole, container } = render(<MultiSelectCheckbox />);
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
  fireEvent.keyDown(document.activeElement, { key: "ArrowRight" }) //Tea group
  fireEvent.keyDown(document.activeElement, { key: "ArrowDown" }); //Black Tea
  fireEvent.keyDown(document.activeElement, { key: "Enter" });

  const nodeLevel3Parents = container.querySelectorAll('.half-selected');
  expect(nodeLevel3Parents.length).toBe(2);
});

test("should have the correct setsize and posinset values", async () => {
  const { queryAllByRole } = render(<MultiSelectCheckbox />);
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
