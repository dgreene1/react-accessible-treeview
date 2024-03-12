"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[566],{9128:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>y,contentTitle:()=>b,default:()=>S,frontMatter:()=>h,metadata:()=>x,toc:()=>v});var i=t(8168),r=t(6540),c=t(5680),a=t(6652),l=t(1558),s=t(1612),o=t(2777);const d=(0,o.dG)({name:"",children:[{name:"src",children:[{name:"index.js"},{name:"styles.css"}]},{name:"node_modules",children:[{name:"react-accessible-treeview",children:[{name:"index.js"}]},{name:"react",children:[{name:"index.js"}]}]},{name:".npmignore"},{name:"package.json"},{name:"webpack.config.js"}]});const m=e=>{let{isOpen:n}=e;return n?r.createElement(s.oeh,{color:"e8a87c",className:"icon"}):r.createElement(s.K$h,{color:"e8a87c",className:"icon"})},p=e=>{let{filename:n}=e;switch(n.slice(n.lastIndexOf(".")+1)){case"js":return r.createElement(l.xCG,{color:"yellow",className:"icon"});case"css":return r.createElement(l._$g,{color:"turquoise",className:"icon"});case"json":return r.createElement(s.svy,{color:"yellow",className:"icon"});case"npmignore":return r.createElement(l.l$F,{color:"red",className:"icon"});default:return null}},u=function(){return r.createElement("div",null,r.createElement("div",{className:"ide"},r.createElement(o.Ay,{data:d,"aria-label":"directory tree",togglableSelect:!0,clickAction:"EXCLUSIVE_SELECT",multiSelect:!0,nodeRenderer:e=>{let{element:n,isBranch:t,isExpanded:c,getNodeProps:a,level:l,handleSelect:s}=e;return r.createElement("div",(0,i.A)({},a(),{style:{paddingLeft:20*(l-1)}}),t?r.createElement(m,{isOpen:c}):r.createElement(p,{filename:n.name}),n.name)}})))},g='import React from "react";\nimport { DiCss3, DiJavascript, DiNpm } from "react-icons/di";\nimport { FaList, FaRegFolder, FaRegFolderOpen } from "react-icons/fa";\nimport TreeView, { flattenTree } from "react-accessible-treeview";\nimport "./styles.css";\n\nconst folder = {\n  name: "",\n  children: [\n    {\n      name: "src",\n      children: [{ name: "index.js" }, { name: "styles.css" }],\n    },\n    {\n      name: "node_modules",\n      children: [\n        {\n          name: "react-accessible-treeview",\n          children: [{ name: "index.js" }],\n        },\n        { name: "react", children: [{ name: "index.js" }] },\n      ],\n    },\n    {\n      name: ".npmignore",\n    },\n    {\n      name: "package.json",\n    },\n    {\n      name: "webpack.config.js",\n    },\n  ],\n};\n\nconst data = flattenTree(folder);\nfunction MultiSelectDirectoryTreeView() {\n  return (\n    <div>\n      <div className="ide">\n        <TreeView\n          data={data}\n          aria-label="directory tree"\n          togglableSelect\n          clickAction="EXCLUSIVE_SELECT"\n          multiSelect\n          nodeRenderer={({\n            element,\n            isBranch,\n            isExpanded,\n            getNodeProps,\n            level,\n            handleSelect,\n          }) => (\n            <div {...getNodeProps()} style={{ paddingLeft: 20 * (level - 1) }}>\n              {isBranch ? (\n                <FolderIcon isOpen={isExpanded} />\n              ) : (\n                <FileIcon filename={element.name} />\n              )}\n              {element.name}\n            </div>\n          )}\n        />\n      </div>\n    </div>\n  );\n}\n\nconst FolderIcon = ({ isOpen }) =>\n  isOpen ? (\n    <FaRegFolderOpen color="e8a87c" className="icon" />\n  ) : (\n    <FaRegFolder color="e8a87c" className="icon" />\n  );\n\nconst FileIcon = ({ filename }) => {\n  const extension = filename.slice(filename.lastIndexOf(".") + 1);\n  switch (extension) {\n    case "js":\n      return <DiJavascript color="yellow" className="icon" />;\n    case "css":\n      return <DiCss3 color="turquoise" className="icon" />;\n    case "json":\n      return <FaList color="yellow" className="icon" />;\n    case "npmignore":\n      return <DiNpm color="red" className="icon" />;\n    default:\n      return null;\n  }\n};\nexport default MultiSelectDirectoryTreeView;\n',f=".ide {\n  background: #242322;\n  font-family: monospace;\n  font-size: 16px;\n  color: white;\n  user-select: none;\n  padding: 20px;\n  border-radius: 0.4em;\n}\n\n.ide .tree,\n.ide .tree-node,\n.ide .tree-node-group {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n.ide .tree-branch-wrapper,\n.ide .tree-node__leaf {\n  outline: none;\n  outline: none;\n}\n\n.ide .tree-node {\n  cursor: pointer;\n}\n\n.ide .tree-node:hover {\n  background: rgba(255, 255, 255, 0.1);\n}\n\n.ide .tree .tree-node--focused {\n  background: rgba(255, 255, 255, 0.2);\n}\n\n.ide .tree .tree-node--selected {\n  background: rgba(48, 107, 176);\n}\n\n.ide .tree-node__branch {\n  display: block;\n}\n\n.ide .icon {\n  vertical-align: middle;\n  margin-right: 5px;\n}\n",h={title:"Directory tree (multiple selection)"},b=void 0,x={unversionedId:"examples-MultiSelectDirectoryTree",id:"examples-MultiSelectDirectoryTree",title:"Directory tree (multiple selection)",description:"This example combines multiselect and an exclusive select onClick. It supports multiselect using various commands, such as Ctrl+click Shift+Click, Enter/Space and Shift + Up/Down.",source:"@site/docs/examples-MultiSelectDirectoryTree.md",sourceDirName:".",slug:"/examples-MultiSelectDirectoryTree",permalink:"/react-accessible-treeview/docs/examples-MultiSelectDirectoryTree",draft:!1,tags:[],version:"current",frontMatter:{title:"Directory tree (multiple selection)"},sidebar:"docs",previous:{title:"Checkbox with disabled nodes",permalink:"/react-accessible-treeview/docs/examples-MultiSelectCheckboxDisabled"},next:{title:"Checkbox (single selection)",permalink:"/react-accessible-treeview/docs/examples-SingleSelectCheckbox"}},y={},v=[],k={toc:v},w="wrapper";function S(e){let{components:n,...t}=e;return(0,c.yg)(w,(0,i.A)({},k,t,{components:n,mdxType:"MDXLayout"}),(0,c.yg)("p",null,"This example combines multiselect and an exclusive select onClick. It supports multiselect using various commands, such as ",(0,c.yg)("inlineCode",{parentName:"p"},"Ctrl+click")," ",(0,c.yg)("inlineCode",{parentName:"p"},"Shift+Click"),", ",(0,c.yg)("inlineCode",{parentName:"p"},"Enter/Space")," and ",(0,c.yg)("inlineCode",{parentName:"p"},"Shift + Up/Down"),"."),(0,c.yg)(a.A,{component:u,js:g,css:f,mdxType:"CodeTabs"}))}S.isMDXComponent=!0}}]);