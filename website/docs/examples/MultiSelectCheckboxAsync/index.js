import React, { useEffect, useRef, useState } from "react";
import { FaSquare, FaCheckSquare, FaMinusSquare } from "react-icons/fa";
import { IoMdArrowDropright } from "react-icons/io";
import { AiOutlineLoading } from "react-icons/ai";
import TreeView from "react-accessible-treeview";
import cx from "classnames";
import "./styles.css";

const initialData = [
  {
    name: "",
    id: 0,
    children: [1, 2, 3],
    parent: null,
  },
  {
    name: "Fruits",
    children: [],
    id: 1,
    parent: 0,
    isBranch: true,
  },
  {
    name: "Drinks",
    children: [4, 5],
    id: 2,
    parent: 0,
    isBranch: true,
  },
  {
    name: "Vegetables",
    children: [],
    id: 3,
    parent: 0,
    isBranch: true,
  },
  {
    name: "Pine colada",
    children: [],
    id: 4,
    parent: 2,
  },
  {
    name: "Water",
    children: [],
    id: 5,
    parent: 2,
  },
];

const initialData1 = [
  {
    name: "",
    id: 0,
    children: [1, 2, 3],
    parent: null,
  },
  {
    name: "Fruits",
    children: [6, 7],
    id: 1,
    parent: 0,
    isBranch: true,
  },
  {
    name: "Drinks",
    children: [4, 5],
    id: 2,
    parent: 0,
    isBranch: true,
  },
  {
    name: "Vegetables",
    children: [],
    id: 3,
    parent: 0,
    isBranch: true,
  },
  {
    name: "Pine colada",
    children: [],
    id: 4,
    parent: 2,
  },
  {
    name: "Water",
    children: [],
    id: 5,
    parent: 2,
  },
  {
    name: `Node One`,
    children: [],
    id: 6,
    parent: 1,
    isBranch: true,
  },
  {
    name: "Node Two",
    children: [],
    id: 7,
    parent: 1,
    isBranch: true,
  },
];

const initialData2 = [
  {
    name: "",
    id: 0,
    children: [1, 2, 3],
    parent: null,
  },
  {
    name: "Fruits",
    children: [6, 7],
    id: 1,
    parent: 0,
    isBranch: true,
  },
  {
    name: "Drinks",
    children: [4, 5],
    id: 2,
    parent: 0,
    isBranch: true,
  },
  {
    name: "Vegetables",
    children: [],
    id: 3,
    parent: 0,
    isBranch: true,
  },
  {
    name: "Pine colada",
    children: [],
    id: 4,
    parent: 2,
  },
  {
    name: "Water",
    children: [],
    id: 5,
    parent: 2,
  },
  {
    name: `Node One`,
    children: [8, 9],
    id: 6,
    parent: 1,
    isBranch: true,
  },
  {
    name: "Node Two",
    children: [],
    id: 7,
    parent: 1,
    isBranch: true,
  },
  {
    name: `Node One Child1`,
    children: [],
    id: 8,
    parent: 6,
    isBranch: true,
  },
  { name: "Node One Child2", children: [], id: 9, parent: 6 },
];

const initialData3 = [
  {
    name: "",
    id: 0,
    children: [1, 2, 3],
    parent: null,
  },
  {
    name: "Fruits",
    children: [6, 7],
    id: 1,
    parent: 0,
    isBranch: true,
  },
  {
    name: "Drinks",
    children: [4, 5],
    id: 2,
    parent: 0,
    isBranch: true,
  },
  {
    name: "Vegetables",
    children: [],
    id: 3,
    parent: 0,
    isBranch: true,
  },
  {
    name: "Pine colada",
    children: [],
    id: 4,
    parent: 2,
  },
  {
    name: "Water",
    children: [],
    id: 5,
    parent: 2,
  },
  {
    name: `Node One`,
    children: [8, 9],
    id: 6,
    parent: 1,
    isBranch: true,
  },
  {
    name: "Node Two",
    children: [10, 11],
    id: 7,
    parent: 1,
    isBranch: true,
  },
  {
    name: `Node One Child1`,
    children: [],
    id: 8,
    parent: 6,
    isBranch: true,
  },
  { name: "Node One Child2", children: [], id: 9, parent: 6 },
  { name: `Node Two Child1`, children: [], id: 10, parent: 7, isBranch: true },
  { name: "Node Two Child2", children: [], id: 11, parent: 7 },
];

function MultiSelectCheckboxAsync() {
  const loadedAlertElement = useRef(null);
  const [data, setData] = useState(initialData);
  const [nodesAlreadyLoaded, setNodesAlreadyLoaded] = useState([]);
  const [loadNumber, setLoadNumber] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);

  // const updateTreeData = (list, id, children) => {
  //   const data = list.map((node) => {
  //     if (node.id === id) {
  //       node.children = children.map((el) => {
  //         return el.id;
  //       });
  //     }
  //     return node;
  //   });
  //   return data.concat(children);
  // };

  const onLoadData = ({ element }) => {
    return new Promise((resolve) => {
      if (element.children.length > 0) {
        resolve();
        return;
      }
      setTimeout(() => {
        if (loadNumber === 0) {
          console.log(0);
          setData(initialData1);
          setLoadNumber(1);
        }
        if (loadNumber === 1) {
          console.log(1);
          setData(initialData2);
          // setSelectedIds([8]);
          setLoadNumber(2);
        }
        if (loadNumber === 2) {
          console.log(2);
          setData(initialData3);
          // setSelectedIds([8]);
        }
        resolve();
      }, 1000);
    });
  };

  useEffect(() => {
    if (loadNumber === 2) {
      console.log('setting selectedID 8');
      setSelectedIds([8]);
    }
    // if (loadNumber === 2) {
    //   setSelectedIds([8]);
    // }
  }, [loadNumber]);

  const wrappedOnLoadData = async (props) => {
    const nodeHasNoChildData = props.element.children.length === 0;
    const nodeHasAlreadyBeenLoaded = nodesAlreadyLoaded.find(
      (e) => e.id === props.element.id
    );

    await onLoadData(props);

    if (nodeHasNoChildData && !nodeHasAlreadyBeenLoaded) {
      const el = loadedAlertElement.current;
      setNodesAlreadyLoaded([...nodesAlreadyLoaded, props.element]);
      el && (el.innerHTML = `${props.element.name} loaded`);

      // Clearing aria-live region so loaded node alerts no longer appear in DOM
      setTimeout(() => {
        el && (el.innerHTML = "");
      }, 5000);
    }
  };

  return (
    <>
      <div>
        <div
          className="visually-hidden"
          ref={loadedAlertElement}
          role="alert"
          aria-live="polite"
        ></div>
        <div className="checkbox">
          <TreeView
            data={data}
            aria-label="Checkbox tree"
            onLoadData={wrappedOnLoadData}
            selectedIds={selectedIds}
            multiSelect
            propagateSelect
            togglableSelect
            propagateSelectUpwards
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
              const branchNode = (isExpanded, element) => {
                return isExpanded && element.children.length === 0 ? (
                  <>
                    <span
                      role="alert"
                      aria-live="assertive"
                      className="visually-hidden"
                    >
                      loading {element.name}
                    </span>
                    <AiOutlineLoading
                      aria-hidden={true}
                      className="loading-icon"
                    />
                  </>
                ) : (
                  <ArrowIcon isOpen={isExpanded} />
                );
              };
              return (
                <div
                  {...getNodeProps({ onClick: handleExpand })}
                  style={{ marginLeft: 40 * (level - 1) }}
                >
                  {isBranch && branchNode(isExpanded, element)}
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
                  <span className="name">{`${element.name}-[${element.id}]`}</span>
                </div>
              );
            }}
          />
        </div>
      </div>
    </>
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

export default MultiSelectCheckboxAsync;
