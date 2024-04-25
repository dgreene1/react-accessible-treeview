import React, { useState } from "react";
import { IoMdArrowDropright } from "react-icons/io";
import TreeView, { flattenTree } from "react-accessible-treeview";
import cx from "classnames";

const folder = {
  name: "",
  id: "treeview",
  children: [
    {
      id: "fruits",
      name: "Fruits",
      children: [
        { name: "Avocados", id: "avocados" },
        { name: "Bananas", id: "bananas" },
        { name: "Berries", id: "berries" },
        { name: "Oranges", id: "oranges" },
        { name: "Pears", id: "pears" },
      ],
    },
    {
      id: "drinks",
      name: "Drinks",
      children: [
        { name: "Apple Juice", id: "appleJuice" },
        { name: "Chocolate", id: "chocolate" },
        { name: "Coffee", id: "coffee" },
        {
          id: "tea",
          name: "Tea",
          children: [
            { name: "Black Tea", id: "blackTea" },
            { name: "Green Tea", id: "greenTea" },
            { name: "Red Tea", id: "redTea" },
            { name: "Matcha", id: "matcha" },
          ],
        },
      ],
    },
    {
      id: "vegetables",
      name: "Vegetables",
      children: [
        { name: "Beets", id: "beets" },
        { name: "Carrots", id: "carrots" },
        { name: "Celery", id: "celery" },
        { name: "Lettuce", id: "lettuce" },
        { name: "Onions", id: "onions" },
      ],
    },
  ],
};

const data = flattenTree(folder);

function ControlledFocusedNode() {
  const [focusId, setFocusId] = useState();

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      getFocusId();
    }
  };

  const getFocusId = () => {
    const id = document.querySelector("#txtIdToFocus").value.trim();
    setFocusId(id);
  };

  return (
    <div>
      <div>
        <label htmlFor="txtIdToFocus">Node ID to focus:</label>
        <input id="txtIdToFocus" type="text" onKeyDown={onKeyDown} />
        <button onClick={() => getFocusId()}>Set</button>
      </div>
      <div className="checkbox">
        <TreeView
          data={data}
          aria-label="Controlled expanded node tree"
          defaultExpandedIds={[1]}
          focusedId={focusId}
          defaultDisabledIds={[3]}
          nodeRenderer={({
            element,
            isBranch,
            isExpanded,
            isDisabled,
            getNodeProps,
            level,
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
                <span className="name">
                  {element.name} [{element.id}]
                </span>
              </div>
            );
          }}
        />
      </div>
    </div>
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

export default ControlledFocusedNode;
