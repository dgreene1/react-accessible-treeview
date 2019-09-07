import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import TreeView, { flattenTree } from "..";

const folder = {
  name: "",
  children: [
    {
      name: "src",
      children: [{ name: "index.js" }, { name: "styles.css" }]
    },
    {
      name: "node_modules",
      children: [
        {
          name: "react-accessible-treeview",
          children: [{ name: "index.js" }]
        },
        { name: "react", children: [{ name: "index.js" }] }
      ]
    },
    {
      name: ".npmignore"
    },
    {
      name: "package.json"
    },
    {
      name: "webpack.config.js"
    }
  ]
};

const data = flattenTree(folder);

function DirectoryTreeView() {
  return (
    <div>
      <div>
        <TreeView
          data={data}
          aria-label="directory tree"
          onBlur={({ treeState, dispatch }) => {
            dispatch({
              type: "DESELECT",
              id: Array.from(treeState.selectedIds)[0]
            });
          }}
          nodeRenderer={({ element, getNodeProps }) => (
            <div {...getNodeProps()}>{element.name}</div>
          )}
        />
      </div>
    </div>
  );
}

test("nodes have aria properties", () => {
  const { queryAllByRole } = render(<DirectoryTreeView />);

  let nodes = queryAllByRole("treeitem");
  expect(nodes[0]).toHaveAttribute("aria-level", "1");
  expect(nodes[0]).toHaveAttribute("aria-posinset", "1");
  expect(nodes[0]).toHaveAttribute("aria-setsize", "5");
  expect(nodes[0]).toHaveAttribute("aria-expanded", "false");
});

test("there is an element with role=tree", () => {
  const { queryByRole } = render(<DirectoryTreeView />);
  expect(queryByRole("tree")).toBeDefined();
});

//Mouse
test("clicking a branch node toggles aria-expanded", () => {
  const { queryAllByRole, container } = render(<DirectoryTreeView />);

  let nodes = queryAllByRole("treeitem");
  let node = container.querySelector(
    '[role="treeitem"][aria-level="1"][aria-posinset="1"]'
  );
  const inner = node.querySelector(".tree-node");
  expect(nodes[0]).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(inner);
  expect(nodes[0]).toHaveAttribute("aria-expanded", "true");
  fireEvent.click(inner);
  expect(nodes[0]).toHaveAttribute("aria-expanded", "false");
});

test("clicking a node makes aria-selected=true ", () => {
  const { queryAllByRole, container } = render(<DirectoryTreeView />);

  let nodes = queryAllByRole("treeitem");
  let node = container.querySelector(
    '[role="treeitem"][aria-level="1"][aria-posinset="1"]'
  );
  const inner = node.querySelector(".tree-node");
  expect(inner).toBeTruthy();
  fireEvent.click(inner);
  expect(nodes[0]).toHaveAttribute("aria-selected", "true");
  fireEvent.click(inner);
  expect(nodes[0]).toHaveAttribute("aria-selected", "true");
});

//Key bindings
test("Key bindings toggle aria-expanded", () => {
  const { queryAllByRole, container } = render(<DirectoryTreeView />);

  let nodes = queryAllByRole("treeitem");
  let node = container.querySelector(
    '[role="treeitem"][aria-level="1"][aria-posinset="1"]'
  );

  fireEvent.keyDown(node, { key: " " });
  expect(nodes[0]).toHaveAttribute("aria-expanded", "false");

  fireEvent.keyDown(node, { key: "Enter" });
  expect(nodes[0]).toHaveAttribute("aria-expanded", "false");

  fireEvent.keyDown(node, { key: "ArrowRight" });
  expect(nodes[0]).toHaveAttribute("aria-expanded", "true");

  fireEvent.keyDown(node, { key: "ArrowLeft" });
  expect(nodes[0]).toHaveAttribute("aria-expanded", "false");
});

test("Spacebar sets aria-selected=true ", () => {
  const { container, queryAllByRole } = render(<DirectoryTreeView />);

  let nodes = queryAllByRole("treeitem");
  let node = container.querySelector(
    '[role="treeitem"][aria-level="1"][aria-posinset="1"]'
  );
  fireEvent.keyDown(node, { key: " " });
  expect(nodes[0]).toHaveAttribute("aria-selected", "true");
});

test("Enter sets aria-selected=true ", () => {
  const { container, queryAllByRole } = render(<DirectoryTreeView />);

  let nodes = queryAllByRole("treeitem");
  let node = container.querySelector(
    '[role="treeitem"][aria-level="1"][aria-posinset="1"]'
  );
  fireEvent.keyDown(node, { key: "Enter" });
  expect(nodes[0]).toHaveAttribute("aria-selected", "true");
});

//WAI-ARIA pattern checklist

test("Right arrow", () => {
  const { queryAllByRole, container } = render(<DirectoryTreeView />);

  let nodes = queryAllByRole("treeitem");
  let node = container.querySelector(
    '[role="treeitem"][aria-level="1"][aria-posinset="1"]'
  );
  // When focus is on a closed node, opens the node; focus does not move.
  nodes[0].focus();
  expect(nodes[0]).toHaveAttribute("aria-expanded", "false");
  expect(document.activeElement).toEqual(nodes[0]);
  fireEvent.keyDown(node, { key: "ArrowRight" });
  expect(nodes[0]).toHaveAttribute("aria-expanded", "true");
  expect(document.activeElement).toEqual(nodes[0]);

  // When focus is on a open node, moves focus to the first child node.
  fireEvent.keyDown(node, { key: "ArrowRight" });
  let childNode = container.querySelector(
    '[role="treeitem"][aria-level="2"][aria-posinset="1"]'
  );
  expect(document.activeElement).toEqual(childNode);

  // When focus is on an end node, does nothing.
  fireEvent.keyDown(node, { key: "ArrowRight" });
  expect(document.activeElement).toEqual(childNode);
});

test("Left arrow", () => {
  const { queryAllByRole, container } = render(<DirectoryTreeView />);

  let nodes = queryAllByRole("treeitem");
  nodes[0].focus();
  //When focus is on an open node, closes the node.
  expect(nodes[0]).toHaveAttribute("aria-expanded", "false");
  fireEvent.keyDown(nodes[0], { key: "ArrowRight" });
  expect(nodes[0]).toHaveAttribute("aria-expanded", "true");
  fireEvent.keyDown(nodes[0], { key: "ArrowLeft" });
  expect(nodes[0]).toHaveAttribute("aria-expanded", "false");

  fireEvent.keyDown(nodes[0], { key: "ArrowRight" });
  fireEvent.keyDown(nodes[0], { key: "ArrowRight" });

  //When focus is on a child node that is also either an end node or a closed node, moves focus to its parent node.
  fireEvent.keyDown(nodes[0], { key: "ArrowRight" });
  let childNode = container.querySelector(
    '[role="treeitem"][aria-level="2"][aria-posinset="1"]'
  );
  childNode.focus();
  expect(document.activeElement).toEqual(childNode);
  fireEvent.keyDown(nodes[0], { key: "ArrowLeft" });
  expect(document.activeElement).toEqual(nodes[0]);

  //When focus is on a root node that is also either an end node or a closed node, does nothing.
  fireEvent.keyDown(nodes[0], { key: "ArrowLeft" });
  expect(document.activeElement).toEqual(nodes[0]);
});

test("Up/Down Arrow", () => {
  const { queryAllByRole, container } = render(<DirectoryTreeView />);
  //Up / Down Arrow: Moves focus to the previous / next node that is focusable without opening or closing a node.

  let nodes = queryAllByRole("treeitem");
  nodes[0].focus();
  fireEvent.keyDown(nodes[0], { key: "ArrowDown" });
  expect(document.activeElement).toEqual(nodes[1]);
  fireEvent.keyDown(nodes[0], { key: "ArrowUp" });
  expect(document.activeElement).toEqual(nodes[0]);

  fireEvent.keyDown(nodes[0], { key: "ArrowRight" });
  fireEvent.keyDown(nodes[0], { key: "ArrowDown" });
  let childNode = container.querySelector(
    '[role="treeitem"][aria-level="2"][aria-posinset="1"]'
  );
  expect(document.activeElement).toEqual(childNode);
  fireEvent.keyDown(nodes[0], { key: "ArrowUp" });
  expect(document.activeElement).toEqual(nodes[0]);
});

test("Home Key", () => {
  const { queryAllByRole } = render(<DirectoryTreeView />);

  let nodes = queryAllByRole("treeitem");
  nodes[nodes.length - 1].focus();
  fireEvent.keyDown(nodes[0], { key: "Home" });
  expect(document.activeElement).toEqual(nodes[0]);
});

test("End Key", () => {
  const { queryAllByRole } = render(<DirectoryTreeView />);
  let nodes = queryAllByRole("treeitem");
  nodes[0].focus();
  fireEvent.keyDown(nodes[0], { key: "End" });
  expect(document.activeElement).toEqual(nodes[nodes.length - 1]);
});

test("Asterisk", () => {
  const { queryAllByRole, container } = render(<DirectoryTreeView />);
  let nodes = queryAllByRole("treeitem");
  nodes[0].focus();
  let rootNodes = container.querySelectorAll(
    '.tree-branch-wrapper[role="treeitem"][aria-level="1"]'
  );
  expect(rootNodes.length).toBeTruthy();
  rootNodes.forEach(x => expect(x).toHaveAttribute("aria-expanded", "false"));
  fireEvent.keyDown(nodes[0], { key: "*" });
  rootNodes.forEach(x => expect(x).toHaveAttribute("aria-expanded", "true"));
});


test("Single character typeahead", () => {
  const { queryAllByRole, getByText } = render(<DirectoryTreeView />);
  let nodes = queryAllByRole("treeitem");
  nodes[0].focus();
  fireEvent.keyDown(nodes[0], { key: "p" });
  expect(document.activeElement).toEqual(getByText("package.json"));
  fireEvent.keyDown(nodes[0], { key: "p" });
  expect(document.activeElement).toEqual(getByText("package.json"));

  //branch node
  fireEvent.keyDown(nodes[0], { key: "s" });
  expect(document.activeElement).toEqual(getByText("src").parentElement);
});
