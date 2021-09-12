(this.webpackJsonpprofile=this.webpackJsonpprofile||[]).push([[0],{218:function(t,e,n){},271:function(t,e){},282:function(t,e){},311:function(t,e){},312:function(t,e){},458:function(t,e,n){"use strict";n.r(e);var a=n(0),s=n.n(a),i=n(68),r=n.n(i),o=(n(218),n(219),n(1)),c=n.n(o),h=n(74),l=n(75),d=n(76),u=n(84),p=n(81),f=n(474),b=n(459),m=n(475),j=n(473),k=n(477),g=n(146),x=n(471),O=n(472),y=n(476),v=n(90),C=n.n(v),w=n(95),S=n(13),M=function(t){Object(u.a)(n,t);var e=Object(p.a)(n);function n(t){var a;Object(l.a)(this,n);var s="text",i=!1;return(a=e.call(this,t)).props.content.startsWith("https://")?(s="https",i=!0):a.props.content.startsWith("ipfs://")&&(s="ipfs",i=!0),a.state={text:!0,lazy:i,type:s,lazyText:"loading...",iconColor:"grey"},a}return Object(d.a)(n,[{key:"componentDidMount",value:function(){var t=Object(h.a)(c.a.mark((function t(){var e,n;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!this.state.lazy){t.next=16;break}t.t0=this.state.type,t.next="https"===t.t0?4:"ipfs"===t.t0?10:4;break;case 4:return t.next=6,C.a.get(this.props.content);case 6:return e=t.sent,e.headers["content-type"].search("text/plain")>=0&&this.setState({lazyText:e.data,iconColor:"red"}),t.abrupt("break",16);case 10:return t.next=12,C.a.get("".concat("https://ipfs.io/ipfs/").concat(this.props.content.replace("ipfs://","")));case 12:return n=t.sent,n.headers["content-type"].search("text/plain")>=0&&this.setState({lazyText:n.data,iconColor:"teal"}),t.abrupt("break",16);case 16:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"render",value:function(){return Object(S.jsxs)(y.a,{fluid:!0,raised:!0,style:{background:"dark"===this.props.theme?"black":"white"},children:[Object(S.jsx)(y.a.Content,{children:Object(S.jsx)(y.a.Description,{content:this.state.lazy?this.state.lazyText:this.props.content,style:{color:"dark"===this.props.theme?"white":"black"}})}),Object(S.jsxs)(y.a.Content,{extra:!0,style:{color:"dark"===this.props.theme?"white":"black"},children:[this.state.lazy&&Object(S.jsxs)(w.a,{attached:"top right",color:this.state.iconColor,size:"tiny",children:[this.state.type," "]}),this.props.date]})]})}}]),n}(s.a.Component);function T(t){return t.split("").map((function(t){return t.charCodeAt(0).toString(16).padStart(2,"0")})).join("")}var I=function(t){Object(u.a)(n,t);var e=Object(p.a)(n);function n(t){var a;Object(l.a)(this,n),a=e.call(this,t);var s=localStorage.getItem("feed");return s=s?JSON.parse(s):[],a.state={feed:s},a}return Object(d.a)(n,[{key:"loadData",value:function(){var t=Object(h.a)(c.a.mark((function t(e){var n,a,s,i,r,o=this;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(e){t.next=2;break}return t.abrupt("return");case 2:n=window.ethereum.networkVersion,t.t0=n,t.next="80001"===t.t0?6:"137"===t.t0?8:10;break;case 6:return a="https://api-testnet.polygonscan.com",t.abrupt("break",11);case 8:return a="https://api.polygonscan.com",t.abrupt("break",11);case 10:return t.abrupt("return");case 11:return t.next=13,C.a.get("".concat(a,"/api?module=account&action=txlist&address=").concat(e,"&startblock=1&endblock=99999999&sort=asc"));case 13:if(s=t.sent,"1"===(i=s.data).status&&Array.isArray(i.result)){t.next=17;break}return t.abrupt("return");case 17:r=i.result.filter((function(t){return t.to.toLowerCase()===o.props.id.toLowerCase()})).filter((function(t){return"0x"!==t.input})).filter((function(t,e,n){return n.findIndex((function(e){return e.hash===t.hash}))===e})).map((function(t){var e,n=t.hash,a=t.input,s=t.timeStamp;return{hash:n,content:(e=a,decodeURIComponent(e.replace(/\s+/g,"").replace(/[0-9a-f]{2}/g,"%$&").substring(2))),date:new Date(1e3*parseInt(s)).toString().substring(0,24)}})).reverse(),this.setState({feed:r}),localStorage.setItem("feed",JSON.stringify(r));case 20:case"end":return t.stop()}}),t,this)})));return function(e){return t.apply(this,arguments)}}()},{key:"render",value:function(){var t=this;return Object(S.jsxs)(x.a,{style:{marginTop:"2.5em"},children:[Object(S.jsx)(O.a,{hidden:!0}),Object(S.jsx)(y.a.Group,{children:this.props.id&&this.state.feed.map((function(e){return Object(S.jsx)(M,Object(g.a)(Object(g.a)({},e),{},{theme:t.props.theme}),e.hash)}))})]})}}]),n}(s.a.Component),z=(0,n(245).create)("http://localhost:5001"),A=function(t){Object(u.a)(n,t);var e=Object(p.a)(n);function n(){var t;Object(l.a)(this,n),t=e.call(this);var a="undefined"===typeof window.ethereum,i=localStorage.getItem("id")||"";return t.state={theme:localStorage.getItem("theme")||"light",connect:!!i,disableConnect:a,id:i,addModalOpen:!1,postMessage:"",disableRefresh:!1},t.profile=s.a.createRef(),t}return Object(d.a)(n,[{key:"componentDidMount",value:function(){this.setTheme(this.state.theme)}},{key:"onClickToggleTheme",value:function(){"dark"===this.state.theme?this.setTheme("light"):this.setTheme("dark")}},{key:"setTheme",value:function(t){this.setState({theme:t}),localStorage.setItem("theme",t),document.body.classList.remove("dark"),document.body.classList.remove("light"),document.body.classList.add(t)}},{key:"onClickConnect",value:function(){var t=this;this.state.connect?(this.setState({connect:!1,id:""}),localStorage.removeItem("feed"),localStorage.removeItem("id")):window.ethereum.request({method:"eth_requestAccounts"}).then((function(e){var n=e[0];localStorage.setItem("id",n),t.setState({connect:!0,id:n}),t.profile.current.loadData(n)})).catch((function(e){t.setState({connect:!1,id:""}),localStorage.clear("feed"),localStorage.clear("id")}))}},{key:"onClickAdd",value:function(){this.setState({addModalOpen:!0,postMessage:""})}},{key:"onClickPostToMetamask",value:function(){var t=Object(h.a)(c.a.mark((function t(){var e,n,a,s,i=this;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!((e=this.state.postMessage).length>60)){t.next=9;break}return t.next=4,z.add(e,{pin:!0});case 4:a=t.sent,s=a.cid,n=T("ipfs://".concat(s.toString())),t.next=10;break;case 9:n=T(e);case 10:window.ethereum.request({method:"eth_sendTransaction",params:[{to:window.ethereum.selectedAddress,from:window.ethereum.selectedAddress,data:"0x".concat(n)}]}).then((function(t){})).catch((function(t){})).finally((function(t){return i.setState({addModalOpen:!1,postMessage:""})}));case 11:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"render",value:function(){var t=this;return Object(S.jsxs)("div",{className:this.state.theme,children:[Object(S.jsxs)(f.a,{fixed:"top",compact:!0,borderless:!0,inverted:"dark"===this.state.theme,children:[Object(S.jsx)(f.a.Item,{header:!0,content:this.state.id?"Profile ".concat(this.state.id.substring(0,6),"...").concat(this.state.id.slice(-4)):"Profile"}),this.state.id&&Object(S.jsx)(f.a.Item,{icon:"refresh",disabled:this.state.disableRefresh,onClick:function(){t.profile.current.loadData(t.state.id),t.setState({disableRefresh:!0}),setTimeout((function(){return t.setState({disableRefresh:!1})}),2e3)}}),Object(S.jsx)(f.a.Item,{position:"right",icon:"dark"===this.state.theme?"moon":"sun",onClick:this.onClickToggleTheme.bind(this)}),Object(S.jsx)(f.a.Item,{name:this.state.disableConnect?"Install Metamask":this.state.connect?"Disconnect":"Connect",icon:this.state.disableConnect?"warning":"power",onClick:this.state.disableConnect?function(){window.open("https://metamask.io","_blank")}:this.onClickConnect.bind(this)})]}),Object(S.jsx)(I,{ref:this.profile,theme:this.state.theme,id:this.state.id}),Object(S.jsx)(b.a,{circular:!0,icon:"add",size:"big",onClick:this.onClickAdd.bind(this),style:{display:this.state.connect?"block":"none",position:"fixed",margin:"2em",bottom:"0px",right:"0px",zIndex:6}}),Object(S.jsxs)(m.a,{open:this.state.addModalOpen,children:[Object(S.jsx)(m.a.Header,{children:"Post a new Message"}),Object(S.jsx)(m.a.Content,{children:Object(S.jsxs)(m.a.Description,{children:[Object(S.jsx)(j.a,{fluid:!0,placeholder:"Enter your messsage",onChange:function(e,n){var a=n.value;return t.setState({postMessage:a})}}),Object(S.jsxs)(k.a,{warning:!0,children:[Object(S.jsx)("p",{children:"Metamask will prompt you for transaction confirmation. Verify transaction amount is 0 and to address is your own. The data input will be a hex encode of your post."}),Object(S.jsx)("p",{children:"After confirming in Metamask, the transaction may take some time to finalize on the blockchain based on network conditions. You can refresh from the header icon when Metamask notifies you of successful posting."})]})]})}),Object(S.jsxs)(m.a.Actions,{children:[Object(S.jsx)(b.a,{negative:!0,content:"Cancel",onClick:function(){return t.setState({addModalOpen:!1,postMessage:""})}}),Object(S.jsx)(b.a,{content:"Post",labelPosition:"right",icon:"checkmark",positive:!0,disabled:!this.state.postMessage,onClick:this.onClickPostToMetamask.bind(this)})]})]})]})}}]),n}(s.a.Component),D=function(t){t&&t instanceof Function&&n.e(3).then(n.bind(null,480)).then((function(e){var n=e.getCLS,a=e.getFID,s=e.getFCP,i=e.getLCP,r=e.getTTFB;n(t),a(t),s(t),i(t),r(t)}))};r.a.render(Object(S.jsx)(s.a.StrictMode,{children:Object(S.jsx)(A,{})}),document.getElementById("root")),D()}},[[458,1,2]]]);
//# sourceMappingURL=main.75e80dd8.chunk.js.map