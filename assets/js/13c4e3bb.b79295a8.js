"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[320],{5532:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>b,contentTitle:()=>f,default:()=>E,frontMatter:()=>C,metadata:()=>y,toc:()=>N});var a=t(7462),l=t(7294),r=t(3905),s=t(2805),i=t(9583),d=t(1649),o=t(8193),c=t(148),m=t(4184),h=t.n(m);const p=[{name:"",id:0,children:[1,2,3],parent:null},{name:"Fruits",children:[],id:1,parent:0,isBranch:!0},{name:"Drinks",children:[4,5],id:2,parent:0,isBranch:!0},{name:"Vegetables",children:[],id:3,parent:0,isBranch:!0},{name:"Pine colada",children:[],id:4,parent:2},{name:"Water",children:[],id:5,parent:2}];const u=e=>{let{isOpen:n,className:t}=e;const a="arrow",r=h()(a,{[a+"--closed"]:!n},{[a+"--open"]:n},t);return l.createElement(d.am,{className:r})},S=e=>{let{variant:n,...t}=e;switch(n){case"all":return l.createElement(i.xik,t);case"none":return l.createElement(i.u9M,t);case"some":return l.createElement(i.kty,t);default:return null}},g=function(){const e=(0,l.useRef)(null),[n,t]=(0,l.useState)(p),[r,s]=(0,l.useState)([]),[i,d]=(0,l.useState)([]),[m,h]=(0,l.useState)(!1),[g,v]=(0,l.useState)(!1),[x,C]=(0,l.useState)([]);return l.createElement(l.Fragment,null,l.createElement("div",null,l.createElement("div",{className:"visually-hidden",ref:e,role:"alert","aria-live":"polite"}),l.createElement("button",{onClick:()=>h(!m)},"Select next loaded children - [",JSON.stringify(m),"]"),l.createElement("button",{onClick:()=>v(!g),style:{marginLeft:"16px"}},"Preserve current selection - [",JSON.stringify(g),"]"),l.createElement("div",{className:"checkbox"},l.createElement(c.ZP,{data:n,"aria-label":"Checkbox tree",onLoadData:async a=>{const l=0===a.element.children.length,o=r.find((e=>e.id===a.element.id));if(await(e=>{let{element:a}=e;return new Promise((e=>{a.children.length>0?e():setTimeout((()=>{t((e=>{return n=e,t=a.id,l=[{name:"Child Node "+e.length,children:[],id:e.length,parent:a.id,isBranch:!0},{name:"Another child Node",children:[],id:e.length+1,parent:a.id}],n.map((e=>(e.id===t&&(e.children=l.map((e=>e.id))),e))).concat(l);var n,t,l})),m&&d(g?[...new Set([...x,...i]),n.length,n.length+1]:[n.length,n.length+1]),e()}),1e3)}))})(a),l&&!o){const n=e.current;s([...r,a.element]),n&&(n.innerHTML=a.element.name+" loaded"),setTimeout((()=>{n&&(n.innerHTML="")}),5e3)}},onNodeSelect:e=>{let{element:n,isSelected:t}=e;t&&C([...x,n.id]),!t&&C(x.filter((e=>e===n.id)))},selectedIds:i,multiSelect:!0,propagateSelect:!0,togglableSelect:!0,propagateSelectUpwards:!0,nodeRenderer:e=>{let{element:n,isBranch:t,isExpanded:r,isSelected:s,isHalfSelected:i,getNodeProps:d,level:c,handleSelect:m,handleExpand:h}=e;return l.createElement("div",(0,a.Z)({},d({onClick:h}),{style:{marginLeft:40*(c-1)}}),t&&((e,n)=>e&&0===n.children.length?l.createElement(l.Fragment,null,l.createElement("span",{role:"alert","aria-live":"assertive",className:"visually-hidden"},"loading ",n.name),l.createElement(o.xz6,{"aria-hidden":!0,className:"loading-icon"})):l.createElement(u,{isOpen:e}))(r,n),l.createElement(S,{className:"checkbox-icon",onClick:e=>{!r&&h(e),m(e),e.stopPropagation()},variant:i?"some":s?"all":"none"}),l.createElement("span",{className:"name"},n.name,"-",n.id))}}))))},v='import React, { useRef, useState } from "react";\nimport { FaSquare, FaCheckSquare, FaMinusSquare } from "react-icons/fa";\nimport { IoMdArrowDropright } from "react-icons/io";\nimport { AiOutlineLoading } from "react-icons/ai";\nimport TreeView from "react-accessible-treeview";\nimport cx from "classnames";\nimport "./styles.css";\n\nconst initialData = [\n  {\n    name: "",\n    id: 0,\n    children: [1, 2, 3],\n    parent: null,\n  },\n  {\n    name: "Fruits",\n    children: [],\n    id: 1,\n    parent: 0,\n    isBranch: true,\n  },\n  {\n    name: "Drinks",\n    children: [4, 5],\n    id: 2,\n    parent: 0,\n    isBranch: true,\n  },\n  {\n    name: "Vegetables",\n    children: [],\n    id: 3,\n    parent: 0,\n    isBranch: true,\n  },\n  {\n    name: "Pine colada",\n    children: [],\n    id: 4,\n    parent: 2,\n  },\n  {\n    name: "Water",\n    children: [],\n    id: 5,\n    parent: 2,\n  },\n];\n\nfunction MultiSelectCheckboxAsyncControlled() {\n  const loadedAlertElement = useRef(null);\n  const [data, setData] = useState(initialData);\n  const [nodesAlreadyLoaded, setNodesAlreadyLoaded] = useState([]);\n  const [selectedIds, setSelectedIds] = useState([]);\n  const [selectChildren, setSelectChildren] = useState(false);\n  const [preserveSelection, setPreserveSelection] = useState(false);\n  const [manuallySelectedNodes, setManuallySelectiedNodes] = useState([]);\n\n  const updateTreeData = (list, id, children) => {\n    const data = list.map((node) => {\n      if (node.id === id) {\n        node.children = children.map((el) => {\n          return el.id;\n        });\n      }\n      return node;\n    });\n    return data.concat(children);\n  };\n\n  const onLoadData = ({ element }) => {\n    return new Promise((resolve) => {\n      if (element.children.length > 0) {\n        resolve();\n        return;\n      }\n      setTimeout(() => {\n        setData((value) =>\n          updateTreeData(value, element.id, [\n            {\n              name: `Child Node ${value.length}`,\n              children: [],\n              id: value.length,\n              parent: element.id,\n              isBranch: true,\n            },\n            {\n              name: "Another child Node",\n              children: [],\n              id: value.length + 1,\n              parent: element.id,\n            },\n          ])\n        );\n        if (selectChildren) {\n          preserveSelection\n            ? setSelectedIds([\n                ...new Set([...manuallySelectedNodes, ...selectedIds]),\n                data.length,\n                data.length + 1,\n              ])\n            : setSelectedIds([data.length, data.length + 1]);\n        }\n        resolve();\n      }, 1000);\n    });\n  };\n\n  const wrappedOnLoadData = async (props) => {\n    const nodeHasNoChildData = props.element.children.length === 0;\n    const nodeHasAlreadyBeenLoaded = nodesAlreadyLoaded.find(\n      (e) => e.id === props.element.id\n    );\n\n    await onLoadData(props);\n\n    if (nodeHasNoChildData && !nodeHasAlreadyBeenLoaded) {\n      const el = loadedAlertElement.current;\n      setNodesAlreadyLoaded([...nodesAlreadyLoaded, props.element]);\n      el && (el.innerHTML = `${props.element.name} loaded`);\n\n      // Clearing aria-live region so loaded node alerts no longer appear in DOM\n      setTimeout(() => {\n        el && (el.innerHTML = "");\n      }, 5000);\n    }\n  };\n\n  const handleNodeSelect = ({ element, isSelected }) => {\n    isSelected &&\n      setManuallySelectiedNodes([...manuallySelectedNodes, element.id]);\n    !isSelected &&\n      setManuallySelectiedNodes(\n        manuallySelectedNodes.filter((id) => id === element.id)\n      );\n  };\n\n  return (\n    <>\n      <div>\n        <div\n          className="visually-hidden"\n          ref={loadedAlertElement}\n          role="alert"\n          aria-live="polite"\n        ></div>\n        <button onClick={() => setSelectChildren(!selectChildren)}>\n          Select next loaded children - [{JSON.stringify(selectChildren)}]\n        </button>\n        <button\n          onClick={() => setPreserveSelection(!preserveSelection)}\n          style={{ marginLeft: "16px" }}\n        >\n          Preserve current selection - [{JSON.stringify(preserveSelection)}]\n        </button>\n        <div className="checkbox">\n          <TreeView\n            data={data}\n            aria-label="Checkbox tree"\n            onLoadData={wrappedOnLoadData}\n            onNodeSelect={handleNodeSelect}\n            selectedIds={selectedIds}\n            multiSelect\n            propagateSelect\n            togglableSelect\n            propagateSelectUpwards\n            nodeRenderer={({\n              element,\n              isBranch,\n              isExpanded,\n              isSelected,\n              isHalfSelected,\n              getNodeProps,\n              level,\n              handleSelect,\n              handleExpand,\n            }) => {\n              const branchNode = (isExpanded, element) => {\n                return isExpanded && element.children.length === 0 ? (\n                  <>\n                    <span\n                      role="alert"\n                      aria-live="assertive"\n                      className="visually-hidden"\n                    >\n                      loading {element.name}\n                    </span>\n                    <AiOutlineLoading\n                      aria-hidden={true}\n                      className="loading-icon"\n                    />\n                  </>\n                ) : (\n                  <ArrowIcon isOpen={isExpanded} />\n                );\n              };\n              return (\n                <div\n                  {...getNodeProps({ onClick: handleExpand })}\n                  style={{ marginLeft: 40 * (level - 1) }}\n                >\n                  {isBranch && branchNode(isExpanded, element)}\n                  <CheckBoxIcon\n                    className="checkbox-icon"\n                    onClick={(e) => {\n                      !isExpanded && handleExpand(e);                      \n                      handleSelect(e);\n                      e.stopPropagation();\n                    }}\n                    variant={\n                      isHalfSelected ? "some" : isSelected ? "all" : "none"\n                    }\n                  />\n                  <span className="name">\n                    {element.name}-{element.id}\n                  </span>\n                </div>\n              );\n            }}\n          />\n        </div>\n      </div>\n    </>\n  );\n}\n\nconst ArrowIcon = ({ isOpen, className }) => {\n  const baseClass = "arrow";\n  const classes = cx(\n    baseClass,\n    { [`${baseClass}--closed`]: !isOpen },\n    { [`${baseClass}--open`]: isOpen },\n    className\n  );\n  return <IoMdArrowDropright className={classes} />;\n};\n\nconst CheckBoxIcon = ({ variant, ...rest }) => {\n  switch (variant) {\n    case "all":\n      return <FaCheckSquare {...rest} />;\n    case "none":\n      return <FaSquare {...rest} />;\n    case "some":\n      return <FaMinusSquare {...rest} />;\n    default:\n      return null;\n  }\n};\n\nexport default MultiSelectCheckboxAsyncControlled;\n',x="@keyframes spinner {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n\n.loading-icon {\n  animation: spinner 1.5s linear infinite;\n  margin-left: 5px;\n}\n\n.visually-hidden {\n  position: absolute;\n  clip-path: circle(0);\n  border: 0;\n  height: 1px;\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  width: 1px;\n  white-space: nowrap;\n}\n",C={title:"Asynchronous loading with Controlled selection"},f=void 0,y={unversionedId:"examples-MultiSelectCheckboxAsyncControlled",id:"examples-MultiSelectCheckboxAsyncControlled",title:"Asynchronous loading with Controlled selection",description:"This example demonstrates how to create a checkbox tree with asynchronous loading and controlled selection",source:"@site/docs/examples-MultiSelectCheckboxAsyncControlled.mdx",sourceDirName:".",slug:"/examples-MultiSelectCheckboxAsyncControlled",permalink:"/react-accessible-treeview/docs/examples-MultiSelectCheckboxAsyncControlled",draft:!1,tags:[],version:"current",frontMatter:{title:"Asynchronous loading with Controlled selection"},sidebar:"docs",previous:{title:"Asynchronous loading",permalink:"/react-accessible-treeview/docs/examples-MultiSelectCheckboxAsync"},next:{title:"Checkbox with controlled selectedIds",permalink:"/react-accessible-treeview/docs/examples-MultiSelectCheckboxControlled"}},b={},N=[],k={toc:N},w="wrapper";function E(e){let{components:n,...t}=e;return(0,r.kt)(w,(0,a.Z)({},k,t,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"This example demonstrates how to create a checkbox tree with asynchronous loading and controlled selection"),(0,r.kt)(s.Z,{component:g,js:v,css:x,mdxType:"CodeTabs"}))}E.isMDXComponent=!0}}]);