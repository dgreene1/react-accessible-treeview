"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[148],{5804:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>h,contentTitle:()=>b,default:()=>x,frontMatter:()=>p,metadata:()=>u,toc:()=>f});var t=a(7462),s=a(7294),c=a(3905),i=a(148);const r=(0,i.fK)({name:"",children:[{name:"src",children:[{name:"index.js"},{name:"styles.css"}]},{name:"node_modules",children:[{name:"react-accessible-treeview",children:[{name:"bundle.js"}]},{name:"react",children:[{name:"bundle.js"}]}]},{name:".npmignore"},{name:"package.json"},{name:"webpack.config.js"}]}),o=()=>s.createElement(i.ZP,{data:r,className:"basic","aria-label":"basic example tree",nodeRenderer:e=>{let{element:n,getNodeProps:a,level:c,handleSelect:i}=e;return s.createElement("div",(0,t.Z)({},a(),{style:{paddingLeft:20*(c-1)}}),n.name)}}),l='import React from "react";\nimport TreeView, { flattenTree } from "react-accessible-treeview";\nimport "./styles.css";\n\nconst folder = {\n  name: "",\n  children: [\n    {\n      name: "src",\n      children: [{ name: "index.js" }, { name: "styles.css" }],\n    },\n    {\n      name: "node_modules",\n      children: [\n        {\n          name: "react-accessible-treeview",\n          children: [{ name: "bundle.js" }],\n        },\n        { name: "react", children: [{ name: "bundle.js" }] },\n      ],\n    },\n    {\n      name: ".npmignore",\n    },\n    {\n      name: "package.json",\n    },\n    {\n      name: "webpack.config.js",\n    },\n  ],\n};\n\nconst data = flattenTree(folder);\n\nconst BasicTreeView = () => (\n  <TreeView\n    data={data}\n    className="basic"\n    aria-label="basic example tree"\n    nodeRenderer={({ element, getNodeProps, level, handleSelect }) => (\n      <div {...getNodeProps()} style={{ paddingLeft: 20 * (level - 1) }}>\n        {element.name}\n      </div>\n    )}\n  />\n);\n\nexport default BasicTreeView;\n';var d=a(3952),m=a(2805);const p={title:"Basic"},b=void 0,u={unversionedId:"examples-Basic",id:"examples-Basic",title:"Basic",description:"The simplest instance of the component, a good base on which a custom component can be built.",source:"@site/docs/examples-Basic.mdx",sourceDirName:".",slug:"/examples-Basic",permalink:"/react-accessible-treeview/docs/examples-Basic",draft:!1,tags:[],version:"current",frontMatter:{title:"Basic"},sidebar:"docs",previous:{title:"API Reference",permalink:"/react-accessible-treeview/docs/api"},next:{title:"Basic with controlled expandable node",permalink:"/react-accessible-treeview/docs/examples-ControlledExpandedNode"}},h={},f=[],w={toc:f},g="wrapper";function x(e){let{components:n,...a}=e;return(0,c.kt)(g,(0,t.Z)({},w,a,{components:n,mdxType:"MDXLayout"}),(0,c.kt)("p",null,"The simplest instance of the component, a good base on which a custom component can be built."),(0,c.kt)(m.Z,{component:o,js:l,css:d.Z,mdxType:"CodeTabs"}))}x.isMDXComponent=!0},3952:(e,n,a)=>{a.d(n,{Z:()=>t});const t=".basic.tree {\n  list-style: none;\n  margin: 0;\n  padding: 20px;\n}\n.basic .tree-node,\n.basic .tree-node-group {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n.basic .tree-branch-wrapper,\n.basic .tree-node__leaf {\n  outline: none;\n}\n\n.basic .tree-node--focused {\n  outline-color: rgb(77, 144, 254);\n  outline-style: auto;\n  outline-width: 2px;\n  display: block;\n}\n\n.basic .tree-node__branch {\n  display: block;\n}\n\n.basic .tree-node {\n  cursor: pointer;\n}\n"}}]);