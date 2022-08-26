/* empty css                          */import{p as Qe}from"./hooks.module.27353e34.js";import{e as N}from"./jsxRuntime.module.600b31b6.js";import{p as he}from"./preact.module.8a47de0f.js";var se={exports:{}};function ie(e){return e instanceof Map?e.clear=e.delete=e.set=function(){throw new Error("map is read-only")}:e instanceof Set&&(e.add=e.clear=e.delete=function(){throw new Error("set is read-only")}),Object.freeze(e),Object.getOwnPropertyNames(e).forEach(function(n){var t=e[n];typeof t=="object"&&!Object.isFrozen(t)&&ie(t)}),e}se.exports=ie;se.exports.default=ie;class de{constructor(n){n.data===void 0&&(n.data={}),this.data=n.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function Xe(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function U(e,...n){const t=Object.create(null);for(const E in e)t[E]=e[E];return n.forEach(function(E){for(const g in E)t[g]=E[g]}),t}const qe="</span>",Me=e=>!!e.scope||e.sublanguage&&e.language,en=(e,{prefix:n})=>{if(e.includes(".")){const t=e.split(".");return[`${n}${t.shift()}`,...t.map((E,g)=>`${E}${"_".repeat(g+1)}`)].join(" ")}return`${n}${e}`};class nn{constructor(n,t){this.buffer="",this.classPrefix=t.classPrefix,n.walk(this)}addText(n){this.buffer+=Xe(n)}openNode(n){if(!Me(n))return;let t="";n.sublanguage?t=`language-${n.language}`:t=en(n.scope,{prefix:this.classPrefix}),this.span(t)}closeNode(n){!Me(n)||(this.buffer+=qe)}value(){return this.buffer}span(n){this.buffer+=`<span class="${n}">`}}const pe=(e={})=>{const n={children:[]};return Object.assign(n,e),n};class re{constructor(){this.rootNode=pe(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(n){this.top.children.push(n)}openNode(n){const t=pe({scope:n});this.add(t),this.stack.push(t)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(n){return this.constructor._walk(n,this.rootNode)}static _walk(n,t){return typeof t=="string"?n.addText(t):t.children&&(n.openNode(t),t.children.forEach(E=>this._walk(n,E)),n.closeNode(t)),n}static _collapse(n){typeof n!="string"&&(!n.children||(n.children.every(t=>typeof t=="string")?n.children=[n.children.join("")]:n.children.forEach(t=>{re._collapse(t)})))}}class tn extends re{constructor(n){super(),this.options=n}addKeyword(n,t){n!==""&&(this.openNode(t),this.addText(n),this.closeNode())}addText(n){n!==""&&this.add(n)}addSublanguage(n,t){const E=n.root;E.sublanguage=!0,E.language=t,this.add(E)}toHTML(){return new nn(this,this.options).value()}finalize(){return!0}}function I(e){return e?typeof e=="string"?e:e.source:null}function be(e){return B("(?=",e,")")}function sn(e){return B("(?:",e,")*")}function rn(e){return B("(?:",e,")?")}function B(...e){return e.map(t=>I(t)).join("")}function cn(e){const n=e[e.length-1];return typeof n=="object"&&n.constructor===Object?(e.splice(e.length-1,1),n):{}}function ce(...e){const n=cn(e);return"("+(n.capture?"":"?:")+e.map(E=>I(E)).join("|")+")"}function Ge(e){return new RegExp(e.toString()+"|").exec("").length-1}function on(e,n){const t=e&&e.exec(n);return t&&t.index===0}const an=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function oe(e,{joinWith:n}){let t=0;return e.map(E=>{t+=1;const g=t;let M=I(E),c="";for(;M.length>0;){const r=an.exec(M);if(!r){c+=M;break}c+=M.substring(0,r.index),M=M.substring(r.index+r[0].length),r[0][0]==="\\"&&r[1]?c+="\\"+String(Number(r[1])+g):(c+=r[0],r[0]==="("&&t++)}return c}).map(E=>`(${E})`).join(n)}const ln=/\b\B/,we="[a-zA-Z]\\w*",ae="[a-zA-Z_]\\w*",Pe="\\b\\d+(\\.\\d+)?",_e="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",De="\\b(0b[01]+)",En="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",un=(e={})=>{const n=/^#![ ]*\//;return e.binary&&(e.begin=B(n,/.*\b/,e.binary,/\b.*/)),U({scope:"meta",begin:n,end:/$/,relevance:0,"on:begin":(t,E)=>{t.index!==0&&E.ignoreMatch()}},e)},k={begin:"\\\\[\\s\\S]",relevance:0},On={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[k]},Rn={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[k]},fn={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},W=function(e,n,t={}){const E=U({scope:"comment",begin:e,end:n,contains:[]},t);E.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const g=ce("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return E.contains.push({begin:B(/[ ]+/,"(",g,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),E},gn=W("//","$"),hn=W("/\\*","\\*/"),dn=W("#","$"),Mn={scope:"number",begin:Pe,relevance:0},pn={scope:"number",begin:_e,relevance:0},Cn={scope:"number",begin:De,relevance:0},An={begin:/(?=\/[^/\n]*\/)/,contains:[{scope:"regexp",begin:/\//,end:/\/[gimuy]*/,illegal:/\n/,contains:[k,{begin:/\[/,end:/\]/,relevance:0,contains:[k]}]}]},Ln={scope:"title",begin:we,relevance:0},Nn={scope:"title",begin:ae,relevance:0},Xn={begin:"\\.\\s*"+ae,relevance:0},bn=function(e){return Object.assign(e,{"on:begin":(n,t)=>{t.data._beginMatch=n[1]},"on:end":(n,t)=>{t.data._beginMatch!==n[1]&&t.ignoreMatch()}})};var K=Object.freeze({__proto__:null,MATCH_NOTHING_RE:ln,IDENT_RE:we,UNDERSCORE_IDENT_RE:ae,NUMBER_RE:Pe,C_NUMBER_RE:_e,BINARY_NUMBER_RE:De,RE_STARTERS_RE:En,SHEBANG:un,BACKSLASH_ESCAPE:k,APOS_STRING_MODE:On,QUOTE_STRING_MODE:Rn,PHRASAL_WORDS_MODE:fn,COMMENT:W,C_LINE_COMMENT_MODE:gn,C_BLOCK_COMMENT_MODE:hn,HASH_COMMENT_MODE:dn,NUMBER_MODE:Mn,C_NUMBER_MODE:pn,BINARY_NUMBER_MODE:Cn,REGEXP_MODE:An,TITLE_MODE:Ln,UNDERSCORE_TITLE_MODE:Nn,METHOD_GUARD:Xn,END_SAME_AS_BEGIN:bn});function Gn(e,n){e.input[e.index-1]==="."&&n.ignoreMatch()}function wn(e,n){e.className!==void 0&&(e.scope=e.className,delete e.className)}function Pn(e,n){!n||!e.beginKeywords||(e.begin="\\b("+e.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",e.__beforeBegin=Gn,e.keywords=e.keywords||e.beginKeywords,delete e.beginKeywords,e.relevance===void 0&&(e.relevance=0))}function _n(e,n){!Array.isArray(e.illegal)||(e.illegal=ce(...e.illegal))}function Dn(e,n){if(!!e.match){if(e.begin||e.end)throw new Error("begin & end are not supported with match");e.begin=e.match,delete e.match}}function Hn(e,n){e.relevance===void 0&&(e.relevance=1)}const Un=(e,n)=>{if(!e.beforeMatch)return;if(e.starts)throw new Error("beforeMatch cannot be used with starts");const t=Object.assign({},e);Object.keys(e).forEach(E=>{delete e[E]}),e.keywords=t.keywords,e.begin=B(t.beforeMatch,be(t.begin)),e.starts={relevance:0,contains:[Object.assign(t,{endsParent:!0})]},e.relevance=0,delete t.beforeMatch},xn=["of","and","for","in","not","or","if","then","parent","list","value"],Sn="keyword";function He(e,n,t=Sn){const E=Object.create(null);return typeof e=="string"?g(t,e.split(" ")):Array.isArray(e)?g(t,e):Object.keys(e).forEach(function(M){Object.assign(E,He(e[M],n,M))}),E;function g(M,c){n&&(c=c.map(r=>r.toLowerCase())),c.forEach(function(r){const l=r.split("|");E[l[0]]=[M,Bn(l[0],l[1])]})}}function Bn(e,n){return n?Number(n):$n(e)?0:1}function $n(e){return xn.includes(e.toLowerCase())}const Ce={},S=e=>{console.error(e)},Ae=(e,...n)=>{console.log(`WARN: ${e}`,...n)},$=(e,n)=>{Ce[`${e}/${n}`]||(console.log(`Deprecated as of ${e}. ${n}`),Ce[`${e}/${n}`]=!0)},z=new Error;function Ue(e,n,{key:t}){let E=0;const g=e[t],M={},c={};for(let r=1;r<=n.length;r++)c[r+E]=g[r],M[r+E]=!0,E+=Ge(n[r-1]);e[t]=c,e[t]._emit=M,e[t]._multi=!0}function yn(e){if(!!Array.isArray(e.begin)){if(e.skip||e.excludeBegin||e.returnBegin)throw S("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),z;if(typeof e.beginScope!="object"||e.beginScope===null)throw S("beginScope must be object"),z;Ue(e,e.begin,{key:"beginScope"}),e.begin=oe(e.begin,{joinWith:""})}}function In(e){if(!!Array.isArray(e.end)){if(e.skip||e.excludeEnd||e.returnEnd)throw S("skip, excludeEnd, returnEnd not compatible with endScope: {}"),z;if(typeof e.endScope!="object"||e.endScope===null)throw S("endScope must be object"),z;Ue(e,e.end,{key:"endScope"}),e.end=oe(e.end,{joinWith:""})}}function kn(e){e.scope&&typeof e.scope=="object"&&e.scope!==null&&(e.beginScope=e.scope,delete e.scope)}function Tn(e){kn(e),typeof e.beginScope=="string"&&(e.beginScope={_wrap:e.beginScope}),typeof e.endScope=="string"&&(e.endScope={_wrap:e.endScope}),yn(e),In(e)}function vn(e){function n(c,r){return new RegExp(I(c),"m"+(e.case_insensitive?"i":"")+(e.unicodeRegex?"u":"")+(r?"g":""))}class t{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(r,l){l.position=this.position++,this.matchIndexes[this.matchAt]=l,this.regexes.push([l,r]),this.matchAt+=Ge(r)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);const r=this.regexes.map(l=>l[1]);this.matcherRe=n(oe(r,{joinWith:"|"}),!0),this.lastIndex=0}exec(r){this.matcherRe.lastIndex=this.lastIndex;const l=this.matcherRe.exec(r);if(!l)return null;const A=l.findIndex((y,J)=>J>0&&y!==void 0),p=this.matchIndexes[A];return l.splice(0,A),Object.assign(l,p)}}class E{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(r){if(this.multiRegexes[r])return this.multiRegexes[r];const l=new t;return this.rules.slice(r).forEach(([A,p])=>l.addRule(A,p)),l.compile(),this.multiRegexes[r]=l,l}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(r,l){this.rules.push([r,l]),l.type==="begin"&&this.count++}exec(r){const l=this.getMatcher(this.regexIndex);l.lastIndex=this.lastIndex;let A=l.exec(r);if(this.resumingScanAtSamePosition()&&!(A&&A.index===this.lastIndex)){const p=this.getMatcher(0);p.lastIndex=this.lastIndex+1,A=p.exec(r)}return A&&(this.regexIndex+=A.position+1,this.regexIndex===this.count&&this.considerAll()),A}}function g(c){const r=new E;return c.contains.forEach(l=>r.addRule(l.begin,{rule:l,type:"begin"})),c.terminatorEnd&&r.addRule(c.terminatorEnd,{type:"end"}),c.illegal&&r.addRule(c.illegal,{type:"illegal"}),r}function M(c,r){const l=c;if(c.isCompiled)return l;[wn,Dn,Tn,Un].forEach(p=>p(c,r)),e.compilerExtensions.forEach(p=>p(c,r)),c.__beforeBegin=null,[Pn,_n,Hn].forEach(p=>p(c,r)),c.isCompiled=!0;let A=null;return typeof c.keywords=="object"&&c.keywords.$pattern&&(c.keywords=Object.assign({},c.keywords),A=c.keywords.$pattern,delete c.keywords.$pattern),A=A||/\w+/,c.keywords&&(c.keywords=He(c.keywords,e.case_insensitive)),l.keywordPatternRe=n(A,!0),r&&(c.begin||(c.begin=/\B|\b/),l.beginRe=n(l.begin),!c.end&&!c.endsWithParent&&(c.end=/\B|\b/),c.end&&(l.endRe=n(l.end)),l.terminatorEnd=I(l.end)||"",c.endsWithParent&&r.terminatorEnd&&(l.terminatorEnd+=(c.end?"|":"")+r.terminatorEnd)),c.illegal&&(l.illegalRe=n(c.illegal)),c.contains||(c.contains=[]),c.contains=[].concat(...c.contains.map(function(p){return Vn(p==="self"?c:p)})),c.contains.forEach(function(p){M(p,l)}),c.starts&&M(c.starts,r),l.matcher=g(l),l}if(e.compilerExtensions||(e.compilerExtensions=[]),e.contains&&e.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return e.classNameAliases=U(e.classNameAliases||{}),M(e)}function xe(e){return e?e.endsWithParent||xe(e.starts):!1}function Vn(e){return e.variants&&!e.cachedVariants&&(e.cachedVariants=e.variants.map(function(n){return U(e,{variants:null},n)})),e.cachedVariants?e.cachedVariants:xe(e)?U(e,{starts:e.starts?U(e.starts):null}):Object.isFrozen(e)?U(e):e}var mn="11.6.0";class jn extends Error{constructor(n,t){super(n),this.name="HTMLInjectionError",this.html=t}}const ne=Xe,Le=U,Ne=Symbol("nomatch"),Fn=7,Kn=function(e){const n=Object.create(null),t=Object.create(null),E=[];let g=!0;const M="Could not find the language '{}', did you forget to load/include a language module?",c={disableAutodetect:!0,name:"Plain text",contains:[]};let r={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:tn};function l(s){return r.noHighlightRe.test(s)}function A(s){let a=s.className+" ";a+=s.parentNode?s.parentNode.className:"";const R=r.languageDetectRe.exec(a);if(R){const h=P(R[1]);return h||(Ae(M.replace("{}",R[1])),Ae("Falling back to no-highlight mode for this block.",s)),h?R[1]:"no-highlight"}return a.split(/\s+/).find(h=>l(h)||P(h))}function p(s,a,R){let h="",C="";typeof a=="object"?(h=s,R=a.ignoreIllegals,C=a.language):($("10.7.0","highlight(lang, code, ...args) has been deprecated."),$("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),C=s,h=a),R===void 0&&(R=!0);const G={code:h,language:C};V("before:highlight",G);const _=G.result?G.result:y(G.language,G.code,R);return _.code=G.code,V("after:highlight",_),_}function y(s,a,R,h){const C=Object.create(null);function G(i,o){return i.keywords[o]}function _(){if(!u.keywords){L.addText(d);return}let i=0;u.keywordPatternRe.lastIndex=0;let o=u.keywordPatternRe.exec(d),O="";for(;o;){O+=d.substring(i,o.index);const f=H.case_insensitive?o[0].toLowerCase():o[0],X=G(u,f);if(X){const[w,Ye]=X;if(L.addText(O),O="",C[f]=(C[f]||0)+1,C[f]<=Fn&&(F+=Ye),w.startsWith("_"))O+=o[0];else{const Ze=H.classNameAliases[w]||w;L.addKeyword(o[0],Ze)}}else O+=o[0];i=u.keywordPatternRe.lastIndex,o=u.keywordPatternRe.exec(d)}O+=d.substring(i),L.addText(O)}function m(){if(d==="")return;let i=null;if(typeof u.subLanguage=="string"){if(!n[u.subLanguage]){L.addText(d);return}i=y(u.subLanguage,d,!0,ge[u.subLanguage]),ge[u.subLanguage]=i._top}else i=Y(d,u.subLanguage.length?u.subLanguage:null);u.relevance>0&&(F+=i.relevance),L.addSublanguage(i._emitter,i.language)}function b(){u.subLanguage!=null?m():_(),d=""}function D(i,o){let O=1;const f=o.length-1;for(;O<=f;){if(!i._emit[O]){O++;continue}const X=H.classNameAliases[i[O]]||i[O],w=o[O];X?L.addKeyword(w,X):(d=w,_(),d=""),O++}}function Oe(i,o){return i.scope&&typeof i.scope=="string"&&L.openNode(H.classNameAliases[i.scope]||i.scope),i.beginScope&&(i.beginScope._wrap?(L.addKeyword(d,H.classNameAliases[i.beginScope._wrap]||i.beginScope._wrap),d=""):i.beginScope._multi&&(D(i.beginScope,o),d="")),u=Object.create(i,{parent:{value:u}}),u}function Re(i,o,O){let f=on(i.endRe,O);if(f){if(i["on:end"]){const X=new de(i);i["on:end"](o,X),X.isMatchIgnored&&(f=!1)}if(f){for(;i.endsParent&&i.parent;)i=i.parent;return i}}if(i.endsWithParent)return Re(i.parent,o,O)}function Fe(i){return u.matcher.regexIndex===0?(d+=i[0],1):(ee=!0,0)}function Ke(i){const o=i[0],O=i.rule,f=new de(O),X=[O.__beforeBegin,O["on:begin"]];for(const w of X)if(!!w&&(w(i,f),f.isMatchIgnored))return Fe(o);return O.skip?d+=o:(O.excludeBegin&&(d+=o),b(),!O.returnBegin&&!O.excludeBegin&&(d=o)),Oe(O,i),O.returnBegin?0:o.length}function ze(i){const o=i[0],O=a.substring(i.index),f=Re(u,i,O);if(!f)return Ne;const X=u;u.endScope&&u.endScope._wrap?(b(),L.addKeyword(o,u.endScope._wrap)):u.endScope&&u.endScope._multi?(b(),D(u.endScope,i)):X.skip?d+=o:(X.returnEnd||X.excludeEnd||(d+=o),b(),X.excludeEnd&&(d=o));do u.scope&&L.closeNode(),!u.skip&&!u.subLanguage&&(F+=u.relevance),u=u.parent;while(u!==f.parent);return f.starts&&Oe(f.starts,i),X.returnEnd?0:o.length}function We(){const i=[];for(let o=u;o!==H;o=o.parent)o.scope&&i.unshift(o.scope);i.forEach(o=>L.openNode(o))}let j={};function fe(i,o){const O=o&&o[0];if(d+=i,O==null)return b(),0;if(j.type==="begin"&&o.type==="end"&&j.index===o.index&&O===""){if(d+=a.slice(o.index,o.index+1),!g){const f=new Error(`0 width match regex (${s})`);throw f.languageName=s,f.badRule=j.rule,f}return 1}if(j=o,o.type==="begin")return Ke(o);if(o.type==="illegal"&&!R){const f=new Error('Illegal lexeme "'+O+'" for mode "'+(u.scope||"<unnamed>")+'"');throw f.mode=u,f}else if(o.type==="end"){const f=ze(o);if(f!==Ne)return f}if(o.type==="illegal"&&O==="")return 1;if(q>1e5&&q>o.index*3)throw new Error("potential infinite loop, way more iterations than matches");return d+=O,O.length}const H=P(s);if(!H)throw S(M.replace("{}",s)),new Error('Unknown language: "'+s+'"');const Je=vn(H);let Q="",u=h||Je;const ge={},L=new r.__emitter(r);We();let d="",F=0,x=0,q=0,ee=!1;try{for(u.matcher.considerAll();;){q++,ee?ee=!1:u.matcher.considerAll(),u.matcher.lastIndex=x;const i=u.matcher.exec(a);if(!i)break;const o=a.substring(x,i.index),O=fe(o,i);x=i.index+O}return fe(a.substring(x)),L.closeAllNodes(),L.finalize(),Q=L.toHTML(),{language:s,value:Q,relevance:F,illegal:!1,_emitter:L,_top:u}}catch(i){if(i.message&&i.message.includes("Illegal"))return{language:s,value:ne(a),illegal:!0,relevance:0,_illegalBy:{message:i.message,index:x,context:a.slice(x-100,x+100),mode:i.mode,resultSoFar:Q},_emitter:L};if(g)return{language:s,value:ne(a),illegal:!1,relevance:0,errorRaised:i,_emitter:L,_top:u};throw i}}function J(s){const a={value:ne(s),illegal:!1,relevance:0,_top:c,_emitter:new r.__emitter(r)};return a._emitter.addText(s),a}function Y(s,a){a=a||r.languages||Object.keys(n);const R=J(s),h=a.filter(P).filter(ue).map(b=>y(b,s,!1));h.unshift(R);const C=h.sort((b,D)=>{if(b.relevance!==D.relevance)return D.relevance-b.relevance;if(b.language&&D.language){if(P(b.language).supersetOf===D.language)return 1;if(P(D.language).supersetOf===b.language)return-1}return 0}),[G,_]=C,m=G;return m.secondBest=_,m}function Se(s,a,R){const h=a&&t[a]||R;s.classList.add("hljs"),s.classList.add(`language-${h}`)}function Z(s){let a=null;const R=A(s);if(l(R))return;if(V("before:highlightElement",{el:s,language:R}),s.children.length>0&&(r.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(s)),r.throwUnescapedHTML))throw new jn("One of your code blocks includes unescaped HTML.",s.innerHTML);a=s;const h=a.textContent,C=R?p(h,{language:R,ignoreIllegals:!0}):Y(h);s.innerHTML=C.value,Se(s,R,C.language),s.result={language:C.language,re:C.relevance,relevance:C.relevance},C.secondBest&&(s.secondBest={language:C.secondBest.language,relevance:C.secondBest.relevance}),V("after:highlightElement",{el:s,result:C,text:h})}function Be(s){r=Le(r,s)}const $e=()=>{v(),$("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function ye(){v(),$("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let le=!1;function v(){if(document.readyState==="loading"){le=!0;return}document.querySelectorAll(r.cssSelector).forEach(Z)}function Ie(){le&&v()}typeof window<"u"&&window.addEventListener&&window.addEventListener("DOMContentLoaded",Ie,!1);function ke(s,a){let R=null;try{R=a(e)}catch(h){if(S("Language definition for '{}' could not be registered.".replace("{}",s)),g)S(h);else throw h;R=c}R.name||(R.name=s),n[s]=R,R.rawDefinition=a.bind(null,e),R.aliases&&Ee(R.aliases,{languageName:s})}function Te(s){delete n[s];for(const a of Object.keys(t))t[a]===s&&delete t[a]}function ve(){return Object.keys(n)}function P(s){return s=(s||"").toLowerCase(),n[s]||n[t[s]]}function Ee(s,{languageName:a}){typeof s=="string"&&(s=[s]),s.forEach(R=>{t[R.toLowerCase()]=a})}function ue(s){const a=P(s);return a&&!a.disableAutodetect}function Ve(s){s["before:highlightBlock"]&&!s["before:highlightElement"]&&(s["before:highlightElement"]=a=>{s["before:highlightBlock"](Object.assign({block:a.el},a))}),s["after:highlightBlock"]&&!s["after:highlightElement"]&&(s["after:highlightElement"]=a=>{s["after:highlightBlock"](Object.assign({block:a.el},a))})}function me(s){Ve(s),E.push(s)}function V(s,a){const R=s;E.forEach(function(h){h[R]&&h[R](a)})}function je(s){return $("10.7.0","highlightBlock will be removed entirely in v12.0"),$("10.7.0","Please use highlightElement now."),Z(s)}Object.assign(e,{highlight:p,highlightAuto:Y,highlightAll:v,highlightElement:Z,highlightBlock:je,configure:Be,initHighlighting:$e,initHighlightingOnLoad:ye,registerLanguage:ke,unregisterLanguage:Te,listLanguages:ve,getLanguage:P,registerAliases:Ee,autoDetection:ue,inherit:Le,addPlugin:me}),e.debugMode=function(){g=!1},e.safeMode=function(){g=!0},e.versionString=mn,e.regex={concat:B,lookahead:be,either:ce,optional:rn,anyNumberOfTimes:sn};for(const s in K)typeof K[s]=="object"&&se.exports(K[s]);return Object.assign(e,K),e};var T=Kn({}),zn=T;T.HighlightJS=T;T.default=T;const te=zn,Wn=[{HEX:"00",NEMO:"MOV RB, RB",REGEX:"^(MOV)\\s(RB),\\s?(RB)$",GRUPO:1,ALLOC:1},{HEX:"01",NEMO:"MOV RC, RB",REGEX:"^(MOV)\\s(RC),\\s?(RB)$",GRUPO:1,ALLOC:1},{HEX:"02",NEMO:"MOV RD, RB",REGEX:"^(MOV)\\s(RD),\\s?(RB)$",GRUPO:1,ALLOC:1},{HEX:"03",NEMO:"MOV RE, RB",REGEX:"^(MOV)\\s(RE),\\s?(RB)$",GRUPO:1,ALLOC:1},{HEX:"04",NEMO:"MOV RB, RC",REGEX:"^(MOV)\\s(RB),\\s?(RC)$",GRUPO:1,ALLOC:1},{HEX:"05",NEMO:"MOV RC, RC",REGEX:"^(MOV)\\s(RC),\\s?(RC)$",GRUPO:1,ALLOC:1},{HEX:"06",NEMO:"MOV RD, RC",REGEX:"^(MOV)\\s(RD),\\s?(RC)$",GRUPO:1,ALLOC:1},{HEX:"07",NEMO:"MOV RE, RC",REGEX:"^(MOV)\\s(RE),\\s?(RC)$",GRUPO:1,ALLOC:1},{HEX:"08",NEMO:"MOV RB, RD",REGEX:"^(MOV)\\s(RB),\\s?(RD)$",GRUPO:1,ALLOC:1},{HEX:"09",NEMO:"MOV RC, RD",REGEX:"^(MOV)\\s(RC),\\s?(RD)$",GRUPO:1,ALLOC:1},{HEX:"0A",NEMO:"MOV RD, RD",REGEX:"^(MOV)\\s(RD),\\s?(RD)$",GRUPO:1,ALLOC:1},{HEX:"0B",NEMO:"MOV RE, RD",REGEX:"^(MOV)\\s(RE),\\s?(RD)$",GRUPO:1,ALLOC:1},{HEX:"0C",NEMO:"MOV RB, RE",REGEX:"^(MOV)\\s(RB),\\s?(RE)$",GRUPO:1,ALLOC:1},{HEX:"0D",NEMO:"MOV RC, RE",REGEX:"^(MOV)\\s(RC),\\s?(RE)$",GRUPO:1,ALLOC:1},{HEX:"0E",NEMO:"MOV RD, RE",REGEX:"^(MOV)\\s(RD),\\s?(RE)$",GRUPO:1,ALLOC:1},{HEX:"0F",NEMO:"MOV RE, RE",REGEX:"^(MOV)\\s(RE),\\s?(RE)$",GRUPO:1,ALLOC:1},{HEX:"10",NEMO:"MOV RB, AC",REGEX:"^(MOV)\\s(RB),\\s?(AC)$",GRUPO:1,ALLOC:1},{HEX:"11",NEMO:"MOV RC, AC",REGEX:"^(MOV)\\s(RC),\\s?(AC)$",GRUPO:1,ALLOC:1},{HEX:"12",NEMO:"MOV RD, AC",REGEX:"^(MOV)\\s(RD),\\s?(AC)$",GRUPO:1,ALLOC:1},{HEX:"13",NEMO:"MOV RE, AC",REGEX:"^(MOV)\\s(RE),\\s?(AC)$",GRUPO:1,ALLOC:1},{HEX:"18",NEMO:"SUB RB",REGEX:"^(SUB)\\s(RB)$",GRUPO:2,ALLOC:1},{HEX:"19",NEMO:"SUB RC",REGEX:"^(SUB)\\s(RC)$",GRUPO:2,ALLOC:1},{HEX:"1A",NEMO:"SUB RD",REGEX:"^(SUB)\\s(RD)$",GRUPO:2,ALLOC:1},{HEX:"1B",NEMO:"SUB RE",REGEX:"^(SUB)\\s(RE)$",GRUPO:2,ALLOC:1},{HEX:"1C",NEMO:"CMP RB",REGEX:"^(CMP)\\s(RB)$",GRUPO:2,ALLOC:1},{HEX:"1D",NEMO:"CMP RC",REGEX:"^(CMP)\\s(RC)$",GRUPO:2,ALLOC:1},{HEX:"1E",NEMO:"CMP RD",REGEX:"^(CMP)\\s(RD)$",GRUPO:2,ALLOC:1},{HEX:"1F",NEMO:"CMP RE",REGEX:"^(CMP)\\s(RE)$",GRUPO:2,ALLOC:1},{HEX:"20",NEMO:"AND RB",REGEX:"^(AND)\\s(RB)$",GRUPO:2,ALLOC:1},{HEX:"21",NEMO:"AND RC",REGEX:"^(AND)\\s(RC)$",GRUPO:2,ALLOC:1},{HEX:"22",NEMO:"AND RD",REGEX:"^(AND)\\s(RD)$",GRUPO:2,ALLOC:1},{HEX:"23",NEMO:"AND RE",REGEX:"^(AND)\\s(RE)$",GRUPO:2,ALLOC:1},{HEX:"24",NEMO:"OR RB",REGEX:"^(OR)\\s(RB)$",GRUPO:2,ALLOC:1},{HEX:"25",NEMO:"OR RC",REGEX:"^(OR)\\s(RC)$",GRUPO:2,ALLOC:1},{HEX:"26",NEMO:"OR RD",REGEX:"^(OR)\\s(RD)$",GRUPO:2,ALLOC:1},{HEX:"27",NEMO:"OR RE",REGEX:"^(OR)\\s(RE)$",GRUPO:2,ALLOC:1},{HEX:"28",NEMO:"XOR RB",REGEX:"^(XOR)\\s(RB)$",GRUPO:2,ALLOC:1},{HEX:"29",NEMO:"XOR RC",REGEX:"^(XOR)\\s(RC)$",GRUPO:2,ALLOC:1},{HEX:"2A",NEMO:"XOR RD",REGEX:"^(XOR)\\s(RD)$",GRUPO:2,ALLOC:1},{HEX:"2B",NEMO:"XOR RE",REGEX:"^(XOR)\\s(RE)$",GRUPO:2,ALLOC:1},{HEX:"2C",NEMO:"INC RB",REGEX:"^(INC)\\s(RB)$",GRUPO:2,ALLOC:1},{HEX:"2D",NEMO:"INC RC",REGEX:"^(INC)\\s(RC)$",GRUPO:2,ALLOC:1},{HEX:"2E",NEMO:"INC RD",REGEX:"^(INC)\\s(RD)$",GRUPO:2,ALLOC:1},{HEX:"2F",NEMO:"INC RE",REGEX:"^(INC)\\s(RE)$",GRUPO:2,ALLOC:1},{HEX:"30",NEMO:"ADD RB",REGEX:"^(ADD)\\s(RB)$",GRUPO:2,ALLOC:1},{HEX:"31",NEMO:"ADD RC",REGEX:"^(ADD)\\s(RC)$",GRUPO:2,ALLOC:1},{HEX:"32",NEMO:"ADD RD",REGEX:"^(ADD)\\s(RD)$",GRUPO:2,ALLOC:1},{HEX:"33",NEMO:"ADD RE",REGEX:"^(ADD)\\s(RE)$",GRUPO:2,ALLOC:1},{HEX:"40",NEMO:"MOV AC, RB",REGEX:"^(MOV)\\s(AC),\\s?(RB)$",GRUPO:3,ALLOC:1},{HEX:"41",NEMO:"MOV AC, RC",REGEX:"^(MOV)\\s(AC),\\s?(RC)$",GRUPO:3,ALLOC:1},{HEX:"42",NEMO:"MOV AC, RD",REGEX:"^(MOV)\\s(AC),\\s?(RD)$",GRUPO:3,ALLOC:1},{HEX:"43",NEMO:"MOV AC, RE",REGEX:"^(MOV)\\s(AC),\\s?(RE)$",GRUPO:3,ALLOC:1},{HEX:"44",NEMO:"MOV AC, AC",REGEX:"^(MOV)\\s(AC),\\s?(AC)$",GRUPO:3,ALLOC:1},{HEX:"45",NEMO:"ADD AC",REGEX:"^(ADD)\\s(AC)$",GRUPO:3,ALLOC:1},{HEX:"46",NEMO:"SUB AC",REGEX:"^(SUB)\\s(AC)$",GRUPO:3,ALLOC:1},{HEX:"47",NEMO:"CMP AC",REGEX:"^(CMP)\\s(AC)$",GRUPO:3,ALLOC:1},{HEX:"48",NEMO:"AND AC",REGEX:"^(AND)\\s(AC)$",GRUPO:3,ALLOC:1},{HEX:"49",NEMO:"OR AC",REGEX:"^(OR)\\s(AC)$",GRUPO:3,ALLOC:1},{HEX:"4A",NEMO:"XOR AC",REGEX:"^(XOR)\\s(AC)$",GRUPO:3,ALLOC:1},{HEX:"4B",NEMO:"INC AC",REGEX:"^(INC)\\s(AC)$",GRUPO:3,ALLOC:1},{HEX:"80",NEMO:"CMA",REGEX:"^(CMA)$",GRUPO:3,ALLOC:1},{HEX:"60",NEMO:"MOV inm, RB",REGEX:"^(MOV)\\s(\\w{1,}),\\s?(RB)$",GRUPO:4,ALLOC:2},{HEX:"61",NEMO:"MOV inm, RC",REGEX:"^(MOV)\\s(\\w{1,}),\\s?(RC)$",GRUPO:4,ALLOC:2},{HEX:"62",NEMO:"MOV inm, RD",REGEX:"^(MOV)\\s(\\w{1,}),\\s?(RD)$",GRUPO:4,ALLOC:2},{HEX:"63",NEMO:"MOV inm, RE",REGEX:"^(MOV)\\s(\\w{1,}),\\s?(RE)$",GRUPO:4,ALLOC:2},{HEX:"64",NEMO:"MOV inm, AC",REGEX:"^(MOV)\\s(\\w{1,}),\\s?(AC)$",GRUPO:4,ALLOC:2},{HEX:"65",NEMO:"ADD inm",REGEX:"^(ADD)\\s(\\w{1,})$",GRUPO:4,ALLOC:2},{HEX:"66",NEMO:"SUB inm",REGEX:"^(SUB)\\s(\\w{1,})$",GRUPO:4,ALLOC:2},{HEX:"67",NEMO:"CMP inm",REGEX:"^(CMP)\\s(\\w{1,})$",GRUPO:4,ALLOC:2},{HEX:"68",NEMO:"AND inm",REGEX:"^(AND)\\s(\\w{1,})$",GRUPO:4,ALLOC:2},{HEX:"69",NEMO:"OR inm",REGEX:"^(OR)\\s(\\w{1,})$",GRUPO:4,ALLOC:2},{HEX:"6A",NEMO:"XOR inm",REGEX:"^(XOR)\\s(\\w{1,})$",GRUPO:4,ALLOC:2},{HEX:"70",NEMO:"LDA dir",REGEX:"^(LDA)\\s(\\w{1,})$",GRUPO:5,ALLOC:3},{HEX:"71",NEMO:"STA dir",REGEX:"^(STA)\\s(\\w{1,})$",GRUPO:5,ALLOC:3},{HEX:"90",NEMO:"STAX",REGEX:"^(STAX)$",GRUPO:5,ALLOC:1},{HEX:"B0",NEMO:"LDAX",REGEX:"^(LDAX)$",GRUPO:5,ALLOC:1},{HEX:"C1",NEMO:"PUSH",REGEX:"^(PUSH)$",GRUPO:5,ALLOC:1},{HEX:"C2",NEMO:"POP",REGEX:"^(POP)$",GRUPO:5,ALLOC:1},{HEX:"C3",NEMO:"INISP dir",REGEX:"^(INISP)\\s(\\w{1,})$",GRUPO:5,ALLOC:3},{HEX:"72",NEMO:"BEQ dir",REGEX:"^(BEQ)\\s(\\w{1,})$",GRUPO:6,ALLOC:3},{HEX:"73",NEMO:"BC dir",REGEX:"^(BC)\\s(\\w{1,})$",GRUPO:6,ALLOC:3},{HEX:"74",NEMO:"JMP dir",REGEX:"^(JMP)\\s(\\w{1,})$",GRUPO:6,ALLOC:3},{HEX:"81",NEMO:"LFA",REGEX:"^(LFA)$",GRUPO:6,ALLOC:1},{HEX:"82",NEMO:"SFA",REGEX:"^(SFA)$",GRUPO:6,ALLOC:1},{HEX:"C4",NEMO:"CALL dir",REGEX:"^(CALL)\\s(\\w{1,})$",GRUPO:6,ALLOC:3},{HEX:"C5",NEMO:"RET",REGEX:"^(RET)$",GRUPO:6,ALLOC:1},{HEX:"C0",NEMO:"IRET",REGEX:"^(IRET)$",GRUPO:6,ALLOC:1},{HEX:"FF",NEMO:"FIN",REGEX:"^(FIN)$",GRUPO:0,ALLOC:1}];function Jn(){return N("svg",{xmlns:"http://www.w3.org/2000/svg",x:"0",y:"0",enableBackground:"new 0 0 26 26",version:"1.1",viewBox:"0 0 26 26",xmlSpace:"preserve",width:26,height:26,children:N("path",{fill:"white",d:"M21.125 0H4.875A4.874 4.874 0 000 4.875v16.25A4.874 4.874 0 004.875 26h16.25A4.874 4.874 0 0026 21.125V4.875A4.874 4.874 0 0021.125 0zM18.78 17.394l-1.388 1.387a.654.654 0 01-.924 0L13 15.313 9.533 18.78a.653.653 0 01-.925-.002L7.22 17.394a.66.66 0 010-.926l3.468-3.467-3.467-3.467a.657.657 0 010-.925l1.388-1.388a.651.651 0 01.925 0L13 10.689l3.468-3.468a.65.65 0 01.924 0l1.388 1.386a.66.66 0 01.001.927l-3.468 3.467 3.468 3.467a.66.66 0 01-.001.926z"})})}function Yn({previewText:e,videoSrc:n,title:t}){const[E,g]=Qe(!1);return N(he,{children:[N("button",{className:"preview-button",onClick:()=>g(!E),children:e}),E&&N(he,{children:N("div",{className:"modal",children:[N("div",{className:"modal-header",children:N("h2",{className:"modal-title",children:t})}),N("video",{src:n,className:"center",autoPlay:!0,loop:!0,muted:!0,playsInline:!0,controls:!0}),N("div",{className:"modal-close",onClick:()=>g(!1),children:N(Jn,{})})]})})]})}const Zn=[...new Set(Wn.map(e=>e.NEMO.split(" ")[0]))].join("|");te.registerLanguage("mpp",e=>{const n={variants:[te.HASH_COMMENT_MODE]};return{name:"MPP",case_insensitive:!0,aliases:["mpp"],contains:[{className:"keyword",begin:`\\b(?:${Zn})\\b`},{className:"built_in",begin:"AC|RB|RC|RD|RE"},n,{className:"number",variants:[{begin:"[#$=]?[0-9a-f]+"}],relevance:0},{className:"symbol",variants:[{begin:"T\\S*"}],relevance:0}]}});function tt({code:e,testCodeText:n,previewText:t,previewVideoSrc:E}){const g=te.highlight(e,{language:"mpp"}).value,M=c=>{const r=new URL("https://mpp.nullx.me");r.searchParams.set("code",c),window.open(r.href,"_blank")};return N("pre",{className:"shiki github-dark",style:{backgroundColor:"#0d1117",color:"#c9d1d9"},children:[N("div",{className:"run-code",children:[n&&N("button",{onClick:()=>M(e),children:n}),t&&N(Yn,{previewText:t,videoSrc:E,title:e})]}),N("div",{className:"code-container",children:N("code",{dangerouslySetInnerHTML:{__html:g}})})]})}export{tt as C,te as H};
