import "@testing-library/jest-dom/extend-expect";
import React from "react";
import TreeView, {ITreeViewOnNodeSelectProps, ITreeViewProps} from "../TreeView";
import {render} from "@testing-library/react";
import {flattenTree} from "../TreeView/utils";
import {INodeRendererProps} from "../TreeView/types";
import userEvent from "@testing-library/user-event";

const folder = {
  name: "",
  children: [
    {
      name: "Fruits",
      children: [
        {name: "Avocados"},
        {name: "Bananas"},
        {name: "Berries"},
        {name: "Oranges"},
        {name: "Pears"},
      ],
    },
    {
      name: "Drinks",
      children: [
        {name: "Apple Juice"},
        {name: "Chocolate"},
        {name: "Coffee"},
        {
          name: "Tea",
          children: [
            {name: "Black Tea"},
            {name: "Green Tea"},
            {name: "Red Tea"},
            {name: "Matcha"},
          ],
        },
      ],
    },
    {
      name: "Vegetables",
      children: [
        {name: "Beets"},
        {name: "Carrots"},
        {name: "Celery"},
        {name: "Lettuce"},
        {name: "Onions"},
      ],
    },
  ],
};

function TreeViewOnNodeSelect({data, nodeRenderer, selectedIds, onNodeSelect}: ITreeViewProps) {
  return (
    <div>
      <TreeView
        data={data}
        aria-label="onNodeSelect"
        selectedIds={selectedIds}
        onNodeSelect={onNodeSelect}
        multiSelect
        defaultExpandedIds={[1, 7, 11, 16]}
        propagateSelect
        propagateSelectUpwards
        togglableSelect
        nodeAction="check"
        nodeRenderer={nodeRenderer}
      />
    </div>
  );
}

describe("onNodeSelect", () => {
  const data = flattenTree(folder);
  const nodeRenderer = ({
    element,
    getNodeProps,
    handleSelect,
    handleExpand,
  }: INodeRendererProps) => {
    return (
      <div {...getNodeProps({onClick: handleExpand})}>
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
  };
  let onNodeSelect: ((props: ITreeViewOnNodeSelectProps) => void);
  beforeEach(() => {
    onNodeSelect = jest.fn();
  });
  test("should be called when node manually selcted/deselected", async () => {
    const {queryAllByRole} = render(<TreeViewOnNodeSelect data={data} nodeRenderer={nodeRenderer}
                                                          onNodeSelect={onNodeSelect}/>);
    const nodes = queryAllByRole("treeitem");

    const expectedSelected = {
      element: {children: [], id: 5, name: "Oranges", parent: 1},
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
      element: {children: [], id: 5, name: "Oranges", parent: 1},
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

    await userEvent.click(nodes[4].getElementsByClassName("checkbox-icon")[0]);

    expect(onNodeSelect).toBeCalledWith(expectedSelected);
    expect(nodes[4]).toHaveAttribute("aria-checked", "true");

    await userEvent.click(nodes[4].getElementsByClassName("checkbox-icon")[0]);

    expect(onNodeSelect).toBeCalledWith(expectedDeselected);
    expect(nodes[4]).toHaveAttribute("aria-checked", "false");
  });

  test("should be called only for interacted node", async () => {
    const {queryAllByRole} = render(<TreeViewOnNodeSelect data={data} nodeRenderer={nodeRenderer}
                                                          onNodeSelect={onNodeSelect}/>);
    const nodes = queryAllByRole("treeitem");

    const expected= {
      element: {id: 1, name: "Fruits", children: [2, 3, 4, 5, 6], parent: 0},
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

    await userEvent.click(nodes[0].getElementsByClassName("checkbox-icon")[0]);

    expect(onNodeSelect).toBeCalledWith(expected);
    expect(nodes[0]).toHaveAttribute("aria-checked", "true");
    expect(nodes[1]).toHaveAttribute("aria-checked", "true");
    expect(nodes[2]).toHaveAttribute("aria-checked", "true");
    expect(nodes[3]).toHaveAttribute("aria-checked", "true");
    expect(nodes[4]).toHaveAttribute("aria-checked", "true");
    expect(nodes[5]).toHaveAttribute("aria-checked", "true");
  });

  test("should not be called when controlled selection", () => {
    render(<TreeViewOnNodeSelect data={data} nodeRenderer={nodeRenderer} selectedIds={[19]} onNodeSelect={onNodeSelect} />);

    expect(onNodeSelect).not.toBeCalled();
  });

  describe("should be called when node selected/deselected via keyboard", () => {
    test("Enter", async () => {
      const expected= {
        element: {children: [], id: 2, name: "Avocados", parent: 1},
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

      const {queryAllByRole} = render(<TreeViewOnNodeSelect data={data} nodeRenderer={nodeRenderer}
                                                            onNodeSelect={onNodeSelect}/>);
      const nodes = queryAllByRole("treeitem");

      await userEvent.tab(); //Fruits
      await userEvent.keyboard("[ArrowDown]"); //Avocados
      await userEvent.keyboard("[Enter]");

      expect(onNodeSelect).toBeCalledWith(expected);
      expect(nodes[1]).toHaveAttribute("aria-checked", "true");
    });
    test("Space", async () => {
      const expected= {
        element: {children: [], id: 2, name: "Avocados", parent: 1},
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

      const {queryAllByRole} = render(<TreeViewOnNodeSelect data={data} nodeRenderer={nodeRenderer}
                                                            onNodeSelect={onNodeSelect}/>);
      const nodes = queryAllByRole("treeitem");

      await userEvent.tab(); //Fruits
      await userEvent.keyboard("[ArrowDown]"); //Avocados
      await userEvent.keyboard(" ");

      expect(onNodeSelect).toBeCalledWith(expected);
      expect(nodes[1]).toHaveAttribute("aria-checked", "true");
    });
    test("Shift+ArrowUp", async () => {
      const expected= {
        element: {id: 1, name: "Fruits", children: [2, 3, 4, 5, 6], parent: 0},
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

      const {queryAllByRole} = render(<TreeViewOnNodeSelect data={data} nodeRenderer={nodeRenderer}
                                                            onNodeSelect={onNodeSelect}/>);
      const nodes = queryAllByRole("treeitem");

      await userEvent.tab(); //Fruits
      await userEvent.keyboard("[ArrowDown]"); //Avocados
      await userEvent.keyboard("{Shift>}[ArrowUp]{/Shift}");

      expect(onNodeSelect).toBeCalledWith(expected);
      expect(nodes[0]).toHaveAttribute("aria-checked", "true");
    });
    test("Shift+ArrowDown", async () => {
      const expected = {
        element: {children: [], id: 2, name: "Avocados", parent: 1},
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

      const {queryAllByRole} = render(<TreeViewOnNodeSelect data={data} nodeRenderer={nodeRenderer}
                                                            onNodeSelect={onNodeSelect}/>);
      const nodes = queryAllByRole("treeitem");

      await userEvent.tab(); //Fruits
      await userEvent.keyboard("{Shift>}[ArrowDown]{/Shift}"); //Avocados

      expect(onNodeSelect).toBeCalledWith(expected);
      expect(nodes[1]).toHaveAttribute("aria-checked", "true");
    });
  });
});
