"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[714,774],{10:(e,t,n)=>{n.r(t),n.d(t,{default:()=>Ne});var a=n(6540),l=n(53),o=n(1003),r=n(7559),c=n(2967),i=n(1754),s=n(2252),d=n(6588),m=n(9408),u=n(1312),b=n(3104),p=n(5062);const h={backToTopButton:"backToTopButton_sjWU",backToTopButtonShow:"backToTopButtonShow_xfvO"};function E(){const{shown:e,scrollToTop:t}=function(e){let{threshold:t}=e;const[n,l]=(0,a.useState)(!1),o=(0,a.useRef)(!1),{startScroll:r,cancelScroll:c}=(0,b.gk)();return(0,b.Mq)(((e,n)=>{let{scrollY:a}=e;const r=null==n?void 0:n.scrollY;r&&(o.current?o.current=!1:a>=r?(c(),l(!1)):a<t?l(!1):a+window.innerHeight<document.documentElement.scrollHeight&&l(!0))})),(0,p.$)((e=>{e.location.hash&&(o.current=!0,l(!1))})),{shown:n,scrollToTop:()=>r(0)}}({threshold:300});return a.createElement("button",{"aria-label":(0,u.T)({id:"theme.BackToTopButton.buttonAriaLabel",message:"Scroll back to top",description:"The ARIA label for the back to top button"}),className:(0,l.A)("clean-btn",r.G.common.backToTopButton,h.backToTopButton,e&&h.backToTopButtonShow),type:"button",onClick:t})}var v=n(3109),f=n(6347),g=n(4581),_=n(6342),A=n(3465),C=n(8168);function k(e){return a.createElement("svg",(0,C.A)({width:"20",height:"20","aria-hidden":"true"},e),a.createElement("g",{fill:"#7a7a7a"},a.createElement("path",{d:"M9.992 10.023c0 .2-.062.399-.172.547l-4.996 7.492a.982.982 0 01-.828.454H1c-.55 0-1-.453-1-1 0-.2.059-.403.168-.551l4.629-6.942L.168 3.078A.939.939 0 010 2.528c0-.548.45-.997 1-.997h2.996c.352 0 .649.18.828.45L9.82 9.472c.11.148.172.347.172.55zm0 0"}),a.createElement("path",{d:"M19.98 10.023c0 .2-.058.399-.168.547l-4.996 7.492a.987.987 0 01-.828.454h-3c-.547 0-.996-.453-.996-1 0-.2.059-.403.168-.551l4.625-6.942-4.625-6.945a.939.939 0 01-.168-.55 1 1 0 01.996-.997h3c.348 0 .649.18.828.45l4.996 7.492c.11.148.168.347.168.55zm0 0"})))}const S="collapseSidebarButton_PEFL",N="collapseSidebarButtonIcon_kv0_";function T(e){let{onClick:t}=e;return a.createElement("button",{type:"button",title:(0,u.T)({id:"theme.docs.sidebar.collapseButtonTitle",message:"Collapse sidebar",description:"The title attribute for collapse button of doc sidebar"}),"aria-label":(0,u.T)({id:"theme.docs.sidebar.collapseButtonAriaLabel",message:"Collapse sidebar",description:"The title attribute for collapse button of doc sidebar"}),className:(0,l.A)("button button--secondary button--outline",S),onClick:t},a.createElement(k,{className:N}))}var I=n(5041),x=n(8587),w=n(9532);const y=Symbol("EmptyContext"),B=a.createContext(y);function M(e){let{children:t}=e;const[n,l]=(0,a.useState)(null),o=(0,a.useMemo)((()=>({expandedItem:n,setExpandedItem:l})),[n]);return a.createElement(B.Provider,{value:o},t)}var L=n(1422),P=n(9169),H=n(5489),G=n(2303);const F=["item","onItemClick","activePath","level","index"];function W(e){let{categoryLabel:t,onClick:n}=e;return a.createElement("button",{"aria-label":(0,u.T)({id:"theme.DocSidebarItem.toggleCollapsedCategoryAriaLabel",message:"Toggle the collapsible sidebar category '{label}'",description:"The ARIA label to toggle the collapsible sidebar category"},{label:t}),type:"button",className:"clean-btn menu__caret",onClick:n})}function D(e){let{item:t,onItemClick:n,activePath:o,level:c,index:s}=e,d=(0,x.A)(e,F);const{items:m,label:u,collapsible:b,className:p,href:h}=t,{docs:{sidebar:{autoCollapseCategories:E}}}=(0,_.p)(),v=function(e){const t=(0,G.A)();return(0,a.useMemo)((()=>e.href?e.href:!t&&e.collapsible?(0,i._o)(e):void 0),[e,t])}(t),f=(0,i.w8)(t,o),g=(0,P.ys)(h,o),{collapsed:A,setCollapsed:k}=(0,L.u)({initialState:()=>!!b&&(!f&&t.collapsed)}),{expandedItem:S,setExpandedItem:N}=function(){const e=(0,a.useContext)(B);if(e===y)throw new w.dV("DocSidebarItemsExpandedStateProvider");return e}(),T=function(e){void 0===e&&(e=!A),N(e?null:s),k(e)};return function(e){let{isActive:t,collapsed:n,updateCollapsed:l}=e;const o=(0,w.ZC)(t);(0,a.useEffect)((()=>{t&&!o&&n&&l(!1)}),[t,o,n,l])}({isActive:f,collapsed:A,updateCollapsed:T}),(0,a.useEffect)((()=>{b&&null!=S&&S!==s&&E&&k(!0)}),[b,S,s,k,E]),a.createElement("li",{className:(0,l.A)(r.G.docs.docSidebarItemCategory,r.G.docs.docSidebarItemCategoryLevel(c),"menu__list-item",{"menu__list-item--collapsed":A},p)},a.createElement("div",{className:(0,l.A)("menu__list-item-collapsible",{"menu__list-item-collapsible--active":g})},a.createElement(H.A,(0,C.A)({className:(0,l.A)("menu__link",{"menu__link--sublist":b,"menu__link--sublist-caret":!h&&b,"menu__link--active":f}),onClick:b?e=>{null==n||n(t),h?T(!1):(e.preventDefault(),T())}:()=>{null==n||n(t)},"aria-current":g?"page":void 0,"aria-expanded":b?!A:void 0,href:b?null!=v?v:"#":v},d),u),h&&b&&a.createElement(W,{categoryLabel:u,onClick:e=>{e.preventDefault(),T()}})),a.createElement(L.N,{lazy:!0,as:"ul",className:"menu__list",collapsed:A},a.createElement($,{items:m,tabIndex:A?-1:0,onItemClick:n,activePath:o,level:c+1})))}var V=n(6654),U=n(3186);const z="menuExternalLink_NmtK",R=["item","onItemClick","activePath","level","index"];function j(e){let{item:t,onItemClick:n,activePath:o,level:c}=e,s=(0,x.A)(e,R);const{href:d,label:m,className:u,autoAddBaseUrl:b}=t,p=(0,i.w8)(t,o),h=(0,V.A)(d);return a.createElement("li",{className:(0,l.A)(r.G.docs.docSidebarItemLink,r.G.docs.docSidebarItemLinkLevel(c),"menu__list-item",u),key:m},a.createElement(H.A,(0,C.A)({className:(0,l.A)("menu__link",!h&&z,{"menu__link--active":p}),autoAddBaseUrl:b,"aria-current":p?"page":void 0,to:d},h&&{onClick:n?()=>n(t):void 0},s),m,!h&&a.createElement(U.A,null)))}const K="menuHtmlItem_M9Kj";function q(e){let{item:t,level:n,index:o}=e;const{value:c,defaultStyle:i,className:s}=t;return a.createElement("li",{className:(0,l.A)(r.G.docs.docSidebarItemLink,r.G.docs.docSidebarItemLinkLevel(n),i&&[K,"menu__list-item"],s),key:o,dangerouslySetInnerHTML:{__html:c}})}const O=["item"];function X(e){let{item:t}=e,n=(0,x.A)(e,O);switch(t.type){case"category":return a.createElement(D,(0,C.A)({item:t},n));case"html":return a.createElement(q,(0,C.A)({item:t},n));default:return a.createElement(j,(0,C.A)({item:t},n))}}const Y=["items"];function Z(e){let{items:t}=e,n=(0,x.A)(e,Y);return a.createElement(M,null,t.map(((e,t)=>a.createElement(X,(0,C.A)({key:t,item:e,index:t},n)))))}const $=(0,a.memo)(Z),J="menu_SIkG",Q="menuWithAnnouncementBar_GW3s";function ee(e){let{path:t,sidebar:n,className:o}=e;const c=function(){const{isActive:e}=(0,I.Mj)(),[t,n]=(0,a.useState)(e);return(0,b.Mq)((t=>{let{scrollY:a}=t;e&&n(0===a)}),[e]),e&&t}();return a.createElement("nav",{"aria-label":(0,u.T)({id:"theme.docs.sidebar.navAriaLabel",message:"Docs sidebar",description:"The ARIA label for the sidebar navigation"}),className:(0,l.A)("menu thin-scrollbar",J,c&&Q,o)},a.createElement("ul",{className:(0,l.A)(r.G.docs.docSidebarMenu,"menu__list")},a.createElement($,{items:n,activePath:t,level:1})))}const te="sidebar_njMd",ne="sidebarWithHideableNavbar_wUlq",ae="sidebarHidden_VK0M",le="sidebarLogo_isFc";function oe(e){let{path:t,sidebar:n,onCollapse:o,isHidden:r}=e;const{navbar:{hideOnScroll:c},docs:{sidebar:{hideable:i}}}=(0,_.p)();return a.createElement("div",{className:(0,l.A)(te,c&&ne,r&&ae)},c&&a.createElement(A.A,{tabIndex:-1,className:le}),a.createElement(ee,{path:t,sidebar:n}),i&&a.createElement(T,{onClick:o}))}const re=a.memo(oe);var ce=n(5600),ie=n(9876);const se=e=>{let{sidebar:t,path:n}=e;const o=(0,ie.M)();return a.createElement("ul",{className:(0,l.A)(r.G.docs.docSidebarMenu,"menu__list")},a.createElement($,{items:t,activePath:n,onItemClick:e=>{"category"===e.type&&e.href&&o.toggle(),"link"===e.type&&o.toggle()},level:1}))};function de(e){return a.createElement(ce.GX,{component:se,props:e})}const me=a.memo(de);function ue(e){const t=(0,g.l)(),n="desktop"===t||"ssr"===t,l="mobile"===t;return a.createElement(a.Fragment,null,n&&a.createElement(re,e),l&&a.createElement(me,e))}const be={expandButton:"expandButton_m80_",expandButtonIcon:"expandButtonIcon_BlDH"};function pe(e){let{toggleSidebar:t}=e;return a.createElement("div",{className:be.expandButton,title:(0,u.T)({id:"theme.docs.sidebar.expandButtonTitle",message:"Expand sidebar",description:"The ARIA label and title attribute for expand button of doc sidebar"}),"aria-label":(0,u.T)({id:"theme.docs.sidebar.expandButtonAriaLabel",message:"Expand sidebar",description:"The ARIA label and title attribute for expand button of doc sidebar"}),tabIndex:0,role:"button",onKeyDown:t,onClick:t},a.createElement(k,{className:be.expandButtonIcon}))}const he={docSidebarContainer:"docSidebarContainer_b6E3",docSidebarContainerHidden:"docSidebarContainerHidden_b3ry",sidebarViewport:"sidebarViewport_Xe31"};function Ee(e){var t;let{children:n}=e;const l=(0,d.t)();return a.createElement(a.Fragment,{key:null!=(t=null==l?void 0:l.name)?t:"noSidebar"},n)}function ve(e){let{sidebar:t,hiddenSidebarContainer:n,setHiddenSidebarContainer:o}=e;const{pathname:c}=(0,f.zy)(),[i,s]=(0,a.useState)(!1),d=(0,a.useCallback)((()=>{i&&s(!1),!i&&(0,v.O)()&&s(!0),o((e=>!e))}),[o,i]);return a.createElement("aside",{className:(0,l.A)(r.G.docs.docSidebarContainer,he.docSidebarContainer,n&&he.docSidebarContainerHidden),onTransitionEnd:e=>{e.currentTarget.classList.contains(he.docSidebarContainer)&&n&&s(!0)}},a.createElement(Ee,null,a.createElement("div",{className:(0,l.A)(he.sidebarViewport,i&&he.sidebarViewportHidden)},a.createElement(ue,{sidebar:t,path:c,onCollapse:d,isHidden:i}),i&&a.createElement(pe,{toggleSidebar:d}))))}const fe={docMainContainer:"docMainContainer_gTbr",docMainContainerEnhanced:"docMainContainerEnhanced_Uz_u",docItemWrapperEnhanced:"docItemWrapperEnhanced_czyv"};function ge(e){let{hiddenSidebarContainer:t,children:n}=e;const o=(0,d.t)();return a.createElement("main",{className:(0,l.A)(fe.docMainContainer,(t||!o)&&fe.docMainContainerEnhanced)},a.createElement("div",{className:(0,l.A)("container padding-top--md padding-bottom--lg",fe.docItemWrapper,t&&fe.docItemWrapperEnhanced)},n))}const _e={docPage:"docPage__5DB",docsWrapper:"docsWrapper_BCFX","themedComponent--light":"themedComponent--light_NU7w"};function Ae(e){let{children:t}=e;const n=(0,d.t)(),[l,o]=(0,a.useState)(!1);return a.createElement(m.A,{wrapperClassName:_e.docsWrapper},a.createElement(E,null),a.createElement("div",{className:_e.docPage},n&&a.createElement(ve,{sidebar:n.items,hiddenSidebarContainer:l,setHiddenSidebarContainer:o}),a.createElement(ge,{hiddenSidebarContainer:l},t)))}var Ce=n(1774),ke=n(1463);function Se(e){const{versionMetadata:t}=e;return a.createElement(a.Fragment,null,a.createElement(ke.A,{version:t.version,tag:(0,c.tU)(t.pluginId,t.version)}),a.createElement(o.be,null,t.noIndex&&a.createElement("meta",{name:"robots",content:"noindex, nofollow"})))}function Ne(e){const{versionMetadata:t}=e,n=(0,i.mz)(e);if(!n)return a.createElement(Ce.default,null);const{docElement:c,sidebarName:m,sidebarItems:u}=n;return a.createElement(a.Fragment,null,a.createElement(Se,e),a.createElement(o.e3,{className:(0,l.A)(r.G.wrapper.docsPages,r.G.page.docsDocPage,e.versionMetadata.className)},a.createElement(s.n,{version:t},a.createElement(d.V,{name:m,items:u},a.createElement(Ae,null,c)))))}},1774:(e,t,n)=>{n.r(t),n.d(t,{default:()=>c});var a=n(6540),l=n(1312),o=n(1003),r=n(9408);function c(){return a.createElement(a.Fragment,null,a.createElement(o.be,{title:(0,l.T)({id:"theme.NotFound.title",message:"Page Not Found"})}),a.createElement(r.A,null,a.createElement("main",{className:"container margin-vert--xl"},a.createElement("div",{className:"row"},a.createElement("div",{className:"col col--6 col--offset-3"},a.createElement("h1",{className:"hero__title"},a.createElement(l.A,{id:"theme.NotFound.title",description:"The title of the 404 page"},"Page Not Found")),a.createElement("p",null,a.createElement(l.A,{id:"theme.NotFound.p1",description:"The first paragraph of the 404 page"},"We could not find what you were looking for.")),a.createElement("p",null,a.createElement(l.A,{id:"theme.NotFound.p2",description:"The 2nd paragraph of the 404 page"},"Please contact the owner of the site that linked you to the original URL and let them know their link is broken.")))))))}},2252:(e,t,n)=>{n.d(t,{n:()=>r,r:()=>c});var a=n(6540),l=n(9532);const o=a.createContext(null);function r(e){let{children:t,version:n}=e;return a.createElement(o.Provider,{value:n},t)}function c(){const e=(0,a.useContext)(o);if(null===e)throw new l.dV("DocsVersionProvider");return e}}}]);