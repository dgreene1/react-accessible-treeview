import React from "react";
import { FaSquare, FaCheckSquare, FaMinusSquare } from "react-icons/fa";
import { IoMdArrowDropright } from "react-icons/io";
import TreeView, { flattenTree } from "react-accessible-treeview";
import cx from "classnames";
import "./styles.css";

const dataWithPredefinedIds = flattenTree({
  name: "",
  id: 890,
  children: [
    {
      id: "data-string",
      name: "Fruits",
      children: [
        { name: "Avocados", id: 690 },
        { name: "Bananas", id: 1001 },
        { name: "Berries", id: 793 },
        { name: "Oranges", id: 18 },
        { name: "Pears", id: 9990 },
      ],
    },
    {
      id: "one",
      name: "Drinks",
      children: [
        { name: "Apple Juice", id: 7 },
        { name: "Chocolate", id: 12 },
        { name: "Coffee", id: 1 },
        {
          id: 908,
          name: "Tea",
          children: [
            { name: "Black Tea", id: 923 },
            { name: "Green Tea", id: 43 },
            { name: "Red Tea", id: 23 },
            { name: "Matcha", id: 4 },
          ],
        },
      ],
    },
    {
      id: 42,
      name: "Vegetables",
      children: [
        { name: "Beets", id: 672 },
        { name: "Carrots", id: 13 },
        { name: "Celery", id: 123 },
        { name: "Lettuce", id: 893 },
        { name: "Onions", id: 82 },
      ],
    },
  ],
});

const dataWithGeneratedIds = flattenTree({
  name: "",
  children: [
    {
      name: "Fruits",
      children: [
        { name: "Avocados" },
        { name: "Bananas" },
        { name: "Berries" },
        { name: "Oranges" },
        { name: "Pears" },
      ],
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
            { name: "Matcha" },
          ],
        },
      ],
    },
    {
      name: "Vegetables",
      children: [
        { name: "Beets" },
        { name: "Carrots" },
        { name: "Celery" },
        { name: "Lettuce" },
        { name: "Onions" },
      ],
    },
  ],
});

function DataTypes() {
  return (
    <div>
      <div className="checkbox">
        <span>
          You can define IDs for your tree nodes yourself (they have to be of
          type <code>number</code> or <code>string</code>). Alternatively, if
          IDs are not defined, <code>flattenTree()</code> will create
          sequential, unique node IDs. If you are loading TreeView data
          asynchronously, it is recommended to define IDs yourself.
        </span>
        <h4>IDs defined by consumer (you)</h4>
        <TreeViewComponent data={dataWithPredefinedIds} />
        <h4>
          IDs set by <code>flattenTree()</code>
        </h4>
        <TreeViewComponent data={dataWithGeneratedIds} />
      </div>
    </div>
  );
}

function TreeViewComponent({ data }) {
  return (
    <TreeView
      data={data}
      aria-label="Data type Map tree"
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
        handleSelect,
        handleExpand,
      }) => {
        return (
          <div
            {...getNodeProps({ onClick: handleExpand })}
            style={{ marginLeft: 40 * (level - 1) }}
          >
            {isBranch && <ArrowIcon isOpen={isExpanded} />}
            <CheckBoxIcon
              className="checkbox-icon"
              onClick={(e) => {
                handleSelect(e);
                e.stopPropagation();
              }}
              variant={isHalfSelected ? "some" : isSelected ? "all" : "none"}
            />
            <span className="name">
              {element.name}-{element.id}
            </span>
          </div>
        );
      }}
    />
  );
}

const ArrowIcon = ({ isOpen, className }) => {
  const baseClass = "arrow";
  const classes = cx(
    baseClass,
    { [`${baseClass}--closed`]: !isOpen },
    { [`${baseClass}--open`]: isOpen },
    className
  );
  return <IoMdArrowDropright className={classes} />;
};

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

export default DataTypes;
