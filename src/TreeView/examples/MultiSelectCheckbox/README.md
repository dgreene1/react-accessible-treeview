```js
import React, { useState } from "react";
import { DiCss3, DiJavascript, DiNpm } from "react-icons/di";
import { GoTriangleDown, GoTriangleRight } from "react-icons/go";
import { FaSquare, FaCheckSquare, FaMinusSquare } from "react-icons/fa";

import "./checkbox-tree.css";
import TreeView, { flattenTree } from "../../..";

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
        { name: "Pears" }
      ]
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
            { name: "Matcha" }
          ]
        }
      ]
    },
    {
      name: "Vegetables",
      children: [
        { name: "Beets" },
        { name: "Carrots" },
        { name: "Celery" },
        { name: "Lettuce" },
        { name: "Onions" }
      ]
    }
  ]
};

const data = flattenTree(folder);

function Example() {
  return (
    <div>
      <div className="checkbox">
        <TreeView
          data={data}
          aria-label="Checkbox tree"
          multiSelect
          propagateSelect
          propagateSelectUpwards
          togglableSelect
          nodeRenderer={({
            element,
            isBranch,
            isExpanded,
            isSelected,
            isHalfSelected,
            getNodeProps,
            level,
            handleSelect
          }) => {
            return (
              <div
                {...getNodeProps({ onClick: handleExpand })}
                style={{ marginLeft: 40 * (level - 1) }}
              >
                {isBranch && <TriangleIcon isOpen={isExpanded} />}
                <CheckBoxIcon
                  className="icon"
                  onClick={e => {
                    handleSelect(e);
                    e.stopPropagation();
                  }}
                  variant={
                    isHalfSelected ? "some" : isSelected ? "all" : "none"
                  }
                />
                {element.name}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}

const TriangleIcon = ({ isOpen }) =>
  isOpen ? (
    <GoTriangleDown className="icon" />
  ) : (
    <GoTriangleRight className="icon" />
  );

const CheckBoxIcon = ({ variant, ...rest }) => {
  switch (variant) {
    case "all":
      return <FaCheckSquare {...rest} />;
    case "none":
      return <FaSquare {...rest} />;
    case "some":
      return <FaMinusSquare {...rest} />;
    default:
      return null;
  }
};

<Example />;
```
