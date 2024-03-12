"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[47],{8204:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>f,contentTitle:()=>C,default:()=>y,frontMatter:()=>S,metadata:()=>g,toc:()=>v});var a=t(8168),l=t(6540),o=t(5680),c=t(6652),r=t(1612),s=t(33),i=t(2777),d=t(6942),m=t.n(d);const p=(0,i.dG)({name:"",children:[{name:"Fruits",children:[{name:"Avocados"},{name:"Bananas"},{name:"Berries"},{name:"Oranges"},{name:"Pears"}]},{name:"Drinks",children:[{name:"Apple Juice"},{name:"Chocolate"},{name:"Coffee"},{name:"Tea",children:[{name:"Black Tea"},{name:"Green Tea"},{name:"Red Tea"},{name:"Matcha"}]}]},{name:"Vegetables",children:[{name:"Beets"},{name:"Carrots"},{name:"Celery"},{name:"Lettuce"},{name:"Onions"}]}]});const u=e=>{let{isOpen:n,className:t}=e;const a="arrow",o=m()(a,{[a+"--closed"]:!n},{[a+"--open"]:n},t);return l.createElement(s.c_e,{className:o})},h=e=>{let{variant:n,...t}=e;switch(n){case"all":return l.createElement(r.Hcz,t);case"none":return l.createElement(r.$qz,t);case"some":return l.createElement(r.tx_,t);default:return null}},b=function(){const[e,n]=(0,l.useState)([]),t=()=>{n(document.querySelector("#txtIdsToSelect").value.split(",").filter((e=>!!e.trim())).map((e=>isNaN(parseInt(e.trim()))?e:parseInt(e.trim()))))};return l.createElement("div",null,l.createElement("div",null,l.createElement("label",{htmlFor:"txtIdsToSelect"},"Comma-delimited list of IDs to set:"),l.createElement("input",{id:"txtIdsToSelect",type:"text",onKeyDown:e=>{"Enter"===e.key&&t()}}),l.createElement("button",{onClick:()=>t()},"Set")),l.createElement("div",null,l.createElement("button",{onClick:()=>n([])},"Clear Selected Nodes")),l.createElement("div",{className:"checkbox"},l.createElement(i.Ay,{data:p,"aria-label":"Checkbox tree",multiSelect:!0,selectedIds:e,defaultExpandedIds:[1],propagateSelect:!0,propagateSelectUpwards:!0,togglableSelect:!0,onSelect:e=>console.log("onSelect callback: ",e),onNodeSelect:e=>console.log("onNodeSelect callback: ",e),nodeRenderer:e=>{let{element:n,isBranch:t,isExpanded:o,isSelected:c,isHalfSelected:r,isDisabled:s,getNodeProps:i,level:d,handleSelect:m,handleExpand:p}=e;return l.createElement("div",(0,a.A)({},i({onClick:p}),{style:{marginLeft:40*(d-1),opacity:s?.5:1}}),t&&l.createElement(u,{isOpen:o}),l.createElement(h,{className:"checkbox-icon",onClick:e=>{m(e),e.stopPropagation()},variant:r?"some":c?"all":"none"}),l.createElement("span",{className:"name"},n.name,"-",n.id))}})))},x='import React, { useState } from "react";\nimport { FaSquare, FaCheckSquare, FaMinusSquare } from "react-icons/fa";\nimport { IoMdArrowDropright } from "react-icons/io";\nimport TreeView, { flattenTree } from "react-accessible-treeview";\nimport cx from "classnames";\nimport "./styles.css";\n\nconst folder = {\n  name: "",\n  children: [\n    {\n      name: "Fruits",\n      children: [\n        { name: "Avocados" },\n        { name: "Bananas" },\n        { name: "Berries" },\n        { name: "Oranges" },\n        { name: "Pears" },\n      ],\n    },\n    {\n      name: "Drinks",\n      children: [\n        { name: "Apple Juice" },\n        { name: "Chocolate" },\n        { name: "Coffee" },\n        {\n          name: "Tea",\n          children: [\n            { name: "Black Tea" },\n            { name: "Green Tea" },\n            { name: "Red Tea" },\n            { name: "Matcha" },\n          ],\n        },\n      ],\n    },\n    {\n      name: "Vegetables",\n      children: [\n        { name: "Beets" },\n        { name: "Carrots" },\n        { name: "Celery" },\n        { name: "Lettuce" },\n        { name: "Onions" },\n      ],\n    },\n  ],\n};\n\nconst data = flattenTree(folder);\n\nfunction MultiSelectCheckboxControlled() {\n  const [selectedIds, setSelectedIds] = useState([]);\n\n  const onKeyDown = (e) => {\n    if (e.key === "Enter") {\n      getAndSetIds();\n    }\n  };\n\n  const getAndSetIds = () => {\n    setSelectedIds(\n      document\n        .querySelector("#txtIdsToSelect")\n        .value.split(",")\n        .filter(val => !!val.trim())\n        .map((x) => {\n          if (isNaN(parseInt(x.trim()))) {\n            return x;\n          }\n          return parseInt(x.trim());\n        })\n    );\n  };\n\n  return (\n    <div>\n      <div>\n        <label htmlFor="txtIdsToSelect">\n          Comma-delimited list of IDs to set:\n        </label>\n        <input id="txtIdsToSelect" type="text" onKeyDown={onKeyDown} />\n        <button onClick={() => getAndSetIds()}>Set</button>\n      </div>\n      <div>\n        <button onClick={() => setSelectedIds([])}>Clear Selected Nodes</button>\n      </div>\n      <div className="checkbox">\n        <TreeView\n          data={data}\n          aria-label="Checkbox tree"\n          multiSelect\n          selectedIds={selectedIds}\n          defaultExpandedIds={[1]}\n          propagateSelect\n          propagateSelectUpwards\n          togglableSelect\n          onSelect={(props) => console.log(\'onSelect callback: \', props)}\n          onNodeSelect={(props) => console.log(\'onNodeSelect callback: \', props)}\n          nodeRenderer={({\n            element,\n            isBranch,\n            isExpanded,\n            isSelected,\n            isHalfSelected,\n            isDisabled,\n            getNodeProps,\n            level,\n            handleSelect,\n            handleExpand,\n          }) => {\n            return (\n              <div\n                {...getNodeProps({ onClick: handleExpand })}\n                style={{\n                  marginLeft: 40 * (level - 1),\n                  opacity: isDisabled ? 0.5 : 1,\n                }}\n              >\n                {isBranch && <ArrowIcon isOpen={isExpanded} />}\n                <CheckBoxIcon\n                  className="checkbox-icon"\n                  onClick={(e) => {\n                    handleSelect(e);\n                    e.stopPropagation();\n                  }}\n                  variant={\n                    isHalfSelected ? "some" : isSelected ? "all" : "none"\n                  }\n                />\n                <span className="name">\n                  {element.name}-{element.id}\n                </span>\n              </div>\n            );\n          }}\n        />\n      </div>\n    </div>\n  );\n}\n\nconst ArrowIcon = ({ isOpen, className }) => {\n  const baseClass = "arrow";\n  const classes = cx(\n    baseClass,\n    { [`${baseClass}--closed`]: !isOpen },\n    { [`${baseClass}--open`]: isOpen },\n    className\n  );\n  return <IoMdArrowDropright className={classes} />;\n};\n\nconst CheckBoxIcon = ({ variant, ...rest }) => {\n  switch (variant) {\n    case "all":\n      return <FaCheckSquare {...rest} />;\n    case "none":\n      return <FaSquare {...rest} />;\n    case "some":\n      return <FaMinusSquare {...rest} />;\n    default:\n      return null;\n  }\n};\n\nexport default MultiSelectCheckboxControlled;\n',k=".checkbox {\n    font-size: 16px;\n    user-select: none;\n    min-height: 320px;\n    padding: 20px;\n    box-sizing: content-box;\n  }\n  \n  .checkbox .tree,\n  .checkbox .tree-node,\n  .checkbox .tree-node-group {\n    list-style: none;\n    margin: 0;\n    padding: 0;\n  }\n  \n  .checkbox .tree-branch-wrapper,\n  .checkbox .tree-node__leaf {\n    outline: none;\n  }\n  \n  .checkbox .tree-node {\n    cursor: pointer;\n  }\n  \n  .checkbox .tree-node .name:hover {\n    background: rgba(0, 0, 0, 0.1);\n  }\n  \n  .checkbox .tree-node--focused .name {\n    background: rgba(0, 0, 0, 0.2);\n  }\n  \n  .checkbox .tree-node {\n    display: inline-block;\n  }\n  \n  .checkbox .checkbox-icon {\n    margin: 0 5px;\n    vertical-align: middle;\n  }\n  \n  .checkbox button {\n    border: none;\n    background: transparent;\n    cursor: pointer;\n  }\n  \n  .checkbox .arrow {\n    margin-left: 5px;\n    vertical-align: middle;\n  }\n  \n  .checkbox .arrow--open {\n    transform: rotate(90deg);\n  }\n  ",S={title:"Checkbox with controlled selectedIds"},C=void 0,g={unversionedId:"examples-MultiSelectCheckboxControlled",id:"examples-MultiSelectCheckboxControlled",title:"Checkbox with controlled selectedIds",description:"This example demonstrates how to create a checkbox tree",source:"@site/docs/examples-MultiSelectCheckboxControlled.mdx",sourceDirName:".",slug:"/examples-MultiSelectCheckboxControlled",permalink:"/react-accessible-treeview/docs/examples-MultiSelectCheckboxControlled",draft:!1,tags:[],version:"current",frontMatter:{title:"Checkbox with controlled selectedIds"},sidebar:"docs",previous:{title:"Asynchronous loading with Controlled selection",permalink:"/react-accessible-treeview/docs/examples-MultiSelectCheckboxAsyncControlled"},next:{title:"Checkbox with disabled nodes",permalink:"/react-accessible-treeview/docs/examples-MultiSelectCheckboxDisabled"}},f={},v=[],w={toc:v},I="wrapper";function y(e){let{components:n,...t}=e;return(0,o.yg)(I,(0,a.A)({},w,t,{components:n,mdxType:"MDXLayout"}),(0,o.yg)("p",null,"This example demonstrates how to create a checkbox tree"),(0,o.yg)(c.A,{component:b,js:x,css:k,mdxType:"CodeTabs"}))}y.isMDXComponent=!0}}]);