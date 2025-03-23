import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render } from "@testing-library/react";
import React from "react";
import TreeView, { flattenTree } from "..";
import { INode, NodeId } from "../TreeView/types";

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
const folderWithIds = {
  name: "",
  id: 890,
  children: [
    {
      id: "data-string",
      name: "Fruits",
      children: [
        { name: "Avocados", id: 690 },
        { name: "Bananas", id: 1100 },
        { name: "Berries", id: 793 },
        { name: "Oranges", id: 18 },
        { name: "Pears", id: 9990 },
      ],
    },
    {
      id: "690",
      name: "Drinks",
      children: [
        { name: "Apple Juice", id: 7 },
        { name: "Chocolate", id: 12 },
        { name: "Coffee", id: 1 },
        {
          id: 908,
          name: "Tea",
          children: [
            { name: "Black Tea", id: 923 },
            { name: "Green Tea", id: 43 },
            { name: "Red Tea", id: 23 },
            { name: "Matcha", id: 4 },
          ],
        },
      ],
    },
    {
      id: 42,
      name: "Vegetables",
      children: [
        { name: "Beets", id: 672 },
        { name: "Carrots", id: 13 },
        { name: "Celery", id: 123 },
        { name: "Lettuce", id: 893 },
        { name: "Onions", id: 82 },
      ],
    },
  ],
};

const dataWithoutIds = flattenTree(folder);
const dataWithIds = flattenTree(folderWithIds);

interface ControlledExpandedProps {
  expandedIds?: NodeId[];
  data: INode[];
}

function ControlledExpanded(props: ControlledExpandedProps) {
  const { expandedIds, data } = props;
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

describe("Without node ids", () => {
  test("Should expanded node with ids set in expandedIds", () => {
    const { queryAllByRole } = render(
      <ControlledExpanded expandedIds={[1, 7, 11]} data={dataWithoutIds} />
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
      <ControlledExpanded expandedIds={expandedIds} data={dataWithoutIds} />
    );

    const nodes = queryAllByRole("treeitem");
    expect(nodes[0]).toHaveAttribute("aria-expanded", "true");

    expandedIds = [11];
    rerender(
      <ControlledExpanded expandedIds={expandedIds} data={dataWithoutIds} />
    );
    const newNodes = queryAllByRole("treeitem");
    expect(newNodes[0]).toHaveAttribute("aria-expanded", "false");
    expect(newNodes[1]).toHaveAttribute("aria-expanded", "true");
    expect(newNodes[5]).toHaveAttribute("aria-expanded", "true");
  });
  test("Should expanded parent node when children is set in expandedIds ", () => {
    const { queryAllByRole } = render(
      <ControlledExpanded expandedIds={[11]} data={dataWithoutIds} />
    );

    const nodes = queryAllByRole("treeitem");
    expect(nodes[0]).toHaveAttribute("aria-expanded", "false");
    expect(nodes[1]).toHaveAttribute("aria-expanded", "true");
    expect(nodes[5]).toHaveAttribute("aria-expanded", "true");
    expect(nodes[10]).toHaveAttribute("aria-expanded", "false");
  });
  test("Should not expanded when id is not a branch node", () => {
    const { queryAllByRole } = render(
      <ControlledExpanded expandedIds={[2]} data={dataWithoutIds} />
    );

    const nodes = queryAllByRole("treeitem");
    expect(nodes[0]).toHaveAttribute("aria-expanded", "false");
    expect(nodes[1]).toHaveAttribute("aria-expanded", "false");
    expect(nodes[2]).toHaveAttribute("aria-expanded", "false");
  });
  test("Should still be keyboard accessible after controll expanded nodes", () => {
    const { queryAllByRole } = render(
      <ControlledExpanded expandedIds={[1]} data={dataWithoutIds} />
    );

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
  test("ExpandedIds should not throw if non-existent after remove", () => {
    const { rerender } = render(
      <ControlledExpanded expandedIds={[1,7,16]} data={dataWithoutIds} />
    );

    //clone data and remove fruits
    const updatedData = [...(JSON.parse(JSON.stringify(dataWithoutIds))).filter((d:any) => !(d.id == 1 || d.parent == 1) )]
    //remove fruit from root children
    updatedData.find((d) => d.id == 0)!.children = [7,16]

    rerender(
      <ControlledExpanded expandedIds={[7,16]} data={updatedData} />
    );

  });
});

describe("With node ids", () => {
  test("Should expanded node with ids set in expandedIds", () => {
    const { queryAllByRole } = render(
      <ControlledExpanded
        expandedIds={["data-string", "690", 908]}
        data={dataWithIds}
      />
    );

    const nodes = queryAllByRole("treeitem");
    expect(nodes[0]).toHaveAttribute("aria-expanded", "true");
    expect(nodes[1]).not.toHaveAttribute("aria-expanded");
    expect(nodes[6]).toHaveAttribute("aria-expanded", "true");
    expect(nodes[10]).toHaveAttribute("aria-expanded", "true");
    expect(nodes[15]).toHaveAttribute("aria-expanded", "false");
  });
  test("Should collapse node of first render and expanded node on rerender when ExpandedIds changes", () => {
    let expandedIds: NodeId[] = ["data-string"];
    const { queryAllByRole, rerender } = render(
      <ControlledExpanded expandedIds={expandedIds} data={dataWithIds} />
    );

    const nodes = queryAllByRole("treeitem");
    expect(nodes[0]).toHaveAttribute("aria-expanded", "true");

    expandedIds = [908];
    rerender(
      <ControlledExpanded expandedIds={expandedIds} data={dataWithIds} />
    );
    const newNodes = queryAllByRole("treeitem");
    expect(newNodes[0]).toHaveAttribute("aria-expanded", "false");
    expect(newNodes[1]).toHaveAttribute("aria-expanded", "true");
    expect(newNodes[5]).toHaveAttribute("aria-expanded", "true");
  });
  test("Should expanded parent node when children is set in expandedIds ", () => {
    const { queryAllByRole } = render(
      <ControlledExpanded expandedIds={[908]} data={dataWithIds} />
    );

    const nodes = queryAllByRole("treeitem");
    expect(nodes[0]).toHaveAttribute("aria-expanded", "false");
    expect(nodes[1]).toHaveAttribute("aria-expanded", "true");
    expect(nodes[5]).toHaveAttribute("aria-expanded", "true");
    expect(nodes[10]).toHaveAttribute("aria-expanded", "false");
  });
  test("Should not expanded when id is not a branch node", () => {
    const { queryAllByRole } = render(
      <ControlledExpanded expandedIds={[690]} data={dataWithIds} />
    );

    const nodes = queryAllByRole("treeitem");
    expect(nodes[0]).toHaveAttribute("aria-expanded", "false");
    expect(nodes[1]).toHaveAttribute("aria-expanded", "false");
    expect(nodes[2]).toHaveAttribute("aria-expanded", "false");
  });
  test("Should still be keyboard accessible after controll expanded nodes", () => {
    const { queryAllByRole } = render(
      <ControlledExpanded expandedIds={["data-string"]} data={dataWithIds} />
    );

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
});
