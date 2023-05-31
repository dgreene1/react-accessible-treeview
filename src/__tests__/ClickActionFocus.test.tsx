import { fireEvent, render } from "@testing-library/react";
import React from "react";
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

function FocusClickActionTreeView() {
  return (
    <div>
      <div>
        <TreeView
          data={data}
          aria-label="directory tree"
          clickAction="FOCUS"
          nodeRenderer={({ element, getNodeProps }) => (
            <div {...getNodeProps()}>{element.name}</div>
          )}
        />
      </div>
    </div>
  );
}

test("should not select on enter/space keydown when click action is focus", () => {
  const { queryAllByRole, container } = render(<FocusClickActionTreeView />);

  const nodes = queryAllByRole("treeitem");
  const node = container.querySelector(
    '[role="treeitem"][aria-level="1"][aria-posinset="1"]'
  );
  if (node == null) {
    throw new Error(
      `Expected to find an element with the following selector, but did not: [role="treeitem"][aria-level="1"][aria-posinset="1"]`
    );
  }
  fireEvent.keyDown(node, { key: " " });
  expect(nodes[0]).not.toHaveAttribute("aria-selected");
});
