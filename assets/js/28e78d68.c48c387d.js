"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[507],{842:(e,n,a)=>{a.d(n,{Z:()=>h});var t=a(7462),r=a(7294),c=a(9583),o=a(1649),s=a(148),l=a(4184),i=a.n(l);const m=(0,s.fK)({name:"",children:[{name:"Fruits",children:[{name:"Avocados"},{name:"Bananas"},{name:"Berries"},{name:"Oranges"},{name:"Pears"}]},{name:"Drinks",children:[{name:"Apple Juice"},{name:"Chocolate"},{name:"Coffee"},{name:"Tea",children:[{name:"Black Tea"},{name:"Green Tea"},{name:"Red Tea"},{name:"Matcha"}]}]},{name:"Vegetables",children:[{name:"Beets"},{name:"Carrots"},{name:"Celery"},{name:"Lettuce"},{name:"Onions"}]}]});const d=e=>{let{isOpen:n,className:a}=e;const t="arrow",c=i()(t,{[t+"--closed"]:!n},{[t+"--open"]:n},a);return r.createElement(o.am,{className:c})},p=e=>{let{variant:n,...a}=e;switch(n){case"all":return r.createElement(c.xik,a);case"none":return r.createElement(c.u9M,a);case"some":return r.createElement(c.kty,a);default:return null}},h=function(){return r.createElement("div",null,r.createElement("div",{className:"checkbox"},r.createElement(s.ZP,{data:m,"aria-label":"Checkbox tree",multiSelect:!0,propagateSelect:!0,propagateSelectUpwards:!0,togglableSelect:!0,nodeRenderer:e=>{let{element:n,isBranch:a,isExpanded:c,isSelected:o,isHalfSelected:s,getNodeProps:l,level:i,handleSelect:m,handleExpand:h}=e;return r.createElement("div",(0,t.Z)({},l({onClick:h}),{style:{marginLeft:40*(i-1)}}),a&&r.createElement(d,{isOpen:c}),r.createElement(p,{className:"checkbox-icon",onClick:e=>{m(e),e.stopPropagation()},variant:s?"some":o?"all":"none"}),r.createElement("span",{className:"name"},n.name))}})))}},2986:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>p,contentTitle:()=>m,default:()=>b,frontMatter:()=>i,metadata:()=>d,toc:()=>h});var t=a(7462),r=(a(7294),a(3905)),c=a(2805),o=a(842);const s='import React from "react";\nimport { FaSquare, FaCheckSquare, FaMinusSquare } from "react-icons/fa";\nimport { IoMdArrowDropright } from "react-icons/io";\nimport TreeView, { flattenTree } from "react-accessible-treeview";\nimport cx from "classnames";\nimport "./styles.css";\n\nconst folder = {\n  name: "",\n  children: [\n    {\n      name: "Fruits",\n      children: [\n        { name: "Avocados" },\n        { name: "Bananas" },\n        { name: "Berries" },\n        { name: "Oranges" },\n        { name: "Pears" },\n      ],\n    },\n    {\n      name: "Drinks",\n      children: [\n        { name: "Apple Juice" },\n        { name: "Chocolate" },\n        { name: "Coffee" },\n        {\n          name: "Tea",\n          children: [\n            { name: "Black Tea" },\n            { name: "Green Tea" },\n            { name: "Red Tea" },\n            { name: "Matcha" },\n          ],\n        },\n      ],\n    },\n    {\n      name: "Vegetables",\n      children: [\n        { name: "Beets" },\n        { name: "Carrots" },\n        { name: "Celery" },\n        { name: "Lettuce" },\n        { name: "Onions" },\n      ],\n    },\n  ],\n};\n\nconst data = flattenTree(folder);\n\nfunction MultiSelectCheckbox() {\n  return (\n    <div>\n      <div className="checkbox">\n        <TreeView\n          data={data}\n          aria-label="Checkbox tree"\n          multiSelect\n          propagateSelect\n          propagateSelectUpwards\n          togglableSelect\n          nodeRenderer={({\n            element,\n            isBranch,\n            isExpanded,\n            isSelected,\n            isHalfSelected,\n            getNodeProps,\n            level,\n            handleSelect,\n            handleExpand,\n          }) => {\n            return (\n              <div\n                {...getNodeProps({ onClick: handleExpand })}\n                style={{ marginLeft: 40 * (level - 1) }}\n              >\n                {isBranch && <ArrowIcon isOpen={isExpanded} />}\n                <CheckBoxIcon\n                  className="checkbox-icon"\n                  onClick={(e) => {\n                    handleSelect(e);\n                    e.stopPropagation();\n                  }}\n                  variant={\n                    isHalfSelected ? "some" : isSelected ? "all" : "none"\n                  }\n                />\n                <span className="name">{element.name}</span>\n              </div>\n            );\n          }}\n        />\n      </div>\n    </div>\n  );\n}\n\nconst ArrowIcon = ({ isOpen, className }) => {\n  const baseClass = "arrow";\n  const classes = cx(\n    baseClass,\n    { [`${baseClass}--closed`]: !isOpen },\n    { [`${baseClass}--open`]: isOpen },\n    className\n  );\n  return <IoMdArrowDropright className={classes} />;\n};\n\nconst CheckBoxIcon = ({ variant, ...rest }) => {\n  switch (variant) {\n    case "all":\n      return <FaCheckSquare {...rest} />;\n    case "none":\n      return <FaSquare {...rest} />;\n    case "some":\n      return <FaMinusSquare {...rest} />;\n    default:\n      return null;\n  }\n};\n\nexport default MultiSelectCheckbox;\n';var l=a(1240);const i={title:"Checkbox"},m=void 0,d={unversionedId:"examples-MultiSelectCheckbox",id:"examples-MultiSelectCheckbox",title:"Checkbox",description:"This example demonstrates how to create a checkbox tree",source:"@site/docs/examples-MultiSelectCheckbox.mdx",sourceDirName:".",slug:"/examples-MultiSelectCheckbox",permalink:"/react-accessible-treeview/docs/examples-MultiSelectCheckbox",draft:!1,tags:[],version:"current",frontMatter:{title:"Checkbox"},sidebar:"docs",previous:{title:"Filtering",permalink:"/react-accessible-treeview/docs/examples-Filtering"},next:{title:"Asynchronous loading",permalink:"/react-accessible-treeview/docs/examples-MultiSelectCheckboxAsync"}},p={},h=[],u={toc:h},x="wrapper";function b(e){let{components:n,...a}=e;return(0,r.kt)(x,(0,t.Z)({},u,a,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"This example demonstrates how to create a checkbox tree"),(0,r.kt)(c.Z,{component:o.Z,js:s,css:l.Z,mdxType:"CodeTabs"}))}b.isMDXComponent=!0},1240:(e,n,a)=>{a.d(n,{Z:()=>t});const t=".checkbox {\n  font-size: 16px;\n  user-select: none;\n  min-height: 320px;\n  padding: 20px;\n  box-sizing: content-box;\n}\n\n.checkbox .tree,\n.checkbox .tree-node,\n.checkbox .tree-node-group {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n.checkbox .tree-branch-wrapper,\n.checkbox .tree-node__leaf {\n  outline: none;\n}\n\n.checkbox .tree-node {\n  cursor: pointer;\n}\n\n.checkbox .tree-node .name:hover {\n  background: rgba(0, 0, 0, 0.1);\n}\n\n.checkbox .tree-node--focused .name {\n  background: rgba(0, 0, 0, 0.2);\n}\n\n.checkbox .tree-node {\n  display: inline-block;\n}\n\n.checkbox .checkbox-icon {\n  margin: 0 5px;\n  vertical-align: middle;\n}\n\n.checkbox button {\n  border: none;\n  background: transparent;\n  cursor: pointer;\n}\n\n.checkbox .arrow {\n  margin-left: 5px;\n  vertical-align: middle;\n}\n\n.checkbox .arrow--open {\n  transform: rotate(90deg);\n}\n"}}]);