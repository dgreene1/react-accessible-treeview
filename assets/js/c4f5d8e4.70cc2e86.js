"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[634],{2406:(e,t,n)=>{n.d(t,{A:()=>d});var a=n(8168),l=n(6540),r=n(1558),c=n(1612),s=n(2777);const m=(0,s.dG)({name:"",children:[{name:"src",children:[{name:"index.js"},{name:"styles.css"}]},{name:"node_modules",children:[{name:"react-accessible-treeview",children:[{name:"index.js"}]},{name:"react",children:[{name:"index.js"}]}]},{name:".npmignore"},{name:"package.json"},{name:"webpack.config.js"}]});const i=e=>{let{isOpen:t}=e;return t?l.createElement(c.oeh,{color:"e8a87c",className:"icon"}):l.createElement(c.K$h,{color:"e8a87c",className:"icon"})},o=e=>{let{filename:t}=e;switch(t.slice(t.lastIndexOf(".")+1)){case"js":return l.createElement(r.xCG,{color:"yellow",className:"icon"});case"css":return l.createElement(r._$g,{color:"turquoise",className:"icon"});case"json":return l.createElement(c.svy,{color:"yellow",className:"icon"});case"npmignore":return l.createElement(r.l$F,{color:"red",className:"icon"});default:return null}},d=function(){return l.createElement("div",null,l.createElement("div",{className:"directory"},l.createElement(s.Ay,{data:m,"aria-label":"directory tree",nodeRenderer:e=>{let{element:t,isBranch:n,isExpanded:r,getNodeProps:c,level:s}=e;return l.createElement("div",(0,a.A)({},c(),{style:{paddingLeft:20*(s-1)}}),n?l.createElement(i,{isOpen:r}):l.createElement(o,{filename:t.name}),t.name)}})))}},8209:(e,t,n)=>{n.d(t,{A:()=>p});var a=n(8168),l=n(6540),r=n(1612),c=n(33),s=n(2777),m=n(6942),i=n.n(m);const o=(0,s.dG)({name:"",children:[{name:"Fruits",children:[{name:"Avocados"},{name:"Bananas"},{name:"Berries"},{name:"Oranges"},{name:"Pears"}]},{name:"Drinks",children:[{name:"Apple Juice"},{name:"Chocolate"},{name:"Coffee"},{name:"Tea",children:[{name:"Black Tea"},{name:"Green Tea"},{name:"Red Tea"},{name:"Matcha"}]}]},{name:"Vegetables",children:[{name:"Beets"},{name:"Carrots"},{name:"Celery"},{name:"Lettuce"},{name:"Onions"}]}]});const d=e=>{let{isOpen:t,className:n}=e;const a="arrow",r=i()(a,{[a+"--closed"]:!t},{[a+"--open"]:t},n);return l.createElement(c.c_e,{className:r})},u=e=>{let{variant:t,...n}=e;switch(t){case"all":return l.createElement(r.Hcz,n);case"none":return l.createElement(r.$qz,n);case"some":return l.createElement(r.tx_,n);default:return null}},p=function(){return l.createElement("div",null,l.createElement("div",{className:"checkbox"},l.createElement(s.Ay,{data:o,"aria-label":"Checkbox tree",multiSelect:!0,propagateSelect:!0,propagateSelectUpwards:!0,togglableSelect:!0,nodeRenderer:e=>{let{element:t,isBranch:n,isExpanded:r,isSelected:c,isHalfSelected:s,getNodeProps:m,level:i,handleSelect:o,handleExpand:p}=e;return l.createElement("div",(0,a.A)({},m({onClick:p}),{style:{marginLeft:40*(i-1)}}),n&&l.createElement(d,{isOpen:r}),l.createElement(u,{className:"checkbox-icon",onClick:e=>{o(e),e.stopPropagation()},variant:s?"some":c?"all":"none"}),l.createElement("span",{className:"name"},t.name))}})))}},2468:(e,t,n)=>{n.r(t),n.d(t,{default:()=>E});var a=n(6540),l=n(6942),r=n.n(l),c=n(9408),s=n(5489),m=n(4586),i=n(6025);const o={heroBanner:"heroBanner_UJJx",buttons:"buttons_pzbO",features:"features_keug",featureImage:"featureImage_yA8i"};var d=n(8209),u=n(2406);const p=[{title:a.createElement(a.Fragment,null,"Features"),component:a.createElement(u.A,null),description:a.createElement(a.Fragment,null,a.createElement("ul",null,a.createElement("li",null,"Single and multiple selection"),a.createElement("li",null,"Disabled nodes"),a.createElement("li",null,"Extensive key bindings")))},{title:a.createElement(a.Fragment,null,"Flexible"),component:a.createElement(d.A,null),description:a.createElement(a.Fragment,null,"Highly customizable through the use of the render prop and prop getter patterns.")}];const E=function(){const e=(0,m.A)(),{siteConfig:t={}}=e,n=(0,i.A)("docs/api");return a.createElement(c.A,{title:"react-accessible-treeview",description:"A React component react component that implements the treeview pattern as described by the WAI-ARIA Authoring Practices."},a.createElement("header",{className:r()("hero hero--primary",o.heroBanner)},a.createElement("div",{className:"container"},a.createElement("h1",{className:"hero__title"},t.title),a.createElement("p",{className:"hero__subtitle"},t.tagline),a.createElement("div",{className:o.buttons},a.createElement(s.A,{className:r()("button button--outline button--secondary button--lg",o.getStarted),to:n},"Get Started")))),a.createElement("main",null,p&&p.length&&a.createElement("section",{className:o.features},a.createElement("div",{className:"container"},a.createElement("div",{className:"row",style:{flexWrap:"nowrap"}},p.map(((e,t)=>{let{component:n,title:l,description:c}=e;return a.createElement("div",{key:t,className:r()("col col--6",o.feature)},a.createElement("h3",null,l),a.createElement("div",null," ",c),n&&a.createElement("div",null,n))})))))))}}}]);