import React from "react";
import MultiSelectCheckbox from "../../website/docs/examples/MultiSelectCheckbox";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";

test("Shift + Up / Down Arrow", () => {
  const { queryAllByRole } = render(<MultiSelectCheckbox />);

  let nodes = queryAllByRole("treeitem");
  nodes[0].focus();
  fireEvent.keyDown(nodes[0], { key: "ArrowDown", shiftKey: true });

  expect(document.activeElement).toEqual(nodes[1]);
  expect(nodes[1]).toHaveAttribute("aria-selected", "true");

  fireEvent.keyDown(nodes[0], { key: "ArrowUp", shiftKey: true });
  expect(document.activeElement).toEqual(nodes[0]);
  expect(nodes[0]).toHaveAttribute("aria-selected", "true");
});
