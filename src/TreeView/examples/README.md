### Examples

#### Basic

```js
import React from "react";
import TreeView, { flattenTree } from "..";
import "./basic.css";

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
          children: [{ name: "bundle.js" }]
        },
        { name: "react", children: [{ name: "bundle.js" }] }
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

<>
  <h5 id="basic-tree">Directory tree</h5>
  <TreeView
    data={data}
    className="basic"
    nodeRenderer={({ element, getNodeProps, level }) => (
      <div
        {...getNodeProps()}
        aria-labelledby={"basic-tree"}
        style={{ paddingLeft: 20 * (level - 1) }}
      >
        {element.name}
      </div>
    )}
  />
</>;
```

#### Styled with options

```js
import React, { useState } from "react";
import { DiCss3, DiJavascript, DiNpm } from "react-icons/di";
import { FaList, FaRegFolder, FaRegFolderOpen } from "react-icons/fa";
import "./styled.css";
import TreeView, { flattenTree } from "..";
import Checkbox from "./Checkbox";

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

function Example() {
  const [state, setState] = useState();
  const [propagateCollapse, setPropagateCollapse] = useState(false);
  const [propagateSelect, setPropagateSelect] = useState(false);
  const [togglableSelect, setTogglableSelect] = useState(false);
  return (
    <div>
      <div className="ide">
        Options:
        <span>
          <Checkbox onChange={x => setPropagateCollapse(x)}>
            propagateCollapse
          </Checkbox>
          <Checkbox onChange={x => setTogglableSelect(x)}>
            togglableSelect
          </Checkbox>
        </span>
        <div style={{ padding: 0, minHeight: 100 }}>
          {state != null
            ? JSON.stringify(state, null, 4)
            : "waiting for a selection"}
        </div>
        <h5 id="styled-tree">Directory tree</h5>
        <TreeView
          data={data}
          onChange={x => setState(x)}
          aria-labelledby={"styled-tree"}
          propagateCollapse={propagateCollapse}
          togglableSelect={togglableSelect}
          nodeRenderer={({
            element,
            isBranch,
            isExpanded,
            getNodeProps,
            level,
            handleSelect
          }) =>
            isBranch ? (
              <div
                {...getNodeProps({ onClick: handleSelect })}
                style={{ paddingLeft: 20 * (level - 1) }}
              >
                <FolderIcon isOpen={isExpanded} />
                {element.name}
              </div>
            ) : (
              <div
                {...getNodeProps({ onClick: handleSelect })}
                style={{ paddingLeft: 20 * (level - 1) }}
              >
                <FileIcon filename={element.name} />
                {element.name}
              </div>
            )
          }
        />
      </div>
    </div>
  );
}

const FolderIcon = ({ isOpen }) =>
  isOpen ? (
    <FaRegFolderOpen color="e8a87c" className="icon" />
  ) : (
    <FaRegFolder color="e8a87c" className="icon" />
  );

const FileIcon = ({ filename }) => {
  const extension = filename.slice(filename.lastIndexOf(".") + 1);
  switch (extension) {
    case "js":
      return <DiJavascript color="yellow" className="icon" />;
    case "css":
      return <DiCss3 color="turquoise" className="icon" />;
    case "json":
      return <FaList color="yellow" className="icon" />;
    case "npmignore":
      return <DiNpm color="red" className="icon" />;
    default:
      return null;
  }
};
<Example />;
```

Multi-select with checkbox

```js
import React, { useState } from "react";
import { DiCss3, DiJavascript, DiNpm } from "react-icons/di";
import { GoTriangleDown, GoTriangleRight } from "react-icons/go";
import { FaSquare, FaCheckSquare, FaMinusSquare } from "react-icons/fa";

import "./checkbox-tree.css";
import TreeView, { flattenTree } from "..";
import { getDescendants } from "../utils";
import Checkbox from "./Checkbox";

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
  const [state, setState] = useState();
  return (
    <div>
      <div className="checkbox">
        <TreeView
          data={data}
          onChange={x => setState(x)}
          aria-label="Checkbox tree"
          multiSelect
          propagateSelect
          togglableSelect
          nodeRenderer={({
            element,
            isBranch,
            isExpanded,
            getNodeProps,
            level,
            selectedIds,
            halfSelectedIds,
            handleSelect
          }) => {
            return (
              <div {...getNodeProps()} style={{ marginLeft: 40 * (level - 1) }}>
                {isBranch && <TriangleIcon isOpen={isExpanded} />}
                <CheckBoxIcon
                  className="icon"
                  onClick={e => {
                    e.preventDefault();
                    handleSelect();
                  }}
                  variant={
                    halfSelectedIds.has(element.id)
                      ? "some"
                      : selectedIds.has(element.id)
                      ? "all"
                      : "none"
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
