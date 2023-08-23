import "@testing-library/jest-dom/extend-expect";
import React from "react";
import TreeView, { ITreeViewOnSelectProps } from "../TreeView";
import { fireEvent, render } from "@testing-library/react";
import { flattenTree } from "../TreeView/utils";
import { INode, NodeId } from "../TreeView/types";

const folder = {
  name: "",
  children: [
    {
      name: "Drinks",
      children: [
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
  ],
};

const initialData = flattenTree(folder);

interface TreeViewOnSelectProps {
  data?: INode[];
  selectedIds?: NodeId[];
  propagateSelect?: boolean;
  defaultSelectedIds?: NodeId[];
  onSelect: (props: ITreeViewOnSelectProps) => void;
}

function TreeViewOnSelect(props: TreeViewOnSelectProps) {
  const {
    data = initialData,
    selectedIds,
    propagateSelect = true,
    defaultSelectedIds,
    onSelect,
  } = props;
  return (
    <div>
      <TreeView
        data={data}
        aria-label="onSelect"
        selectedIds={selectedIds}
        defaultSelectedIds={defaultSelectedIds}
        onSelect={onSelect}
        multiSelect
        defaultExpandedIds={[1, 2]}
        propagateSelect={propagateSelect}
        propagateSelectUpwards
        togglableSelect
        nodeAction="check"
        nodeRenderer={({
          element,
          isHalfSelected,
          getNodeProps,
          handleSelect,
          handleExpand,
        }) => {
          return (
            <div {...getNodeProps({ onClick: handleExpand })}>
              <div
                className={`checkbox-icon ${
                  isHalfSelected ? "half-checked" : ""
                }`}
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

let mockedOnSelect: (props: ITreeViewOnSelectProps) => void;

describe("onSelect", () => {
  beforeEach(() => {
    mockedOnSelect = jest.fn();
  });

  test("should not show half-selected for deselected branch node", () => {
    const { queryAllByRole } = render(
      <TreeViewOnSelect onSelect={mockedOnSelect} />
    );
    const nodes = queryAllByRole("treeitem");

    const expectedSelected = {
      element: { children: [3,4,5,6], id: 2, name: "Tea", parent: 1 },
      isSelected: true,
      isHalfSelected: false,
    };
    const expectedDeselected = {
      element: { children: [3,4,5,6], id: 2, name: "Tea", parent: 1 },
      isSelected: false,
      isHalfSelected: false,
    };

    if (document.activeElement == null)
      throw new Error(
        `Expected to find an active element on the document (after focusing the second element with role["treeitem"]), but did not.`
      );

    fireEvent.click(nodes[1].getElementsByClassName("checkbox-icon")[0]);

    expect(mockedOnSelect).toHaveBeenCalledWith(expect.objectContaining(expectedSelected));
    expect(nodes[1]).toHaveAttribute("aria-checked", "true");

    fireEvent.click(nodes[1].getElementsByClassName("checkbox-icon")[0]);

    expect(mockedOnSelect).toHaveBeenCalledWith(expect.objectContaining(expectedDeselected));
    expect(nodes[1]).toHaveAttribute("aria-checked", "false");
  });
});
