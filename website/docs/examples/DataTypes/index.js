import React from "react";
import { FaSquare, FaCheckSquare, FaMinusSquare } from "react-icons/fa";
import { IoMdArrowDropright } from "react-icons/io";
import TreeView, {
  flattenTree,
  flattenTreeMap,
} from "react-accessible-treeview";
import cx from "classnames";
import "./styles.css";

const folder = {
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
};

const dataTypeINode = flattenTree(folder);
const dataTypeMap = flattenTreeMap(folder);

function DataTypes() {
  return (
    <div>
      <div className="checkbox">
        <span>
          {
            "Map<(number|string), INode> data type was introduced to add an ability to use own non sequential unique node ids."
          }
        </span>
        <h4>{"Type of data prop is INode[]"}</h4>
        <TreeViewComponent data={dataTypeINode} />
        <h4>{"Type of data prop is Map<(number|string), INode>"}</h4>
        <TreeViewComponent data={dataTypeMap} />
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
              {element.name} - id: {element.id}
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
