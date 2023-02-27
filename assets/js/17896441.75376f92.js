"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[918],{2839:function(e,t,a){a.r(t),a.d(t,{default:function(){return Ie}});var n=a(7294),l=a(1944),r=a(9688),i=n.createContext(null);function o(e){var t=e.children,a=function(e){return(0,n.useMemo)((function(){return{metadata:e.metadata,frontMatter:e.frontMatter,assets:e.assets,contentTitle:e.contentTitle,toc:e.toc}}),[e])}(e.content);return n.createElement(i.Provider,{value:a},t)}function c(){var e=(0,n.useContext)(i);if(null===e)throw new r.i6("DocProvider");return e}function s(){var e,t=c(),a=t.metadata,r=t.frontMatter,i=t.assets;return n.createElement(l.d,{title:a.title,description:a.description,keywords:r.keywords,image:null!=(e=i.image)?e:r.image})}var d=a(6010),m=a(7524),u=a(7462),v=a(5999),b=a(9960);function p(e){var t=e.permalink,a=e.title,l=e.subLabel,r=e.isNext;return n.createElement(b.Z,{className:(0,d.Z)("pagination-nav__link",r?"pagination-nav__link--next":"pagination-nav__link--prev"),to:t},l&&n.createElement("div",{className:"pagination-nav__sublabel"},l),n.createElement("div",{className:"pagination-nav__label"},a))}function f(e){var t=e.previous,a=e.next;return n.createElement("nav",{className:"pagination-nav docusaurus-mt-lg","aria-label":(0,v.I)({id:"theme.docs.paginator.navAriaLabel",message:"Docs pages navigation",description:"The ARIA label for the docs pagination"})},t&&n.createElement(p,(0,u.Z)({},t,{subLabel:n.createElement(v.Z,{id:"theme.docs.paginator.previous",description:"The label used to navigate to the previous doc"},"Previous")})),a&&n.createElement(p,(0,u.Z)({},a,{subLabel:n.createElement(v.Z,{id:"theme.docs.paginator.next",description:"The label used to navigate to the next doc"},"Next"),isNext:!0})))}function h(){var e=c().metadata;return n.createElement(f,{previous:e.previous,next:e.next})}var g=a(2263),E=a(143),L=a(5281),N=a(373),C=a(4477);var _={unreleased:function(e){var t=e.siteTitle,a=e.versionMetadata;return n.createElement(v.Z,{id:"theme.docs.versions.unreleasedVersionLabel",description:"The label used to tell the user that he's browsing an unreleased doc version",values:{siteTitle:t,versionLabel:n.createElement("b",null,a.label)}},"This is unreleased documentation for {siteTitle} {versionLabel} version.")},unmaintained:function(e){var t=e.siteTitle,a=e.versionMetadata;return n.createElement(v.Z,{id:"theme.docs.versions.unmaintainedVersionLabel",description:"The label used to tell the user that he's browsing an unmaintained doc version",values:{siteTitle:t,versionLabel:n.createElement("b",null,a.label)}},"This is documentation for {siteTitle} {versionLabel}, which is no longer actively maintained.")}};function k(e){var t=_[e.versionMetadata.banner];return n.createElement(t,e)}function Z(e){var t=e.versionLabel,a=e.to,l=e.onClick;return n.createElement(v.Z,{id:"theme.docs.versions.latestVersionSuggestionLabel",description:"The label used to tell the user to check the latest version",values:{versionLabel:t,latestVersionLink:n.createElement("b",null,n.createElement(b.Z,{to:a,onClick:l},n.createElement(v.Z,{id:"theme.docs.versions.latestVersionLinkLabel",description:"The label used for the latest version suggestion link label"},"latest version")))}},"For up-to-date documentation, see the {latestVersionLink} ({versionLabel}).")}function x(e){var t,a=e.className,l=e.versionMetadata,r=(0,g.Z)().siteConfig.title,i=(0,E.gA)({failfast:!0}).pluginId,o=(0,N.J)(i).savePreferredVersionName,c=(0,E.Jo)(i),s=c.latestDocSuggestion,m=c.latestVersionSuggestion,u=null!=s?s:(t=m).docs.find((function(e){return e.id===t.mainDocId}));return n.createElement("div",{className:(0,d.Z)(a,L.k.docs.docVersionBanner,"alert alert--warning margin-bottom--md"),role:"alert"},n.createElement("div",null,n.createElement(k,{siteTitle:r,versionMetadata:l})),n.createElement("div",{className:"margin-top--md"},n.createElement(Z,{versionLabel:m.label,to:u.path,onClick:function(){return o(m.name)}})))}function T(e){var t=e.className,a=(0,C.E)();return a.banner?n.createElement(x,{className:t,versionMetadata:a}):null}function H(e){var t=e.className,a=(0,C.E)();return a.badge?n.createElement("span",{className:(0,d.Z)(t,L.k.docs.docVersionBadge,"badge badge--secondary")},n.createElement(v.Z,{id:"theme.docs.versionBadge.label",values:{versionLabel:a.label}},"Version: {versionLabel}")):null}function U(e){var t=e.lastUpdatedAt,a=e.formattedLastUpdatedAt;return n.createElement(v.Z,{id:"theme.lastUpdated.atDate",description:"The words used to describe on which date a page has been last updated",values:{date:n.createElement("b",null,n.createElement("time",{dateTime:new Date(1e3*t).toISOString()},a))}}," on {date}")}function w(e){var t=e.lastUpdatedBy;return n.createElement(v.Z,{id:"theme.lastUpdated.byUser",description:"The words used to describe by who the page has been last updated",values:{user:n.createElement("b",null,t)}}," by {user}")}function y(e){var t=e.lastUpdatedAt,a=e.formattedLastUpdatedAt,l=e.lastUpdatedBy;return n.createElement("span",{className:L.k.common.lastUpdated},n.createElement(v.Z,{id:"theme.lastUpdated.lastUpdatedAtBy",description:"The sentence used to display when a page has been last updated, and by who",values:{atDate:t&&a?n.createElement(U,{lastUpdatedAt:t,formattedLastUpdatedAt:a}):"",byUser:l?n.createElement(w,{lastUpdatedBy:l}):""}},"Last updated{atDate}{byUser}"),!1)}var A=a(3366),M={iconEdit:"iconEdit_Z9Sw"},I=["className"];function B(e){var t=e.className,a=(0,A.Z)(e,I);return n.createElement("svg",(0,u.Z)({fill:"currentColor",height:"20",width:"20",viewBox:"0 0 40 40",className:(0,d.Z)(M.iconEdit,t),"aria-hidden":"true"},a),n.createElement("g",null,n.createElement("path",{d:"m34.5 11.7l-3 3.1-6.3-6.3 3.1-3q0.5-0.5 1.2-0.5t1.1 0.5l3.9 3.9q0.5 0.4 0.5 1.1t-0.5 1.2z m-29.5 17.1l18.4-18.5 6.3 6.3-18.4 18.4h-6.3v-6.2z"})))}function O(e){var t=e.editUrl;return n.createElement("a",{href:t,target:"_blank",rel:"noreferrer noopener",className:L.k.common.editThisPage},n.createElement(B,null),n.createElement(v.Z,{id:"theme.common.editThisPage",description:"The link label to edit the current page"},"Edit this page"))}var V={tag:"tag_zVej",tagRegular:"tagRegular_sFm0",tagWithCount:"tagWithCount_h2kH"};function P(e){var t=e.permalink,a=e.label,l=e.count;return n.createElement(b.Z,{href:t,className:(0,d.Z)(V.tag,l?V.tagWithCount:V.tagRegular)},a,l&&n.createElement("span",null,l))}var S={tags:"tags_jXut",tag:"tag_QGVx"};function R(e){var t=e.tags;return n.createElement(n.Fragment,null,n.createElement("b",null,n.createElement(v.Z,{id:"theme.tags.tagsListLabel",description:"The label alongside a tag list"},"Tags:")),n.createElement("ul",{className:(0,d.Z)(S.tags,"padding--none","margin-left--sm")},t.map((function(e){var t=e.label,a=e.permalink;return n.createElement("li",{key:a,className:S.tag},n.createElement(P,{label:t,permalink:a}))}))))}var D={lastUpdated:"lastUpdated_vwxv"};function F(e){return n.createElement("div",{className:(0,d.Z)(L.k.docs.docFooterTagsRow,"row margin-bottom--sm")},n.createElement("div",{className:"col"},n.createElement(R,e)))}function z(e){var t=e.editUrl,a=e.lastUpdatedAt,l=e.lastUpdatedBy,r=e.formattedLastUpdatedAt;return n.createElement("div",{className:(0,d.Z)(L.k.docs.docFooterEditMetaRow,"row")},n.createElement("div",{className:"col"},t&&n.createElement(O,{editUrl:t})),n.createElement("div",{className:(0,d.Z)("col",D.lastUpdated)},(a||l)&&n.createElement(y,{lastUpdatedAt:a,formattedLastUpdatedAt:r,lastUpdatedBy:l})))}function j(){var e=c().metadata,t=e.editUrl,a=e.lastUpdatedAt,l=e.formattedLastUpdatedAt,r=e.lastUpdatedBy,i=e.tags,o=i.length>0,s=!!(t||a||r);return o||s?n.createElement("footer",{className:(0,d.Z)(L.k.docs.docFooter,"docusaurus-mt-lg")},o&&n.createElement(F,{tags:i}),s&&n.createElement(z,{editUrl:t,lastUpdatedAt:a,lastUpdatedBy:r,formattedLastUpdatedAt:l})):null}var q=a(6043),G=a(6668),W=["parentIndex"];function J(e){var t=e.map((function(e){return Object.assign({},e,{parentIndex:-1,children:[]})})),a=Array(7).fill(-1);t.forEach((function(e,t){var n=a.slice(2,e.level);e.parentIndex=Math.max.apply(Math,n),a[e.level]=t}));var n=[];return t.forEach((function(e){var a=e.parentIndex,l=(0,A.Z)(e,W);a>=0?t[a].children.push(l):n.push(l)})),n}function Q(e){var t=e.toc,a=e.minHeadingLevel,n=e.maxHeadingLevel;return t.flatMap((function(e){var t=Q({toc:e.children,minHeadingLevel:a,maxHeadingLevel:n});return function(e){return e.level>=a&&e.level<=n}(e)?[Object.assign({},e,{children:t})]:t}))}function X(e){var t=e.getBoundingClientRect();return t.top===t.bottom?X(e.parentNode):t}function Y(e,t){var a,n,l=t.anchorTopOffset,r=e.find((function(e){return X(e).top>=l}));return r?function(e){return e.top>0&&e.bottom<window.innerHeight/2}(X(r))?r:null!=(n=e[e.indexOf(r)-1])?n:null:null!=(a=e[e.length-1])?a:null}function K(){var e=(0,n.useRef)(0),t=(0,G.L)().navbar.hideOnScroll;return(0,n.useEffect)((function(){e.current=t?0:document.querySelector(".navbar").clientHeight}),[t]),e}function $(e){var t=(0,n.useRef)(void 0),a=K();(0,n.useEffect)((function(){if(!e)return function(){};var n=e.linkClassName,l=e.linkActiveClassName,r=e.minHeadingLevel,i=e.maxHeadingLevel;function o(){var e=function(e){return Array.from(document.getElementsByClassName(e))}(n),o=function(e){for(var t=e.minHeadingLevel,a=e.maxHeadingLevel,n=[],l=t;l<=a;l+=1)n.push("h"+l+".anchor");return Array.from(document.querySelectorAll(n.join()))}({minHeadingLevel:r,maxHeadingLevel:i}),c=Y(o,{anchorTopOffset:a.current}),s=e.find((function(e){return c&&c.id===function(e){return decodeURIComponent(e.href.substring(e.href.indexOf("#")+1))}(e)}));e.forEach((function(e){!function(e,a){a?(t.current&&t.current!==e&&t.current.classList.remove(l),e.classList.add(l),t.current=e):e.classList.remove(l)}(e,e===s)}))}return document.addEventListener("scroll",o),document.addEventListener("resize",o),o(),function(){document.removeEventListener("scroll",o),document.removeEventListener("resize",o)}}),[e,a])}function ee(e){var t=e.toc,a=e.className,l=e.linkClassName,r=e.isChild;return t.length?n.createElement("ul",{className:r?void 0:a},t.map((function(e){return n.createElement("li",{key:e.id},n.createElement("a",{href:"#"+e.id,className:null!=l?l:void 0,dangerouslySetInnerHTML:{__html:e.value}}),n.createElement(ee,{isChild:!0,toc:e.children,className:a,linkClassName:l}))}))):null}var te=n.memo(ee),ae=["toc","className","linkClassName","linkActiveClassName","minHeadingLevel","maxHeadingLevel"];function ne(e){var t=e.toc,a=e.className,l=void 0===a?"table-of-contents table-of-contents__left-border":a,r=e.linkClassName,i=void 0===r?"table-of-contents__link":r,o=e.linkActiveClassName,c=void 0===o?void 0:o,s=e.minHeadingLevel,d=e.maxHeadingLevel,m=(0,A.Z)(e,ae),v=(0,G.L)(),b=null!=s?s:v.tableOfContents.minHeadingLevel,p=null!=d?d:v.tableOfContents.maxHeadingLevel,f=function(e){var t=e.toc,a=e.minHeadingLevel,l=e.maxHeadingLevel;return(0,n.useMemo)((function(){return Q({toc:J(t),minHeadingLevel:a,maxHeadingLevel:l})}),[t,a,l])}({toc:t,minHeadingLevel:b,maxHeadingLevel:p});return $((0,n.useMemo)((function(){if(i&&c)return{linkClassName:i,linkActiveClassName:c,minHeadingLevel:b,maxHeadingLevel:p}}),[i,c,b,p])),n.createElement(te,(0,u.Z)({toc:f,className:l,linkClassName:i},m))}var le={tocCollapsibleButton:"tocCollapsibleButton_TO0P",tocCollapsibleButtonExpanded:"tocCollapsibleButtonExpanded_MG3E"},re=["collapsed"];function ie(e){var t=e.collapsed,a=(0,A.Z)(e,re);return n.createElement("button",(0,u.Z)({type:"button"},a,{className:(0,d.Z)("clean-btn",le.tocCollapsibleButton,!t&&le.tocCollapsibleButtonExpanded,a.className)}),n.createElement(v.Z,{id:"theme.TOCCollapsible.toggleButtonLabel",description:"The label used by the button on the collapsible TOC component"},"On this page"))}var oe={tocCollapsible:"tocCollapsible_ETCw",tocCollapsibleContent:"tocCollapsibleContent_vkbj",tocCollapsibleExpanded:"tocCollapsibleExpanded_sAul"};function ce(e){var t=e.toc,a=e.className,l=e.minHeadingLevel,r=e.maxHeadingLevel,i=(0,q.u)({initialState:!0}),o=i.collapsed,c=i.toggleCollapsed;return n.createElement("div",{className:(0,d.Z)(oe.tocCollapsible,!o&&oe.tocCollapsibleExpanded,a)},n.createElement(ie,{collapsed:o,onClick:c}),n.createElement(q.z,{lazy:!0,className:oe.tocCollapsibleContent,collapsed:o},n.createElement(ne,{toc:t,minHeadingLevel:l,maxHeadingLevel:r})))}var se={tocMobile:"tocMobile_ITEo"};function de(){var e=c(),t=e.toc,a=e.frontMatter;return n.createElement(ce,{toc:t,minHeadingLevel:a.toc_min_heading_level,maxHeadingLevel:a.toc_max_heading_level,className:(0,d.Z)(L.k.docs.docTocMobile,se.tocMobile)})}var me={tableOfContents:"tableOfContents_bqdL",docItemContainer:"docItemContainer_F8PC"},ue=["className"],ve="table-of-contents__link toc-highlight",be="table-of-contents__link--active";function pe(e){var t=e.className,a=(0,A.Z)(e,ue);return n.createElement("div",{className:(0,d.Z)(me.tableOfContents,"thin-scrollbar",t)},n.createElement(ne,(0,u.Z)({},a,{linkClassName:ve,linkActiveClassName:be})))}function fe(){var e=c(),t=e.toc,a=e.frontMatter;return n.createElement(pe,{toc:t,minHeadingLevel:a.toc_min_heading_level,maxHeadingLevel:a.toc_max_heading_level,className:L.k.docs.docTocDesktop})}var he=a(2503),ge=a(3905),Ee=a(7535);function Le(e){var t=e.children;return n.createElement(ge.Zo,{components:Ee.Z},t)}function Ne(e){var t,a,l,r,i=e.children,o=(t=c(),a=t.metadata,l=t.frontMatter,r=t.contentTitle,l.hide_title||void 0!==r?null:a.title);return n.createElement("div",{className:(0,d.Z)(L.k.docs.docMarkdown,"markdown")},o&&n.createElement("header",null,n.createElement(he.Z,{as:"h1"},o)),n.createElement(Le,null,i))}var Ce=a(8425),_e=a(8596),ke=a(4996);function Ze(e){return n.createElement("svg",(0,u.Z)({viewBox:"0 0 24 24"},e),n.createElement("path",{d:"M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z",fill:"currentColor"}))}var xe={breadcrumbHomeIcon:"breadcrumbHomeIcon_YNFT"};function Te(){var e=(0,ke.Z)("/");return n.createElement("li",{className:"breadcrumbs__item"},n.createElement(b.Z,{"aria-label":(0,v.I)({id:"theme.docs.breadcrumbs.home",message:"Home page",description:"The ARIA label for the home page in the breadcrumbs"}),className:"breadcrumbs__link",href:e},n.createElement(Ze,{className:xe.breadcrumbHomeIcon})))}var He={breadcrumbsContainer:"breadcrumbsContainer_Z_bl"};function Ue(e){var t=e.children,a=e.href,l="breadcrumbs__link";return e.isLast?n.createElement("span",{className:l,itemProp:"name"},t):a?n.createElement(b.Z,{className:l,href:a,itemProp:"item"},n.createElement("span",{itemProp:"name"},t)):n.createElement("span",{className:l},t)}function we(e){var t=e.children,a=e.active,l=e.index,r=e.addMicrodata;return n.createElement("li",(0,u.Z)({},r&&{itemScope:!0,itemProp:"itemListElement",itemType:"https://schema.org/ListItem"},{className:(0,d.Z)("breadcrumbs__item",{"breadcrumbs__item--active":a})}),t,n.createElement("meta",{itemProp:"position",content:String(l+1)}))}function ye(){var e=(0,Ce.s1)(),t=(0,_e.Ns)();return e?n.createElement("nav",{className:(0,d.Z)(L.k.docs.docBreadcrumbs,He.breadcrumbsContainer),"aria-label":(0,v.I)({id:"theme.docs.breadcrumbs.navAriaLabel",message:"Breadcrumbs",description:"The ARIA label for the breadcrumbs"})},n.createElement("ul",{className:"breadcrumbs",itemScope:!0,itemType:"https://schema.org/BreadcrumbList"},t&&n.createElement(Te,null),e.map((function(t,a){var l=a===e.length-1;return n.createElement(we,{key:a,active:l,index:a,addMicrodata:!!t.href},n.createElement(Ue,{href:t.href,isLast:l},t.label))})))):null}var Ae={docItemContainer:"docItemContainer_Djhp",docItemCol:"docItemCol_VOVn"};function Me(e){var t,a,l,r,i,o,s=e.children,u=(t=c(),a=t.frontMatter,l=t.toc,r=(0,m.i)(),i=a.hide_table_of_contents,o=!i&&l.length>0,{hidden:i,mobile:o?n.createElement(de,null):void 0,desktop:!o||"desktop"!==r&&"ssr"!==r?void 0:n.createElement(fe,null)});return n.createElement("div",{className:"row"},n.createElement("div",{className:(0,d.Z)("col",!u.hidden&&Ae.docItemCol)},n.createElement(T,null),n.createElement("div",{className:Ae.docItemContainer},n.createElement("article",null,n.createElement(ye,null),n.createElement(H,null),u.mobile,n.createElement(Ne,null,s),n.createElement(j,null)),n.createElement(h,null))),u.desktop&&n.createElement("div",{className:"col col--3"},u.desktop))}function Ie(e){var t="docs-doc-id-"+e.content.metadata.unversionedId,a=e.content;return n.createElement(o,{content:e.content},n.createElement(l.FG,{className:t},n.createElement(s,null),n.createElement(Me,null,n.createElement(a,null))))}},4477:function(e,t,a){a.d(t,{E:function(){return o},q:function(){return i}});var n=a(7294),l=a(9688),r=n.createContext(null);function i(e){var t=e.children,a=e.version;return n.createElement(r.Provider,{value:a},t)}function o(){var e=(0,n.useContext)(r);if(null===e)throw new l.i6("DocsVersionProvider");return e}}}]);