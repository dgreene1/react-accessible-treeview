import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
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

interface MultiSelectCheckboxControlledProps {
  selectedIds: number[],
  defaultDisabledIds?: number[],
}

function MultiSelectCheckboxControlled(props: MultiSelectCheckboxControlledProps) {
  const {selectedIds, defaultDisabledIds = []} = props;
  return (
    <div>
        <TreeView
          data={data}
          aria-label="Controlled tree"
          multiSelect
          selectedIds={selectedIds}
          defaultDisabledIds={defaultDisabledIds}
          defaultExpandedIds={[1,7,11,16]}
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
  );
}

test("SelectedIds should be rendered", () => {
  const { queryAllByRole } = render(<MultiSelectCheckboxControlled selectedIds={[1,12,19]} />);

  const nodes = queryAllByRole("treeitem");
  expect(nodes[0]).toHaveAttribute("aria-checked", "true");
  expect(nodes[1]).toHaveAttribute("aria-checked", "true");
  expect(nodes[2]).toHaveAttribute("aria-checked", "true");
  expect(nodes[3]).toHaveAttribute("aria-checked", "true");
  expect(nodes[4]).toHaveAttribute("aria-checked", "true");
  expect(nodes[5]).toHaveAttribute("aria-checked", "true");
  expect(nodes[11]).toHaveAttribute("aria-checked", "true");
  expect(nodes[18]).toHaveAttribute("aria-checked", "true");
});

test("SelectedIds should be re-rendered", () => {
  let selectedIds = [12];
  const { queryAllByRole, rerender } = render(<MultiSelectCheckboxControlled selectedIds={selectedIds} />);

  const nodes = queryAllByRole("treeitem");
  expect(nodes[11]).toHaveAttribute("aria-checked", "true");

  selectedIds = [20];
  rerender(<MultiSelectCheckboxControlled selectedIds={selectedIds} />)
  const newNodes = queryAllByRole("treeitem");
  expect(newNodes[11]).toHaveAttribute("aria-checked", "false");
  expect(newNodes[19]).toHaveAttribute("aria-checked", "true");
});

test('SelectedIds should clear previous selection', () => {
  let selectedIds = [12];
  const { queryAllByRole, rerender } = render(<MultiSelectCheckboxControlled selectedIds={selectedIds} />);

  const nodes = queryAllByRole("treeitem");
  expect(nodes[11]).toHaveAttribute("aria-checked", "true");
  nodes[4].focus();
  if (document.activeElement == null)
  throw new Error(
    `Expected to find an active element on the document (after focusing the second element with role["treeitem"]), but did not.`
  );
  fireEvent.click(nodes[4].getElementsByClassName('checkbox-icon')[0]);
  expect(nodes[11]).toHaveAttribute("aria-checked", "true");
  expect(nodes[4]).toHaveAttribute("aria-checked", "true");

  selectedIds = [20];
  rerender(<MultiSelectCheckboxControlled selectedIds={selectedIds} />)
  const newNodes = queryAllByRole("treeitem");
  expect(newNodes[11]).toHaveAttribute("aria-checked", "false");
  expect(newNodes[4]).toHaveAttribute("aria-checked", "false");
  expect(newNodes[19]).toHaveAttribute("aria-checked", "true");
});

test('SelectedIds should select all children if parent node selected', () => {
  const { queryAllByRole } = render(<MultiSelectCheckboxControlled selectedIds={[16]} />);
  const nodes = queryAllByRole("treeitem");
  expect(nodes[15]).toHaveAttribute("aria-checked", "true");
  expect(nodes[16]).toHaveAttribute("aria-checked", "true");
  expect(nodes[17]).toHaveAttribute("aria-checked", "true");
  expect(nodes[18]).toHaveAttribute("aria-checked", "true");
  expect(nodes[19]).toHaveAttribute("aria-checked", "true");
  expect(nodes[20]).toHaveAttribute("aria-checked", "true");
});

test('SelectedIds should select disabled id, but not propagate selection to children', () => {
  const { queryAllByRole } = render(<MultiSelectCheckboxControlled selectedIds={[1]} defaultDisabledIds={[1]} />);
  const nodes = queryAllByRole("treeitem");
  expect(nodes[0]).toHaveAttribute("aria-disabled", "true");
  expect(nodes[0]).toHaveAttribute("aria-checked", "true");
  expect(nodes[1]).toHaveAttribute("aria-checked", "false");
  expect(nodes[2]).toHaveAttribute("aria-checked", "false");
  expect(nodes[3]).toHaveAttribute("aria-checked", "false");
  expect(nodes[4]).toHaveAttribute("aria-checked", "false");
  expect(nodes[5]).toHaveAttribute("aria-checked", "false");
});

test('SelectedIds should select disabled id, but not propagate selection to parent', () => {
  const { queryAllByRole } = render(<MultiSelectCheckboxControlled selectedIds={[3]} defaultDisabledIds={[3]} />);
  const nodes = queryAllByRole("treeitem");
  expect(nodes[0]).toHaveAttribute("aria-checked", "false");
  expect(nodes[2]).toHaveAttribute("aria-disabled", "true");
  expect(nodes[2]).toHaveAttribute("aria-checked", "true");
});
