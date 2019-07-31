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
          name: "react-accesible-treeview",
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
        aria-labelled-by={"basic-tree"}
        style={{ paddingLeft: 20 * (level - 1) }}
      >
        {element.name}
      </div>
    )}
  />
</>;
```

#### Styled

```js
import React, { useState } from "react";
import { DiCss3, DiJavascript, DiNpm } from "react-icons/di";
import { FaList, FaRegFolder, FaRegFolderOpen } from "react-icons/fa";
import "./styled.css";
import TreeView, { flattenTree } from "..";

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
          name: "react-accesible-treeview",
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
  return (
    <div className="ide">
      <h5 id="styled-tree">Directory tree</h5>
      <div style={{ padding: 0, minHeight: 40 }}>
        {(state != null && JSON.stringify(state, null, 4)) ||
          "waiting for a selection"}
      </div>
      <TreeView
        data={data}
        onSelect={x => setState(x)}
        aria-labelled-by={"styled-tree"}
        nodeRenderer={({
          element,
          isBranch,
          isExpanded,
          getNodeProps,
          level
        }) => (
          <div {...getNodeProps()} style={{ paddingLeft: 20 * (level - 1) }}>
            {isBranch ? (
              <>
                <FolderIcon isOpen={isExpanded} />
                {element.name}
              </>
            ) : (
              <>
                <FileIcon filename={element.name} />
                {element.name}
              </>
            )}
          </div>
        )}
      />
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
