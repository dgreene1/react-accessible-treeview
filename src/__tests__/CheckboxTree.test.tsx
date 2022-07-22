import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render } from "@testing-library/react";
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
  expect(nodes[1]).toHaveAttribute("aria-checked", "true");

  fireEvent.keyDown(nodes[0], { key: "ArrowUp", shiftKey: true });
  expect(document.activeElement).toEqual(nodes[0]);
  expect(nodes[0]).toHaveAttribute("aria-checked", "true");
});

test("Shift + Up / Down Arrow", () => {
  const { queryAllByRole } = render(<MultiSelectCheckbox />);

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
  childNodes.forEach((x) => expect(x).toHaveAttribute("aria-checked", "true"));
});

test("expect when nodeAction='check', aria-multiselectable is not set and aria-checked is set", () => {
  const { queryAllByRole } = render(<MultiSelectCheckbox />);
  const treeNodes = queryAllByRole("tree");
  expect(treeNodes[0]).not.toHaveAttribute("aria-multiselectable");

  const nodes = queryAllByRole("treeitem");
  nodes.forEach((x) => expect(x).toHaveAttribute("aria-checked"));
});

test("expect when nodeAction='check', parent node indeterminate's state is set when a children node is checked ", () => {
  const { queryAllByRole } = render(<MultiSelectCheckbox />);
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
