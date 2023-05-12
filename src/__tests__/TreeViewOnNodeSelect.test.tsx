import "@testing-library/jest-dom/extend-expect";
import React from "react";
import TreeView from "../TreeView";
import { fireEvent, render } from "@testing-library/react";
import { flattenTree } from "../TreeView/utils";
import { NodeId } from "../TreeView/types";

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

interface TreeViewOnNodeSelectProps {
  selectedIds?: NodeId[];
}

function TreeViewOnNodeSelect(props: TreeViewOnNodeSelectProps) {
  const { selectedIds } = props;
  return (
    <div>
      <TreeView
        data={data}
        aria-label="onNodeSelect"
        selectedIds={selectedIds}
        onNodeSelect={(props) => console.log(props)}
        multiSelect
        defaultExpandedIds={[1, 7, 11, 16]}
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
              <span className="element">
                {element.name}-{element.id}
              </span>
            </div>
          );
        }}
      />
    </div>
  );
}

jest.spyOn(global.console, "log");

test("onNodeSelect should be called when node manually seelcted/deselected", () => {
  const { queryAllByRole } = render(<TreeViewOnNodeSelect />);
  const nodes = queryAllByRole("treeitem");

  const expectedSelected = {
    element: { children: [], id: 5, name: "Oranges", parent: 1 },
    isBranch: false,
    isSelected: true,
    treeState: {
      disabledIds: new Set(),
      controlledIds: new Set(),
      expandedIds: new Set([1, 7, 11, 16]),
      halfSelectedIds: new Set(),
      isFocused: true,
      lastAction: "SELECT_MANY",
      lastInteractedWith: 5,
      lastManuallyToggled: 5,
      lastUserSelect: 5,
      selectedIds: new Set([5]),
      tabbableId: 5,
    },
  };
  const expectedDeselected = {
    element: { children: [], id: 5, name: "Oranges", parent: 1 },
    isBranch: false,
    isSelected: false,
    treeState: {
      disabledIds: new Set(),
      controlledIds: new Set(),
      expandedIds: new Set([1, 7, 11, 16]),
      halfSelectedIds: new Set([1]),
      isFocused: true,
      lastAction: "SELECT_MANY",
      lastInteractedWith: 5,
      lastManuallyToggled: 5,
      lastUserSelect: 5,
      selectedIds: new Set(),
      tabbableId: 5,
    },
  };

  if (document.activeElement == null)
    throw new Error(
      `Expected to find an active element on the document (after focusing the second element with role["treeitem"]), but did not.`
    );

  fireEvent.click(nodes[4].getElementsByClassName("checkbox-icon")[0]);

  expect(console.log).toBeCalledWith(expectedSelected);
  expect(nodes[4]).toHaveAttribute("aria-checked", "true");

  fireEvent.click(nodes[4].getElementsByClassName("checkbox-icon")[0]);

  expect(console.log).toBeCalledWith(expectedDeselected);
  expect(nodes[4]).toHaveAttribute("aria-checked", "false");
});

test("onNodeSelect should be called only for interacted node", () => {
  const { queryAllByRole } = render(<TreeViewOnNodeSelect />);
  const nodes = queryAllByRole("treeitem");

  const expected = {
    element: { id: 1, name: "Fruits", children: [2, 3, 4, 5, 6], parent: 0 },
    isSelected: true,
    isBranch: true,
    treeState: {
      disabledIds: new Set(),
      controlledIds: new Set(),
      expandedIds: new Set([1, 7, 11, 16]),
      halfSelectedIds: new Set(),
      isFocused: true,
      lastAction: "SELECT_MANY",
      lastInteractedWith: 1,
      lastManuallyToggled: 1,
      lastUserSelect: 1,
      selectedIds: new Set([1, 2, 3, 4, 5, 6]),
      tabbableId: 1,
    },
  };

  if (document.activeElement == null)
    throw new Error(
      `Expected to find an active element on the document (after focusing the second element with role["treeitem"]), but did not.`
    );

  fireEvent.click(nodes[0].getElementsByClassName("checkbox-icon")[0]);

  expect(console.log).toBeCalledWith(expected);
  expect(nodes[0]).toHaveAttribute("aria-checked", "true");
  expect(nodes[1]).toHaveAttribute("aria-checked", "true");
  expect(nodes[2]).toHaveAttribute("aria-checked", "true");
  expect(nodes[3]).toHaveAttribute("aria-checked", "true");
  expect(nodes[4]).toHaveAttribute("aria-checked", "true");
  expect(nodes[5]).toHaveAttribute("aria-checked", "true");
});

test("onNodeSelect should not be called when controlled selection", () => {
  render(<TreeViewOnNodeSelect selectedIds={[19]} />);
  expect(console.log).not.toBeCalled();
});

describe("onNodeSelect should be called when node selected/deselected via keyboard", () => {
  test("Enter", () => {
    const expected = {
      element: { children: [], id: 2, name: "Avocados", parent: 1 },
      isBranch: false,
      isSelected: true,
      treeState: {
        disabledIds: new Set(),
        controlledIds: new Set(),
        expandedIds: new Set([1, 7, 11, 16]),
        halfSelectedIds: new Set(),
        isFocused: true,
        lastAction: "SELECT_MANY",
        lastInteractedWith: 2,
        lastManuallyToggled: 2,
        lastUserSelect: 2,
        selectedIds: new Set([2]),
        tabbableId: 2,
      },
    };

    const { queryAllByRole } = render(<TreeViewOnNodeSelect />);
    const nodes = queryAllByRole("treeitem");

    if (document.activeElement == null)
      throw new Error(
        `Expected to find an active element on the document (after focusing the second element with role["treeitem"]), but did not.`
      );
    nodes[0].focus(); //Fruits
    fireEvent.keyDown(nodes[0], { key: "ArrowDown" }); //Avocados
    fireEvent.keyDown(document.activeElement, { key: "Enter" });

    expect(console.log).toBeCalledWith(expected);
    expect(nodes[1]).toHaveAttribute("aria-checked", "true");
  });
  test("Space", () => {
    const expected = {
      element: { children: [], id: 2, name: "Avocados", parent: 1 },
      isBranch: false,
      isSelected: true,
      treeState: {
        disabledIds: new Set(),
        controlledIds: new Set(),
        expandedIds: new Set([1, 7, 11, 16]),
        halfSelectedIds: new Set(),
        isFocused: true,
        lastAction: "SELECT_MANY",
        lastInteractedWith: 2,
        lastManuallyToggled: 2,
        lastUserSelect: 2,
        selectedIds: new Set([2]),
        tabbableId: 2,
      },
    };

    const { queryAllByRole } = render(<TreeViewOnNodeSelect />);
    const nodes = queryAllByRole("treeitem");

    if (document.activeElement == null)
      throw new Error(
        `Expected to find an active element on the document (after focusing the second element with role["treeitem"]), but did not.`
      );
    nodes[0].focus(); //Fruits
    fireEvent.keyDown(nodes[0], { key: "ArrowDown" }); //Avocados
    fireEvent.keyDown(document.activeElement, { key: " " });

    expect(console.log).toBeCalledWith(expected);
    expect(nodes[1]).toHaveAttribute("aria-checked", "true");
  });
  test("Shift+ArrowUp", () => {
    const expected = {
      element: { id: 1, name: "Fruits", children: [2, 3, 4, 5, 6], parent: 0 },
      isSelected: true,
      isBranch: true,
      treeState: {
        disabledIds: new Set(),
        controlledIds: new Set(),
        expandedIds: new Set([1, 7, 11, 16]),
        halfSelectedIds: new Set(),
        isFocused: true,
        lastAction: "FOCUS",
        lastInteractedWith: 1,
        lastManuallyToggled: 1,
        lastUserSelect: 1,
        selectedIds: new Set([1, 2, 3, 4, 5, 6]),
        tabbableId: 1,
      },
    };

    const { queryAllByRole } = render(<TreeViewOnNodeSelect />);
    const nodes = queryAllByRole("treeitem");

    if (document.activeElement == null)
      throw new Error(
        `Expected to find an active element on the document (after focusing the second element with role["treeitem"]), but did not.`
      );
    nodes[0].focus(); //Fruits
    fireEvent.keyDown(nodes[0], { key: "ArrowDown" }); //Avocados
    fireEvent.keyDown(document.activeElement, {
      key: "ArrowUp",
      shiftKey: true,
    });

    expect(console.log).toBeCalledWith(expected);
    expect(nodes[0]).toHaveAttribute("aria-checked", "true");
  });
  test("Shift+ArrowDown", () => {
    const expected = {
      element: { children: [], id: 2, name: "Avocados", parent: 1 },
      isBranch: false,
      isSelected: true,
      treeState: {
        disabledIds: new Set(),
        controlledIds: new Set(),
        expandedIds: new Set([1, 7, 11, 16]),
        halfSelectedIds: new Set(),
        isFocused: true,
        lastAction: "FOCUS",
        lastInteractedWith: 2,
        lastManuallyToggled: 2,
        lastUserSelect: 1,
        selectedIds: new Set([2]),
        tabbableId: 2,
      },
    };

    const { queryAllByRole } = render(<TreeViewOnNodeSelect />);
    const nodes = queryAllByRole("treeitem");

    if (document.activeElement == null)
      throw new Error(
        `Expected to find an active element on the document (after focusing the second element with role["treeitem"]), but did not.`
      );
    nodes[0].focus(); //Fruits
    fireEvent.keyDown(nodes[0], { key: "ArrowDown", shiftKey: true }); //Avocados

    expect(console.log).toBeCalledWith(expected);
    expect(nodes[1]).toHaveAttribute("aria-checked", "true");
  });
});
