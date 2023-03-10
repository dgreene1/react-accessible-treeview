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

interface ControlledDisabledProps {
  disabledIds?: number[];
  defaultDisabledIds?: number[];
  defaultSelectedIds?: number[];
  propagateSelect?: boolean;
}

function ControlledDisabled(props: ControlledDisabledProps) {
  const {
    disabledIds,
    defaultDisabledIds,
    defaultSelectedIds,
    propagateSelect,
  } = props;
  return (
    <div>
      <TreeView
        data={data}
        aria-label="Controlled disabled tree"
        disabledIds={disabledIds}
        defaultDisabledIds={defaultDisabledIds}
        defaultSelectedIds={defaultSelectedIds}
        defaultExpandedIds={[1, 7, 11, 16]}
        propagateSelect={propagateSelect}
        multiSelect
        nodeRenderer={({
          element,
          getNodeProps,
          handleExpand,
          isDisabled,
          isBranch,
        }) => {
          return (
            <div {...getNodeProps({ onClick: handleExpand })}>
              {isBranch && (
                <div className={isDisabled ? "disabled" : "enabled"} />
              )}
              <span className="name">{element.name}</span>
            </div>
          );
        }}
      />
    </div>
  );
}

test("should disable node with ids set in disabledIds", () => {
  const { queryAllByRole } = render(
    <ControlledDisabled disabledIds={[1, 7, 11]} />
  );

  const nodes = queryAllByRole("treeitem");
  expect(nodes[0]).toHaveAttribute("aria-disabled", "true");
  expect(nodes[6]).toHaveAttribute("aria-disabled", "true");
  expect(nodes[10]).toHaveAttribute("aria-disabled", "true");
});

test("should disable node of first render and enable node on rerender when disabledIds changes", () => {
  let disabledIds = [1];
  const { queryAllByRole, rerender } = render(
    <ControlledDisabled disabledIds={disabledIds} />
  );

  const nodes = queryAllByRole("treeitem");
  expect(nodes[0]).toHaveAttribute("aria-disabled", "true");

  disabledIds = [20];
  rerender(<ControlledDisabled disabledIds={disabledIds} />);
  const newNodes = queryAllByRole("treeitem");
  expect(newNodes[0]).toHaveAttribute("aria-disabled", "false");
  expect(newNodes[19]).toHaveAttribute("aria-disabled", "true");
});

test("should enable defaultDisabledIds when disabledIDs is set on rerender", () => {
  const { queryAllByRole, rerender } = render(
    <ControlledDisabled defaultDisabledIds={[3]} />
  );

  const nodes = queryAllByRole("treeitem");
  expect(nodes[2]).toHaveAttribute("aria-disabled", "true");

  rerender(<ControlledDisabled disabledIds={[14]} />);

  const newNodes = queryAllByRole("treeitem");
  expect(newNodes[2]).toHaveAttribute("aria-disabled", "false");
  expect(newNodes[13]).toHaveAttribute("aria-disabled", "true");
});

test("should disable selected node", () => {
  const { queryAllByRole } = render(
    <ControlledDisabled defaultSelectedIds={[2]} disabledIds={[2]} />
  );

  const nodes = queryAllByRole("treeitem");
  expect(nodes[1]).toHaveAttribute("aria-selected", "true");
  expect(nodes[1]).toHaveAttribute("aria-disabled", "true");
});

test("should not select disabled node", () => {
  const { queryAllByRole } = render(
    <ControlledDisabled propagateSelect disabledIds={[5]} />
  );

  const nodes = queryAllByRole("treeitem");
  expect(nodes[4]).toHaveAttribute("aria-disabled", "true");
  expect(nodes[4]).toHaveAttribute("aria-selected", "false");

  nodes[0].focus();
  if (document.activeElement == null)
    throw new Error(
      `Expected to find an active element on the document (after focusing the second element with role["treeitem"]), but did not.`
    );
  fireEvent.keyDown(document.activeElement, { key: "Enter" });
  const nodesAfterSelect = queryAllByRole("treeitem");
  expect(nodesAfterSelect[0]).toHaveAttribute("aria-selected", "true");
  expect(nodesAfterSelect[1]).toHaveAttribute("aria-selected", "true");
  expect(nodesAfterSelect[2]).toHaveAttribute("aria-selected", "true");
  expect(nodesAfterSelect[3]).toHaveAttribute("aria-selected", "true");
  expect(nodesAfterSelect[4]).toHaveAttribute("aria-selected", "false");
  expect(nodesAfterSelect[4]).toHaveAttribute("aria-disabled", "true");
  expect(nodesAfterSelect[5]).toHaveAttribute("aria-selected", "true");
});

test("should disable children when parent is disabled", () => {
  const parentId = 7;
  const childrenIds: number[] = [];
  const getAllChildren = (id: number) => {
    data[id].children.forEach((id: number) => {
      if (data[id]?.children.length) {
        childrenIds.push(id);
        return getAllChildren(id);
      }
      return childrenIds.push(id);
    });

    return test;
  };
  getAllChildren(parentId);
  const { queryAllByRole } = render(
    <ControlledDisabled disabledIds={[parentId]} />
  );

  const nodes = queryAllByRole("treeitem");

  nodes.forEach((node, index) => {
    const nodeIndex = index + 1;
    if (childrenIds.includes(nodeIndex) || nodeIndex === parentId) {
      expect(node).toHaveAttribute("aria-disabled", "true");
    } else {
      expect(node).toHaveAttribute("aria-disabled", "false");
    }
  });
});

test("should disable children when parent is disabled in defaultDisabledIds", () => {
  const parentId = 7;
  const childrenIds: number[] = [];
  const getAllChildren = (id: number) => {
    data[id].children.forEach((id: number) => {
      if (data[id]?.children.length) {
        childrenIds.push(id);
        return getAllChildren(id);
      }
      return childrenIds.push(id);
    });

    return test;
  };
  getAllChildren(parentId);
  const { queryAllByRole } = render(
    <ControlledDisabled defaultDisabledIds={[parentId]} />
  );

  const nodes = queryAllByRole("treeitem");

  nodes.forEach((node, index) => {
    const nodeIndex = index + 1;
    if (childrenIds.includes(nodeIndex) || nodeIndex === parentId) {
      expect(node).toHaveAttribute("aria-disabled", "true");
    } else {
      expect(node).toHaveAttribute("aria-disabled", "false");
    }
  });
});
