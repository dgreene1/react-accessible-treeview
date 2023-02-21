import React, { useState } from "react";
import { FaSquare, FaCheckSquare, FaMinusSquare } from "react-icons/fa";
import { IoMdArrowDropright } from "react-icons/io";
import TreeView, { flattenTree } from "react-accessible-treeview";
import cx from "classnames";
import "./styles.css";

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
};

const data = flattenTree(folder);

function ControlledDisabledNode() {
  const [disabledIds, setDisabledIds] = useState();

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      getAndSetIds();
    }
  };

  const getAndSetIds = () => {
    setDisabledIds(
      document
        .querySelector("#txtIdsToExpand")
        .value.split(",")
        .map((x) => parseInt(x.trim()))
    );
  };

  return (
    <div>
      <div>
        <label htmlFor="txtIdsToExpand">
          Comma-delimited list of nodes IDs to disable:
        </label>
        <input id="txtIdsToExpand" type="text" onKeyDown={onKeyDown} />
        <button onClick={() => getAndSetIds()}>Set</button>
      </div>
      <div>
        <button onClick={() => setDisabledIds([])}>
          Clear all disabled nodes
        </button>
      </div>
      <div className="checkbox">
        <TreeView
          data={data}
          aria-label="Controlled node tree"
          disabledIds={disabledIds}
          defaultExpandedIds={[1, 7, 11, 16]}
          defaultDisabledIds={[17]}
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
            isDisabled,
            getNodeProps,
            level,
            handleSelect,
            handleExpand,
          }) => {
            return (
              <div
                {...getNodeProps({ onClick: handleExpand })}
                style={{
                  marginLeft: 40 * (level - 1),
                  opacity: isDisabled ? 0.5 : 1,
                }}
              >
                {isBranch && <ArrowIcon isOpen={isExpanded} />}
                <CheckBoxIcon
                  className="checkbox-icon"
                  onClick={(e) => {
                    handleSelect(e);
                    e.stopPropagation();
                  }}
                  variant={
                    isHalfSelected ? "some" : isSelected ? "all" : "none"
                  }
                />
                <span className="name">
                  {element.name}-{element.id}
                </span>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}

const ArrowIcon = ({ isOpen }) => {
  const baseClass = "arrow";
  const classes = cx(
    baseClass,
    { [`${baseClass}--closed`]: !isOpen },
    { [`${baseClass}--open`]: isOpen }
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
export default ControlledDisabledNode;
