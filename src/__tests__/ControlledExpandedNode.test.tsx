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

interface ControlledExpandedProps {
  expandedIds?: number[];
}

function ControlledExpanded(props: ControlledExpandedProps) {
  const { expandedIds } = props;
  return (
    <div>
      <TreeView
        data={data}
        aria-label="Controlled expanded tree"
        expandedIds={expandedIds}
        nodeRenderer={({
          element,
          getNodeProps,
          handleExpand,
          isExpanded,
          isBranch,
        }) => {
          return (
            <div {...getNodeProps({ onClick: handleExpand })}>
              {isBranch && (
                <div className={isExpanded ? "arrow--open" : "arrow--closed"} />
              )}
              <span className="name">{element.name}</span>
            </div>
          );
        }}
      />
    </div>
  );
}

test("Should expanded node with ids set in expandedIds ", () => {
  const { queryAllByRole } = render(
    <ControlledExpanded expandedIds={[1, 7, 11]} />
  );

  const nodes = queryAllByRole("treeitem");
  expect(nodes[0]).toHaveAttribute("aria-expanded", "true");
  expect(nodes[1]).not.toHaveAttribute("aria-expanded");
  expect(nodes[6]).toHaveAttribute("aria-expanded", "true");
  expect(nodes[10]).toHaveAttribute("aria-expanded", "true");
  expect(nodes[15]).toHaveAttribute("aria-expanded", "false");
});
test("Should collapse node of first render and expanded node on rerender when ExpandedIds changes", () => {
  let expandedIds = [1];
  const { queryAllByRole, rerender } = render(
    <ControlledExpanded expandedIds={expandedIds} />
  );

  const nodes = queryAllByRole("treeitem");
  expect(nodes[0]).toHaveAttribute("aria-expanded", "true");

  expandedIds = [11];
  rerender(<ControlledExpanded expandedIds={expandedIds} />);
  const newNodes = queryAllByRole("treeitem");
  expect(newNodes[0]).toHaveAttribute("aria-expanded", "false");
  expect(newNodes[1]).toHaveAttribute("aria-expanded", "true");
  expect(newNodes[5]).toHaveAttribute("aria-expanded", "true");
});

test("Should expanded parent node when children is set in expandedIds ", () => {
  const { queryAllByRole } = render(<ControlledExpanded expandedIds={[11]} />);

  const nodes = queryAllByRole("treeitem");
  expect(nodes[0]).toHaveAttribute("aria-expanded", "false");
  expect(nodes[1]).toHaveAttribute("aria-expanded", "true");
  expect(nodes[5]).toHaveAttribute("aria-expanded", "true");
  expect(nodes[10]).toHaveAttribute("aria-expanded", "false");
});

test("Should not expanded when id is not a branch node", () => {
  const { queryAllByRole } = render(<ControlledExpanded expandedIds={[2]} />);

  const nodes = queryAllByRole("treeitem");
  expect(nodes[0]).toHaveAttribute("aria-expanded", "false");
  expect(nodes[1]).toHaveAttribute("aria-expanded", "false");
  expect(nodes[2]).toHaveAttribute("aria-expanded", "false");
});

test("Should still be keyboard accessible after controll expanded nodes", () => {
  const { queryAllByRole } = render(<ControlledExpanded expandedIds={[1]} />);

  const nodes = queryAllByRole("treeitem");
  expect(nodes[0]).toHaveAttribute("aria-expanded", "true");
  nodes[0].focus();
  if (document.activeElement == null)
    throw new Error(
      `Expected to find an active element on the document (after focusing the second element with role["treeitem"]), but did not.`
    );
  fireEvent.keyDown(document.activeElement, { key: "ArrowLeft" });
  const nodesAfterCollapse = queryAllByRole("treeitem");
  expect(nodesAfterCollapse[0]).toHaveAttribute("aria-expanded", "false");

  nodes[0].focus();
  fireEvent.keyDown(document.activeElement, { key: "*" });
  const nodesAfterExpandedAll = queryAllByRole("treeitem");
  expect(nodesAfterExpandedAll[0]).toHaveAttribute("aria-expanded", "true");
  expect(nodesAfterExpandedAll[6]).toHaveAttribute("aria-expanded", "true");
  expect(nodesAfterExpandedAll[11]).toHaveAttribute("aria-expanded", "true");
});
