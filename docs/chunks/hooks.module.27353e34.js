import{l as o}from"./preact.module.8a47de0f.js";var H,u,s,N,m=0,q=[],h=[],y=o.__b,E=o.__r,V=o.diffed,F=o.__c,g=o.unmount;function d(n,r){o.__h&&o.__h(u,n,m||r),m=0;var _=u.__H||(u.__H={__:[],__h:[]});return n>=_.__.length&&_.__.push({__V:h}),_.__[n]}function x(n){return m=1,U(T,n)}function U(n,r,_){var t=d(H++,2);if(t.t=n,!t.__c&&(t.__=[_?_(r):T(void 0,r),function(e){var f=t.__N?t.__N[0]:t.__[0],a=t.t(f,e);f!==a&&(t.__N=[a,t.__[1]],t.__c.setState({}))}],t.__c=u,!t.__c.u)){t.__c.__H.u=!0;var i=t.__c.shouldComponentUpdate;t.__c.shouldComponentUpdate=function(e,f,a){if(!t.__c.__H)return!0;var p=t.__c.__H.__.filter(function(c){return c.__c});return(p.every(function(c){return!c.__N})||!p.every(function(c){if(!c.__N)return!0;var C=c.__[0];return c.__=c.__N,c.__N=void 0,C===c.__[0]}))&&(!i||i(e,f,a))}}return t.__N||t.__}function z(n,r){var _=d(H++,3);!o.__s&&b(_.__H,r)&&(_.__=n,_.i=r,u.__H.__h.push(_))}function P(n){return m=5,j(function(){return{current:n}},[])}function j(n,r){var _=d(H++,7);return b(_.__H,r)?(_.__V=n(),_.i=r,_.__h=n,_.__V):_.__}function k(){for(var n;n=q.shift();)if(n.__P&&n.__H)try{n.__H.__h.forEach(v),n.__H.__h.forEach(l),n.__H.__h=[]}catch(r){n.__H.__h=[],o.__e(r,n.__v)}}o.__b=function(n){u=null,y&&y(n)},o.__r=function(n){E&&E(n),H=0;var r=(u=n.__c).__H;r&&(s===u?(r.__h=[],u.__h=[],r.__.forEach(function(_){_.__N&&(_.__=_.__N),_.__V=h,_.__N=_.i=void 0})):(r.__h.forEach(v),r.__h.forEach(l),r.__h=[])),s=u},o.diffed=function(n){V&&V(n);var r=n.__c;r&&r.__H&&(r.__H.__h.length&&(q.push(r)!==1&&N===o.requestAnimationFrame||((N=o.requestAnimationFrame)||function(_){var t,i=function(){clearTimeout(e),A&&cancelAnimationFrame(t),setTimeout(_)},e=setTimeout(i,100);A&&(t=requestAnimationFrame(i))})(k)),r.__H.__.forEach(function(_){_.i&&(_.__H=_.i),_.__V!==h&&(_.__=_.__V),_.i=void 0,_.__V=h})),s=u=null},o.__c=function(n,r){r.some(function(_){try{_.__h.forEach(v),_.__h=_.__h.filter(function(t){return!t.__||l(t)})}catch(t){r.some(function(i){i.__h&&(i.__h=[])}),r=[],o.__e(t,_.__v)}}),F&&F(n,r)},o.unmount=function(n){g&&g(n);var r,_=n.__c;_&&_.__H&&(_.__H.__.forEach(function(t){try{v(t)}catch(i){r=i}}),r&&o.__e(r,_.__v))};var A=typeof requestAnimationFrame=="function";function v(n){var r=u,_=n.__c;typeof _=="function"&&(n.__c=void 0,_()),u=r}function l(n){var r=u;n.__c=n.__(),u=r}function b(n,r){return!n||n.length!==r.length||r.some(function(_,t){return _!==n[t]})}function T(n,r){return typeof r=="function"?r(n):r}export{z as _,x as p,P as s};
