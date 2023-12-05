import "@testing-library/jest-dom/extend-expect";
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
          togglableSelect
          multiSelect
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
  expect(nodes[0]).toHaveAttribute("aria-selected", "false");
});

test("should not select on control keydown when click action is focus", () => {
  const { queryAllByRole } = render(<FocusClickActionTreeView />);

  const nodes = queryAllByRole("treeitem");
  nodes[0].focus();

  if (document.activeElement == null) {
    throw new Error(
      `Expected to find an active element on the document (after focusing the first element with role["treeitem"]), but did not.`
    );
  }

  fireEvent.keyDown(document.activeElement, { key: "a", ctrlKey: true });
  nodes.forEach((x) => expect(x).toHaveAttribute("aria-selected", "false"));

  fireEvent.keyDown(document.activeElement, {
    key: "Home",
    ctrlKey: true,
    shiftKey: true,
  });
  nodes.forEach((x) => expect(x).toHaveAttribute("aria-selected", "false"));

  fireEvent.keyDown(document.activeElement, {
    key: "End",
    ctrlKey: true,
    shiftKey: true,
  });
  nodes.forEach((x) => expect(x).toHaveAttribute("aria-selected", "false"));
});

test("should not select on shift + arrow up/down keydown when click action is focus", () => {
  const { queryAllByRole } = render(<FocusClickActionTreeView />);

  const nodes = queryAllByRole("treeitem");
  nodes[0].focus();

  if (document.activeElement == null) {
    throw new Error(
      `Expected to find an active element on the document (after focusing the first element with role["treeitem"]), but did not.`
    );
  }
  fireEvent.keyDown(document.activeElement, {
    key: "ArrowDown",
    shiftKey: true,
  });
  nodes.forEach((x) => expect(x).toHaveAttribute("aria-selected", "false"));
  nodes[4].focus();
  fireEvent.keyDown(document.activeElement, { key: "ArrowUp", shiftKey: true });
  nodes.forEach((x) => expect(x).toHaveAttribute("aria-selected", "false"));
});
