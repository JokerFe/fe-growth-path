(this.webpackJsonpsetting=this.webpackJsonpsetting||[]).push([[3],{1:function(e,t,n){"use strict";n.d(t,"n",(function(){return k})),n.d(t,"g",(function(){return N})),n.d(t,"b",(function(){return C})),n.d(t,"j",(function(){return O})),n.d(t,"q",(function(){return S})),n.d(t,"c",(function(){return L})),n.d(t,"s",(function(){return T})),n.d(t,"p",(function(){return P})),n.d(t,"a",(function(){return M})),n.d(t,"r",(function(){return D})),n.d(t,"t",(function(){return F})),n.d(t,"k",(function(){return K})),n.d(t,"m",(function(){return _})),n.d(t,"e",(function(){return z})),n.d(t,"d",(function(){return R})),n.d(t,"f",(function(){return B})),n.d(t,"o",(function(){return q})),n.d(t,"i",(function(){return I})),n.d(t,"u",(function(){return W})),n.d(t,"v",(function(){return Q})),n.d(t,"h",(function(){return A})),n.d(t,"l",(function(){return U}));var a=n(9),l=n(6),i=n(3),r=n(4),o=n(14),c=n(15),s=n(7),u=n(18),m=n(17),d=n(0),p=n.n(d),f=n(8),h=n.n(f),b=n(10),g=n(2),v=n(5),w=n(20),y=n.n(w);function E(e){return function(t){Object(u.a)(a,t);var n=Object(m.a)(a);function a(e){var t;return Object(o.a)(this,a),(t=n.call(this,e)).onMouseEnter=t.onMouseEnter.bind(Object(s.a)(t)),t.onMouseLeave=t.onMouseLeave.bind(Object(s.a)(t)),t.targetRef=p.a.createRef(),t}return Object(c.a)(a,[{key:"componentDidMount",value:function(){this.tooltip=document.querySelector("#ty-tooltip")}},{key:"_adjustPosition",value:function(e){var t=this.targetRef.current,n=t.getBoundingClientRect(),a=this.tooltip.clientWidth,l={top:n.top+document.body.scrollTop,left:n.left+document.body.scrollLeft};"bottom"===e?(l.top=n.bottom+8,l.right=n.right+(a-n.width)/2):"top"===e?(l.top=n.top-36,l.right=n.right+(a-n.width)/2):(l.right=l.left-8,l.top=l.top+t.clientHeight/2-this.tooltip.clientHeight/2),a>window.innerWidth-30?l.left=8:l.left=l.right-a,this.tooltip.style.top=l.top+"px",this.tooltip.style.left=l.left+"px",l.right&&(this.tooltip.style.right=window.innerWidth-l.right-4+"px")}},{key:"onMouseEnter",value:function(){var e=this.props,t=e.hintPosition,n=e.hint;n&&(this.tooltip.style.right="auto",this.tooltip.innerHTML=n,this.tooltip.classList.add("shown"),this._adjustPosition(t))}},{key:"onMouseLeave",value:function(){this.tooltip.classList.remove("shown")}},{key:"render",value:function(){return p.a.createElement(e,Object.assign({},this.props,{ref:this.targetRef,onMouseEnter:this.onMouseEnter,onMouseLeave:this.onMouseLeave}))}}]),a}(p.a.Component)}var k=function(e){var t=e.active,n=e.children,a=Object(r.a)(e,["active","children"]),l=p.a.useRef(null);return p.a.useEffect((function(){if(t&&l.current){var e=l.current,n=e.querySelector(".search-hit, .blink-area");if(n){var a=n.getBoundingClientRect();a.top+20>e.parentElement.scrollTop+window.innerHeight&&(e.parentElement.scrollTop=a.top-20)}}})),p.a.createElement("div",Object.assign({ref:l,className:"content"+(t?"":" display-none")},a),n)},j=function(e){var t=e.text,n=e.link;return n?p.a.createElement("a",{href:n,target:"_blank",onClick:function(e){window.Setting.openLink(n),e.preventDefault()}},Object(g.a)(t)):Object(g.a)(t)},N=function(e){var t=e.hint,n=e.displayHint,a=e.inlineHint,l=e.hintLink,i=Object(r.a)(e,["hint","displayHint","inlineHint","hintLink"]);return n?p.a.createElement("div",{className:"panel-content-hint row"},t):a?p.a.createElement("div",{className:"inline-hint"},p.a.createElement(j,{link:l,text:t||Object(g.a)("Learn More\u2026","Front")})):p.a.createElement(x,Object.assign({hint:t?Object(g.a)(t):l},i))},x=E(p.a.forwardRef((function(e,t){var n=e.hint,a=(e.forwardedRef,Object(r.a)(e,["hint","forwardedRef"]));return p.a.createElement("span",Object.assign({ref:t,className:"label-hint",hint:n},a),p.a.createElement(b.c,null))}))),C=function(e){var t=e.keyName,n=e.label,a=e.dictGroup,l=e.checked,i=e.reverse,o=e.onChange,c=e.hint,s=e.hintLink,u=e.inlineHint,m=e.isCell,d=e.disabled,f=Object(r.a)(e,["keyName","label","dictGroup","checked","reverse","onChange","hint","hintLink","inlineHint","isCell","disabled"]),h=p.a.useContext(v.a),b=!m&&h&&(Object(v.c)(h,n,a)||Object(v.c)(h,c))?" search-hit":"";return p.a.createElement("div",Object.assign({className:"checkbox"+(m?"":" row")+b+(d?" disabled":"")},f),p.a.createElement("label",null,p.a.createElement("input",{type:"checkbox",onChange:function(e){o(t,i?!e.target.checked:e.target.checked)},checked:!!l,disabled:d}),Object(g.a)(n,a)),c||s?p.a.createElement(N,{hint:c,inlineHint:u,hintLink:s}):null)},O=p.a.memo((function(e){var t=e.title,n=e.dictGroup,a=e.hint,l=e.hintLink,i=e.breakBeforeHint,r=e.children,o=e.headerStyle,c=e.keyWords,s=e.highlight,u=p.a.useContext(v.a),m=Object(v.c)(u,t,n)||Object(v.c)(u,a)||c&&Object(v.d)(u,c);return p.a.createElement("div",{className:"input-group"+(m?" search-hit":"")+(s?" blink-area":"")},p.a.createElement("h5",{className:"input-group-header",style:o},p.a.createElement("span",{className:"input-group-header-title"},Object(g.a)(t,n)),a||l?p.a.createElement("span",{className:"input-group-header-hint"+(i?" hint-break-before":"")},p.a.createElement(j,{link:l,text:a||Object(g.a)("Learn More\u2026")})):null),p.a.createElement("div",{className:"input-group-content"},r))})),S=function(e){var t=e.keyName,n=e.isCell,a=e.options,l=e.value,i=e.type,o=e.hint,c=e.inlineHint,s=e.optionsDict,u=e.onChange,m=e.disabled,d=Object(r.a)(e,["keyName","isCell","options","value","type","hint","inlineHint","optionsDict","onChange","disabled"]),f=p.a.useContext(v.a),h=f&&!n&&(Object(v.d)(f,Object.values(a),s)||Object(v.c)(f,o))?" search-hit":"";return p.a.createElement("div",Object.assign({className:(n?"cell":"row")+h},d),p.a.createElement("select",{onChange:function(e){var n=e.target.value;"number"==i?n=e.target.value-0:"boolean"==i&&(n=e.target.value+""=="true"),u(t,n)},value:l,disabled:m},function(){var e=[];for(var t in a)"_seperator"==t?e.push(p.a.createElement("option",{key:t,disabled:!0},"\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500")):e.push(p.a.createElement("option",{key:t,value:t},Object(g.a)(a[t],s)));return e}()),o?p.a.createElement(N,{hint:o,inlineHint:c}):null)},L=function(e){var t=e.forMac,n=e.forWin,a=e.forLinux,l=e.visible,i=e.children;return function(e){return(e=e||t&&window.isMac||n&&window.isWin||a&&window.isLinux)?p.a.createElement(p.a.Fragment,null,i):null}(l)},T=function(e){var t=e.label,n=e.style;return p.a.createElement("span",{style:n},Object(g.a)(t))},P=function(e){var t=e.keyWords,n=e.style,a=e.children,l=p.a.useContext(v.a),i=l&&t&&Object(v.d)(l,t)?" search-hit":"";return p.a.createElement("div",{className:"row"+i,style:n},a)},M=function(e){var t=e.label,n=e.style,a=Object(r.a)(e,["label","style"]);return p.a.createElement("button",Object.assign({"aria-label":Object(g.a)(t),style:Object(i.a)({},n),className:"btn btn-default"},a),Object(g.a)(t))},D=function(e){var t=e.label,n=e.style,a=e.options,l=e.onExtra,o=Object(r.a)(e,["label","style","options","onExtra"]),c=p.a.useRef(null);return p.a.createElement("div",{className:"btn-split-group"},p.a.createElement("button",Object.assign({"aria-label":Object(g.a)(t),style:Object(i.a)({},n),className:"btn btn-default btn-split-left"},o),p.a.createElement("span",{className:"btn-split-main"},Object(g.a)(t))),p.a.createElement("button",{"tab-index":-1,"aria-label":Object(g.a)(t),style:Object(i.a)({},n),className:"btn btn-default btn-split-right",onClick:function(e){e.currentTarget.focus();var t=c.current.classList;t.contains("shown")?t.remove("shown"):t.add("shown")},onBlur:function(){c.current.classList.remove("shown")}},p.a.createElement("span",{className:"icon icon-down-dir"})),p.a.createElement("ul",{className:"dropdown-menu",ref:c},Object.keys(a).map((function(e){return p.a.createElement("li",{key:e,onMouseDown:function(){l(e-0),c.current.classList.remove("shown")}},Object(g.a)(a[e]))}))))},F=function(e){var t=e.className,n=Object(r.a)(e,["className"]);return p.a.createElement("input",Object.assign({type:"text",className:"ty-text-input "+(t||"")},n))},_=function(e){var t=e.value,n=e.keyName,a=e.onChange,l=Object(r.a)(e,["value","keyName","onChange"]);return p.a.createElement("input",Object.assign({type:"number",value:t,onChange:function(e){var t=e.target.value-0;isNaN(t)?a(n,"382"):t<l.min?a(n,"1"):t>l.max?a(n,"999"):a(n,t)}},l))},A=E(p.a.forwardRef((function(e,t){var n=e.icon,a=(e.label,e.hint),l=(e.hintPosition,e.disabled),i=Object(r.a)(e,["icon","label","hint","hintPosition","disabled"]);return p.a.createElement("span",Object.assign({role:"button",className:"icon-button icon icon-"+n+(l?" button-disabled":""),"aria-label":a,ref:t},i))}))),R=function(e){var t=e.keyName,n=e.value,a=e.defaultPath,l=e.placeholder,i=e.onChange,r=e.option;return p.a.createElement("div",{className:"file-input"},p.a.createElement("input",{type:"text",value:n||"",onChange:function(e){i(t,e.target.value)},placeholder:l}),p.a.createElement(A,{hint:"Select",icon:"folder",style:{marginLeft:"1ch",cursor:"pointer"},onClick:function(){var e=n||a;window.Setting.selectFile(e,[r],(function(e){e&&i(t,e)}))},hintPosition:"bottom"}))},H=E(p.a.forwardRef((function(e,t){var n=e.value,a=e.onSelect,l=(e.hintPosition,Object(r.a)(e,["value","onSelect","hintPosition"])),i=(n||"").replace(/[\\\/]\s*$/,"").replace(/.*[\\\/]/,"");return"/"==n&&(i="/"),p.a.createElement("span",Object.assign({ref:t,type:"text",className:"dir-path",placeholder:Object(g.a)("Select Custom Folder..."),readOnly:!0,onClick:function(){n?window.Setting.openFolder(n):a()}},l),i||Object(g.a)("Select Custom Folder..."))}))),z=function(e){var t=e.hidden,n=e.value,a=e.keyName,l=e.onChange,i=(Object(r.a)(e,["hidden","value","keyName","onChange"]),function(){window.Setting.selectFolder(n,(function(e){var t=e||n;t&&l(a,t)}))});return t?null:p.a.createElement("div",{className:"row"},p.a.createElement("div",{className:"select-pin-input-group"},p.a.createElement(H,{hint:n,value:n,onSelect:i,hintPosition:"bottom"}),p.a.createElement(A,{icon:"folder",onClick:i,hint:Object(g.a)("Select custom folder"),hintPosition:"bottom"})))},B=function(e){var t=e.value,n=e.customValue,a=e.onChange,i=p.a.useState(n||14),r=Object(l.a)(i,2),o=r[0],c=r[1];var s,u=function(e){"radio"===e.target.type&&a("useCustomFontSize",e.target.value+""==="true")};return p.a.createElement("div",{className:"row"},p.a.createElement("span",{className:"radio",style:{minWidth:"40%",paddingRight:"8px",height:"26px"}},p.a.createElement("label",{style:{overflow:"visible"}},p.a.createElement("input",{type:"radio",name:"useCustomFontSize",value:!1,checked:!1===t,onChange:u}),Object(g.a)("Auto ( Recommended )"))),p.a.createElement("span",{className:"radio",style:{width:"40%",height:"26px"}},p.a.createElement("label",{style:{overflow:"visible",whiteSpace:"nowrap"}},p.a.createElement("input",{type:"radio",name:"useCustomFontSize",value:!0,checked:!0===t,onChange:u}),Object(g.a)("Customized"),(s=t+""==="true",p.a.createElement("span",{className:"custom-font-input",style:{visibility:s?"visible":"hidden"}},p.a.createElement("input",{style:{marginLeft:"8px",marginTop:"-4px"},step:"1",type:"number",max:"24",size:"2",min:"9",value:o,onChange:function(e){var t=e.target.value-0;isNaN(t)||(c(Math.floor(t)),t<=24&&t>=9&&a("customFontSize",t))},onBlur:function(){var e=o;e>24&&(e=24),e<9&&(e=9),c(e),a("customFontSize",e)}})," ",p.a.createElement("span",null,"px"))))))},q=function(e){var t=e.keyName,n=e.value,a=e.type,l=e.options,i=e.onChange;Object(r.a)(e,["keyName","value","type","options","onChange"]);return p.a.createElement("div",{className:"row",onChange:function(e){var n=e.target.value;"number"==a?n=e.target.value-0:"boolean"==a&&(n=e.target.value+""=="true"),i(t,n)},value:n},function(){var e=[];for(var a in l)e.push(p.a.createElement("span",{key:a,className:"radio",style:{width:"40%"}},p.a.createElement("label",null,p.a.createElement("input",{type:"radio",name:t,value:a,defaultChecked:n+""==a}),Object(g.a)(l[a]))));return e}())},I=function(e){var t,n,a=e.indentSize,l=e.prettyIndent,i=Object(r.a)(e,["indentSize","prettyIndent"]);return a-=0,l=l+""==="true",p.a.createElement(O,{title:"Indent Size on Save",breakBeforeHint:!0,hint:"only apply to quotes and lists created from menu bar or hybrid view",headerStyle:{marginBottom:"0"}},p.a.createElement(W,{rows:[[p.a.createElement("div",null,p.a.createElement(S,Object.assign({keyName:"indentSize",style:{width:"80px",minHeight:"25px"},options:{0:"Auto",2:"2",3:"3",4:"4",5:"5","-1":"Tab"},isCell:!0},i,{onChange:function(e,t){i.onChange(e,t-0)},value:(a||0)+""})),p.a.createElement(C,Object.assign({keyName:"prettyIndent",style:{marginTop:"8px"},label:"Pretty indentation",isCell:!0},i,{checked:!!l}))),p.a.createElement("div",{style:{marginTop:"4px",border:"1px solid",padding:"0 8px"}},p.a.createElement("pre",{style:{margin:"0",lineHeight:"1.5"}},(t=a,n=l,(t=t||2)<0?"> Quote\n- List item\n\t1. sub-bullet\n\t\tline2":(n?["> Quote\n- List item\n  1. sub-bullet\n     line2",">  Quote\n-  List item\n   1. sub-bullet\n      line2",">   Quote\n-   List item\n    1.  sub-bullet\n        line2",">    Quote\n-    List item\n     1.   sub-bullet\n          line2"]:["> Quote\n- List item\n  1. sub-bullet\n     line2","> Quote\n- List item\n   1. sub-bullet\n      line2","> Quote\n- List item\n    1. sub-bullet\n        line2","> Quote\n- List item\n     1. sub-bullet\n          line2"])[(t||2)-2])))]]}))},W=function(e){var t=e.className,n=e.rows,a=p.a.useContext(v.a);return p.a.createElement("table",{className:"label-input-group "+(t||"")},p.a.createElement("tbody",null,n.map((function(e,t){var n=e[2]||e[0],l=a&&"string"==typeof n&&Object(v.c)(a,n)?"search-hit":"";return p.a.createElement("tr",{key:t,className:l},p.a.createElement("td",null,"string"==typeof e[0]?Object(g.a)(e[0]):e[0]),p.a.createElement("td",null,e[1]),e[2]?p.a.createElement(N,{hint:e[2]}):null)}))))},Q=function(){return p.a.createElement("header",{className:"window-header"},p.a.createElement("div",{className:"window-header-content"},p.a.createElement("div",{className:"window-header-title"},p.a.createElement("button",{className:"window-header-back",onClick:window.Setting.close},p.a.createElement("span",{className:"icon"},p.a.createElement(b.a,null))),p.a.createElement("h2",null,Object(g.a)("Preferences")))),p.a.createElement("button",{className:"header-close",onClick:window.Setting.close},p.a.createElement("span",{className:"icon"},p.a.createElement(b.b,null))))},U=function(e){return h.a.createPortal(p.a.createElement("div",{className:"modal-backdrop"},p.a.createElement("div",{className:"modal-content "+(e.className||""),onKeyDown:e.onKeyDown},p.a.createElement("div",{className:"modal-icon",style:{display:"none",textAlign:"center"}},p.a.createElement("img",{src:"/icon.png",style:{width:"64px"}})),void 0===e.title?null:p.a.createElement("div",{className:"modal-title"},p.a.createElement("h3",null,Object(g.a)(e.title))),p.a.createElement("div",{className:"modal-body"},e.children),p.a.createElement("div",{className:"modal-footer"},e.footer?e.footer:p.a.createElement("div",null,p.a.createElement("button",{className:"btn btn-primary",onClick:e.closeAction},Object(g.a)("OK")))))),document.querySelector("#modal"))},K=function(e){var t,n=e.candidates,i=e.value,o=e.onChange,c=e.placeholder,s=Object(r.a)(e,["candidates","value","onChange","placeholder"]),u=p.a.useState(!1),m=Object(l.a)(u,2),d=m[0],f=m[1],h=p.a.useState(-1),b=Object(l.a)(h,2),v=b[0],w=b[1],E=p.a.useState(!0),k=Object(l.a)(E,2),j=k[0],N=k[1],x=p.a.useRef(null),C=y()().Portal,O=p.a.useRef(null),S=n.filter((function(e){return!i||0==e.indexOf(i.toLowerCase())})),L=p.a.useCallback((function(){return i=i||"",p.a.createElement("div",{ref:O,className:"input-autocomplete"},S.map((function(e,t){return p.a.createElement("div",{className:"input-autocomplete-row ".concat(t==v?"active":""),key:e,onMouseDown:function(t){o(e),t.preventDefault(),t.stopPropagation(),P()}},e)})))}),[S]),T=function(e){w(-1),N(!0),o(e)},P=function(){x.current&&(x.current.select(),N(!1))};return p.a.useEffect((function(){if(d&&O.current){var e=x.current.getBoundingClientRect(),t=document.body.scrollTop;O.current.style.top=e.bottom+2+t+"px",O.current.style.width=e.width+"px",O.current.style.left=e.left+"px"}}),[d,O.current]),p.a.useEffect((function(){if(!(v<0)&&O.current){var e=O.current,t=e.children[v];if(t){var n=e.scrollTop,a=t.offsetTop;(a>n+180-8||a+30<n+8)&&(e.scrollTop=a)}}}),[v]),p.a.createElement(p.a.Fragment,null,p.a.createElement("input",Object.assign((t={ref:x,type:"text",className:"ty-text-input",onFocus:function(e){e.target.select(),f(!0)},onBlur:function(){f(!1)},value:i||""},Object(a.a)(t,"type","text"),Object(a.a)(t,"onChange",(function(e){return T(e.target.value)})),Object(a.a)(t,"placeholder",Object(g.a)(c||"")),Object(a.a)(t,"onKeyDown",(function(e){"Enter"===e.key?(v>=0&&T(S[v]),N(!1)):"Esc"===e.key?N(!1):"ArrowUp"===e.key?(w(v-1<0?S.length-1:v-1),N(!0)):"ArrowDown"===e.key&&(v+1>S.length?w(0):w(v+1),N(!0))})),t),s)),S.length&&j&&d?p.a.createElement(C,null,L()):null)}},10:function(e,t,n){"use strict";n.d(t,"c",(function(){return i})),n.d(t,"b",(function(){return r})),n.d(t,"a",(function(){return o}));var a=n(0),l=n.n(a),i=function(e){return l.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 512 512"},l.a.createElement("path",{d:"M256 90c44.3 0 86 17.3 117.4 48.6C404.7 170 422 211.7 422 256s-17.3 86-48.6 117.4C342 404.7 300.3 422 256 422s-86-17.3-117.4-48.6C107.3 342 90 300.3 90 256s17.3-86 48.6-117.4C170 107.3 211.7 90 256 90m0-42C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48z"}),l.a.createElement("path",Object.assign({d:"M235 339h42v42h-42zM276.8 318h-41.6c0-67 62.4-62.2 62.4-103.8 0-22.9-18.7-41.7-41.6-41.7S214.4 192 214.4 214h-41.6c0-46 37.2-83 83.2-83s83.2 37.1 83.2 83.1c0 52-62.4 57.9-62.4 103.9z"},e)))},r=function(e){return l.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 512 512"},l.a.createElement("path",Object.assign({d:"M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z"},e)))},o=function(e){return l.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 512 512"},l.a.createElement("path",Object.assign({d:"M427 234.625H167.296l119.702-119.702L256 85 85 256l171 171 29.922-29.924-118.626-119.701H427v-42.75z"},e)))}},16:function(e,t,n){"use strict";n.d(t,"a",(function(){return a}));var a={A5:{name:"A5",pt:[420,595],mm:[148,210]},A4:{name:"A4",pt:[595,842],mm:[210,297]},A3:{name:"A3",pt:[842,1191],mm:[297,420]},Letter:{name:"US Letter",pt:[612,791],mm:[216,279]},Legal:{name:"US Legal",pt:[612,1009],mm:[216,356]},Tabloid:{name:"Tabloid",pt:[791,1225],mm:[279,432]}}},2:function(e,t,n){"use strict";n.d(t,"a",(function(){return a}));var a=function(e,t){return e?(e=e.replace(/\\n/g,"\n"),/((\.\.\.)|(\u2026))$/.exec(e)?window.Dict.get(e.replace(/((\.\.\.)|(\u2026))$/,""),t).replace(/\n/g," ")+"\u2026":window.Dict.get(e,t).replace(/\n/g," ")):""}},24:function(e,t,n){},25:function(e,t){Object.values=Object.values||function(e){return Object.keys(e).map((function(t){return e[t]}))}},42:function(e,t,n){e.exports=n(48)},43:function(e,t,n){},48:function(e,t,n){"use strict";n.r(t);var a=n(3),l=n(0),i=n.n(l),r=n(8),o=n.n(r),c=n(13),s=(n(25),n(23)),u=n(4),m=n(10),d=n(2),p=(n(43),n(63)),f=n(1),h=(n(20),n(16)),b=function(e){var t=e.title,n=e.children;return i.a.createElement(i.a.Fragment,null,i.a.createElement("tr",null,i.a.createElement("td",{colSpan:"2"},i.a.createElement("h5",{className:"input-group-header"},t))),n)},g=function(e){var t=e.left,n=e.right;return i.a.createElement("tr",null,i.a.createElement("td",null,t),i.a.createElement("td",null,n))},v=function(e){var t=e.keyName,n=e.label,a=(e.keywords,e.placeholder),l=(Object(u.a)(e,["keyName","label","keywords","placeholder"]),i.a.useContext(F)),r=l.onChangeSetting,o=l.getSetting,c=l.activeTab,s=o(c,t||"")||"",m=i.a.useCallback((function(e){r(c,t,e.target.value)}),[c,t]);return i.a.createElement(g,{left:i.a.createElement(f.s,{label:n}),right:i.a.createElement(f.t,{value:s,placeholder:a,onChange:m})})},w=function(e){var t=e.keyName,n=e.label,a=(e.keywords,e.placeholder),l=(Object(u.a)(e,["keyName","label","keywords","placeholder"]),i.a.useContext(F)),r=l.onChangeSetting,o=l.getSetting,c=l.activeTab,s=o(c,t||"")||"",m=i.a.useCallback((function(e){r(c,t,e.target.value)}),[c,t]);return i.a.createElement(E,{label:n},i.a.createElement(f.t,{value:s,placeholder:a,onChange:m}),i.a.createElement("a",{className:"left-icon icon icon-folder",href:"#","aria-role":"button","aria-label":"select folder"},i.a.createElement("span",{className:"left-icon"})))},y=function(e){var t=e.keyName,n=e.label,a=(e.keywords,e.placeholder),l=(Object(u.a)(e,["keyName","label","keywords","placeholder"]),i.a.useContext(F)),r=l.onChangeSetting,o=l.getSetting,c=l.activeTab,s=o(c,t||"")||"",m=i.a.useCallback((function(e){r(c,t,e.target.value)}),[c,t]);return i.a.createElement(E,{label:n},i.a.createElement("textarea",{className:"ty-text-input",value:s,placeholder:a,onChange:m}))},E=function(e){var t=e.label,n=(e.keywords,e.children);Object(u.a)(e,["label","keywords","children"]);return i.a.createElement(g,{left:i.a.createElement(f.s,{label:t}),right:n})},k=function(e){var t=e.activeTab,n=e.setActiveTab;return i.a.createElement("header",{className:"window-header"},i.a.createElement("div",{className:"window-header-content"},i.a.createElement("div",{className:"window-header-title"},i.a.createElement("button",{className:"window-header-back",onClick:window.Setting.close},i.a.createElement("span",{className:"icon"},i.a.createElement(m.a,null))),i.a.createElement("div",{className:"window-header-title-tab ".concat(1==t?"active":"")},i.a.createElement(p.a,{onClick:function(){n(1)}},Object(d.a)("Workspace Setting"))),i.a.createElement("div",{className:"window-header-title-tab ".concat(0==t?"active":"")},i.a.createElement(p.a,{onClick:function(){n(0)}},Object(d.a)("File Setting"))))),i.a.createElement("button",{className:"header-close",onClick:window.Setting.close},i.a.createElement("span",{className:"icon"},i.a.createElement(m.b,null))))},j=function(){var e=i.a.useContext(F).activeTab;return i.a.createElement(b,{title:"Document"},0==e?i.a.createElement(v,{keyName:"title",label:"Title",placeholder:"Auto"}):null,i.a.createElement(v,{keyName:"author",label:"Author",placeholder:"System Setting"}))},N=function(e){var t=e.keyName,n=i.a.useContext(F),a=n.onChangeSetting,l=n.getSetting,r=n.activeTab,o=l(r,t||"")||"",c=i.a.useCallback((function(e,t){a(r,e,t)}),[r]);return i.a.createElement(E,{label:"Default Code Language"},i.a.createElement(f.k,{value:o,onChange:function(e){return c(t,e)},candidates:["js","javascript","java","json","typescript","clojure","coffeescript","css","less","scss","gfm","markdown","xaml","xml","haskell","html","lua","lisp","commonlisp","pascal","perl","perl6","php","php+HTML","python","cython","ruby","shell","sh","sql","sqlite","mssql","mysql","CQL","mariadb","cassandra","plsql","tiddlywiki","wiki","vb","basic","visual basic","vbscript","velocity","verilog","xquery","yaml","go","groovy","nginx","octave","c","clike","c++","cpp","objc","objective-c","csharp","c#","squirrel","ceylon","kotlin","tex","latex","swift","scala","R","D","diff","erlang","http","jade","rst","rust","jinja2","reStructuredText","asp","jsp","erb","ejs","embeddedjs","powershell","dockerfile","jsx","tsx","react","vue","nsis","mathematica","tiki wiki","properties","ini","livescript","assembly","gas","toml","matlab","ocaml","F#","fsharp","elm","pgp","asciiarmor","spreadsheet","elixir","cmake","cypher","dart","django","dtd","xml-dtd","dylan","handlebars","idl","web-idl","yacas","mbox","vhdl","julia","haxe","hxml","fortran","protobuf","makefile","tcl","scheme","twig","bash","SAS","pseudocode","stylus","cobol","oz","SPARQL","crystal","ASN.1","gherkin","smalltalk","turtle","glsl","apl","ABAP","q"],placeholder:"none"}))},x=function(){var e=i.a.useContext(F),t=e.onChangeSetting,n=e.getSetting,a=e.activeTab,l=n(a,"line_ending_crlf",!1)||!1,r=i.a.useCallback((function(e,n){t(a,e,n)}),[a]);return a?i.a.createElement(E,{label:"Default Line Ending"},i.a.createElement(f.o,{keyName:"line_ending_crlf",type:"boolean",options:{false:"LF (Unix Style)",true:"CRLF (Windows Style)"},onChange:r,value:l})):null},C=function(){var e=i.a.useContext(F),t=e.onChangeSetting,n=e.getSetting,a=e.activeTab,l=n(a,"customPaperSize",void 0),r=/\d+(\.\d+)?/g,o=(r.exec(l||"210 x 297")||[])[0],c=(r.exec(l||"210 x 297")||[])[0],s=i.a.useCallback((function(e){t(a,"customPaperSize",e)}),[a]);return i.a.createElement("div",{style:{display:"flex"},className:"paper-setting-row"},i.a.createElement("div",{style:{display:"flex",flex:"50%"}},i.a.createElement("div",null,"Width"),i.a.createElement("div",{style:{flex:"70%"}},i.a.createElement(f.m,{className:"ty-text-input",keyName:"w",value:o,onChange:function(e,t){s(t+" x "+c)},min:0,max:999}),"mm")),i.a.createElement("div",{style:{display:"flex",flex:"50%"}},i.a.createElement("div",null,"Height"),i.a.createElement("div",{style:{flex:"70%"}},i.a.createElement(f.m,{className:"ty-text-input",keyName:"h",value:c,onChange:function(e,t){s(o+" x "+t)},min:0,max:999}),"mm")))},O=function(){var e=i.a.useContext(F),t=e.onChangeSetting,n=e.getSetting,a=e.activeTab,l=n(a,"paperSize",void 0),r=void 0===l,o=i.a.useCallback((function(e,n){t(a,e,n)}),[a]),c={};return Object.keys(h.a).map((function(e){c[e]=e})),c.custom="Custom",i.a.createElement(E,{label:"Paper Size"},i.a.createElement(f.q,{className:"ty-text-input ty-select-input ".concat(r?"placeholder":""),keyName:"paperSize",options:c,onChange:o,value:l||"A4"}),"custom"===l?i.a.createElement(C,null):null)},S=function(){var e=i.a.useContext(F),t=e.onChangeSetting,n=e.getSetting,a=e.activeTab,l=n(a,"paperMargin",void 0)||[],r=i.a.useCallback((function(e){t(a,"paperMargin",e)}),[a]);return i.a.createElement(i.a.Fragment,null,i.a.createElement("div",{style:{display:"flex"},className:"paper-setting-row"},i.a.createElement("div",{style:{display:"flex",flex:"50%"}},i.a.createElement("div",{style:{flex:"30%"}},"Top"),i.a.createElement("div",{style:{flex:"70%"}},i.a.createElement(f.m,{className:"ty-text-input",keyName:"w",value:l[0]||16,onChange:function(e,t){r([t,l[1],l[2],l[3]])},min:0,max:999}),"mm")),i.a.createElement("div",{style:{display:"flex",flex:"50%"}},i.a.createElement("div",{style:{flex:"30%"}},"Right"),i.a.createElement("div",{style:{flex:"70%"}},i.a.createElement(f.m,{className:"ty-text-input",keyName:"w",value:l[0]||16,onChange:function(e,t){r([l[0],t,l[2],l[3]])},min:0,max:999}),"mm"))),i.a.createElement("div",{style:{display:"flex"},className:"paper-setting-row"},i.a.createElement("div",{style:{display:"flex",flex:"50%"}},i.a.createElement("div",{style:{flex:"30%"}},"Bottom"),i.a.createElement("div",{style:{flex:"70%"}},i.a.createElement(f.m,{className:"ty-text-input",keyName:"w",value:l[0]||16,onChange:function(e,t){r([l[0],l[1],t,l[3]])},min:0,max:999}),"mm")),i.a.createElement("div",{style:{display:"flex",flex:"50%"}},i.a.createElement("div",{style:{flex:"30%"}},"Left"),i.a.createElement("div",{style:{flex:"70%"}},i.a.createElement(f.m,{className:"ty-text-input",keyName:"w",value:l[0]||16,onChange:function(e,t){r([l[0],l[1],l[2],t])},min:0,max:999}),"mm"))))},L=function(){var e=i.a.useContext(F),t=e.onChangeSetting,n=e.getSetting,a=e.activeTab,l=n(a,"margin",void 0),r=void 0===l,o=i.a.useCallback((function(e,n){t(a,e,n)}),[a]);return i.a.createElement(E,{label:"Margin"},i.a.createElement(f.q,{className:"ty-text-input ty-select-input ".concat(r?"placeholder":""),keyName:"margin",options:{"":"Default",custom:"Custom"},onChange:o,value:l||"A4"}),"custom"===l?i.a.createElement(S,null):null)},T=function(){return i.a.createElement(b,{title:"Editor"},i.a.createElement(N,{keyName:"defaultCodeLang"}),i.a.createElement(x,null))},P=function(){return i.a.createElement(b,{title:"Image"},i.a.createElement(w,{label:"Image Root Folder",placeholder:"./",keyName:"imgRootUrl"}),i.a.createElement(w,{label:"Copy Images to... (when insert)",placeholder:"System Setting",keyName:"imgCopyTo"}))},M=function(){return i.a.createElement(b,{title:"PDF Export"},i.a.createElement(O,null),i.a.createElement(L,null),i.a.createElement(v,{label:"Header",keyName:"pageHeader",placeholder:"None"}),i.a.createElement(v,{label:"Footer",keyName:"pageFooter",placeholder:"None"}))},D=function(){return i.a.createElement(b,{title:"PDF / HTML Export"},i.a.createElement(y,{label:"Append in <head />",keyName:"appendHeader",placeholder:"None"}),i.a.createElement(y,{label:"Append in <body />",keyName:"appendBody",placeholder:"None"}))},F=i.a.createContext({fileSetting:{},workspaceSetting:{},activeTab:0,onChangeSetting:function(e,t,n){},getSetting:function(e,t,n){return n}}),_=function(e){var t=e.activeTab,n=e.setActiveTab,a=i.a.useRef(null);return i.a.useEffect((function(){a.current&&(a.current.classList.remove("load"),a.current.scrollTop=0,setTimeout((function(){a.current.classList.add("load")}),100))}),[t]),i.a.createElement(F.Provider,{value:e},i.a.createElement("div",null,i.a.createElement(k,{activeTab:t,setActiveTab:n}),i.a.createElement("div",{id:"ty-local-setting-container",className:"ty-local-setting-container load",ref:a},i.a.createElement("table",{className:"ty-local-setting-container-table"},i.a.createElement("tbody",null,i.a.createElement(j,null),i.a.createElement(T,null),i.a.createElement(P,null),i.a.createElement(M,null),i.a.createElement(D,null))))))};n(24);window.isNode=window.top!==window&&(window.isWin||window.isLinux);var A=!1,R=function(){return window._options.userLocale},H=0,z={};window.onMessageCallback=function(e){var t=e._callbackID,n=z[t||""];t&&n&&(delete e._callbackID,n.call(null,e)),delete z[t]},window.onmessage=function(e){var t=e.data;if(t.type)switch(t.type){case"callback":window.onMessageCallback(t);break;case"reload":window._options=Object.assign(window._options,t.initData),q()}},window._options={fileSetting:{},workspaceSetting:{}},window.Setting={close:function(){window.Setting.postMessage({type:"closeLocalSetting"})},postMessage:function(e,t){H++,t&&(e._callbackID=H,z[H]=t),window.top.postMessage(Object(a.a)(Object(a.a)({},e),{},{_callbackID:H}),"*")},fetchLocalSetting:function(){return new Promise((function(e){window.Setting.postMessage({type:"fetchLocalSetting"},e)}))},fileSetting:function(){return window._options.fileSetting},workspaceSetting:function(){return window._options.workspaceSetting}},window.loadDict=function(e){return window.location.href.match(/localhost/)?new Promise((function(e){setTimeout((function(){e({Front:{},Menu:{},Panel:{}})}),100)})):Promise.all([fetch("../locales/"+e+".lproj/Front.json"),fetch("../locales/"+e+".lproj/Menu.json"),fetch("../locales/"+e+".lproj/Panel.json")]).then((function(e){return Promise.all(e.map((function(e){return e.json()})))})).then((function(e){return Promise.resolve({Front:e[0],Menu:e[1],Panel:e[2]})}))};var B={Front:{},Menu:{},Panel:{},get:function(e,t){return B[t||"Panel"][e]||e}};window.Dict=B;var q=function(){console.debug("render...");var e=window.location.search.match(/tab=workspace/)?1:0,t=function(t){e=t;var n=new URLSearchParams(window.location.search);n.set("tab",t?"workspace":"file"),window.history.replaceState(null,null,"?"+n.toString()),r()},n=function(e,t,n){var l=e?"workspaceSetting":"fileSetting",i=window._options[l],o=Object(a.a)({},i);o[t]=n,window._options[l]=o,r()},l=function(e,t,n){var a=e?"workspaceSetting":"fileSetting",l=window._options[a][t];return void 0===l?n:l},r=function(){o.a.render(i.a.createElement(_,Object.assign({},window._options,{activeTab:e,setActiveTab:t,onChangeSetting:n,getSetting:l})),document.getElementById("root"))};r()};if(window.reloadData=function(){console.log("window.reloadData"),window.Setting.fetchLocalSetting().then((function(e){if(console.log("setting.getExtraOption done"),window._options=e,window._options.tempPath,window._options.userDataPath,window._options.documentsPath,!A){A=!0;var t=R();"Base"!==t&&t?window.loadDict(t).then((function(e){B=Object(a.a)(Object(a.a)({},B),e),q()})):A&&q()}}))},window.isNode&&window.reloadData(),window.webkit&&window._options._documentPath,window.fetch||(fetch=s.a),window.isUnibody&&document.body.classList.add("unibody-window"),Object(c.a)("esc",(function(e,t){"INPUT"===e.target.nodeName||document.querySelector(".modal-backdrop")||(e.preventDefault(),window.Setting.close())})),window.isMac){var I=!1;window.loadDict(R()).then((function(e){B=Object(a.a)(Object(a.a)({},B),e),I=!0,q()})),setTimeout((function(){!I&&q()}),1e3)}else window.isNode||q()},5:function(e,t,n){"use strict";n.d(t,"c",(function(){return d})),n.d(t,"d",(function(){return p})),n.d(t,"a",(function(){return s})),n.d(t,"b",(function(){return f}));var a=n(6),l=n(22),i=n(0),r=n.n(i),o=n(2),c=n(13),s=r.a.createContext(""),u=null,m=function(e,t){return u&&(clearTimeout(u),u=null),u=setTimeout((function(){u=null,t(e)}),100),e},d=function(e,t,n){if(!e||!t)return!1;if(t.toLowerCase().indexOf(e.toLowerCase())>-1)return!0;if("Base"!==(window.Setting.locale()||"Base")&&Object(o.a)(t,n).toLowerCase().indexOf(e.toLowerCase())>-1)return!0;return!1},p=function(e,t,n){if(!e)return!1;var a,i=Object(l.a)(t);try{for(i.s();!(a=i.n()).done;){var r=a.value;if(d(e,r,n))return!0}}catch(o){i.e(o)}finally{i.f()}return!1},f=function(e){var t=e.onSearch,n=r.a.useRef(null),l=r.a.useState((Object(c.a)(window.isMac?"command+f":"ctrl+f",(function(e,t){e.preventDefault(),window.searchOnPreferencePanel()})),"")),i=Object(a.a)(l,2),s=i[0],u=i[1];return window.searchOnPreferencePanel=function(){n.current&&(n.current.focus(),n.current.select())},r.a.createElement("div",{style:{position:"relative"},className:s?" show-clear-icon":""},r.a.createElement("input",{ref:n,className:"search-input",type:"search",placeholder:Object(o.a)("Search for\u2026","Panel"),value:s,onChange:function(e){u(m(e.target.value,t))}}),r.a.createElement("span",{className:"clear-btn-icon icon icon-cancel-circled",onMouseDown:function(e){u(m("",t)),e.preventDefault(),e.stopPropagation()}}))}}},[[42,6,0,8]]]);
//# sourceMappingURL=localSettingIndex.a2c75cbd.615b03e2.chunk.js.map