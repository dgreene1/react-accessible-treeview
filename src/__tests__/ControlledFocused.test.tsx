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

interface ControlledFocusedProps {
  focusedId?: NodeId;
  data: INode[];
  defaultDisabledIds?: NodeId[];
}

function ControlledFocused(props: ControlledFocusedProps) {
  const { focusedId, data, defaultDisabledIds } = props;
  return (
    <div>
      <TreeView
        data={data}
        aria-label="Controlled focused tree"
        focusedId={focusedId}
        defaultDisabledIds={defaultDisabledIds}
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
  test("Should set focus with focusedId", () => {
    render(<ControlledFocused focusedId={7} data={dataWithoutIds} />);

    const focusNode = document.querySelector(".tree-node--focused");
    expect(focusNode?.innerHTML).toContain("Drinks");

    if (focusNode) {
      fireEvent.keyDown(focusNode, { key: "ArrowDown" });
    }

    expect(document.querySelector(".tree-node--focused")?.innerHTML).toContain(
      "Vegetables"
    );
  });

  test("Should set focus with focusedId and expand parent node", () => {
    render(<ControlledFocused focusedId={12} data={dataWithoutIds} />);

    const focusNode = document.querySelector(".tree-node--focused");
    expect(focusNode?.innerHTML).toContain("Black Tea");

    if (focusNode) {
      fireEvent.keyDown(focusNode, { key: "ArrowUp" });
    }

    expect(document.querySelector(".tree-node--focused")?.innerHTML).toContain(
      "Tea"
    );
  });
  test("Should not have focus when focusedId is not set", () => {
    const { getAllByRole } = render(
      <ControlledFocused data={dataWithoutIds} />
    );

    expect(document.querySelector(".tree-node--focused")).toBeNull();
    getAllByRole("treeitem")[0].focus();

    if (document.activeElement) {
      fireEvent.keyDown(document.activeElement, { key: "ArrowDown" });
    }
    expect(document.querySelector(".tree-node--focused")?.innerHTML).toContain(
      "Drinks"
    );
  });
  test("Should focus when focusedId is disabled", () => {
    render(
      <ControlledFocused
        focusedId={7}
        data={dataWithoutIds}
        defaultDisabledIds={[7]}
      />
    );
    const focusNode = document.querySelector(".tree-node--focused");
    expect(focusNode?.innerHTML).toContain("Drinks");

    if (focusNode) {
      fireEvent.keyDown(focusNode, { key: "ArrowDown" });
    }

    expect(document.querySelector(".tree-node--focused")?.innerHTML).toContain(
      "Vegetables"
    );
  });
});

describe("With node ids", () => {
  test("Should set focus with focusedId", () => {
    render(<ControlledFocused focusedId="690" data={dataWithIds} />);
    const focusNode = document.querySelector(".tree-node--focused");
    expect(focusNode?.innerHTML).toContain("Drinks");

    if (document.activeElement) {
      fireEvent.keyDown(document.activeElement, { key: "ArrowDown" });
    }

    expect(document.querySelector(".tree-node--focused")?.innerHTML).toContain(
      "Vegetables"
    );
  });

  test("Should set focus with focusedId and expand parent node", () => {
    render(<ControlledFocused focusedId={923} data={dataWithIds} />);

    const focusNode = document.querySelector(".tree-node--focused");
    expect(focusNode?.innerHTML).toContain("Black Tea");

    if (document.activeElement) {
      fireEvent.keyDown(document.activeElement, { key: "ArrowUp" });
    }

    expect(document.querySelector(".tree-node--focused")?.innerHTML).toContain(
      "Tea"
    );
  });
  test("Should not have focus when focusedId is not set", () => {
    const { getAllByRole } = render(<ControlledFocused data={dataWithIds} />);

    expect(document.querySelector(".tree-node--focused")).toBeNull();
    getAllByRole("treeitem")[0].focus();

    if (document.activeElement) {
      fireEvent.keyDown(document.activeElement, { key: "ArrowDown" });
    }
    expect(document.querySelector(".tree-node--focused")?.innerHTML).toContain(
      "Drinks"
    );
  });
  test("Should have focus when focusedId is disabled", () => {
    render(
      <ControlledFocused
        focusedId="690"
        data={dataWithIds}
        defaultDisabledIds={["690"]}
      />
    );
    const focusNode = document.querySelector(".tree-node--focused");
    expect(focusNode?.innerHTML).toContain("Drinks");

    if (document.activeElement) {
      fireEvent.keyDown(document.activeElement, { key: "ArrowDown" });
    }

    expect(document.querySelector(".tree-node--focused")?.innerHTML).toContain(
      "Vegetables"
    );
  });
});
