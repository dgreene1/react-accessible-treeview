import { flattenTreeMap } from "..";

describe("FlattenTree helper", () => {
  test("should add sequential number ids when id is not provided", () => {
    const initialTreeNode = {
      name: "",
      children: [
        {
          name: "Fruits",
          children: [{ name: "Avocados" }, { name: "Bananas" }],
        },
        {
          name: "Drinks",
          children: [
            { name: "Apple Juice" },
            { name: "Coffee" },
            {
              name: "Tea",
              children: [
                { name: "Black Tea" },
                { name: "Green Tea" },
                {
                  name: "Matcha",
                  children: [{ name: "Matcha 1" }],
                },
              ],
            },
          ],
        },
        {
          name: "Vegetables",
        },
      ],
    };

    const expectedTreeList = [
      { id: 0, name: "", parent: null, children: [1, 4, 12] },
      { id: 1, name: "Fruits", children: [2, 3], parent: 0 },
      { id: 2, name: "Avocados", children: [], parent: 1 },
      { id: 3, name: "Bananas", children: [], parent: 1 },
      { id: 4, name: "Drinks", children: [5, 6, 7], parent: 0 },
      { id: 5, name: "Apple Juice", children: [], parent: 4 },
      { id: 6, name: "Coffee", children: [], parent: 4 },
      { id: 7, name: "Tea", children: [8, 9, 10], parent: 4 },
      { id: 8, name: "Black Tea", children: [], parent: 7 },
      { id: 9, name: "Green Tea", children: [], parent: 7 },
      { id: 10, name: "Matcha", children: [11], parent: 7 },
      { id: 11, name: "Matcha 1", children: [], parent: 10 },
      { id: 12, name: "Vegetables", children: [], parent: 0 },
    ];
    const expectedTree = new Map(
      expectedTreeList.map((node) => [node.id, node])
    );

    const expected = flattenTreeMap(initialTreeNode);
    expect(expected).toEqual(expectedTree);
  });
  test("should use number ids", () => {
    const initialTreeNode = {
      name: "",
      id: 12,
      children: [
        {
          name: "Fruits",
          id: 54,
          children: [
            { name: "Avocados", id: 98 },
            { name: "Bananas", id: 789 },
          ],
        },
        {
          id: 888,
          name: "Drinks",
          children: [
            { name: "Apple Juice", id: 990 },
            { name: "Coffee", id: 9 },
            {
              id: 43,
              name: "Tea",
              children: [
                { name: "Black Tea", id: 4 },
                { name: "Green Tea", id: 44 },
                {
                  id: 53,
                  name: "Matcha",
                  children: [{ name: "Matcha 1", id: 2 }],
                },
              ],
            },
          ],
        },
        {
          id: 24,
          name: "Vegetables",
        },
      ],
    };

    const expectedTreeList = [
      { id: 12, name: "", parent: null, children: [54, 888, 24] },
      { id: 54, name: "Fruits", children: [98, 789], parent: 12 },
      { id: 98, name: "Avocados", children: [], parent: 54 },
      { id: 789, name: "Bananas", children: [], parent: 54 },
      { id: 888, name: "Drinks", children: [990, 9, 43], parent: 12 },
      { id: 990, name: "Apple Juice", children: [], parent: 888 },
      { id: 9, name: "Coffee", children: [], parent: 888 },
      { id: 43, name: "Tea", children: [4, 44, 53], parent: 888 },
      { id: 4, name: "Black Tea", children: [], parent: 43 },
      { id: 44, name: "Green Tea", children: [], parent: 43 },
      { id: 53, name: "Matcha", children: [2], parent: 43 },
      { id: 2, name: "Matcha 1", children: [], parent: 53 },
      { id: 24, name: "Vegetables", children: [], parent: 12 },
    ];
    const expectedTree = new Map(
      expectedTreeList.map((node) => [node.id, node])
    );

    const expected = flattenTreeMap(initialTreeNode);
    expect(expected).toEqual(expectedTree);
  });
  test("should use string ids", () => {
    const initialTreeNode = {
      name: "",
      id: "12",
      children: [
        {
          name: "Fruits",
          id: "54",
          children: [
            { name: "Avocados", id: "98" },
            { name: "Bananas", id: "789" },
          ],
        },
        {
          id: "888",
          name: "Drinks",
          children: [
            { name: "Apple Juice", id: "990" },
            { name: "Coffee", id: "9" },
            {
              id: "43",
              name: "Tea",
              children: [
                { name: "Black Tea", id: "4" },
                { name: "Green Tea", id: "44" },
                {
                  id: "53",
                  name: "Matcha",
                  children: [{ name: "Matcha 1", id: "2" }],
                },
              ],
            },
          ],
        },
        {
          id: "24",
          name: "Vegetables",
        },
      ],
    };

    const expectedTreeList = [
      { id: "12", name: "", parent: null, children: ["54", "888", "24"] },
      { id: "54", name: "Fruits", children: ["98", "789"], parent: "12" },
      { id: "98", name: "Avocados", children: [], parent: "54" },
      { id: "789", name: "Bananas", children: [], parent: "54" },
      { id: "888", name: "Drinks", children: ["990", "9", "43"], parent: "12" },
      { id: "990", name: "Apple Juice", children: [], parent: "888" },
      { id: "9", name: "Coffee", children: [], parent: "888" },
      { id: "43", name: "Tea", children: ["4", "44", "53"], parent: "888" },
      { id: "4", name: "Black Tea", children: [], parent: "43" },
      { id: "44", name: "Green Tea", children: [], parent: "43" },
      { id: "53", name: "Matcha", children: ["2"], parent: "43" },
      { id: "2", name: "Matcha 1", children: [], parent: "53" },
      { id: "24", name: "Vegetables", children: [], parent: "12" },
    ];
    const expectedTree = new Map(
      expectedTreeList.map((node) => [node.id, node])
    );

    const expected = flattenTreeMap(initialTreeNode);
    expect(expected).toEqual(expectedTree);
  });
  test("should error if ids are not unique", () => {
    const initialTreeNode = {
      name: "",
      id: 12,
      children: [
        {
          name: "Fruits",
          id: 54,
          children: [
            { name: "Avocados", id: 98 },
            { name: "Bananas", id: 789 },
          ],
        },
        {
          id: 54,
          name: "Vegetables",
        },
      ],
    };

    const expected = () => flattenTreeMap(initialTreeNode);
    expect(expected).toThrow("TreeView node must has unique ids");
  });
});
