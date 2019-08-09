```js
import React from "react";
import TreeView, { flattenTree } from "../../..";
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

<TreeView
  data={data}
  className="basic"
  nodeRenderer={({ element, getNodeProps, level }) => (
    <div
      {...getNodeProps()}
      aria-label="basic example tree"
      style={{ paddingLeft: 20 * (level - 1) }}
    >
      {element.name}
    </div>
  )}
/>;
```
