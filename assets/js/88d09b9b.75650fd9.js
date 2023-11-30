"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[982],{3112:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>v,contentTitle:()=>S,default:()=>N,frontMatter:()=>g,metadata:()=>f,toc:()=>C});var t=a(7462),c=a(7294),r=a(3905),s=a(2805),l=a(9583),o=a(1649),i=a(148),d=a(4184),m=a.n(d);const p=(0,i.fK)({name:"",children:[{name:"Fruits",children:[{name:"Avocados"},{name:"Bananas"},{name:"Berries"},{name:"Oranges"},{name:"Pears"}]},{name:"Drinks",children:[{name:"Hot drinks",children:[{name:"Non-alcohol",children:[{name:"Tea",children:[{name:"Black Tea"}]}]}]}]},{name:"Vegetables",children:[{name:"Beets"}]}]});const h=e=>{let{isOpen:n,className:a}=e;const t="arrow",r=m()(t,{[t+"--closed"]:!n},{[t+"--open"]:n},a);return c.createElement(o.am,{className:r})},k=e=>{let{variant:n,...a}=e;switch(n){case"all":return c.createElement(l.xik,a);case"none":return c.createElement(l.u9M,a);case"some":return c.createElement(l.kty,a);default:return null}},u=function(){return c.createElement("div",null,c.createElement("div",{className:"checkbox"},c.createElement(i.ZP,{data:p,"aria-label":"Single select",multiSelect:!1,propagateSelectUpwards:!0,togglableSelect:!0,nodeAction:"check",nodeRenderer:e=>{let{element:n,isBranch:a,isExpanded:r,isSelected:s,isHalfSelected:l,getNodeProps:o,level:i,handleSelect:d,handleExpand:m}=e;return c.createElement("div",(0,t.Z)({},o({onClick:m}),{style:{marginLeft:40*(i-1)}}),a&&c.createElement(h,{isOpen:r}),c.createElement(k,{className:"checkbox-icon",onClick:e=>{d(e),e.stopPropagation()},variant:l?"some":s?"all":"none"}),c.createElement("span",{className:"name"},n.name))}})))},b='import React from "react";\nimport { FaSquare, FaCheckSquare, FaMinusSquare } from "react-icons/fa";\nimport { IoMdArrowDropright } from "react-icons/io";\nimport TreeView, { flattenTree } from "react-accessible-treeview";\nimport cx from "classnames";\nimport "./styles.css";\n\nconst folder = {\n  name: "",\n  children: [\n    {\n      name: "Fruits",\n      children: [\n        { name: "Avocados" },\n        { name: "Bananas" },\n        { name: "Berries" },\n        { name: "Oranges" },\n        { name: "Pears" },\n      ],\n    },\n    {\n      name: "Drinks",\n      children: [\n        {\n          name: "Hot drinks",\n          children: [\n            {\n              name: "Non-alcohol",\n              children: [\n                {\n                  name: "Tea",\n                  children: [\n                    {\n                      name: "Black Tea",\n                    },\n                  ],\n                },\n              ],\n            },\n          ],\n        },\n      ],\n    },\n    {\n      name: "Vegetables",\n      children: [{ name: "Beets" }],\n    },\n  ],\n};\n\nconst data = flattenTree(folder);\n\nfunction SingleSelectCheckbox() {\n  return (\n    <div>\n      <div className="checkbox">\n        <TreeView\n          data={data}\n          aria-label="Single select"\n          multiSelect={false}\n          propagateSelectUpwards\n          togglableSelect\n          nodeAction="check"\n          nodeRenderer={({\n            element,\n            isBranch,\n            isExpanded,\n            isSelected,\n            isHalfSelected,\n            getNodeProps,\n            level,\n            handleSelect,\n            handleExpand,\n          }) => {\n            return (\n              <div\n                {...getNodeProps({ onClick: handleExpand })}\n                style={{ marginLeft: 40 * (level - 1) }}\n              >\n                {isBranch && <ArrowIcon isOpen={isExpanded} />}\n                <CheckBoxIcon\n                  className="checkbox-icon"\n                  onClick={(e) => {\n                    handleSelect(e);\n                    e.stopPropagation();\n                  }}\n                  variant={\n                    isHalfSelected ? "some" : isSelected ? "all" : "none"\n                  }\n                />\n                <span className="name">{element.name}</span>\n              </div>\n            );\n          }}\n        />\n      </div>\n    </div>\n  );\n}\n\nconst ArrowIcon = ({ isOpen, className }) => {\n  const baseClass = "arrow";\n  const classes = cx(\n    baseClass,\n    { [`${baseClass}--closed`]: !isOpen },\n    { [`${baseClass}--open`]: isOpen },\n    className\n  );\n  return <IoMdArrowDropright className={classes} />;\n};\n\nconst CheckBoxIcon = ({ variant, ...rest }) => {\n  switch (variant) {\n    case "all":\n      return <FaCheckSquare {...rest} />;\n    case "none":\n      return <FaSquare {...rest} />;\n    case "some":\n      return <FaMinusSquare {...rest} />;\n    default:\n      return null;\n  }\n};\n\nexport default SingleSelectCheckbox;\n',x=".checkbox {\n  font-size: 16px;\n  user-select: none;\n  min-height: 320px;\n  padding: 20px;\n  box-sizing: content-box;\n}\n\n.checkbox .tree,\n.checkbox .tree-node,\n.checkbox .tree-node-group {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n.checkbox .tree-branch-wrapper,\n.checkbox .tree-node__leaf {\n  outline: none;\n}\n\n.checkbox .tree-node {\n  cursor: pointer;\n}\n\n.checkbox .tree-node .name:hover {\n  background: rgba(0, 0, 0, 0.1);\n}\n\n.checkbox .tree-node--focused .name {\n  background: rgba(0, 0, 0, 0.2);\n}\n\n.checkbox .tree-node {\n  display: inline-block;\n}\n\n.checkbox .checkbox-icon {\n  margin: 0 5px;\n  vertical-align: middle;\n}\n\n.checkbox button {\n  border: none;\n  background: transparent;\n  cursor: pointer;\n}\n\n.checkbox .arrow {\n  margin-left: 5px;\n  vertical-align: middle;\n}\n\n.checkbox .arrow--open {\n  transform: rotate(90deg);\n}\n",g={title:"Checkbox (single selection)"},S=void 0,f={unversionedId:"examples-SingleSelectCheckbox",id:"examples-SingleSelectCheckbox",title:"Checkbox (single selection)",description:"This example demonstrates how to create single select checkbox tree",source:"@site/docs/examples-SingleSelectCheckbox.mdx",sourceDirName:".",slug:"/examples-SingleSelectCheckbox",permalink:"/react-accessible-treeview/docs/examples-SingleSelectCheckbox",draft:!1,tags:[],version:"current",frontMatter:{title:"Checkbox (single selection)"},sidebar:"docs",previous:{title:"Directory tree (multiple selection)",permalink:"/react-accessible-treeview/docs/examples-MultiSelectDirectoryTree"}},v={},C=[],w={toc:C},E="wrapper";function N(e){let{components:n,...a}=e;return(0,r.kt)(E,(0,t.Z)({},w,a,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"This example demonstrates how to create single select checkbox tree"),(0,r.kt)(s.Z,{component:u,js:b,css:x,mdxType:"CodeTabs"}))}N.isMDXComponent=!0}}]);