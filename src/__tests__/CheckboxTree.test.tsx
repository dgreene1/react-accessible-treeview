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

function MultiSelectCheckbox(props: any) {
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

  let nodes = queryAllByRole("treeitem");
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

  let nodes = queryAllByRole("treeitem");
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
  let nodes = queryAllByRole("treeitem");
  nodes[0].focus();
  fireEvent.keyDown(document.activeElement, { key: "Enter" });
  fireEvent.keyDown(document.activeElement, { key: "ArrowRight" });
  let childNodes = container.querySelectorAll(
    '[role="treeitem"][aria-level="2"]'
  );
  childNodes.forEach((x) => expect(x).toHaveAttribute("aria-selected", "true"));
});
