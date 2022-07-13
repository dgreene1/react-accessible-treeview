import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import TreeView, { flattenTree } from "..";

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
function DirectoryTreeView(props) {
  return (
    <div>
      <div className="ide">
        <TreeView
          data={data}
          aria-label="directory tree"
          togglableSelect
          clickAction="EXCLUSIVE_SELECT"
          multiSelect
          onBlur={({ treeState, dispatch }) => {
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
  let nodes = queryAllByRole("treeitem");
  nodes[0].focus();
  fireEvent.keyDown(document.activeElement, { key: "a", ctrlKey: true });
  nodes.forEach((x) => expect(x).toHaveAttribute("aria-selected", "true"));
});
