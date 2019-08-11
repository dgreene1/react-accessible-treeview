```js
import React, { useState } from "react";
import { DiCss3, DiJavascript, DiNpm } from "react-icons/di";
import { FaList, FaRegFolder, FaRegFolderOpen } from "react-icons/fa";
import "./styled.css";
import TreeView, { flattenTree } from "../../..";
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
  const [propagateCollapse, setPropagateCollapse] = useState(false);
  const [propagateSelect, setPropagateSelect] = useState(false);
  const [togglableSelect, setTogglableSelect] = useState(false);
  return (
    <div>
      <div className="ide">
        <span>
          <Checkbox onChange={x => setPropagateCollapse(x)}>
            propagateCollapse
          </Checkbox>
          <Checkbox onChange={x => setTogglableSelect(x)}>
            togglableSelect
          </Checkbox>
        </span>
        <TreeView
          data={data}
          aria-label="directory tree"
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
