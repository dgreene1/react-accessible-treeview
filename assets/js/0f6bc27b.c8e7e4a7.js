"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[99],{4650:function(e,n,a){a.r(n),a.d(n,{assets:function(){return w},contentTitle:function(){return v},default:function(){return T},frontMatter:function(){return E},metadata:function(){return C},toc:function(){return I}});var t=a(7462),r=a(3366),o=a(7294),s=a(3905),d=a(1649),l=a(148),i=a(4184),c=a.n(i),m=(0,l.fK)({name:"",children:[{name:"Fruits",children:[{name:"Avocados"},{name:"Bananas"},{name:"Berries"},{name:"Oranges"},{name:"Pears"}]},{name:"Drinks",children:[{name:"Apple Juice"},{name:"Chocolate"},{name:"Coffee"},{name:"Tea",children:[{name:"Black Tea"},{name:"Green Tea"},{name:"Red Tea"},{name:"Matcha"}]}]},{name:"Vegetables",children:[{name:"Beets"},{name:"Carrots"},{name:"Celery"},{name:"Lettuce"},{name:"Onions"}]}]});var p=function(e){var n,a,t=e.isOpen,r=e.className,s="arrow",l=c()(s,((n={})[s+"--closed"]=!t,n),((a={})[s+"--open"]=t,a),r);return o.createElement(d.am,{className:l})},u=function(){var e=(0,o.useState)(),n=e[0],a=e[1],r=function(){a(document.querySelector("#txtIdsToExpand").value.split(",").filter((function(e){return!!e.trim()})).map((function(e){return isNaN(parseInt(e.trim()))?e:parseInt(e.trim())})))};return o.createElement("div",null,o.createElement("div",null,o.createElement("label",{htmlFor:"txtIdsToExpand"},"Comma-delimited list of branch node IDs to expand:"),o.createElement("input",{id:"txtIdsToExpand",type:"text",onKeyDown:function(e){"Enter"===e.key&&r()}}),o.createElement("button",{onClick:function(){return r()}},"Set")),o.createElement("div",null,o.createElement("button",{onClick:function(){return a([])}},"Clear all expanded nodes")),o.createElement("div",{className:"checkbox"},o.createElement(l.ZP,{data:m,"aria-label":"Controlled expanded node tree",expandedIds:n,defaultExpandedIds:[1],nodeRenderer:function(e){var n=e.element,a=e.isBranch,r=e.isExpanded,s=e.isDisabled,d=e.getNodeProps,l=e.level,i=e.handleExpand;return o.createElement("div",(0,t.Z)({},d({onClick:i}),{style:{marginLeft:40*(l-1),opacity:s?.5:1}}),a&&o.createElement(p,{isOpen:r}),o.createElement("span",{className:"name"},n.name,"-",n.id))}})))},x='import React, { useState } from "react";\nimport { IoMdArrowDropright } from "react-icons/io";\nimport TreeView, { flattenTree } from "react-accessible-treeview";\nimport cx from "classnames";\n\nconst folder = {\n  name: "",\n  children: [\n    {\n      name: "Fruits",\n      children: [\n        { name: "Avocados" },\n        { name: "Bananas" },\n        { name: "Berries" },\n        { name: "Oranges" },\n        { name: "Pears" },\n      ],\n    },\n    {\n      name: "Drinks",\n      children: [\n        { name: "Apple Juice" },\n        { name: "Chocolate" },\n        { name: "Coffee" },\n        {\n          name: "Tea",\n          children: [\n            { name: "Black Tea" },\n            { name: "Green Tea" },\n            { name: "Red Tea" },\n            { name: "Matcha" },\n          ],\n        },\n      ],\n    },\n    {\n      name: "Vegetables",\n      children: [\n        { name: "Beets" },\n        { name: "Carrots" },\n        { name: "Celery" },\n        { name: "Lettuce" },\n        { name: "Onions" },\n      ],\n    },\n  ],\n};\n\nconst data = flattenTree(folder);\n\nfunction ControlledExpandedNode() {\n  const [expandedIds, setExpandedIds] = useState();\n\n  const onKeyDown = (e) => {\n    if (e.key === "Enter") {\n      getAndSetIds();\n    }\n  };\n\n  const getAndSetIds = () => {\n    setExpandedIds(\n      document\n        .querySelector("#txtIdsToExpand")\n        .value.split(",")\n        .filter(val => !!val.trim())\n        .map((x) => {\n          if (isNaN(parseInt(x.trim()))) {\n            return x;\n          }\n          return parseInt(x.trim());\n        })\n    );\n  };\n\n  return (\n    <div>\n      <div>\n        <label htmlFor="txtIdsToExpand">\n          Comma-delimited list of branch node IDs to expand:\n        </label>\n        <input id="txtIdsToExpand" type="text" onKeyDown={onKeyDown} />\n        <button onClick={() => getAndSetIds()}>Set</button>\n      </div>\n      <div>\n        <button onClick={() => setExpandedIds([])}>\n          Clear all expanded nodes\n        </button>\n      </div>\n      <div className="checkbox">\n        <TreeView\n          data={data}\n          aria-label="Controlled expanded node tree"\n          expandedIds={expandedIds}\n          defaultExpandedIds={[1]}\n          nodeRenderer={({\n            element,\n            isBranch,\n            isExpanded,\n            isDisabled,\n            getNodeProps,\n            level,\n            handleExpand,\n          }) => {\n            return (\n              <div\n                {...getNodeProps({ onClick: handleExpand })}\n                style={{\n                  marginLeft: 40 * (level - 1),\n                  opacity: isDisabled ? 0.5 : 1,\n                }}\n              >\n                {isBranch && <ArrowIcon isOpen={isExpanded} />}\n                <span className="name">\n                  {element.name}-{element.id}\n                </span>\n              </div>\n            );\n          }}\n        />\n      </div>\n    </div>\n  );\n}\n\nconst ArrowIcon = ({ isOpen, className }) => {\n  const baseClass = "arrow";\n  const classes = cx(\n    baseClass,\n    { [`${baseClass}--closed`]: !isOpen },\n    { [`${baseClass}--open`]: isOpen },\n    className\n  );\n  return <IoMdArrowDropright className={classes} />;\n};\n\nexport default ControlledExpandedNode;\n',b=a(3952),f=a(2805),h=["components"],E={title:"Basic with controlled expandable node"},v=void 0,C={unversionedId:"examples-ControlledExpandedNode",id:"examples-ControlledExpandedNode",title:"Basic with controlled expandable node",description:"This example demonstrates how to create a simple tree with controlled expandable node",source:"@site/docs/examples-ControlledExpandedNode.mdx",sourceDirName:".",slug:"/examples-ControlledExpandedNode",permalink:"/react-accessible-treeview/docs/examples-ControlledExpandedNode",draft:!1,tags:[],version:"current",frontMatter:{title:"Basic with controlled expandable node"},sidebar:"docs",previous:{title:"Basic",permalink:"/react-accessible-treeview/docs/examples-Basic"},next:{title:"Data types",permalink:"/react-accessible-treeview/docs/examples-DataTypes"}},w={},I=[],k={toc:I},y="wrapper";function T(e){var n=e.components,a=(0,r.Z)(e,h);return(0,s.kt)(y,(0,t.Z)({},k,a,{components:n,mdxType:"MDXLayout"}),(0,s.kt)("p",null,"This example demonstrates how to create a simple tree with controlled expandable node"),(0,s.kt)(f.Z,{component:u,js:x,css:b.Z,mdxType:"CodeTabs"}))}T.isMDXComponent=!0},3952:function(e,n){n.Z=".basic.tree {\n  list-style: none;\n  margin: 0;\n  padding: 20px;\n}\n.basic .tree-node,\n.basic .tree-node-group {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n.basic .tree-branch-wrapper,\n.basic .tree-node__leaf {\n  outline: none;\n}\n\n.basic .tree-node--focused {\n  outline-color: rgb(77, 144, 254);\n  outline-style: auto;\n  outline-width: 2px;\n  display: block;\n}\n\n.basic .tree-node__branch {\n  display: block;\n}\n\n.basic .tree-node {\n  cursor: pointer;\n}\n"}}]);