"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[864],{6532:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>S,contentTitle:()=>C,default:()=>E,frontMatter:()=>f,metadata:()=>g,toc:()=>v});var t=a(7462),s=a(7294),r=a(3905),c=a(2805),l=a(9583),o=a(1649),i=a(4184),d=a.n(i),m=a(148);const p=(0,m.fK)({name:"",children:[{name:"Fruits",children:[{name:"Avocados"},{name:"Bananas"},{name:"Berries"},{name:"Oranges"},{name:"Pears"}]},{name:"Drinks",children:[{name:"Apple Juice"},{name:"Chocolate"},{name:"Coffee"},{name:"Tea",children:[{name:"Black Tea"},{name:"Green Tea"},{name:"Red Tea"},{name:"Matcha"}]}]},{name:"Vegetables",children:[{name:"Beets"},{name:"Carrots"},{name:"Celery"},{name:"Lettuce"},{name:"Onions"}]}]});const b=e=>{let{isOpen:n,className:a}=e;const t="arrow",r=d()(t,{[t+"--closed"]:!n},{[t+"--open"]:n},a);return s.createElement(o.am,{className:r})},h=e=>{let{variant:n,...a}=e;switch(n){case"all":return s.createElement(l.xik,a);case"none":return s.createElement(l.u9M,a);case"some":return s.createElement(l.kty,a);default:return null}},u=function(){return s.createElement("div",null,s.createElement("div",{className:"checkbox"},s.createElement(m.ZP,{data:p,"aria-label":"Checkbox tree",multiSelect:!0,propagateSelect:!0,propagateSelectUpwards:!0,defaultDisabledIds:[1,5],togglableSelect:!0,nodeRenderer:e=>{let{element:n,isBranch:a,isExpanded:r,isSelected:c,isDisabled:l,isHalfSelected:o,getNodeProps:i,level:d,handleSelect:m,handleExpand:p,dispatch:u}=e;return s.createElement(s.Fragment,null,s.createElement("div",(0,t.Z)({},i({onClick:p}),{style:{marginLeft:40*(d-1),opacity:l?.5:1}}),a&&s.createElement(b,{isOpen:r}),s.createElement(h,{className:"checkbox-icon",onClick:e=>{m(e),e.stopPropagation()},variant:o?"some":c?"all":"none"}),s.createElement("span",{className:"name"},n.name)),s.createElement("button",{onClick:()=>u({type:l?"ENABLE":"DISABLE",id:n.id})},l?"Enable":"Disable"))}})))},x='import React from "react";\nimport { FaSquare, FaCheckSquare, FaMinusSquare } from "react-icons/fa";\nimport { IoMdArrowDropright } from "react-icons/io";\nimport cx from "classnames";\n\nimport TreeView, { flattenTree } from "react-accessible-treeview";\nconst folder = {\n  name: "",\n  children: [\n    {\n      name: "Fruits",\n      children: [\n        { name: "Avocados" },\n        { name: "Bananas" },\n        { name: "Berries" },\n        { name: "Oranges" },\n        { name: "Pears" },\n      ],\n    },\n    {\n      name: "Drinks",\n      children: [\n        { name: "Apple Juice" },\n        { name: "Chocolate" },\n        { name: "Coffee" },\n        {\n          name: "Tea",\n          children: [\n            { name: "Black Tea" },\n            { name: "Green Tea" },\n            { name: "Red Tea" },\n            { name: "Matcha" },\n          ],\n        },\n      ],\n    },\n    {\n      name: "Vegetables",\n      children: [\n        { name: "Beets" },\n        { name: "Carrots" },\n        { name: "Celery" },\n        { name: "Lettuce" },\n        { name: "Onions" },\n      ],\n    },\n  ],\n};\n\nconst data = flattenTree(folder);\n\nfunction MultiSelectCheckboxDisabled() {\n  return (\n    <div>\n      <div className="checkbox">\n        <TreeView\n          data={data}\n          aria-label="Checkbox tree"\n          multiSelect\n          propagateSelect\n          propagateSelectUpwards\n          defaultDisabledIds={[1, 5]}\n          togglableSelect\n          nodeRenderer={({\n            element,\n            isBranch,\n            isExpanded,\n            isSelected,\n            isDisabled,\n            isHalfSelected,\n            getNodeProps,\n            level,\n            handleSelect,\n            handleExpand,\n            dispatch,\n          }) => {\n            return (\n              <>\n                <div\n                  {...getNodeProps({ onClick: handleExpand })}\n                  style={{\n                    marginLeft: 40 * (level - 1),\n                    opacity: isDisabled ? 0.5 : 1,\n                  }}\n                >\n                  {isBranch && <ArrowIcon isOpen={isExpanded} />}\n                  <CheckBoxIcon\n                    className="checkbox-icon"\n                    onClick={(e) => {\n                      handleSelect(e);\n                      e.stopPropagation();\n                    }}\n                    variant={\n                      isHalfSelected ? "some" : isSelected ? "all" : "none"\n                    }\n                  />\n                  <span className="name">{element.name}</span>\n                </div>\n                <button\n                  onClick={() =>\n                    dispatch({\n                      type: isDisabled ? "ENABLE" : "DISABLE",\n                      id: element.id,\n                    })\n                  }\n                >\n                  {isDisabled ? "Enable" : "Disable"}\n                </button>\n              </>\n            );\n          }}\n        />\n      </div>\n    </div>\n  );\n}\n\nconst ArrowIcon = ({ isOpen, className }) => {\n  const baseClass = "arrow";\n  const classes = cx(\n    baseClass,\n    { [`${baseClass}--closed`]: !isOpen },\n    { [`${baseClass}--open`]: isOpen },\n    className\n  );\n  return <IoMdArrowDropright className={classes} />;\n};\n\nconst CheckBoxIcon = ({ variant, ...rest }) => {\n  switch (variant) {\n    case "all":\n      return <FaCheckSquare {...rest} />;\n    case "none":\n      return <FaSquare {...rest} />;\n    case "some":\n      return <FaMinusSquare {...rest} />;\n    default:\n      return null;\n  }\n};\n\nexport default MultiSelectCheckboxDisabled;\n';var k=a(1240);const f={title:"Checkbox with disabled nodes"},C=void 0,g={unversionedId:"examples-MultiSelectCheckboxDisabled",id:"examples-MultiSelectCheckboxDisabled",title:"Checkbox with disabled nodes",description:"This example demonstrates the use of disabled nodes",source:"@site/docs/examples-MultiSelectCheckboxDisabled.md",sourceDirName:".",slug:"/examples-MultiSelectCheckboxDisabled",permalink:"/react-accessible-treeview/docs/examples-MultiSelectCheckboxDisabled",draft:!1,tags:[],version:"current",frontMatter:{title:"Checkbox with disabled nodes"},sidebar:"docs",previous:{title:"Checkbox with controlled selectedIds",permalink:"/react-accessible-treeview/docs/examples-MultiSelectCheckboxControlled"},next:{title:"Directory tree (multiple selection)",permalink:"/react-accessible-treeview/docs/examples-MultiSelectDirectoryTree"}},S={},v=[],w={toc:v},D="wrapper";function E(e){let{components:n,...a}=e;return(0,r.kt)(D,(0,t.Z)({},w,a,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"This example demonstrates the use of disabled nodes"),(0,r.kt)(c.Z,{component:u,js:x,css:k.Z,mdxType:"CodeTabs"}))}E.isMDXComponent=!0},1240:(e,n,a)=>{a.d(n,{Z:()=>t});const t=".checkbox {\n  font-size: 16px;\n  user-select: none;\n  min-height: 320px;\n  padding: 20px;\n  box-sizing: content-box;\n}\n\n.checkbox .tree,\n.checkbox .tree-node,\n.checkbox .tree-node-group {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n.checkbox .tree-branch-wrapper,\n.checkbox .tree-node__leaf {\n  outline: none;\n}\n\n.checkbox .tree-node {\n  cursor: pointer;\n}\n\n.checkbox .tree-node .name:hover {\n  background: rgba(0, 0, 0, 0.1);\n}\n\n.checkbox .tree-node--focused .name {\n  background: rgba(0, 0, 0, 0.2);\n}\n\n.checkbox .tree-node {\n  display: inline-block;\n}\n\n.checkbox .checkbox-icon {\n  margin: 0 5px;\n  vertical-align: middle;\n}\n\n.checkbox button {\n  border: none;\n  background: transparent;\n  cursor: pointer;\n}\n\n.checkbox .arrow {\n  margin-left: 5px;\n  vertical-align: middle;\n}\n\n.checkbox .arrow--open {\n  transform: rotate(90deg);\n}\n"}}]);