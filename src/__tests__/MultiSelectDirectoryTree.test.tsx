import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render } from "@testing-library/react";
import React from "react";
import TreeView, { flattenTree } from "..";
import { ITreeViewProps } from "../TreeView";

const folder = {
  name: "",
  children: [
    {
      name: "src",
      children: [{ name: "index.js" }, { name: "styles.css" }],
    },
    {
      name: "node_modules",
      children: [
        {
          name: "react-accessible-treeview",
          children: [{ name: "index.js" }],
        },
        { name: "react", children: [{ name: "index.js" }] },
      ],
    },
    {
      name: ".npmignore",
    },
    {
      name: "package.json",
    },
    {
      name: "webpack.config.js",
    },
  ],
};

const data = flattenTree(folder);
function DirectoryTreeView(props: {
  defaultExpandedIds: ITreeViewProps["defaultExpandedIds"];
}) {
  return (
    <div>
      <div className="ide">
        <TreeView
          data={data}
          aria-label="directory tree"
          togglableSelect
          clickAction="EXCLUSIVE_SELECT"
          multiSelect
          onBlur={(event) => {
            const { treeState, dispatch } = event;
            dispatch({
              type: "DESELECT",
              id: Array.from(treeState.selectedIds)[0],
            });
          }}
          nodeRenderer={({ element, getNodeProps }) => (
            <div {...getNodeProps()}>{element.name}</div>
          )}
          {...props}
        />
      </div>
    </div>
  );
}

test("Ctrl+A selects all nodes", () => {
  const { queryAllByRole } = render(
    <DirectoryTreeView defaultExpandedIds={data.map((x) => x.id)} />
  );
  const nodes = queryAllByRole("treeitem");
  nodes[0].focus();
  if (document.activeElement == null) {
    throw new Error(
      `Expected to find an active element on the document (after focusing the first element with role["treeitem"]), but did not.`
    );
  }
  fireEvent.keyDown(document.activeElement, { key: "a", ctrlKey: true });
  nodes.forEach((x) => expect(x).toHaveAttribute("aria-selected", "true"));
});
