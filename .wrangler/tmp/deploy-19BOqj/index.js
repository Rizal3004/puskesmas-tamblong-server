var Se=async(e,t=Object.create(null))=>{let{all:r=!1,dot:s=!1}=t,i=(e instanceof L?e.raw.headers:e.headers).get("Content-Type");return i!==null&&i.startsWith("multipart/form-data")||i!==null&&i.startsWith("application/x-www-form-urlencoded")?ut(e,{all:r,dot:s}):{}};async function ut(e,t){let r=await e.formData();return r?lt(r,t):{}}function lt(e,t){let r=Object.create(null);return e.forEach((s,n)=>{t.all||n.endsWith("[]")?ht(r,n,s):r[n]=s}),t.dot&&Object.entries(r).forEach(([s,n])=>{s.includes(".")&&(ft(r,s,n),delete r[s])}),r}var ht=(e,t,r)=>{e[t]!==void 0?Array.isArray(e[t])?e[t].push(r):e[t]=[e[t],r]:e[t]=r},ft=(e,t,r)=>{let s=e,n=t.split(".");n.forEach((i,a)=>{a===n.length-1?s[i]=r:((!s[i]||typeof s[i]!="object"||Array.isArray(s[i])||s[i]instanceof File)&&(s[i]=Object.create(null)),s=s[i])})};var Y=e=>{let t=e.split("/");return t[0]===""&&t.shift(),t},Re=e=>{let{groups:t,path:r}=pt(e),s=Y(r);return mt(s,t)},pt=e=>{let t=[];return e=e.replace(/\{[^}]+\}/g,(r,s)=>{let n=`@${s}`;return t.push([n,r]),n}),{groups:t,path:e}},mt=(e,t)=>{for(let r=t.length-1;r>=0;r--){let[s]=t[r];for(let n=e.length-1;n>=0;n--)if(e[n].includes(s)){e[n]=e[n].replace(s,t[r][1]);break}}return e},N={},Z=e=>{if(e==="*")return"*";let t=e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);return t?(N[e]||(t[2]?N[e]=[e,t[1],new RegExp("^"+t[2]+"$")]:N[e]=[e,t[1],!0]),N[e]):null},wt=e=>{try{return decodeURI(e)}catch{return e.replace(/(?:%[0-9A-Fa-f]{2})+/g,t=>{try{return decodeURI(t)}catch{return t}})}},ee=e=>{let t=e.url,r=t.indexOf("/",8),s=r;for(;s<t.length;s++){let n=t.charCodeAt(s);if(n===37){let i=t.indexOf("?",s),a=t.slice(r,i===-1?void 0:i);return wt(a.includes("%25")?a.replace(/%25/g,"%2525"):a)}else if(n===63)break}return t.slice(r,s)};var _e=e=>{let t=ee(e);return t.length>1&&t[t.length-1]==="/"?t.slice(0,-1):t},j=(...e)=>{let t="",r=!1;for(let s of e)t[t.length-1]==="/"&&(t=t.slice(0,-1),r=!0),s[0]!=="/"&&(s=`/${s}`),s==="/"&&r?t=`${t}/`:s!=="/"&&(t=`${t}${s}`),s==="/"&&t===""&&(t="/");return t},J=e=>{if(!e.match(/\:.+\?$/))return null;let t=e.split("/"),r=[],s="";return t.forEach(n=>{if(n!==""&&!/\:/.test(n))s+="/"+n;else if(/\:/.test(n))if(/\?/.test(n)){r.length===0&&s===""?r.push("/"):r.push(s);let i=n.replace("?","");s+="/"+i,r.push(s)}else s+="/"+n}),r.filter((n,i,a)=>a.indexOf(n)===i)},X=e=>/[%+]/.test(e)?(e.indexOf("+")!==-1&&(e=e.replace(/\+/g," ")),/%/.test(e)?A(e):e):e,je=(e,t,r)=>{let s;if(!r&&t&&!/[%+]/.test(t)){let a=e.indexOf(`?${t}`,8);for(a===-1&&(a=e.indexOf(`&${t}`,8));a!==-1;){let c=e.charCodeAt(a+t.length+1);if(c===61){let o=a+t.length+2,d=e.indexOf("&",o);return X(e.slice(o,d===-1?void 0:d))}else if(c==38||isNaN(c))return"";a=e.indexOf(`&${t}`,a+1)}if(s=/[%+]/.test(e),!s)return}let n={};s??=/[%+]/.test(e);let i=e.indexOf("?",8);for(;i!==-1;){let a=e.indexOf("&",i+1),c=e.indexOf("=",i);c>a&&a!==-1&&(c=-1);let o=e.slice(i+1,c===-1?a===-1?void 0:a:c);if(s&&(o=X(o)),i=a,o==="")continue;let d;c===-1?d="":(d=e.slice(c+1,a===-1?void 0:a),s&&(d=X(d))),r?(n[o]&&Array.isArray(n[o])||(n[o]=[]),n[o].push(d)):n[o]??=d}return t?n[t]:n},Ae=je,ke=(e,t)=>je(e,t,!0),A=decodeURIComponent;var L=class{raw;#r;#s;routeIndex=0;path;bodyCache={};constructor(e,t="/",r=[[]]){this.raw=e,this.path=t,this.#s=r,this.#r={}}param(e){return e?this.getDecodedParam(e):this.getAllDecodedParams()}getDecodedParam(e){let t=this.#s[0][this.routeIndex][1][e],r=this.getParamValue(t);return r?/\%/.test(r)?A(r):r:void 0}getAllDecodedParams(){let e={},t=Object.keys(this.#s[0][this.routeIndex][1]);for(let r of t){let s=this.getParamValue(this.#s[0][this.routeIndex][1][r]);s&&typeof s=="string"&&(e[r]=/\%/.test(s)?A(s):s)}return e}getParamValue(e){return this.#s[1]?this.#s[1][e]:e}query(e){return Ae(this.url,e)}queries(e){return ke(this.url,e)}header(e){if(e)return this.raw.headers.get(e.toLowerCase())??void 0;let t={};return this.raw.headers.forEach((r,s)=>{t[s]=r}),t}async parseBody(e){return this.bodyCache.parsedBody??=await Se(this,e)}cachedBody=e=>{let{bodyCache:t,raw:r}=this,s=t[e];if(s)return s;let n=Object.keys(t)[0];return n?t[n].then(i=>(n==="json"&&(i=JSON.stringify(i)),new Response(i)[e]())):t[e]=r[e]()};json(){return this.cachedBody("json")}text(){return this.cachedBody("text")}arrayBuffer(){return this.cachedBody("arrayBuffer")}blob(){return this.cachedBody("blob")}formData(){return this.cachedBody("formData")}addValidatedData(e,t){this.#r[e]=t}valid(e){return this.#r[e]}get url(){return this.raw.url}get method(){return this.raw.method}get matchedRoutes(){return this.#s[0].map(([[,e]])=>e)}get routePath(){return this.#s[0].map(([[,e]])=>e)[this.routeIndex].path}};var He={Stringify:1,BeforeStream:2,Stream:3},gt=(e,t)=>{let r=new String(e);return r.isEscaped=!0,r.callbacks=t,r};var te=async(e,t,r,s,n)=>{let i=e.callbacks;if(!i?.length)return Promise.resolve(e);n?n[0]+=e:n=[e];let a=Promise.all(i.map(c=>c({phase:t,buffer:n,context:s}))).then(c=>Promise.all(c.filter(Boolean).map(o=>te(o,t,!1,s,n))).then(()=>n[0]));return r?gt(await a,i):a};var yt="text/plain; charset=UTF-8",re=(e,t={})=>(Object.entries(t).forEach(([r,s])=>e.set(r,s)),e),k=class{#r;#s;env={};#i;finalized=!1;error;#c=200;#o;#e;#t;#n;#a=!0;#l;#d;#u;#h;#f;constructor(e,t){this.#r=e,t&&(this.#o=t.executionCtx,this.env=t.env,this.#u=t.notFoundHandler,this.#f=t.path,this.#h=t.matchResult)}get req(){return this.#s??=new L(this.#r,this.#f,this.#h),this.#s}get event(){if(this.#o&&"respondWith"in this.#o)return this.#o;throw Error("This context has no FetchEvent")}get executionCtx(){if(this.#o)return this.#o;throw Error("This context has no ExecutionContext")}get res(){return this.#a=!1,this.#n||=new Response("404 Not Found",{status:404})}set res(e){if(this.#a=!1,this.#n&&e){this.#n.headers.delete("content-type");for(let[t,r]of this.#n.headers.entries())if(t==="set-cookie"){let s=this.#n.headers.getSetCookie();e.headers.delete("set-cookie");for(let n of s)e.headers.append("set-cookie",n)}else e.headers.set(t,r)}this.#n=e,this.finalized=!0}render=(...e)=>(this.#d??=t=>this.html(t),this.#d(...e));setLayout=e=>this.#l=e;getLayout=()=>this.#l;setRenderer=e=>{this.#d=e};header=(e,t,r)=>{if(t===void 0){this.#e?this.#e.delete(e):this.#t&&delete this.#t[e.toLocaleLowerCase()],this.finalized&&this.res.headers.delete(e);return}r?.append?(this.#e||(this.#a=!1,this.#e=new Headers(this.#t),this.#t={}),this.#e.append(e,t)):this.#e?this.#e.set(e,t):(this.#t??={},this.#t[e.toLowerCase()]=t),this.finalized&&(r?.append?this.res.headers.append(e,t):this.res.headers.set(e,t))};status=e=>{this.#a=!1,this.#c=e};set=(e,t)=>{this.#i??=new Map,this.#i.set(e,t)};get=e=>this.#i?this.#i.get(e):void 0;get var(){return this.#i?Object.fromEntries(this.#i):{}}newResponse=(e,t,r)=>{if(this.#a&&!r&&!t&&this.#c===200)return new Response(e,{headers:this.#t});if(t&&typeof t!="number"){let n=new Headers(t.headers);this.#e&&this.#e.forEach((a,c)=>{c==="set-cookie"?n.append(c,a):n.set(c,a)});let i=re(n,this.#t);return new Response(e,{headers:i,status:t.status??this.#c})}let s=typeof t=="number"?t:this.#c;this.#t??={},this.#e??=new Headers,re(this.#e,this.#t),this.#n&&(this.#n.headers.forEach((n,i)=>{i==="set-cookie"?this.#e?.append(i,n):this.#e?.set(i,n)}),re(this.#e,this.#t)),r??={};for(let[n,i]of Object.entries(r))if(typeof i=="string")this.#e.set(n,i);else{this.#e.delete(n);for(let a of i)this.#e.append(n,a)}return new Response(e,{status:s,headers:this.#e})};body=(e,t,r)=>typeof t=="number"?this.newResponse(e,t,r):this.newResponse(e,t);text=(e,t,r)=>{if(!this.#t){if(this.#a&&!r&&!t)return new Response(e);this.#t={}}return this.#t["content-type"]=yt,typeof t=="number"?this.newResponse(e,t,r):this.newResponse(e,t)};json=(e,t,r)=>{let s=JSON.stringify(e);return this.#t??={},this.#t["content-type"]="application/json; charset=UTF-8",typeof t=="number"?this.newResponse(s,t,r):this.newResponse(s,t)};html=(e,t,r)=>(this.#t??={},this.#t["content-type"]="text/html; charset=UTF-8",typeof e=="object"&&(e instanceof Promise||(e=e.toString()),e instanceof Promise)?e.then(s=>te(s,He.Stringify,!1,{})).then(s=>typeof t=="number"?this.newResponse(s,t,r):this.newResponse(s,t)):typeof t=="number"?this.newResponse(e,t,r):this.newResponse(e,t));redirect=(e,t)=>(this.#e??=new Headers,this.#e.set("Location",e),this.newResponse(null,t??302));notFound=()=>(this.#u??=()=>new Response,this.#u(this))};var se=(e,t,r)=>(s,n)=>{let i=-1;return a(0);async function a(c){if(c<=i)throw new Error("next() called multiple times");i=c;let o,d=!1,u;if(e[c]?(u=e[c][0][0],s instanceof k&&(s.req.routeIndex=c)):u=c===e.length&&n||void 0,!u)s instanceof k&&s.finalized===!1&&r&&(o=await r(s));else try{o=await u(s,()=>a(c+1))}catch(l){if(l instanceof Error&&s instanceof k&&t)s.error=l,o=await t(l,s),d=!0;else throw l}return o&&(s.finalized===!1||d)&&(s.res=o),s}};var h="ALL",Pe="all",Oe=["get","post","put","delete","options","patch"],K="Can not add a route since the matcher is already built.",U=class extends Error{};var bt=Symbol("composedHandler"),vt=e=>e.text("404 Not Found",404),Ce=(e,t)=>"getResponse"in e?e.getResponse():(console.error(e),t.text("Internal Server Error",500)),ne=class{get;post;put;delete;options;patch;all;on;use;router;getPath;_basePath="/";#r="/";routes=[];constructor(e={}){[...Oe,Pe].forEach(s=>{this[s]=(n,...i)=>(typeof n=="string"?this.#r=n:this.addRoute(s,this.#r,n),i.forEach(a=>{typeof a!="string"&&this.addRoute(s,this.#r,a)}),this)}),this.on=(s,n,...i)=>{for(let a of[n].flat()){this.#r=a;for(let c of[s].flat())i.map(o=>{this.addRoute(c.toUpperCase(),this.#r,o)})}return this},this.use=(s,...n)=>(typeof s=="string"?this.#r=s:(this.#r="*",n.unshift(s)),n.forEach(i=>{this.addRoute(h,this.#r,i)}),this);let r=e.strict??!0;delete e.strict,Object.assign(this,e),this.getPath=r?e.getPath??ee:_e}clone(){let e=new ne({router:this.router,getPath:this.getPath});return e.routes=this.routes,e}notFoundHandler=vt;errorHandler=Ce;route(e,t){let r=this.basePath(e);return t.routes.map(s=>{let n;t.errorHandler===Ce?n=s.handler:(n=async(i,a)=>(await se([],t.errorHandler)(i,()=>s.handler(i,a))).res,n[bt]=s.handler),r.addRoute(s.method,s.path,n)}),this}basePath(e){let t=this.clone();return t._basePath=j(this._basePath,e),t}onError=e=>(this.errorHandler=e,this);notFound=e=>(this.notFoundHandler=e,this);mount(e,t,r){let s,n;r&&(typeof r=="function"?n=r:(n=r.optionHandler,s=r.replaceRequest));let i=n?c=>{let o=n(c);return Array.isArray(o)?o:[o]}:c=>{let o;try{o=c.executionCtx}catch{}return[c.env,o]};s||=(()=>{let c=j(this._basePath,e),o=c==="/"?0:c.length;return d=>{let u=new URL(d.url);return u.pathname=u.pathname.slice(o)||"/",new Request(u,d)}})();let a=async(c,o)=>{let d=await t(s(c.req.raw),...i(c));if(d)return d;await o()};return this.addRoute(h,j(e,"*"),a),this}addRoute(e,t,r){e=e.toUpperCase(),t=j(this._basePath,t);let s={path:t,method:e,handler:r};this.router.add(e,t,[r,s]),this.routes.push(s)}matchRoute(e,t){return this.router.match(e,t)}handleError(e,t){if(e instanceof Error)return this.errorHandler(e,t);throw e}dispatch(e,t,r,s){if(s==="HEAD")return(async()=>new Response(null,await this.dispatch(e,t,r,"GET")))();let n=this.getPath(e,{env:r}),i=this.matchRoute(s,n),a=new k(e,{path:n,matchResult:i,env:r,executionCtx:t,notFoundHandler:this.notFoundHandler});if(i[0].length===1){let o;try{o=i[0][0][0][0](a,async()=>{a.res=await this.notFoundHandler(a)})}catch(d){return this.handleError(d,a)}return o instanceof Promise?o.then(d=>d||(a.finalized?a.res:this.notFoundHandler(a))).catch(d=>this.handleError(d,a)):o??this.notFoundHandler(a)}let c=se(i[0],this.errorHandler,this.notFoundHandler);return(async()=>{try{let o=await c(a);if(!o.finalized)throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return o.res}catch(o){return this.handleError(o,a)}})()}fetch=(e,...t)=>this.dispatch(e,t[1],t[0],e.method);request=(e,t,r,s)=>{if(e instanceof Request)return t!==void 0&&(e=new Request(e,t)),this.fetch(e,r,s);e=e.toString();let n=/^https?:\/\//.test(e)?e:`http://localhost${j("/",e)}`,i=new Request(n,t);return this.fetch(i,r,s)};fire=()=>{addEventListener("fetch",e=>{e.respondWith(this.dispatch(e.request,e,void 0,e.request.method))})}};var W="[^/]+",B=".*",$="(?:|/.*)",H=Symbol(),Et=new Set(".\\+*[^]$()");function xt(e,t){return e.length===1?t.length===1?e<t?-1:1:-1:t.length===1||e===B||e===$?1:t===B||t===$?-1:e===W?1:t===W?-1:e.length===t.length?e<t?-1:1:t.length-e.length}var F=class{index;varIndex;children=Object.create(null);insert(e,t,r,s,n){if(e.length===0){if(this.index!==void 0)throw H;if(n)return;this.index=t;return}let[i,...a]=e,c=i==="*"?a.length===0?["","",B]:["","",W]:i==="/*"?["","",$]:i.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/),o;if(c){let d=c[1],u=c[2]||W;if(d&&c[2]&&(u=u.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(u)))throw H;if(o=this.children[u],!o){if(Object.keys(this.children).some(l=>l!==B&&l!==$))throw H;if(n)return;o=this.children[u]=new F,d!==""&&(o.varIndex=s.varIndex++)}!n&&d!==""&&r.push([d,o.varIndex])}else if(o=this.children[i],!o){if(Object.keys(this.children).some(d=>d.length>1&&d!==B&&d!==$))throw H;if(n)return;o=this.children[i]=new F}o.insert(a,t,r,s,n)}buildRegExpStr(){let t=Object.keys(this.children).sort(xt).map(r=>{let s=this.children[r];return(typeof s.varIndex=="number"?`(${r})@${s.varIndex}`:Et.has(r)?`\\${r}`:r)+s.buildRegExpStr()});return typeof this.index=="number"&&t.unshift(`#${this.index}`),t.length===0?"":t.length===1?t[0]:"(?:"+t.join("|")+")"}};var De=class{context={varIndex:0};root=new F;insert(e,t,r){let s=[],n=[];for(let a=0;;){let c=!1;if(e=e.replace(/\{[^}]+\}/g,o=>{let d=`@\\${a}`;return n[a]=[d,o],a++,c=!0,d}),!c)break}let i=e.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let a=n.length-1;a>=0;a--){let[c]=n[a];for(let o=i.length-1;o>=0;o--)if(i[o].indexOf(c)!==-1){i[o]=i[o].replace(c,n[a][1]);break}}return this.root.insert(i,t,s,this.context,r),s}buildRegExp(){let e=this.root.buildRegExpStr();if(e==="")return[/^$/,[],[]];let t=0,r=[],s=[];return e=e.replace(/#(\d+)|@(\d+)|\.\*\$/g,(n,i,a)=>typeof i<"u"?(r[++t]=Number(i),"$()"):(typeof a<"u"&&(s[Number(a)]=++t),"")),[new RegExp(`^${e}`),r,s]}};var Te=[],St=[/^$/,[],Object.create(null)],Be=Object.create(null);function $e(e){return Be[e]??=new RegExp(e==="*"?"":`^${e.replace(/\/\*$|([.\\+*[^\]$()])/g,(t,r)=>r?`\\${r}`:"(?:|/.*)")}$`)}function Rt(){Be=Object.create(null)}function _t(e){let t=new De,r=[];if(e.length===0)return St;let s=e.map(d=>[!/\*|\/:/.test(d[0]),...d]).sort(([d,u],[l,p])=>d?1:l?-1:u.length-p.length),n=Object.create(null);for(let d=0,u=-1,l=s.length;d<l;d++){let[p,y,f]=s[d];p?n[y]=[f.map(([g])=>[g,Object.create(null)]),Te]:u++;let m;try{m=t.insert(y,u,p)}catch(g){throw g===H?new U(y):g}p||(r[u]=f.map(([g,R])=>{let D=Object.create(null);for(R-=1;R>=0;R--){let[v,M]=m[R];D[v]=M}return[g,D]}))}let[i,a,c]=t.buildRegExp();for(let d=0,u=r.length;d<u;d++)for(let l=0,p=r[d].length;l<p;l++){let y=r[d][l]?.[1];if(!y)continue;let f=Object.keys(y);for(let m=0,g=f.length;m<g;m++)y[f[m]]=c[y[f[m]]]}let o=[];for(let d in a)o[d]=r[a[d]];return[i,o,n]}function P(e,t){if(e){for(let r of Object.keys(e).sort((s,n)=>n.length-s.length))if($e(r).test(t))return[...e[r]]}}var ie=class{name="RegExpRouter";middleware;routes;constructor(){this.middleware={[h]:Object.create(null)},this.routes={[h]:Object.create(null)}}add(e,t,r){let{middleware:s,routes:n}=this;if(!s||!n)throw new Error(K);s[e]||[s,n].forEach(c=>{c[e]=Object.create(null),Object.keys(c[h]).forEach(o=>{c[e][o]=[...c[h][o]]})}),t==="/*"&&(t="*");let i=(t.match(/\/:/g)||[]).length;if(/\*$/.test(t)){let c=$e(t);e===h?Object.keys(s).forEach(o=>{s[o][t]||=P(s[o],t)||P(s[h],t)||[]}):s[e][t]||=P(s[e],t)||P(s[h],t)||[],Object.keys(s).forEach(o=>{(e===h||e===o)&&Object.keys(s[o]).forEach(d=>{c.test(d)&&s[o][d].push([r,i])})}),Object.keys(n).forEach(o=>{(e===h||e===o)&&Object.keys(n[o]).forEach(d=>c.test(d)&&n[o][d].push([r,i]))});return}let a=J(t)||[t];for(let c=0,o=a.length;c<o;c++){let d=a[c];Object.keys(n).forEach(u=>{(e===h||e===u)&&(n[u][d]||=[...P(s[u],d)||P(s[h],d)||[]],n[u][d].push([r,i-o+c+1]))})}}match(e,t){Rt();let r=this.buildAllMatchers();return this.match=(s,n)=>{let i=r[s]||r[h],a=i[2][n];if(a)return a;let c=n.match(i[0]);if(!c)return[[],Te];let o=c.indexOf("",1);return[i[1][o],c]},this.match(e,t)}buildAllMatchers(){let e=Object.create(null);return[...Object.keys(this.routes),...Object.keys(this.middleware)].forEach(t=>{e[t]||=this.buildMatcher(t)}),this.middleware=this.routes=void 0,e}buildMatcher(e){let t=[],r=e===h;return[this.middleware,this.routes].forEach(s=>{let n=s[e]?Object.keys(s[e]).map(i=>[i,s[e][i]]):[];n.length!==0?(r||=!0,t.push(...n)):e!==h&&t.push(...Object.keys(s[h]).map(i=>[i,s[h][i]]))}),r?_t(t):null}};var oe=class{name="SmartRouter";routers=[];routes=[];constructor(e){Object.assign(this,e)}add(e,t,r){if(!this.routes)throw new Error(K);this.routes.push([e,t,r])}match(e,t){if(!this.routes)throw new Error("Fatal error");let{routers:r,routes:s}=this,n=r.length,i=0,a;for(;i<n;i++){let c=r[i];try{s.forEach(o=>{c.add(...o)}),a=c.match(e,t)}catch(o){if(o instanceof U)continue;throw o}this.match=c.match.bind(c),this.routers=[c],this.routes=void 0;break}if(i===n)throw new Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,a}get activeRouter(){if(this.routes||this.routers.length!==1)throw new Error("No active router has been determined yet.");return this.routers[0]}};var ae=class{methods;children;patterns;order=0;name;params=Object.create(null);constructor(e,t,r){if(this.children=r||Object.create(null),this.methods=[],this.name="",e&&t){let s=Object.create(null);s[e]={handler:t,possibleKeys:[],score:0,name:this.name},this.methods=[s]}this.patterns=[]}insert(e,t,r){this.name=`${e} ${t}`,this.order=++this.order;let s=this,n=Re(t),i=[];for(let o=0,d=n.length;o<d;o++){let u=n[o];if(Object.keys(s.children).includes(u)){s=s.children[u];let p=Z(u);p&&i.push(p[1]);continue}s.children[u]=new ae;let l=Z(u);l&&(s.patterns.push(l),i.push(l[1])),s=s.children[u]}s.methods.length||(s.methods=[]);let a=Object.create(null),c={handler:r,possibleKeys:i.filter((o,d,u)=>u.indexOf(o)===d),name:this.name,score:this.order};return a[e]=c,s.methods.push(a),s}gHSets(e,t,r,s){let n=[];for(let i=0,a=e.methods.length;i<a;i++){let c=e.methods[i],o=c[t]||c[h],d=Object.create(null);o!==void 0&&(o.params=Object.create(null),o.possibleKeys.forEach(u=>{let l=d[o.name];o.params[u]=s[u]&&!l?s[u]:r[u]??s[u],d[o.name]=!0}),n.push(o))}return n}search(e,t){let r=[];this.params=Object.create(null);let n=[this],i=Y(t);for(let c=0,o=i.length;c<o;c++){let d=i[c],u=c===o-1,l=[];for(let p=0,y=n.length;p<y;p++){let f=n[p],m=f.children[d];m&&(m.params=f.params,u===!0?(m.children["*"]&&r.push(...this.gHSets(m.children["*"],e,f.params,Object.create(null))),r.push(...this.gHSets(m,e,f.params,Object.create(null)))):l.push(m));for(let g=0,R=f.patterns.length;g<R;g++){let D=f.patterns[g],v={...f.params};if(D==="*"){let Q=f.children["*"];Q&&(r.push(...this.gHSets(Q,e,f.params,Object.create(null))),l.push(Q));continue}if(d==="")continue;let[M,Ee,T]=D,_=f.children[M],xe=i.slice(c).join("/");if(T instanceof RegExp&&T.test(xe)){v[Ee]=xe,r.push(...this.gHSets(_,e,f.params,v));continue}(T===!0||T instanceof RegExp&&T.test(d))&&typeof M=="string"&&(v[Ee]=d,u===!0?(r.push(...this.gHSets(_,e,v,f.params)),_.children["*"]&&r.push(...this.gHSets(_.children["*"],e,v,f.params))):(_.params=v,l.push(_)))}}n=l}return[r.sort((c,o)=>c.score-o.score).map(({handler:c,params:o})=>[c,o])]}};var ce=class{name="TrieRouter";node;constructor(){this.node=new ae}add(e,t,r){let s=J(t);if(s){for(let n of s)this.node.insert(e,n,r);return}this.node.insert(e,t,r)}match(e,t){return this.node.search(e,t)}};var w=class extends ne{constructor(e={}){super(e),this.router=e.router??new oe({routers:[new ie,new ce]})}};var Ie=e=>{let r={...{origin:"*",allowMethods:["GET","HEAD","PUT","POST","DELETE","PATCH"],allowHeaders:[],exposeHeaders:[]},...e},s=(n=>typeof n=="string"?()=>n:typeof n=="function"?n:i=>n.includes(i)?i:n[0])(r.origin);return async function(i,a){function c(d,u){i.res.headers.set(d,u)}let o=s(i.req.header("origin")||"",i);if(o&&c("Access-Control-Allow-Origin",o),r.origin!=="*"){let d=i.req.header("Vary");d?c("Vary",d):c("Vary","Origin")}if(r.credentials&&c("Access-Control-Allow-Credentials","true"),r.exposeHeaders?.length&&c("Access-Control-Expose-Headers",r.exposeHeaders.join(",")),i.req.method==="OPTIONS"){r.maxAge!=null&&c("Access-Control-Max-Age",r.maxAge.toString()),r.allowMethods?.length&&c("Access-Control-Allow-Methods",r.allowMethods.join(","));let d=r.allowHeaders;if(!d?.length){let u=i.req.header("Access-Control-Request-Headers");u&&(d=u.split(/\s*,\s*/))}return d?.length&&(c("Access-Control-Allow-Headers",d.join(",")),i.res.headers.append("Vary","Access-Control-Request-Headers")),i.res.headers.delete("Content-Length"),i.res.headers.delete("Content-Type"),new Response(null,{headers:i.res.headers,status:204,statusText:i.res.statusText})}await a()}};var qe={name:"HMAC",hash:"SHA-256"},jt=async e=>{let t=typeof e=="string"?new TextEncoder().encode(e):e;return await crypto.subtle.importKey("raw",t,qe,!1,["sign","verify"])};var At=async(e,t,r)=>{try{let s=atob(e),n=new Uint8Array(s.length);for(let i=0,a=s.length;i<a;i++)n[i]=s.charCodeAt(i);return await crypto.subtle.verify(qe,r,n,new TextEncoder().encode(t))}catch{return!1}},kt=/^[\w!#$%&'*.^`|~+-]+$/,Ht=/^[ !#-:<-[\]-~]*$/,V=(e,t)=>e.trim().split(";").reduce((s,n)=>{n=n.trim();let i=n.indexOf("=");if(i===-1)return s;let a=n.substring(0,i).trim();if(t&&t!==a||!kt.test(a))return s;let c=n.substring(i+1).trim();return c.startsWith('"')&&c.endsWith('"')&&(c=c.slice(1,-1)),Ht.test(c)&&(s[a]=A(c)),s},{}),de=async(e,t,r)=>{let s={},n=await jt(t);for(let[i,a]of Object.entries(V(e,r))){let c=a.lastIndexOf(".");if(c<1)continue;let o=a.substring(0,c),d=a.substring(c+1);if(d.length!==44||!d.endsWith("="))continue;let u=await At(d,o,n);s[i]=u?o:!1}return s};var z=(e,t,r)=>{let s=e.req.raw.headers.get("Cookie");if(typeof t=="string"){if(!s)return;let i=t;return r==="secure"?i="__Secure-"+t:r==="host"&&(i="__Host-"+t),V(s,i)[i]}return s?V(s):{}},ue=async(e,t,r,s)=>{let n=e.req.raw.headers.get("Cookie");if(typeof r=="string"){if(!n)return;let a=r;return s==="secure"?a="__Secure-"+r:s==="host"&&(a="__Host-"+r),(await de(n,t,a))[a]}return n?await de(n,t):{}};var G=class extends Error{res;status;constructor(e=500,t){super(t?.message,{cause:t?.cause}),this.res=t?.res,this.status=e}getResponse(){return this.res?new Response(this.res.body,{status:this.status,headers:this.res.headers}):new Response(this.message,{status:this.status})}};var le=e=>fe(e.replace(/_|-/g,t=>({_:"/","-":"+"})[t]??t)),he=e=>Pt(e).replace(/\/|\+/g,t=>({"/":"_","+":"-"})[t]??t),Pt=e=>{let t="",r=new Uint8Array(e);for(let s=0,n=r.length;s<n;s++)t+=String.fromCharCode(r[s]);return btoa(t)},fe=e=>{let t=atob(e),r=new Uint8Array(new ArrayBuffer(t.length)),s=t.length/2;for(let n=0,i=t.length-1;n<=s;n++,i--)r[n]=t.charCodeAt(n),r[i]=t.charCodeAt(i);return r};var pe=(e=>(e.HS256="HS256",e.HS384="HS384",e.HS512="HS512",e.RS256="RS256",e.RS384="RS384",e.RS512="RS512",e.PS256="PS256",e.PS384="PS384",e.PS512="PS512",e.ES256="ES256",e.ES384="ES384",e.ES512="ES512",e.EdDSA="EdDSA",e))(pe||{});var Ot={deno:"Deno",bun:"Bun",workerd:"Cloudflare-Workers",node:"Node.js"},Me=()=>{let e=globalThis;if(typeof navigator<"u"&&!0){for(let[r,s]of Object.entries(Ot))if(Ct(s))return r}return typeof e?.EdgeRuntime=="string"?"edge-light":e?.fastly!==void 0?"fastly":e?.process?.release?.name==="node"?"node":"other"},Ct=e=>"Cloudflare-Workers".startsWith(e);var Le=class extends Error{constructor(e){super(`${e} is not an implemented algorithm`),this.name="JwtAlgorithmNotImplemented"}},me=class extends Error{constructor(e){super(`invalid JWT token: ${e}`),this.name="JwtTokenInvalid"}},Ne=class extends Error{constructor(e){super(`token (${e}) is being used before it's valid`),this.name="JwtTokenNotBefore"}},Je=class extends Error{constructor(e){super(`token (${e}) expired`),this.name="JwtTokenExpired"}},Ke=class extends Error{constructor(e,t){super(`Incorrect "iat" claim must be a older than "${e}" (iat: "${t}")`),this.name="JwtTokenIssuedAt"}},Ue=class extends Error{constructor(e){super(`jwt header is invalid: ${JSON.stringify(e)}`),this.name="JwtHeaderInvalid"}},We=class extends Error{constructor(e){super(`token(${e}) signature mismatched`),this.name="JwtTokenSignatureMismatched"}},O=(e=>(e.Encrypt="encrypt",e.Decrypt="decrypt",e.Sign="sign",e.Verify="verify",e.DeriveKey="deriveKey",e.DeriveBits="deriveBits",e.WrapKey="wrapKey",e.UnwrapKey="unwrapKey",e))(O||{});var S=new TextEncoder,Fe=new TextDecoder;async function ze(e,t,r){let s=Qe(t),n=await Dt(e,s);return await crypto.subtle.sign(s,n,r)}async function Ge(e,t,r,s){let n=Qe(t),i=await Tt(e,n);return await crypto.subtle.verify(n,i,r,s)}function we(e){return fe(e.replace(/-+(BEGIN|END).*/g,"").replace(/\s/g,""))}async function Dt(e,t){if(!crypto.subtle||!crypto.subtle.importKey)throw new Error("`crypto.subtle.importKey` is undefined. JWT auth middleware requires it.");if(Xe(e)){if(e.type!=="private")throw new Error(`unexpected non private key: CryptoKey.type is ${e.type}`);return e}let r=[O.Sign];return typeof e=="object"?await crypto.subtle.importKey("jwk",e,t,!1,r):e.includes("PRIVATE")?await crypto.subtle.importKey("pkcs8",we(e),t,!1,r):await crypto.subtle.importKey("raw",S.encode(e),t,!1,r)}async function Tt(e,t){if(!crypto.subtle||!crypto.subtle.importKey)throw new Error("`crypto.subtle.importKey` is undefined. JWT auth middleware requires it.");if(Xe(e)){if(e.type==="public"||e.type==="secret")return e;e=await Ve(e)}if(typeof e=="string"&&e.includes("PRIVATE")){let s=await crypto.subtle.importKey("pkcs8",we(e),t,!0,[O.Sign]);e=await Ve(s)}let r=[O.Verify];return typeof e=="object"?await crypto.subtle.importKey("jwk",e,t,!1,r):e.includes("PUBLIC")?await crypto.subtle.importKey("spki",we(e),t,!1,r):await crypto.subtle.importKey("raw",S.encode(e),t,!1,r)}async function Ve(e){if(e.type!=="private")throw new Error(`unexpected key type: ${e.type}`);if(!e.extractable)throw new Error("unexpected private key is unextractable");let t=await crypto.subtle.exportKey("jwk",e),{kty:r}=t,{alg:s,e:n,n:i}=t,{crv:a,x:c,y:o}=t;return{kty:r,alg:s,e:n,n:i,crv:a,x:c,y:o,key_ops:[O.Verify]}}function Qe(e){switch(e){case"HS256":return{name:"HMAC",hash:{name:"SHA-256"}};case"HS384":return{name:"HMAC",hash:{name:"SHA-384"}};case"HS512":return{name:"HMAC",hash:{name:"SHA-512"}};case"RS256":return{name:"RSASSA-PKCS1-v1_5",hash:{name:"SHA-256"}};case"RS384":return{name:"RSASSA-PKCS1-v1_5",hash:{name:"SHA-384"}};case"RS512":return{name:"RSASSA-PKCS1-v1_5",hash:{name:"SHA-512"}};case"PS256":return{name:"RSA-PSS",hash:{name:"SHA-256"},saltLength:32};case"PS384":return{name:"RSA-PSS",hash:{name:"SHA-384"},saltLength:48};case"PS512":return{name:"RSA-PSS",hash:{name:"SHA-512"},saltLength:64};case"ES256":return{name:"ECDSA",hash:{name:"SHA-256"},namedCurve:"P-256"};case"ES384":return{name:"ECDSA",hash:{name:"SHA-384"},namedCurve:"P-384"};case"ES512":return{name:"ECDSA",hash:{name:"SHA-512"},namedCurve:"P-521"};case"EdDSA":return{name:"Ed25519",namedCurve:"Ed25519"};default:throw new Le(e)}}function Xe(e){return Me()==="node"&&crypto.webcrypto?e instanceof crypto.webcrypto.CryptoKey:e instanceof CryptoKey}var Ye=e=>he(S.encode(JSON.stringify(e))).replace(/=/g,""),Bt=e=>he(e).replace(/=/g,""),Ze=e=>JSON.parse(Fe.decode(le(e)));function $t(e){if(typeof e=="object"&&e!==null){let t=e;return"alg"in t&&Object.values(pe).includes(t.alg)&&(!("typ"in t)||t.typ==="JWT")}return!1}var et=async(e,t,r="HS256")=>{let s=Ye(e),i=`${Ye({alg:r,typ:"JWT"})}.${s}`,a=await ze(t,r,S.encode(i)),c=Bt(a);return`${i}.${c}`},tt=async(e,t,r="HS256")=>{let s=e.split(".");if(s.length!==3)throw new me(e);let{header:n,payload:i}=ge(e);if(!$t(n))throw new Ue(n);let a=Math.floor(Date.now()/1e3);if(i.nbf&&i.nbf>a)throw new Ne(e);if(i.exp&&i.exp<=a)throw new Je(e);if(i.iat&&a<i.iat)throw new Ke(a,i.iat);let c=e.substring(0,e.lastIndexOf("."));if(!await Ge(t,r,le(s[2]),S.encode(c)))throw new We(e);return i},ge=e=>{try{let[t,r]=e.split("."),s=Ze(t),n=Ze(r);return{header:s,payload:n}}catch{throw new me(e)}};var I={sign:et,verify:tt,decode:ge};var be=e=>{if(!e||!e.secret)throw new Error('JWT auth middleware requires options for "secret"');if(!crypto.subtle||!crypto.subtle.importKey)throw new Error("`crypto.subtle.importKey` is undefined. JWT auth middleware requires it.");return async function(r,s){let n=r.req.raw.headers.get("Authorization"),i;if(n){let o=n.split(/\s+/);if(o.length!==2){let d="invalid credentials structure";throw new G(401,{message:d,res:ye({ctx:r,error:"invalid_request",errDescription:d})})}else i=o[1]}else e.cookie&&(typeof e.cookie=="string"?i=z(r,e.cookie):e.cookie.secret?e.cookie.prefixOptions?i=await ue(r,e.cookie.secret,e.cookie.key,e.cookie.prefixOptions):i=await ue(r,e.cookie.secret,e.cookie.key):e.cookie.prefixOptions?i=z(r,e.cookie.key,e.cookie.prefixOptions):i=z(r,e.cookie.key));if(!i){let o="no authorization included in request";throw new G(401,{message:o,res:ye({ctx:r,error:"invalid_request",errDescription:o})})}let a,c;try{a=await I.verify(i,e.secret,e.alg)}catch(o){c=o}if(!a)throw new G(401,{message:"Unauthorized",res:ye({ctx:r,error:"invalid_token",statusText:"Unauthorized",errDescription:"token verification failure"}),cause:c});r.set("jwtPayload",a),await s()}};function ye(e){return new Response("Unauthorized",{status:401,statusText:e.statusText,headers:{"WWW-Authenticate":`Bearer realm="${e.ctx.req.url}",error="${e.error}",error_description="${e.errDescription}"`}})}var It=I.verify,qt=I.decode,ve=I.sign;var q=new w;q.use("/verify",(e,t)=>be({secret:e.env.JWT_SECRET})(e,t));q.post("/login",async e=>{let t=e.env.DB,{email:r,password:s}=await e.req.json(),n=e.env.JWT_SECRET,i=await t.prepare("select * from patients where email = ? and password = ?").bind(r,s).first();if(!i)return e.text("Invalid email or password",401);let a=await ve({id:i.id},n);return e.json({token:a,patient:i})});q.post("/verify",async e=>{let t=e.env.DB,{id:r}=e.get("jwtPayload"),s=await t.prepare("select * from patients where id = ?").bind(r).first();return s?e.json({patient:s}):e.text("Invalid token",401)});q.post("/register",async e=>{let t=e.env.DB,{email:r,password:s,name:n,nik:i}=await e.req.json();return await t.prepare("insert into patients (email, password, name, nik) values (?, ?, ?, ?)").bind(r,s,n,i).run(),e.json({message:"success"})});var rt=q;var b=new w;b.get("/",async e=>{let r=await e.env.DB.prepare("select * from patients").all();return e.json({patients:r.results})});b.get("/:id",async e=>{let t=e.env.DB,r=e.req.param("id"),s=await t.prepare("select * from patients where id = ?").bind(r).first();return e.json(s)});b.patch("/:id/email",async e=>{let t=e.env.DB,r=e.req.param("id"),{email:s}=await e.req.json();return await t.prepare("update patients set email = ? where id = ?").bind(s,r).run(),e.json({message:"Email updated"})});b.patch("/:id/password",async e=>{let t=e.env.DB,r=e.req.param("id"),{password:s}=await e.req.json();return await t.prepare("update patients set password = ? where id = ?").bind(s,r).run(),e.json({message:"Password updated"})});b.patch("/:id/phone",async e=>{let t=e.env.DB,r=e.req.param("id"),{phone:s}=await e.req.json();return await t.prepare("update patients set phone = ? where id = ?").bind(s,r).run(),e.json({message:"Phone updated"})});b.patch("/:id/address",async e=>{let t=e.env.DB,r=e.req.param("id"),{address:s}=await e.req.json();return await t.prepare("update patients set address = ? where id = ?").bind(s,r).run(),e.json({message:"Address updated"})});b.patch("/:id/birthdate",async e=>{let t=e.env.DB,r=e.req.param("id"),{birthdate:s}=await e.req.json();return await t.prepare("update patients set birthdate = ? where id = ?").bind(s,r).run(),e.json({message:"Birthdate updated"})});b.delete("/:id",async e=>{let t=e.env.DB,r=e.req.param("id");return await t.prepare("select * from booking_activity where pasien_id = ?").bind(r).first()?e.text("Patient is still booked",400):(await t.prepare("delete from patients where id = ?").bind(r).run(),e.json({message:"Patient deleted"}))});var st=b;var E=new w;E.get("/",async e=>{let r=await e.env.DB.prepare("select * from booking_activity").all();return e.json({bookingActivities:r.results})});E.post("/",async e=>{let t=e.env.DB,{starts_at:r,ends_at:s,bpjs_number:n,pasien_id:i,dokter_id:a,date:c,patient_type:o,keluhan:d}=await e.req.json();await t.prepare("insert into booking_activity (bpjs_number, pasien_id, dokter_id, date, patient_type, keluhan, starts_at, ends_at ) values ( ?, ?, ?, ?, ?, ?, ?, ?)").bind(n,i,a,c,o,d,r,s).run();let u=(await t.prepare("select last_insert_rowid() as id").first()).id,l=await t.prepare("select * from booking_activity where id = ?").bind(u).first();return e.json({booking_activity:l})});E.get("/patient/:id",async e=>{let t=e.env.DB,r=e.req.param("id"),s=await t.prepare('select * from booking_activity where pasien_id = ? and status = "booked"').bind(r).first();return e.json({bookingActivity:s})});E.patch("/:id/done",async e=>{let t=e.env.DB,r=e.req.param("id"),{penyakit:s,resep:n}=await e.req.json();return await t.prepare(`
    update booking_activity 
    set status = "done", penyakit = ?, resep = ? 
    where id = ?`).bind(s,n,r).run(),e.json({message:"Booking activity done"})});E.patch("/:id/cancel",async e=>{let t=e.env.DB,r=e.req.param("id");return await t.prepare('update booking_activity set status = "canceled" where id = ?').bind(r).run(),e.json({message:"Booking activity cancel"})});E.patch("/:id/update-time-and-doctor",async e=>{let t=e.env.DB,r=e.req.param("id"),{starts_at:s,ends_at:n,date:i,dokter_id:a}=await e.req.json();return await t.prepare(`
    update booking_activity 
    set starts_at = ?, ends_at = ?, date = ?, dokter_id = ?
    where id = ?`).bind(s,n,i,a,r).run(),e.json({message:"Booking activity updated"})});E.patch("/:id/arrived",async e=>{let t=e.env.DB,r=e.req.param("id");return await t.prepare('update booking_activity set arrived_at = datetime(current_timestamp, "localtime") where id = ?').bind(r).run(),e.json({message:"Booking activity arrived"})});var nt=E;function it(e){let t="";return new Uint8Array(e).forEach(r=>{t+=String.fromCharCode(r)}),btoa(t)}function ot(e){e=atob(e);let t=e.length,r=new ArrayBuffer(t),s=new Uint8Array(r);for(var n=0;n<t;n++)s[n]=e.charCodeAt(n);return r}var C=new w;C.get("/",async e=>{let r=await e.env.DB.prepare('select * from doctor where status = "active"').all();return e.json(r.results)});C.get("/:id",async e=>{let t=e.env.DB,r=e.req.param("id"),s=await t.prepare("select * from doctor where id = ?").bind(r).first();return e.json(s)});C.post("/:id/deactivate",async e=>{let t=e.env.DB,r=e.req.param("id");return await t.prepare('select * from booking_activity where dokter_id = ? and status = "booked"').bind(r).first()?e.text("Doctor is handling booking activity, cannot be deleted",400):(await t.prepare('update doctor set status = "nonactive" where id = ?').bind(r).run(),e.json({message:"Doctor deleted"}))});C.post("/",async e=>{let t=e.env.DB,r=e.env.puskesmas_tamblong_kv,{email:s,imageFile:n,jam_kerja_end:i,jam_kerja_start:a,name:c,phone:o,poli_id:d}=await e.req.parseBody();await t.prepare(`
    insert into doctor (email, jam_kerja_start, jam_kerja_end, name, phone, poli_id)
    values (?, ?, ?, ?, ?, ?)
  `).bind(s,a,i,c,o,d).run();let u=(await t.prepare("select last_insert_rowid() as id").first()).id,l=await t.prepare("select * from doctor where id = ?").bind(u).first(),p=it(await n.arrayBuffer());return await r.put(`images/doctor/${u}.png`,p),e.json({doctor:l})});C.get("/image/:id",async e=>{let t=e.env.puskesmas_tamblong_kv,r=e.req.param("id"),s=await t.get(`images/doctor/${r}.png`);return s?e.body(ot(s),200,{"Content-Type":"image/png"}):e.text("Image not found",404)});var at=C;var ct=new w;ct.get("/",async e=>{let r=await e.env.DB.prepare("select * from poli").all();return e.json({poli:r.results})});var dt=ct;var x=new w;x.use("*",Ie());x.get("/",e=>e.text("Hello Hono!"));x.route("/auth",rt);x.route("/patients",st);x.route("/doctors",at);x.route("/booking-activities",nt);x.route("/poli",dt);var Zs=x;export{Zs as default};
//# sourceMappingURL=index.js.map
