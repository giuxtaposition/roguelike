var X=Object.defineProperty;var Y=(t,e,n)=>e in t?X(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var a=(t,e,n)=>(Y(t,typeof e!="symbol"?e+"":e,n),n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const l of r)if(l.type==="childList")for(const i of l.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function n(r){const l={};return r.integrity&&(l.integrity=r.integrity),r.referrerpolicy&&(l.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?l.credentials="include":r.crossorigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function s(r){if(r.ep)return;r.ep=!0;const l=n(r);fetch(r.href,l)}})();function d(){}function F(t){return t()}function N(){return Object.create(null)}function P(t){t.forEach(F)}function R(t){return typeof t=="function"}function B(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}function Z(t){return Object.keys(t).length===0}function G(t,e,n){t.insertBefore(e,n||null)}function A(t){t.parentNode&&t.parentNode.removeChild(t)}function H(t){return document.createElement(t)}function ee(t,e,n,s){return t.addEventListener(e,n,s),()=>t.removeEventListener(e,n,s)}function te(t){return function(e){return e.preventDefault(),t.call(this,e)}}function ne(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function se(t){return Array.from(t.childNodes)}let v;function w(t){v=t}function re(){if(!v)throw new Error("Function called outside component initialization");return v}function ie(t){re().$$.on_mount.push(t)}const y=[],L=[],x=[],z=[],le=Promise.resolve();let O=!1;function oe(){O||(O=!0,le.then(U))}function M(t){x.push(t)}const k=new Set;let g=0;function U(){if(g!==0)return;const t=v;do{try{for(;g<y.length;){const e=y[g];g++,w(e),ue(e.$$)}}catch(e){throw y.length=0,g=0,e}for(w(null),y.length=0,g=0;L.length;)L.pop()();for(let e=0;e<x.length;e+=1){const n=x[e];k.has(n)||(k.add(n),n())}x.length=0}while(y.length);for(;z.length;)z.pop()();O=!1,k.clear(),w(t)}function ue(t){if(t.fragment!==null){t.update(),P(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(M)}}const E=new Set;let ae;function K(t,e){t&&t.i&&(E.delete(t),t.i(e))}function ce(t,e,n,s){if(t&&t.o){if(E.has(t))return;E.add(t),ae.c.push(()=>{E.delete(t),s&&(n&&t.d(1),s())}),t.o(e)}else s&&s()}function fe(t){t&&t.c()}function q(t,e,n,s){const{fragment:r,after_update:l}=t.$$;r&&r.m(e,n),s||M(()=>{const i=t.$$.on_mount.map(F).filter(R);t.$$.on_destroy?t.$$.on_destroy.push(...i):P(i),t.$$.on_mount=[]}),l.forEach(M)}function D(t,e){const n=t.$$;n.fragment!==null&&(P(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function he(t,e){t.$$.dirty[0]===-1&&(y.push(t),oe(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function J(t,e,n,s,r,l,i,S=[-1]){const m=v;w(t);const u=t.$$={fragment:null,ctx:[],props:l,update:d,not_equal:r,bound:N(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(m?m.$$.context:[])),callbacks:N(),dirty:S,skip_bound:!1,root:e.target||m.$$.root};i&&i(u.root);let b=!1;if(u.ctx=n?n(t,e.props||{},(c,p,...$)=>{const o=$.length?$[0]:p;return u.ctx&&r(u.ctx[c],u.ctx[c]=o)&&(!u.skip_bound&&u.bound[c]&&u.bound[c](o),b&&he(t,c)),p}):[],u.update(),b=!0,P(u.before_update),u.fragment=s?s(u.ctx):!1,e.target){if(e.hydrate){const c=se(e.target);u.fragment&&u.fragment.l(c),c.forEach(A)}else u.fragment&&u.fragment.c();e.intro&&K(t.$$.fragment),q(t,e.target,e.anchor,e.customElement),U()}w(m)}class Q{$destroy(){D(this,1),this.$destroy=d}$on(e,n){if(!R(n))return d;const s=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return s.push(n),()=>{const r=s.indexOf(n);r!==-1&&s.splice(r,1)}}$set(e){this.$$set&&!Z(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}function C(t,e){for(let n=1e3;n>0;n--)if(e())return;throw"Timeout while trying to "+t}function j(t,e){return Math.floor(Math.random()*(e-t+1))+t}function I(t){let e,n;for(let s=1;s<t.length;s++)n=j(0,s),e=t[s],t[s]=t[n],t[n]=e;return t}class _{constructor(e,n,s){a(this,"tile");a(this,"sprite");a(this,"health");a(this,"isPlayer",!1);this.move(e),this.sprite=n,this.health=s}move(e){this.tile&&(this.tile.entity=null),this.tile=e,e.entity=this}}class de extends _{constructor(e){super(e,0,3),this.isPlayer=!0}}class me extends _{constructor(e){super(e,4,3)}}class pe extends _{constructor(e){super(e,5,1)}}class ge extends _{constructor(e){super(e,6,2)}}class ye extends _{constructor(e){super(e,7,1)}}class _e extends _{constructor(e){super(e,8,3)}}class V{constructor(e,n,s,r){a(this,"x");a(this,"y");a(this,"sprite");a(this,"passable");a(this,"entity");this.x=e,this.y=n,this.sprite=s,this.passable=r}}class Te extends V{constructor(e,n){super(e,n,2,!0)}}class W extends V{constructor(e,n){super(e,n,3,!1)}}class we{constructor(){a(this,"tileSize",64);a(this,"numTiles",9);a(this,"uiWidth",4);a(this,"level",1);a(this,"tiles",[]);a(this,"enemies",[]);a(this,"player");this.generateLevel(),this.player=new de(this.randomPassableTile())}movePlayer(e){switch(e){case h.UP:this.tryToMove(this.player,0,-1);break;case h.DOWN:this.tryToMove(this.player,0,1);break;case h.LEFT:this.tryToMove(this.player,-1,0);break;case h.RIGHT:this.tryToMove(this.player,1,0);break}}getTile(e,n){return this.inBounds(e,n)?this.tiles[e][n]:new W(e,n)}tryToMove(e,n,s){let r=this.getTile(e.tile.x+n,e.tile.y+s);if(r.passable)return r.entity||e.move(r),!0}generateLevel(){C("generate map",()=>this.generateTiles()==this.getConnectedTiles(this.randomPassableTile()).length),this.generateEnemies()}generateTiles(){let e=0;for(let n=0;n<this.numTiles;n++){this.tiles[n]=[];for(let s=0;s<this.numTiles;s++)Math.random()<.3||!this.inBounds(n,s)?this.tiles[n][s]=new W(n,s):(this.tiles[n][s]=new Te(n,s),e++)}return e}generateEnemies(){let e=this.level+1;for(let n=0;n<e;n++)this.spawnEnemies()}spawnEnemies(){let e=I([me,pe,ge,ye,_e])[0];this.enemies.push(new e(this.randomPassableTile()))}getConnectedTiles(e){let n=[e],s=[e];for(;s.length;){let r=s.pop(),l=this.getAdjacentPassableTiles(r.x,r.y).filter(i=>!n.includes(i));n=n.concat(l),s=s.concat(l)}return n}getAdjacentPassableTiles(e,n){return this.getAdjacentTiles(e,n).filter(s=>s.passable)}getAdjacentTiles(e,n){return I([this.getTile(e,n-1),this.getTile(e,n+1),this.getTile(e-1,n),this.getTile(e+1,n)])}inBounds(e,n){return e>0&&n>0&&e<this.numTiles-1&&n<this.numTiles-1}randomPassableTile(){let e;return C("get random passable tile",()=>{let n=j(0,this.numTiles-1),s=j(0,this.numTiles-1);return e=this.getTile(n,s),e.passable}),e}}var h=(t=>(t[t.UP=0]="UP",t[t.DOWN=1]="DOWN",t[t.LEFT=2]="LEFT",t[t.RIGHT=3]="RIGHT",t))(h||{});function ve(t){let e,n,s;return{c(){e=H("canvas"),ne(e,"class","svelte-3f2pl5")},m(r,l){G(r,e,l),t[2](e),n||(s=ee(window,"keydown",te(t[1])),n=!0)},p:d,i:d,o:d,d(r){r&&A(e),t[2](null),n=!1,s()}}}function be(t,e,n){let s,r;const l=new Image;l.src="spritesheet.png";const i=new we;function S(o){o.key=="w"&&i.movePlayer(h.UP),o.key=="s"&&i.movePlayer(h.DOWN),o.key=="a"&&i.movePlayer(h.LEFT),o.key=="d"&&i.movePlayer(h.RIGHT)}function m(){r.clearRect(0,0,s.width,s.height),c(),b(),u()}function u(){for(let o=0;o<i.enemies.length;o++){const f=i.enemies[o];p(f.sprite,f.tile.x,f.tile.y)}}function b(){p(i.player.sprite,i.player.tile.x,i.player.tile.y)}function c(){for(let o=0;o<i.numTiles;o++)for(let f=0;f<i.numTiles;f++){const T=i.getTile(o,f);p(T.sprite,T.x,T.y)}}function p(o,f,T){r.drawImage(l,o*16,0,16,16,f*i.tileSize,T*i.tileSize,i.tileSize,i.tileSize)}ie(()=>{r=s.getContext("2d"),n(0,s.width=i.tileSize*(i.numTiles+i.uiWidth),s),n(0,s.height=i.tileSize*i.numTiles,s),n(0,s.style.width=s.width+"px",s),n(0,s.style.height=s.height+"px",s),r.imageSmoothingEnabled=!1});function $(o){L[o?"unshift":"push"](()=>{s=o,n(0,s)})}return setInterval(m,15),[s,S,$]}class $e extends Q{constructor(e){super(),J(this,e,be,ve,B,{})}}function xe(t){let e,n,s;return n=new $e({}),{c(){e=H("main"),fe(n.$$.fragment)},m(r,l){G(r,e,l),q(n,e,null),s=!0},p:d,i(r){s||(K(n.$$.fragment,r),s=!0)},o(r){ce(n.$$.fragment,r),s=!1},d(r){r&&A(e),D(n)}}}class Ee extends Q{constructor(e){super(),J(this,e,null,xe,B,{})}}new Ee({target:document.body});