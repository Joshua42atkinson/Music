import{c as Fn,a as Dn,j as M,m as j,R as Hn,A as Gn}from"./index-CNmSeRp3.js";function Ln(n){return n!==null&&typeof n=="object"&&"name"in n&&typeof n.name=="string"}function Bn(n){return n!==null&&typeof n=="object"&&"step"in n&&typeof n.step=="number"&&"alt"in n&&typeof n.alt=="number"&&!isNaN(n.step)&&!isNaN(n.alt)}var mn=[0,2,4,-1,1,3,5],on=mn.map(n=>Math.floor(n*7/12));function Xn(n){const{step:t,alt:e,oct:a,dir:m=1}=n,o=mn[t]+7*e;if(a===void 0)return[m*o];const r=a-on[t]-4*e;return[m*o,m*r]}var Qn=[3,0,4,1,5,2,6];function Un(n){const[t,e,a]=n,m=Qn[qn(t)],o=Math.floor((t+1)/7);if(e===void 0)return{step:m,alt:o,dir:a};const r=e+4*o+on[m];return{step:m,alt:o,oct:r,dir:a}}function qn(n){const t=(n+1)%7;return t<0?7+t:t}var B=(n,t)=>Array(Math.abs(t)+1).join(n),S=Object.freeze({empty:!0,name:"",num:NaN,q:"",type:"",step:NaN,alt:NaN,dir:NaN,simple:NaN,semitones:NaN,chroma:NaN,coord:[],oct:NaN}),Vn="([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})",Jn="(AA|A|P|M|m|d|dd)([-+]?\\d+)",Yn=new RegExp("^"+Vn+"|"+Jn+"$");function Zn(n){const t=Yn.exec(`${n}`);return t===null?["",""]:t[1]?[t[1],t[2]]:[t[4],t[3]]}var X={};function E(n){return typeof n=="string"?X[n]||(X[n]=Kn(n)):Bn(n)?E(tt(n)):Ln(n)?E(n.name):S}var Q=[0,2,4,5,7,9,11],rn="PMMPPMM";function Kn(n){const t=Zn(n);if(t[0]==="")return S;const e=+t[0],a=t[1],m=(Math.abs(e)-1)%7,o=rn[m];if(o==="M"&&a==="P")return S;const r=o==="M"?"majorable":"perfectable",P=""+e+a,s=e<0?-1:1,c=e===8||e===-8?e:s*(m+1),d=nt(r,a),u=Math.floor((Math.abs(e)-1)/7),i=s*(Q[m]+d+12*u),b=(s*(Q[m]+d)%12+12)%12,f=Xn({step:m,alt:d,oct:u,dir:s});return{empty:!1,name:P,num:e,q:a,step:m,alt:d,dir:s,type:r,simple:c,semitones:i,chroma:b,coord:f,oct:u}}function Wn(n,t){const[e,a=0]=n,m=e*7+a*12<0,o=t||m?[-e,-a,-1]:[e,a,1];return E(Un(o))}function nt(n,t){return t==="M"&&n==="majorable"||t==="P"&&n==="perfectable"?0:t==="m"&&n==="majorable"?-1:/^A+$/.test(t)?t.length:/^d+$/.test(t)?-1*(n==="perfectable"?t.length:t.length+1):0}function tt(n){const{step:t,alt:e,oct:a=0,dir:m}=n;if(!m)return"";const o=t+1+7*a,r=o===0?t+1:o,P=m<0?"-":"",s=rn[t]==="M"?"majorable":"perfectable";return P+r+et(s,e)}function et(n,t){return t===0?n==="majorable"?"M":"P":t===-1&&n==="majorable"?"m":t>0?B("A",t):B("d",n==="perfectable"?t:t+1)}function at(n){return n!==null&&typeof n=="object"&&"name"in n&&typeof n.name=="string"}function mt(n){return n!==null&&typeof n=="object"&&"step"in n&&typeof n.step=="number"&&"alt"in n&&typeof n.alt=="number"&&!isNaN(n.step)&&!isNaN(n.alt)}var sn=[0,2,4,-1,1,3,5],Pn=sn.map(n=>Math.floor(n*7/12));function ot(n){const{step:t,alt:e,oct:a,dir:m=1}=n,o=sn[t]+7*e;if(a===void 0)return[m*o];const r=a-Pn[t]-4*e;return[m*o,m*r]}var rt=[3,0,4,1,5,2,6];function it(n){const[t,e,a]=n,m=rt[st(t)],o=Math.floor((t+1)/7);if(e===void 0)return{step:m,alt:o,dir:a};const r=e+4*o+Pn[m];return{step:m,alt:o,oct:r,dir:a}}function st(n){const t=(n+1)%7;return t<0?7+t:t}var U=(n,t)=>Array(Math.abs(t)+1).join(n),Mn=Object.freeze({empty:!0,name:"",letter:"",acc:"",pc:"",step:NaN,alt:NaN,chroma:NaN,height:NaN,coord:[],midi:null,freq:null}),q=new Map,Pt=n=>"CDEFGAB".charAt(n),Mt=n=>n<0?U("b",-n):U("#",n),dt=n=>n[0]==="b"?-n.length:n.length;function l(n){const t=JSON.stringify(n),e=q.get(t);if(e)return e;const a=typeof n=="string"?bt(n):mt(n)?l(ft(n)):at(n)?l(n.name):Mn;return q.set(t,a),a}var ct=/^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;function ut(n){const t=ct.exec(n);return t?[t[1].toUpperCase(),t[2].replace(/x/g,"##"),t[3],t[4]]:["","","",""]}function lt(n){return l(it(n))}var ht=(n,t)=>(n%t+t)%t,w=[0,2,4,5,7,9,11];function bt(n){const t=ut(n);if(t[0]===""||t[3]!=="")return Mn;const e=t[0],a=t[1],m=t[2],o=(e.charCodeAt(0)+3)%7,r=dt(a),P=m.length?+m:void 0,s=ot({step:o,alt:r,oct:P}),c=e+a+m,d=e+a,u=(w[o]+r+120)%12,i=P===void 0?ht(w[o]+r,12)-1188:w[o]+r+12*(P+1),b=i>=0&&i<=127?i:null,f=P===void 0?null:Math.pow(2,(i-69)/12)*440;return{empty:!1,acc:a,alt:r,chroma:u,coord:s,freq:f,height:i,letter:e,midi:b,name:c,oct:P,pc:d,step:o}}function ft(n){const{step:t,alt:e,oct:a}=n,m=Pt(t);if(!m)return"";const o=m+Mt(e);return a||a===0?o+a:o}function T(n,t){const e=l(n),a=Array.isArray(t)?t:E(t).coord;if(e.empty||!a||a.length<2)return"";const m=e.coord,o=m.length===1?[m[0]+a[0]]:[m[0]+a[0],m[1]+a[1]];return lt(o).name}function dn(n,t){const e=n.length;return a=>{if(!t)return"";const m=a<0?(e- -a%e)%e:a%e,o=Math.floor(a/e),r=T(t,[0,o]);return T(r,n[m])}}function pt(n,t){const e=l(n),a=l(t);if(e.empty||a.empty)return"";const m=e.coord,o=a.coord,r=o[0]-m[0],P=m.length===2&&o.length===2?o[1]-m[1]:-Math.floor(r*7/12),s=a.height===e.height&&a.midi!==null&&e.oct===a.oct&&e.step>a.step;return Wn([r,P],s).name}function At(n,t){const e=[];for(;t--;e[t]=t+n);return e}function gt(n,t){const e=[];for(;t--;e[t]=n-t);return e}function vt(n,t){return n<t?At(n,t-n+1):gt(n,n-t+1)}function x(n,t){const e=t.length,a=(n%e+e)%e;return t.slice(a,e).concat(t.slice(0,a))}function xt(n){return n.filter(t=>t===0||t)}function jt(n){return n!==null&&typeof n=="object"&&"name"in n&&typeof n.name=="string"}function yt(n){return n!==null&&typeof n=="object"&&"step"in n&&typeof n.step=="number"&&"alt"in n&&typeof n.alt=="number"&&!isNaN(n.step)&&!isNaN(n.alt)}var cn=[0,2,4,-1,1,3,5],Nt=cn.map(n=>Math.floor(n*7/12));function $t(n){const{step:t,alt:e,oct:a,dir:m=1}=n,o=cn[t]+7*e;if(a===void 0)return[m*o];const r=a-Nt[t]-4*e;return[m*o,m*r]}var V=(n,t)=>Array(Math.abs(t)+1).join(n),O=Object.freeze({empty:!0,name:"",num:NaN,q:"",type:"",step:NaN,alt:NaN,dir:NaN,simple:NaN,semitones:NaN,chroma:NaN,coord:[],oct:NaN}),kt="([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})",Et="(AA|A|P|M|m|d|dd)([-+]?\\d+)",Tt=new RegExp("^"+kt+"|"+Et+"$");function wt(n){const t=Tt.exec(`${n}`);return t===null?["",""]:t[1]?[t[1],t[2]]:[t[4],t[3]]}var J={};function R(n){return typeof n=="string"?J[n]||(J[n]=St(n)):yt(n)?R(Rt(n)):jt(n)?R(n.name):O}var Y=[0,2,4,5,7,9,11],un="PMMPPMM";function St(n){const t=wt(n);if(t[0]==="")return O;const e=+t[0],a=t[1],m=(Math.abs(e)-1)%7,o=un[m];if(o==="M"&&a==="P")return O;const r=o==="M"?"majorable":"perfectable",P=""+e+a,s=e<0?-1:1,c=e===8||e===-8?e:s*(m+1),d=Ot(r,a),u=Math.floor((Math.abs(e)-1)/7),i=s*(Y[m]+d+12*u),b=(s*(Y[m]+d)%12+12)%12,f=$t({step:m,alt:d,oct:u,dir:s});return{empty:!1,name:P,num:e,q:a,step:m,alt:d,dir:s,type:r,simple:c,semitones:i,chroma:b,coord:f,oct:u}}function Ot(n,t){return t==="M"&&n==="majorable"||t==="P"&&n==="perfectable"?0:t==="m"&&n==="majorable"?-1:/^A+$/.test(t)?t.length:/^d+$/.test(t)?-1*(n==="perfectable"?t.length:t.length+1):0}function Rt(n){const{step:t,alt:e,oct:a=0,dir:m}=n;if(!m)return"";const o=t+1+7*a,r=o===0?t+1:o,P=m<0?"-":"",s=un[t]==="M"?"majorable":"perfectable";return P+r+_t(s,e)}function _t(n,t){return t===0?n==="majorable"?"M":"P":t===-1&&n==="majorable"?"m":t>0?V("A",t):V("d",n==="perfectable"?t:t+1)}var A={empty:!0,name:"",setNum:0,chroma:"000000000000",normalized:"000000000000",intervals:[]},ln=n=>Number(n).toString(2).padStart(12,"0"),Z=n=>parseInt(n,2),Ct=/^[01]{12}$/;function I(n){return Ct.test(n)}var It=n=>typeof n=="number"&&n>=0&&n<=4095,zt=n=>n&&I(n.chroma),K={[A.chroma]:A};function p(n){const t=I(n)?n:It(n)?ln(n):Array.isArray(n)?Qt(n):zt(n)?n.chroma:A.chroma;return K[t]=K[t]||Xt(t)}var Ft=n=>p(n).chroma,Dt=["1P","2m","2M","3m","3M","4P","5d","5P","6m","6M","7m","7M"];function Ht(n){const t=[];for(let e=0;e<12;e++)n.charAt(e)==="1"&&t.push(Dt[e]);return t}function Gt(n,t=!0){const a=p(n).chroma.split("");return xt(a.map((m,o)=>{const r=x(o,a);return t&&r[0]==="0"?null:r.join("")}))}function hn(n){const t=p(n).setNum;return e=>{const a=p(e).setNum;return t&&t!==a&&(a&t)===a}}function Lt(n){const t=p(n).setNum;return e=>{const a=p(e).setNum;return t&&t!==a&&(a|t)===a}}function Bt(n){const t=n.split("");return t.map((e,a)=>x(a,t).join(""))}function Xt(n){const t=Z(n),e=Bt(n).map(Z).filter(o=>o>=2048).sort()[0],a=ln(e),m=Ht(n);return{empty:!1,name:"",setNum:t,chroma:n,normalized:a,intervals:m}}function Qt(n){if(n.length===0)return A.chroma;let t;const e=[0,0,0,0,0,0,0,0,0,0,0,0];for(let a=0;a<n.length;a++)t=l(n[a]),t.empty&&(t=R(n[a])),t.empty||(e[t.chroma]=1);return e.join("")}var Ut=[["1P 3M 5P","major","M ^  maj"],["1P 3M 5P 7M","major seventh","maj7 Δ ma7 M7 Maj7 ^7"],["1P 3M 5P 7M 9M","major ninth","maj9 Δ9 ^9"],["1P 3M 5P 7M 9M 13M","major thirteenth","maj13 Maj13 ^13"],["1P 3M 5P 6M","sixth","6 add6 add13 M6"],["1P 3M 5P 6M 9M","sixth added ninth","6add9 6/9 69 M69"],["1P 3M 6m 7M","major seventh flat sixth","M7b6 ^7b6"],["1P 3M 5P 7M 11A","major seventh sharp eleventh","maj#4 Δ#4 Δ#11 M7#11 ^7#11 maj7#11"],["1P 3m 5P","minor","m min -"],["1P 3m 5P 7m","minor seventh","m7 min7 mi7 -7"],["1P 3m 5P 7M","minor/major seventh","m/ma7 m/maj7 mM7 mMaj7 m/M7 -Δ7 mΔ -^7 -maj7"],["1P 3m 5P 6M","minor sixth","m6 -6"],["1P 3m 5P 7m 9M","minor ninth","m9 -9"],["1P 3m 5P 7M 9M","minor/major ninth","mM9 mMaj9 -^9"],["1P 3m 5P 7m 9M 11P","minor eleventh","m11 -11"],["1P 3m 5P 7m 9M 13M","minor thirteenth","m13 -13"],["1P 3m 5d","diminished","dim ° o"],["1P 3m 5d 7d","diminished seventh","dim7 °7 o7"],["1P 3m 5d 7m","half-diminished","m7b5 ø -7b5 h7 h"],["1P 3M 5P 7m","dominant seventh","7 dom"],["1P 3M 5P 7m 9M","dominant ninth","9"],["1P 3M 5P 7m 9M 13M","dominant thirteenth","13"],["1P 3M 5P 7m 11A","lydian dominant seventh","7#11 7#4"],["1P 3M 5P 7m 9m","dominant flat ninth","7b9"],["1P 3M 5P 7m 9A","dominant sharp ninth","7#9"],["1P 3M 7m 9m","altered","alt7"],["1P 4P 5P","suspended fourth","sus4 sus"],["1P 2M 5P","suspended second","sus2"],["1P 4P 5P 7m","suspended fourth seventh","7sus4 7sus"],["1P 5P 7m 9M 11P","eleventh","11"],["1P 4P 5P 7m 9m","suspended fourth flat ninth","b9sus phryg 7b9sus 7b9sus4"],["1P 5P","fifth","5"],["1P 3M 5A","augmented","aug + +5 ^#5"],["1P 3m 5A","minor augmented","m#5 -#5 m+"],["1P 3M 5A 7M","augmented seventh","maj7#5 maj7+5 +maj7 ^7#5"],["1P 3M 5P 7M 9M 11A","major sharp eleventh (lydian)","maj9#11 Δ9#11 ^9#11"],["1P 2M 4P 5P","","sus24 sus4add9"],["1P 3M 5A 7M 9M","","maj9#5 Maj9#5"],["1P 3M 5A 7m","","7#5 +7 7+ 7aug aug7"],["1P 3M 5A 7m 9A","","7#5#9 7#9#5 7alt"],["1P 3M 5A 7m 9M","","9#5 9+"],["1P 3M 5A 7m 9M 11A","","9#5#11"],["1P 3M 5A 7m 9m","","7#5b9 7b9#5"],["1P 3M 5A 7m 9m 11A","","7#5b9#11"],["1P 3M 5A 9A","","+add#9"],["1P 3M 5A 9M","","M#5add9 +add9"],["1P 3M 5P 6M 11A","","M6#11 M6b5 6#11 6b5"],["1P 3M 5P 6M 7M 9M","","M7add13"],["1P 3M 5P 6M 9M 11A","","69#11"],["1P 3m 5P 6M 9M","","m69 -69"],["1P 3M 5P 6m 7m","","7b6"],["1P 3M 5P 7M 9A 11A","","maj7#9#11"],["1P 3M 5P 7M 9M 11A 13M","","M13#11 maj13#11 M13+4 M13#4"],["1P 3M 5P 7M 9m","","M7b9"],["1P 3M 5P 7m 11A 13m","","7#11b13 7b5b13"],["1P 3M 5P 7m 13M","","7add6 67 7add13"],["1P 3M 5P 7m 9A 11A","","7#9#11 7b5#9 7#9b5"],["1P 3M 5P 7m 9A 11A 13M","","13#9#11"],["1P 3M 5P 7m 9A 11A 13m","","7#9#11b13"],["1P 3M 5P 7m 9A 13M","","13#9"],["1P 3M 5P 7m 9A 13m","","7#9b13"],["1P 3M 5P 7m 9M 11A","","9#11 9+4 9#4"],["1P 3M 5P 7m 9M 11A 13M","","13#11 13+4 13#4"],["1P 3M 5P 7m 9M 11A 13m","","9#11b13 9b5b13"],["1P 3M 5P 7m 9m 11A","","7b9#11 7b5b9 7b9b5"],["1P 3M 5P 7m 9m 11A 13M","","13b9#11"],["1P 3M 5P 7m 9m 11A 13m","","7b9b13#11 7b9#11b13 7b5b9b13"],["1P 3M 5P 7m 9m 13M","","13b9"],["1P 3M 5P 7m 9m 13m","","7b9b13"],["1P 3M 5P 7m 9m 9A","","7b9#9"],["1P 3M 5P 9M","","Madd9 2 add9 add2"],["1P 3M 5P 9m","","Maddb9"],["1P 3M 5d","","Mb5"],["1P 3M 5d 6M 7m 9M","","13b5"],["1P 3M 5d 7M","","M7b5"],["1P 3M 5d 7M 9M","","M9b5"],["1P 3M 5d 7m","","7b5"],["1P 3M 5d 7m 9M","","9b5"],["1P 3M 7m","","7no5"],["1P 3M 7m 13m","","7b13"],["1P 3M 7m 9M","","9no5"],["1P 3M 7m 9M 13M","","13no5"],["1P 3M 7m 9M 13m","","9b13"],["1P 3m 4P 5P","","madd4"],["1P 3m 5P 6m 7M","","mMaj7b6"],["1P 3m 5P 6m 7M 9M","","mMaj9b6"],["1P 3m 5P 7m 11P","","m7add11 m7add4"],["1P 3m 5P 9M","","madd9"],["1P 3m 5d 6M 7M","","o7M7"],["1P 3m 5d 7M","","oM7"],["1P 3m 6m 7M","","mb6M7"],["1P 3m 6m 7m","","m7#5"],["1P 3m 6m 7m 9M","","m9#5"],["1P 3m 5A 7m 9M 11P","","m11A"],["1P 3m 6m 9m","","mb6b9"],["1P 2M 3m 5d 7m","","m9b5"],["1P 4P 5A 7M","","M7#5sus4"],["1P 4P 5A 7M 9M","","M9#5sus4"],["1P 4P 5A 7m","","7#5sus4"],["1P 4P 5P 7M","","M7sus4"],["1P 4P 5P 7M 9M","","M9sus4"],["1P 4P 5P 7m 9M","","9sus4 9sus"],["1P 4P 5P 7m 9M 13M","","13sus4 13sus"],["1P 4P 5P 7m 9m 13m","","7sus4b9b13 7b9b13sus4"],["1P 4P 7m 10m","","4 quartal"],["1P 5P 7m 9m 11P","","11b9"]],qt=Ut;({...A});var bn=[],y={};function Vt(n,t,e){const a=Yt(n),m={...p(n),name:e||"",quality:a,intervals:n,aliases:t};bn.push(m),m.name&&(y[m.name]=m),y[m.setNum]=m,y[m.chroma]=m,m.aliases.forEach(o=>Jt(m,o))}function Jt(n,t){y[t]=n}function Yt(n){const t=e=>n.indexOf(e)!==-1;return t("5A")?"Augmented":t("3M")?"Major":t("5d")?"Diminished":t("3m")?"Minor":"Unknown"}qt.forEach(([n,t,e])=>Vt(n.split(" "),e.split(" "),t));bn.sort((n,t)=>n.setNum-t.setNum);function Zt(n){return n!==null&&typeof n=="object"&&"name"in n&&typeof n.name=="string"}function Kt(n){return n!==null&&typeof n=="object"&&"step"in n&&typeof n.step=="number"&&"alt"in n&&typeof n.alt=="number"}var fn=[0,2,4,-1,1,3,5],pn=fn.map(n=>Math.floor(n*7/12));function Wt(n){const{step:t,alt:e,oct:a,dir:m=1}=n,o=fn[t]+7*e;if(a===void 0)return[m*o];const r=a-pn[t]-4*e;return[m*o,m*r]}var ne=[3,0,4,1,5,2,6];function te(n){const[t,e,a]=n,m=ne[ee(t)],o=Math.floor((t+1)/7);if(e===void 0)return{step:m,alt:o,dir:a};const r=e+4*o+pn[m];return{step:m,alt:o,oct:r,dir:a}}function ee(n){const t=(n+1)%7;return t<0?7+t:t}var W=(n,t)=>Array(Math.abs(t)+1).join(n),_={empty:!0,name:"",acc:""},ae="([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})",me="(AA|A|P|M|m|d|dd)([-+]?\\d+)",oe=new RegExp("^"+ae+"|"+me+"$");function re(n){const t=oe.exec(`${n}`);return t===null?["",""]:t[1]?[t[1],t[2]]:[t[4],t[3]]}var nn={};function h(n){return typeof n=="string"?nn[n]||(nn[n]=ie(n)):Kt(n)?h(Pe(n)):Zt(n)?h(n.name):_}var tn=[0,2,4,5,7,9,11],An="PMMPPMM";function ie(n){const t=re(n);if(t[0]==="")return _;const e=+t[0],a=t[1],m=(Math.abs(e)-1)%7,o=An[m];if(o==="M"&&a==="P")return _;const r=o==="M"?"majorable":"perfectable",P=""+e+a,s=e<0?-1:1,c=e===8||e===-8?e:s*(m+1),d=se(r,a),u=Math.floor((Math.abs(e)-1)/7),i=s*(tn[m]+d+12*u),b=(s*(tn[m]+d)%12+12)%12,f=Wt({step:m,alt:d,oct:u,dir:s});return{empty:!1,name:P,num:e,q:a,step:m,alt:d,dir:s,type:r,simple:c,semitones:i,chroma:b,coord:f,oct:u}}function gn(n,t){const[e,a=0]=n,o=e*7+a*12<0?[-e,-a,-1]:[e,a,1];return h(te(o))}function se(n,t){return t==="M"&&n==="majorable"||t==="P"&&n==="perfectable"?0:t==="m"&&n==="majorable"?-1:/^A+$/.test(t)?t.length:/^d+$/.test(t)?-1*(n==="perfectable"?t.length:t.length+1):0}function Pe(n){const{step:t,alt:e,oct:a=0,dir:m}=n;if(!m)return"";const o=t+1+7*a,r=o===0?t+1:o,P=m<0?"-":"",s=An[t]==="M"?"majorable":"perfectable";return P+r+Me(s,e)}function Me(n,t){return t===0?n==="majorable"?"M":"P":t===-1&&n==="majorable"?"m":t>0?W("A",t):W("d",n==="perfectable"?t:t+1)}var de=[["1P 3M 5P","major","M ^  maj"],["1P 3M 5P 7M","major seventh","maj7 Δ ma7 M7 Maj7 ^7"],["1P 3M 5P 7M 9M","major ninth","maj9 Δ9 ^9"],["1P 3M 5P 7M 9M 13M","major thirteenth","maj13 Maj13 ^13"],["1P 3M 5P 6M","sixth","6 add6 add13 M6"],["1P 3M 5P 6M 9M","sixth added ninth","6add9 6/9 69 M69"],["1P 3M 6m 7M","major seventh flat sixth","M7b6 ^7b6"],["1P 3M 5P 7M 11A","major seventh sharp eleventh","maj#4 Δ#4 Δ#11 M7#11 ^7#11 maj7#11"],["1P 3m 5P","minor","m min -"],["1P 3m 5P 7m","minor seventh","m7 min7 mi7 -7"],["1P 3m 5P 7M","minor/major seventh","m/ma7 m/maj7 mM7 mMaj7 m/M7 -Δ7 mΔ -^7"],["1P 3m 5P 6M","minor sixth","m6 -6"],["1P 3m 5P 7m 9M","minor ninth","m9 -9"],["1P 3m 5P 7M 9M","minor/major ninth","mM9 mMaj9 -^9"],["1P 3m 5P 7m 9M 11P","minor eleventh","m11 -11"],["1P 3m 5P 7m 9M 13M","minor thirteenth","m13 -13"],["1P 3m 5d","diminished","dim ° o"],["1P 3m 5d 7d","diminished seventh","dim7 °7 o7"],["1P 3m 5d 7m","half-diminished","m7b5 ø -7b5 h7 h"],["1P 3M 5P 7m","dominant seventh","7 dom"],["1P 3M 5P 7m 9M","dominant ninth","9"],["1P 3M 5P 7m 9M 13M","dominant thirteenth","13"],["1P 3M 5P 7m 11A","lydian dominant seventh","7#11 7#4"],["1P 3M 5P 7m 9m","dominant flat ninth","7b9"],["1P 3M 5P 7m 9A","dominant sharp ninth","7#9"],["1P 3M 7m 9m","altered","alt7"],["1P 4P 5P","suspended fourth","sus4 sus"],["1P 2M 5P","suspended second","sus2"],["1P 4P 5P 7m","suspended fourth seventh","7sus4 7sus"],["1P 5P 7m 9M 11P","eleventh","11"],["1P 4P 5P 7m 9m","suspended fourth flat ninth","b9sus phryg 7b9sus 7b9sus4"],["1P 5P","fifth","5"],["1P 3M 5A","augmented","aug + +5 ^#5"],["1P 3m 5A","minor augmented","m#5 -#5 m+"],["1P 3M 5A 7M","augmented seventh","maj7#5 maj7+5 +maj7 ^7#5"],["1P 3M 5P 7M 9M 11A","major sharp eleventh (lydian)","maj9#11 Δ9#11 ^9#11"],["1P 2M 4P 5P","","sus24 sus4add9"],["1P 3M 5A 7M 9M","","maj9#5 Maj9#5"],["1P 3M 5A 7m","","7#5 +7 7+ 7aug aug7"],["1P 3M 5A 7m 9A","","7#5#9 7#9#5 7alt"],["1P 3M 5A 7m 9M","","9#5 9+"],["1P 3M 5A 7m 9M 11A","","9#5#11"],["1P 3M 5A 7m 9m","","7#5b9 7b9#5"],["1P 3M 5A 7m 9m 11A","","7#5b9#11"],["1P 3M 5A 9A","","+add#9"],["1P 3M 5A 9M","","M#5add9 +add9"],["1P 3M 5P 6M 11A","","M6#11 M6b5 6#11 6b5"],["1P 3M 5P 6M 7M 9M","","M7add13"],["1P 3M 5P 6M 9M 11A","","69#11"],["1P 3m 5P 6M 9M","","m69 -69"],["1P 3M 5P 6m 7m","","7b6"],["1P 3M 5P 7M 9A 11A","","maj7#9#11"],["1P 3M 5P 7M 9M 11A 13M","","M13#11 maj13#11 M13+4 M13#4"],["1P 3M 5P 7M 9m","","M7b9"],["1P 3M 5P 7m 11A 13m","","7#11b13 7b5b13"],["1P 3M 5P 7m 13M","","7add6 67 7add13"],["1P 3M 5P 7m 9A 11A","","7#9#11 7b5#9 7#9b5"],["1P 3M 5P 7m 9A 11A 13M","","13#9#11"],["1P 3M 5P 7m 9A 11A 13m","","7#9#11b13"],["1P 3M 5P 7m 9A 13M","","13#9"],["1P 3M 5P 7m 9A 13m","","7#9b13"],["1P 3M 5P 7m 9M 11A","","9#11 9+4 9#4"],["1P 3M 5P 7m 9M 11A 13M","","13#11 13+4 13#4"],["1P 3M 5P 7m 9M 11A 13m","","9#11b13 9b5b13"],["1P 3M 5P 7m 9m 11A","","7b9#11 7b5b9 7b9b5"],["1P 3M 5P 7m 9m 11A 13M","","13b9#11"],["1P 3M 5P 7m 9m 11A 13m","","7b9b13#11 7b9#11b13 7b5b9b13"],["1P 3M 5P 7m 9m 13M","","13b9"],["1P 3M 5P 7m 9m 13m","","7b9b13"],["1P 3M 5P 7m 9m 9A","","7b9#9"],["1P 3M 5P 9M","","Madd9 2 add9 add2"],["1P 3M 5P 9m","","Maddb9"],["1P 3M 5d","","Mb5"],["1P 3M 5d 6M 7m 9M","","13b5"],["1P 3M 5d 7M","","M7b5"],["1P 3M 5d 7M 9M","","M9b5"],["1P 3M 5d 7m","","7b5"],["1P 3M 5d 7m 9M","","9b5"],["1P 3M 7m","","7no5"],["1P 3M 7m 13m","","7b13"],["1P 3M 7m 9M","","9no5"],["1P 3M 7m 9M 13M","","13no5"],["1P 3M 7m 9M 13m","","9b13"],["1P 3m 4P 5P","","madd4"],["1P 3m 5P 6m 7M","","mMaj7b6"],["1P 3m 5P 6m 7M 9M","","mMaj9b6"],["1P 3m 5P 7m 11P","","m7add11 m7add4"],["1P 3m 5P 9M","","madd9"],["1P 3m 5d 6M 7M","","o7M7"],["1P 3m 5d 7M","","oM7"],["1P 3m 6m 7M","","mb6M7"],["1P 3m 6m 7m","","m7#5"],["1P 3m 6m 7m 9M","","m9#5"],["1P 3m 5A 7m 9M 11P","","m11A"],["1P 3m 6m 9m","","mb6b9"],["1P 2M 3m 5d 7m","","m9b5"],["1P 4P 5A 7M","","M7#5sus4"],["1P 4P 5A 7M 9M","","M9#5sus4"],["1P 4P 5A 7m","","7#5sus4"],["1P 4P 5P 7M","","M7sus4"],["1P 4P 5P 7M 9M","","M9sus4"],["1P 4P 5P 7m 9M","","9sus4 9sus"],["1P 4P 5P 7m 9M 13M","","13sus4 13sus"],["1P 4P 5P 7m 9m 13m","","7sus4b9b13 7b9b13sus4"],["1P 4P 7m 10m","","4 quartal"],["1P 5P 7m 9m 11P","","11b9"]],ce=de;({...A});var vn=[],N={};function ue(n,t,e){const a=he(n),m={...p(n),name:e||"",quality:a,intervals:n,aliases:t};vn.push(m),m.name&&(N[m.name]=m),N[m.setNum]=m,N[m.chroma]=m,m.aliases.forEach(o=>le(m,o))}function le(n,t){N[t]=n}function he(n){const t=e=>n.indexOf(e)!==-1;return t("5A")?"Augmented":t("3M")?"Major":t("5d")?"Diminished":t("3m")?"Minor":"Unknown"}ce.forEach(([n,t,e])=>ue(n.split(" "),e.split(" "),t));vn.sort((n,t)=>n.setNum-t.setNum);var be=[["1P 2M 3M 5P 6M","major pentatonic","pentatonic"],["1P 2M 3M 4P 5P 6M 7M","major","ionian"],["1P 2M 3m 4P 5P 6m 7m","minor","aeolian"],["1P 2M 3m 3M 5P 6M","major blues"],["1P 3m 4P 5d 5P 7m","minor blues","blues"],["1P 2M 3m 4P 5P 6M 7M","melodic minor"],["1P 2M 3m 4P 5P 6m 7M","harmonic minor"],["1P 2M 3M 4P 5P 6M 7m 7M","bebop"],["1P 2M 3m 4P 5d 6m 6M 7M","diminished","whole-half diminished"],["1P 2M 3m 4P 5P 6M 7m","dorian"],["1P 2M 3M 4A 5P 6M 7M","lydian"],["1P 2M 3M 4P 5P 6M 7m","mixolydian","dominant"],["1P 2m 3m 4P 5P 6m 7m","phrygian"],["1P 2m 3m 4P 5d 6m 7m","locrian"],["1P 3M 4P 5P 7M","ionian pentatonic"],["1P 3M 4P 5P 7m","mixolydian pentatonic","indian"],["1P 2M 4P 5P 6M","ritusen"],["1P 2M 4P 5P 7m","egyptian"],["1P 3M 4P 5d 7m","neapolitan major pentatonic"],["1P 3m 4P 5P 6m","vietnamese 1"],["1P 2m 3m 5P 6m","pelog"],["1P 2m 4P 5P 6m","kumoijoshi"],["1P 2M 3m 5P 6m","hirajoshi"],["1P 2m 4P 5d 7m","iwato"],["1P 2m 4P 5P 7m","in-sen"],["1P 3M 4A 5P 7M","lydian pentatonic","chinese"],["1P 3m 4P 6m 7m","malkos raga"],["1P 3m 4P 5d 7m","locrian pentatonic","minor seven flat five pentatonic"],["1P 3m 4P 5P 7m","minor pentatonic","vietnamese 2"],["1P 3m 4P 5P 6M","minor six pentatonic"],["1P 2M 3m 5P 6M","flat three pentatonic","kumoi"],["1P 2M 3M 5P 6m","flat six pentatonic"],["1P 2m 3M 5P 6M","scriabin"],["1P 3M 5d 6m 7m","whole tone pentatonic"],["1P 3M 4A 5A 7M","lydian #5p pentatonic"],["1P 3M 4A 5P 7m","lydian dominant pentatonic"],["1P 3m 4P 5P 7M","minor #7m pentatonic"],["1P 3m 4d 5d 7m","super locrian pentatonic"],["1P 2M 3m 4P 5P 7M","minor hexatonic"],["1P 2A 3M 5P 5A 7M","augmented"],["1P 2M 4P 5P 6M 7m","piongio"],["1P 2m 3M 4A 6M 7m","prometheus neapolitan"],["1P 2M 3M 4A 6M 7m","prometheus"],["1P 2m 3M 5d 6m 7m","mystery #1"],["1P 2m 3M 4P 5A 6M","six tone symmetric"],["1P 2M 3M 4A 5A 6A","whole tone","messiaen's mode #1"],["1P 2m 4P 4A 5P 7M","messiaen's mode #5"],["1P 2M 3M 4P 5d 6m 7m","locrian major","arabian"],["1P 2m 3M 4A 5P 6m 7M","double harmonic lydian"],["1P 2m 2A 3M 4A 6m 7m","altered","super locrian","diminished whole tone","pomeroy"],["1P 2M 3m 4P 5d 6m 7m","locrian #2","half-diminished","aeolian b5"],["1P 2M 3M 4P 5P 6m 7m","mixolydian b6","melodic minor fifth mode","hindu"],["1P 2M 3M 4A 5P 6M 7m","lydian dominant","lydian b7","overtone"],["1P 2M 3M 4A 5A 6M 7M","lydian augmented"],["1P 2m 3m 4P 5P 6M 7m","dorian b2","phrygian #6","melodic minor second mode"],["1P 2m 3m 4d 5d 6m 7d","ultralocrian","superlocrian bb7","superlocrian diminished"],["1P 2m 3m 4P 5d 6M 7m","locrian 6","locrian natural 6","locrian sharp 6"],["1P 2A 3M 4P 5P 5A 7M","augmented heptatonic"],["1P 2M 3m 4A 5P 6M 7m","dorian #4","ukrainian dorian","romanian minor","altered dorian"],["1P 2M 3m 4A 5P 6M 7M","lydian diminished"],["1P 2M 3M 4A 5A 7m 7M","leading whole tone"],["1P 2M 3M 4A 5P 6m 7m","lydian minor"],["1P 2m 3M 4P 5P 6m 7m","phrygian dominant","spanish","phrygian major"],["1P 2m 3m 4P 5P 6m 7M","balinese"],["1P 2m 3m 4P 5P 6M 7M","neapolitan major"],["1P 2M 3M 4P 5P 6m 7M","harmonic major"],["1P 2m 3M 4P 5P 6m 7M","double harmonic major","gypsy"],["1P 2M 3m 4A 5P 6m 7M","hungarian minor"],["1P 2A 3M 4A 5P 6M 7m","hungarian major"],["1P 2m 3M 4P 5d 6M 7m","oriental"],["1P 2m 3m 3M 4A 5P 7m","flamenco"],["1P 2m 3m 4A 5P 6m 7M","todi raga"],["1P 2m 3M 4P 5d 6m 7M","persian"],["1P 2m 3M 5d 6m 7m 7M","enigmatic"],["1P 2M 3M 4P 5A 6M 7M","major augmented","major #5","ionian augmented","ionian #5"],["1P 2A 3M 4A 5P 6M 7M","lydian #9"],["1P 2m 2M 4P 4A 5P 6m 7M","messiaen's mode #4"],["1P 2m 3M 4P 4A 5P 6m 7M","purvi raga"],["1P 2m 3m 3M 4P 5P 6m 7m","spanish heptatonic"],["1P 2M 3m 3M 4P 5P 6M 7m","bebop minor"],["1P 2M 3M 4P 5P 5A 6M 7M","bebop major"],["1P 2m 3m 4P 5d 5P 6m 7m","bebop locrian"],["1P 2M 3m 4P 5P 6m 7m 7M","minor bebop"],["1P 2M 3M 4P 5d 5P 6M 7M","ichikosucho"],["1P 2M 3m 4P 5P 6m 6M 7M","minor six diminished"],["1P 2m 3m 3M 4A 5P 6M 7m","half-whole diminished","dominant diminished","messiaen's mode #2"],["1P 3m 3M 4P 5P 6M 7m 7M","kafi raga"],["1P 2M 3M 4P 4A 5A 6A 7M","messiaen's mode #6"],["1P 2M 3m 3M 4P 5d 5P 6M 7m","composite blues"],["1P 2M 3m 3M 4A 5P 6m 7m 7M","messiaen's mode #3"],["1P 2m 2M 3m 4P 4A 5P 6m 6M 7M","messiaen's mode #7"],["1P 2m 2M 3m 3M 4P 5d 5P 6m 6M 7m 7M","chromatic"]],fe=be,pe={...A,intervals:[],aliases:[]},z=[],v={};function Ae(){return z.map(n=>n.name)}function xn(n){return v[n]||pe}function F(){return z.slice()}function ge(n,t,e=[]){const a={...p(n),name:t,intervals:n,aliases:e};return z.push(a),v[a.name]=a,v[a.setNum]=a,v[a.chroma]=a,a.aliases.forEach(m=>ve(a,m)),a}function ve(n,t){v[t]=n}fe.forEach(([n,t,...e])=>ge(n.split(" "),t,e));var xe=[[.125,"dl",["large","duplex longa","maxima","octuple","octuple whole"]],[.25,"l",["long","longa"]],[.5,"d",["double whole","double","breve"]],[1,"w",["whole","semibreve"]],[2,"h",["half","minim"]],[4,"q",["quarter","crotchet"]],[8,"e",["eighth","quaver"]],[16,"s",["sixteenth","semiquaver"]],[32,"t",["thirty-second","demisemiquaver"]],[64,"sf",["sixty-fourth","hemidemisemiquaver"]],[128,"h",["hundred twenty-eighth"]],[256,"th",["two hundred fifty-sixth"]]],je=xe;je.forEach(([n,t,e])=>void 0);function ye(){return"1P 2M 3M 4P 5P 6m 7m".split(" ")}var jn=h,Ne=n=>h(n).name,$e=n=>h(n).semitones,ke=n=>h(n).q,Ee=n=>h(n).num;function Te(n){const t=h(n);return t.empty?"":t.simple+t.q}function we(n){const t=h(n);if(t.empty)return"";const e=(7-t.step)%7,a=t.type==="perfectable"?-t.alt:-(t.alt+1);return h({step:e,alt:a,oct:t.oct,dir:t.dir}).name}var Se=[1,2,2,3,3,4,5,5,6,6,7,7],Oe="P m M m M P d P m M m M".split(" ");function Re(n){const t=n<0?-1:1,e=Math.abs(n),a=e%12,m=Math.floor(e/12);return t*(Se[a]+7*m)+Oe[a]}var _e=pt,yn=Nn((n,t)=>[n[0]+t[0],n[1]+t[1]]),Ce=n=>t=>yn(n,t),Ie=Nn((n,t)=>[n[0]-t[0],n[1]-t[1]]);function ze(n,t){const e=jn(n);if(e.empty)return"";const[a,m,o]=e.coord;return gn([a+t,m,o]).name}var A1={names:ye,get:jn,name:Ne,num:Ee,semitones:$e,quality:ke,fromSemitones:Re,distance:_e,invert:we,simplify:Te,add:yn,addTo:Ce,substract:Ie,transposeFifths:ze};function Nn(n){return(t,e)=>{const a=h(t).coord,m=h(e).coord;if(a&&m){const o=n(a,m);return gn(o).name}}}var Fe="C C# D D# E F F# G G# A A# B".split(" "),De="C Db D Eb E F Gb G Ab A Bb B".split(" ");function $n(n,t={}){if(isNaN(n)||n===-1/0||n===1/0)return"";n=Math.round(n);const a=(t.sharps===!0?Fe:De)[n%12];if(t.pitchClass)return a;const m=Math.floor(n/12)-1;return a+m}var He=n=>n.name,Ge=n=>n.map(l).filter(t=>!t.empty),en=l;function Le(n){return $n(n)}var kn=(n,t)=>n.height-t.height;function Be(n,t){return t=t||kn,Ge(n).sort(t).map(He)}function Xe(n){return Be(n,kn).filter((t,e,a)=>e===0||t!==a[e-1])}function Qe(n,t){const e=en(n);if(e.empty)return"";const a=en(t||$n(e.midi||e.chroma,{sharps:e.alt<0,pitchClass:!0}));if(a.empty||a.chroma!==e.chroma)return"";if(e.oct===void 0)return a.pc;const m=e.chroma-e.alt,o=a.chroma-a.alt,r=m>11||o<0?-1:m<0||o>11?1:0,P=e.oct+r;return a.pc+P}var D=[[0,2773,0,"ionian","","Maj7","major"],[1,2902,2,"dorian","m","m7"],[2,3418,4,"phrygian","m","m7"],[3,2741,-1,"lydian","","Maj7"],[4,2774,1,"mixolydian","","7"],[5,2906,3,"aeolian","m","m7","minor"],[6,3434,5,"locrian","dim","m7b5"]],an={...A,name:"",alt:0,modeNum:NaN,triad:"",seventh:"",aliases:[]},Ue=D.map(qe),C={};Ue.forEach(n=>{C[n.name]=n,n.aliases.forEach(t=>{C[t]=n})});function En(n){return typeof n=="string"?C[n.toLowerCase()]||an:n&&n.name?En(n.name):an}function qe(n){const[t,e,a,m,o,r,P]=n,s=P?[P]:[],c=Number(e).toString(2);return{empty:!1,intervals:xn(m).intervals,modeNum:t,chroma:c,normalized:c,name:m,setNum:e,alt:a,triad:o,seventh:r,aliases:s}}function Tn(n){return(t,e)=>{const a=En(t);if(a.empty)return[];const m=x(a.modeNum,n),o=a.intervals.map(r=>T(e,r));return m.map((r,P)=>o[P]+r)}}Tn(D.map(n=>n[4]));Tn(D.map(n=>n[5]));var Ve=[["1P 3M 5P","major","M ^  maj"],["1P 3M 5P 7M","major seventh","maj7 Δ ma7 M7 Maj7 ^7"],["1P 3M 5P 7M 9M","major ninth","maj9 Δ9 ^9"],["1P 3M 5P 7M 9M 13M","major thirteenth","maj13 Maj13 ^13"],["1P 3M 5P 6M","sixth","6 add6 add13 M6"],["1P 3M 5P 6M 9M","sixth added ninth","6add9 6/9 69 M69"],["1P 3M 6m 7M","major seventh flat sixth","M7b6 ^7b6"],["1P 3M 5P 7M 11A","major seventh sharp eleventh","maj#4 Δ#4 Δ#11 M7#11 ^7#11 maj7#11"],["1P 3m 5P","minor","m min -"],["1P 3m 5P 7m","minor seventh","m7 min7 mi7 -7"],["1P 3m 5P 7M","minor/major seventh","m/ma7 m/maj7 mM7 mMaj7 m/M7 -Δ7 mΔ -^7 -maj7"],["1P 3m 5P 6M","minor sixth","m6 -6"],["1P 3m 5P 7m 9M","minor ninth","m9 -9"],["1P 3m 5P 7M 9M","minor/major ninth","mM9 mMaj9 -^9"],["1P 3m 5P 7m 9M 11P","minor eleventh","m11 -11"],["1P 3m 5P 7m 9M 13M","minor thirteenth","m13 -13"],["1P 3m 5d","diminished","dim ° o"],["1P 3m 5d 7d","diminished seventh","dim7 °7 o7"],["1P 3m 5d 7m","half-diminished","m7b5 ø -7b5 h7 h"],["1P 3M 5P 7m","dominant seventh","7 dom"],["1P 3M 5P 7m 9M","dominant ninth","9"],["1P 3M 5P 7m 9M 13M","dominant thirteenth","13"],["1P 3M 5P 7m 11A","lydian dominant seventh","7#11 7#4"],["1P 3M 5P 7m 9m","dominant flat ninth","7b9"],["1P 3M 5P 7m 9A","dominant sharp ninth","7#9"],["1P 3M 7m 9m","altered","alt7"],["1P 4P 5P","suspended fourth","sus4 sus"],["1P 2M 5P","suspended second","sus2"],["1P 4P 5P 7m","suspended fourth seventh","7sus4 7sus"],["1P 5P 7m 9M 11P","eleventh","11"],["1P 4P 5P 7m 9m","suspended fourth flat ninth","b9sus phryg 7b9sus 7b9sus4"],["1P 5P","fifth","5"],["1P 3M 5A","augmented","aug + +5 ^#5"],["1P 3m 5A","minor augmented","m#5 -#5 m+"],["1P 3M 5A 7M","augmented seventh","maj7#5 maj7+5 +maj7 ^7#5"],["1P 3M 5P 7M 9M 11A","major sharp eleventh (lydian)","maj9#11 Δ9#11 ^9#11"],["1P 2M 4P 5P","","sus24 sus4add9"],["1P 3M 5A 7M 9M","","maj9#5 Maj9#5"],["1P 3M 5A 7m","","7#5 +7 7+ 7aug aug7"],["1P 3M 5A 7m 9A","","7#5#9 7#9#5 7alt"],["1P 3M 5A 7m 9M","","9#5 9+"],["1P 3M 5A 7m 9M 11A","","9#5#11"],["1P 3M 5A 7m 9m","","7#5b9 7b9#5"],["1P 3M 5A 7m 9m 11A","","7#5b9#11"],["1P 3M 5A 9A","","+add#9"],["1P 3M 5A 9M","","M#5add9 +add9"],["1P 3M 5P 6M 11A","","M6#11 M6b5 6#11 6b5"],["1P 3M 5P 6M 7M 9M","","M7add13"],["1P 3M 5P 6M 9M 11A","","69#11"],["1P 3m 5P 6M 9M","","m69 -69"],["1P 3M 5P 6m 7m","","7b6"],["1P 3M 5P 7M 9A 11A","","maj7#9#11"],["1P 3M 5P 7M 9M 11A 13M","","M13#11 maj13#11 M13+4 M13#4"],["1P 3M 5P 7M 9m","","M7b9"],["1P 3M 5P 7m 11A 13m","","7#11b13 7b5b13"],["1P 3M 5P 7m 13M","","7add6 67 7add13"],["1P 3M 5P 7m 9A 11A","","7#9#11 7b5#9 7#9b5"],["1P 3M 5P 7m 9A 11A 13M","","13#9#11"],["1P 3M 5P 7m 9A 11A 13m","","7#9#11b13"],["1P 3M 5P 7m 9A 13M","","13#9"],["1P 3M 5P 7m 9A 13m","","7#9b13"],["1P 3M 5P 7m 9M 11A","","9#11 9+4 9#4"],["1P 3M 5P 7m 9M 11A 13M","","13#11 13+4 13#4"],["1P 3M 5P 7m 9M 11A 13m","","9#11b13 9b5b13"],["1P 3M 5P 7m 9m 11A","","7b9#11 7b5b9 7b9b5"],["1P 3M 5P 7m 9m 11A 13M","","13b9#11"],["1P 3M 5P 7m 9m 11A 13m","","7b9b13#11 7b9#11b13 7b5b9b13"],["1P 3M 5P 7m 9m 13M","","13b9"],["1P 3M 5P 7m 9m 13m","","7b9b13"],["1P 3M 5P 7m 9m 9A","","7b9#9"],["1P 3M 5P 9M","","Madd9 2 add9 add2"],["1P 3M 5P 9m","","Maddb9"],["1P 3M 5d","","Mb5"],["1P 3M 5d 6M 7m 9M","","13b5"],["1P 3M 5d 7M","","M7b5"],["1P 3M 5d 7M 9M","","M9b5"],["1P 3M 5d 7m","","7b5"],["1P 3M 5d 7m 9M","","9b5"],["1P 3M 7m","","7no5"],["1P 3M 7m 13m","","7b13"],["1P 3M 7m 9M","","9no5"],["1P 3M 7m 9M 13M","","13no5"],["1P 3M 7m 9M 13m","","9b13"],["1P 3m 4P 5P","","madd4"],["1P 3m 5P 6m 7M","","mMaj7b6"],["1P 3m 5P 6m 7M 9M","","mMaj9b6"],["1P 3m 5P 7m 11P","","m7add11 m7add4"],["1P 3m 5P 9M","","madd9"],["1P 3m 5d 6M 7M","","o7M7"],["1P 3m 5d 7M","","oM7"],["1P 3m 6m 7M","","mb6M7"],["1P 3m 6m 7m","","m7#5"],["1P 3m 6m 7m 9M","","m9#5"],["1P 3m 5A 7m 9M 11P","","m11A"],["1P 3m 6m 9m","","mb6b9"],["1P 2M 3m 5d 7m","","m9b5"],["1P 4P 5A 7M","","M7#5sus4"],["1P 4P 5A 7M 9M","","M9#5sus4"],["1P 4P 5A 7m","","7#5sus4"],["1P 4P 5P 7M","","M7sus4"],["1P 4P 5P 7M 9M","","M9sus4"],["1P 4P 5P 7m 9M","","9sus4 9sus"],["1P 4P 5P 7m 9M 13M","","13sus4 13sus"],["1P 4P 5P 7m 9m 13m","","7sus4b9b13 7b9b13sus4"],["1P 4P 7m 10m","","4 quartal"],["1P 5P 7m 9m 11P","","11b9"]],Je=Ve;({...A});var wn=[],$={};function Ye(n,t,e){const a=Ke(n),m={...p(n),name:e||"",quality:a,intervals:n,aliases:t};wn.push(m),m.name&&($[m.name]=m),$[m.setNum]=m,$[m.chroma]=m,m.aliases.forEach(o=>Ze(m,o))}function Ze(n,t){$[t]=n}function Ke(n){const t=e=>n.indexOf(e)!==-1;return t("5A")?"Augmented":t("3M")?"Major":t("5d")?"Diminished":t("3m")?"Minor":"Unknown"}Je.forEach(([n,t,e])=>Ye(n.split(" "),e.split(" "),t));wn.sort((n,t)=>n.setNum-t.setNum);var We=[["1P 3M 5P","major","M ^  maj"],["1P 3M 5P 7M","major seventh","maj7 Δ ma7 M7 Maj7 ^7"],["1P 3M 5P 7M 9M","major ninth","maj9 Δ9 ^9"],["1P 3M 5P 7M 9M 13M","major thirteenth","maj13 Maj13 ^13"],["1P 3M 5P 6M","sixth","6 add6 add13 M6"],["1P 3M 5P 6M 9M","sixth added ninth","6add9 6/9 69 M69"],["1P 3M 6m 7M","major seventh flat sixth","M7b6 ^7b6"],["1P 3M 5P 7M 11A","major seventh sharp eleventh","maj#4 Δ#4 Δ#11 M7#11 ^7#11 maj7#11"],["1P 3m 5P","minor","m min -"],["1P 3m 5P 7m","minor seventh","m7 min7 mi7 -7"],["1P 3m 5P 7M","minor/major seventh","m/ma7 m/maj7 mM7 mMaj7 m/M7 -Δ7 mΔ -^7 -maj7"],["1P 3m 5P 6M","minor sixth","m6 -6"],["1P 3m 5P 7m 9M","minor ninth","m9 -9"],["1P 3m 5P 7M 9M","minor/major ninth","mM9 mMaj9 -^9"],["1P 3m 5P 7m 9M 11P","minor eleventh","m11 -11"],["1P 3m 5P 7m 9M 13M","minor thirteenth","m13 -13"],["1P 3m 5d","diminished","dim ° o"],["1P 3m 5d 7d","diminished seventh","dim7 °7 o7"],["1P 3m 5d 7m","half-diminished","m7b5 ø -7b5 h7 h"],["1P 3M 5P 7m","dominant seventh","7 dom"],["1P 3M 5P 7m 9M","dominant ninth","9"],["1P 3M 5P 7m 9M 13M","dominant thirteenth","13"],["1P 3M 5P 7m 11A","lydian dominant seventh","7#11 7#4"],["1P 3M 5P 7m 9m","dominant flat ninth","7b9"],["1P 3M 5P 7m 9A","dominant sharp ninth","7#9"],["1P 3M 7m 9m","altered","alt7"],["1P 4P 5P","suspended fourth","sus4 sus"],["1P 2M 5P","suspended second","sus2"],["1P 4P 5P 7m","suspended fourth seventh","7sus4 7sus"],["1P 5P 7m 9M 11P","eleventh","11"],["1P 4P 5P 7m 9m","suspended fourth flat ninth","b9sus phryg 7b9sus 7b9sus4"],["1P 5P","fifth","5"],["1P 3M 5A","augmented","aug + +5 ^#5"],["1P 3m 5A","minor augmented","m#5 -#5 m+"],["1P 3M 5A 7M","augmented seventh","maj7#5 maj7+5 +maj7 ^7#5"],["1P 3M 5P 7M 9M 11A","major sharp eleventh (lydian)","maj9#11 Δ9#11 ^9#11"],["1P 2M 4P 5P","","sus24 sus4add9"],["1P 3M 5A 7M 9M","","maj9#5 Maj9#5"],["1P 3M 5A 7m","","7#5 +7 7+ 7aug aug7"],["1P 3M 5A 7m 9A","","7#5#9 7#9#5 7alt"],["1P 3M 5A 7m 9M","","9#5 9+"],["1P 3M 5A 7m 9M 11A","","9#5#11"],["1P 3M 5A 7m 9m","","7#5b9 7b9#5"],["1P 3M 5A 7m 9m 11A","","7#5b9#11"],["1P 3M 5A 9A","","+add#9"],["1P 3M 5A 9M","","M#5add9 +add9"],["1P 3M 5P 6M 11A","","M6#11 M6b5 6#11 6b5"],["1P 3M 5P 6M 7M 9M","","M7add13"],["1P 3M 5P 6M 9M 11A","","69#11"],["1P 3m 5P 6M 9M","","m69 -69"],["1P 3M 5P 6m 7m","","7b6"],["1P 3M 5P 7M 9A 11A","","maj7#9#11"],["1P 3M 5P 7M 9M 11A 13M","","M13#11 maj13#11 M13+4 M13#4"],["1P 3M 5P 7M 9m","","M7b9"],["1P 3M 5P 7m 11A 13m","","7#11b13 7b5b13"],["1P 3M 5P 7m 13M","","7add6 67 7add13"],["1P 3M 5P 7m 9A 11A","","7#9#11 7b5#9 7#9b5"],["1P 3M 5P 7m 9A 11A 13M","","13#9#11"],["1P 3M 5P 7m 9A 11A 13m","","7#9#11b13"],["1P 3M 5P 7m 9A 13M","","13#9"],["1P 3M 5P 7m 9A 13m","","7#9b13"],["1P 3M 5P 7m 9M 11A","","9#11 9+4 9#4"],["1P 3M 5P 7m 9M 11A 13M","","13#11 13+4 13#4"],["1P 3M 5P 7m 9M 11A 13m","","9#11b13 9b5b13"],["1P 3M 5P 7m 9m 11A","","7b9#11 7b5b9 7b9b5"],["1P 3M 5P 7m 9m 11A 13M","","13b9#11"],["1P 3M 5P 7m 9m 11A 13m","","7b9b13#11 7b9#11b13 7b5b9b13"],["1P 3M 5P 7m 9m 13M","","13b9"],["1P 3M 5P 7m 9m 13m","","7b9b13"],["1P 3M 5P 7m 9m 9A","","7b9#9"],["1P 3M 5P 9M","","Madd9 2 add9 add2"],["1P 3M 5P 9m","","Maddb9"],["1P 3M 5d","","Mb5"],["1P 3M 5d 6M 7m 9M","","13b5"],["1P 3M 5d 7M","","M7b5"],["1P 3M 5d 7M 9M","","M9b5"],["1P 3M 5d 7m","","7b5"],["1P 3M 5d 7m 9M","","9b5"],["1P 3M 7m","","7no5"],["1P 3M 7m 13m","","7b13"],["1P 3M 7m 9M","","9no5"],["1P 3M 7m 9M 13M","","13no5"],["1P 3M 7m 9M 13m","","9b13"],["1P 3m 4P 5P","","madd4"],["1P 3m 5P 6m 7M","","mMaj7b6"],["1P 3m 5P 6m 7M 9M","","mMaj9b6"],["1P 3m 5P 7m 11P","","m7add11 m7add4"],["1P 3m 5P 9M","","madd9"],["1P 3m 5d 6M 7M","","o7M7"],["1P 3m 5d 7M","","oM7"],["1P 3m 6m 7M","","mb6M7"],["1P 3m 6m 7m","","m7#5"],["1P 3m 6m 7m 9M","","m9#5"],["1P 3m 5A 7m 9M 11P","","m11A"],["1P 3m 6m 9m","","mb6b9"],["1P 2M 3m 5d 7m","","m9b5"],["1P 4P 5A 7M","","M7#5sus4"],["1P 4P 5A 7M 9M","","M9#5sus4"],["1P 4P 5A 7m","","7#5sus4"],["1P 4P 5P 7M","","M7sus4"],["1P 4P 5P 7M 9M","","M9sus4"],["1P 4P 5P 7m 9M","","9sus4 9sus"],["1P 4P 5P 7m 9M 13M","","13sus4 13sus"],["1P 4P 5P 7m 9m 13m","","7sus4b9b13 7b9b13sus4"],["1P 4P 7m 10m","","4 quartal"],["1P 5P 7m 9m 11P","","11b9"]],n1=We;({...A});var H=[],k={};function t1(){return H.slice()}function e1(n,t,e){const a=m1(n),m={...p(n),name:e||"",quality:a,intervals:n,aliases:t};H.push(m),m.name&&(k[m.name]=m),k[m.setNum]=m,k[m.chroma]=m,m.aliases.forEach(o=>a1(m,o))}function a1(n,t){k[t]=n}function m1(n){const t=e=>n.indexOf(e)!==-1;return t("5A")?"Augmented":t("3M")?"Major":t("5d")?"Diminished":t("3m")?"Minor":"Unknown"}n1.forEach(([n,t,e])=>e1(n.split(" "),e.split(" "),t));H.sort((n,t)=>n.setNum-t.setNum);var o1={empty:!0,name:"",type:"",tonic:null,setNum:NaN,chroma:"",normalized:"",aliases:[],notes:[],intervals:[]};function Sn(n){if(typeof n!="string")return["",""];const t=n.indexOf(" "),e=l(n.substring(0,t));if(e.empty){const m=l(n);return m.empty?["",n.toLowerCase()]:[m.name,""]}const a=n.substring(e.name.length+1).toLowerCase();return[e.name,a.length?a:""]}var r1=Ae;function g(n){const t=Array.isArray(n)?n:Sn(n),e=l(t[0]).name,a=xn(t[1]);if(a.empty)return o1;const m=a.name,o=e?a.intervals.map(P=>T(e,P)):[],r=e?e+" "+m:m;return{...a,name:r,type:m,tonic:e,notes:o}}var i1=g;function s1(n,t={}){const e=Ft(n),a=l(t.tonic??n[0]??""),m=a.chroma;if(m===void 0)return[];const o=e.split("");o[m]="1";const r=x(m,o).join(""),P=F().find(c=>c.chroma===r),s=[];return P&&s.push(a.name+" "+P.name),t.match==="exact"||On(r).forEach(c=>{s.push(a.name+" "+c)}),s}function P1(n){const t=g(n),e=hn(t.chroma);return t1().filter(a=>e(a.chroma)).map(a=>a.aliases[0])}function On(n){const t=I(n)?n:g(n).chroma,e=Lt(t);return F().filter(a=>e(a.chroma)).map(a=>a.name)}function M1(n){const t=hn(g(n).chroma);return F().filter(e=>t(e.chroma)).map(e=>e.name)}function Rn(n){const t=n.map(m=>l(m).pc).filter(m=>m),e=t[0],a=Xe(t);return x(a.indexOf(e),a)}function d1(n){const t=g(n);if(t.empty)return[];const e=t.tonic?t.notes:t.intervals;return Gt(t.chroma).map((a,m)=>{const o=g(a).name;return o?[e[m],o]:["",""]}).filter(a=>a[0])}function c1(n){const t=Array.isArray(n)?Rn(n):g(n).notes,e=t.map(a=>l(a).chroma);return a=>{const m=l(typeof a=="number"?Le(a):a),o=m.height;if(o===void 0)return;const r=o%12,P=e.indexOf(r);if(P!==-1)return Qe(m.name,t[P])}}function u1(n){const t=c1(n);return(e,a)=>{const m=l(e).height,o=l(a).height;return m===void 0||o===void 0?[]:vt(m,o).map(t).filter(r=>r)}}function l1(n){const{intervals:t,tonic:e}=g(n),a=dn(t,e);return m=>m?a(m>0?m-1:m):""}function h1(n){const{intervals:t,tonic:e}=g(n);return dn(t,e)}var g1={degrees:l1,detect:s1,extended:On,get:g,modeNames:d1,names:r1,rangeOf:u1,reduced:M1,scaleChords:P1,scaleNotes:Rn,steps:h1,tokenize:Sn,scale:i1};const b1=[3,5,7,9],f1=[12],v1=({items:n,activeId:t,onItemClick:e,renderContent:a,headerTitle:m,headerSubtitle:o,headerContent:r,showBackButton:P=!0,children:s})=>{const c=Fn(),{isFrench:d}=Dn(),u=i=>i&&typeof i=="object"?d?i.fr:i.en:i;return M.jsxs("div",{className:"neck-container",children:[M.jsx("style",{children:`
        .neck-container {
          min-height: 100vh;
          width: 100%;
          max-width: 540px;
          margin: 0 auto;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow-x: hidden;
          padding-left: env(safe-area-inset-left);
          padding-right: env(safe-area-inset-right);
          background: linear-gradient(180deg,
            #0d0d14 0%,
            #12100e 8%,
            #1a1510 20%,
            #1a1510 80%,
            #12100e 95%,
            #0d0d14 100%
          );
        }
        @media (min-width: 768px) {
          .neck-container {
            max-width: 600px;
          }
        }

        /* ═══════ THE NUT / HEADSTOCK ═══════ */
        .neck-nut {
          position: relative;
          padding: 44px 24px 32px;
          padding-top: max(44px, calc(env(safe-area-inset-top) + 24px));
          text-align: center;
          z-index: 5;
          background: radial-gradient(
            ellipse at 50% 80%,
            rgba(201, 169, 110, 0.08) 0%,
            transparent 60%
          );
        }
        .neck-nut::after {
          content: '';
          position: absolute;
          bottom: 0; left: 6%; right: 6%;
          height: 5px;
          background: linear-gradient(90deg,
            rgba(120,100,60,0.2),
            rgba(200,180,130,0.7),
            rgba(240,230,200,0.95),
            rgba(200,180,130,0.7),
            rgba(120,100,60,0.2)
          );
          border-radius: 2px;
          box-shadow:
            0 0 8px rgba(212,175,55,0.3),
            0 2px 4px rgba(0,0,0,0.5);
        }
        .neck-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 8vw, 2.8rem);
          font-weight: 400;
          color: #f0e6d2;
          margin: 0 0 6px;
          line-height: 1.1;
          text-shadow: 0 2px 12px rgba(201,169,110,0.3);
        }
        .neck-tagline {
          font-family: 'EB Garamond', serif;
          font-style: italic;
          font-size: 0.95rem;
          color: #7aaa88;
          margin: 0 0 20px;
          text-shadow: 0 1px 8px rgba(122,170,136,0.2);
        }

        /* ═══════ THE NECK ═══════ */
        .neck-board {
          position: relative;
          padding: 0 16px 120px;
        }

        /* Wood grain texture */
        .neck-board::before {
          content: '';
          position: absolute;
          top: 0; bottom: 0;
          left: 16px; right: 16px;
          background:
            repeating-linear-gradient(180deg,
              rgba(80, 55, 30, 0.06) 0px,
              transparent 2px,
              transparent 8px,
              rgba(80, 55, 30, 0.04) 10px
            ),
            linear-gradient(180deg,
              rgba(58, 40, 24, 0.3) 0%,
              rgba(42, 28, 16, 0.25) 30%,
              rgba(52, 36, 22, 0.28) 60%,
              rgba(42, 28, 16, 0.25) 100%
            );
          pointer-events: none;
          z-index: 0;
          border-left: 2px solid rgba(90, 65, 35, 0.25);
          border-right: 2px solid rgba(90, 65, 35, 0.25);
        }

        /* Strings — 6 vertical metallic lines */
        .neck-strings {
          position: absolute;
          top: 0; bottom: 0;
          left: 36px; right: 36px;
          display: flex;
          justify-content: space-between;
          pointer-events: none;
          z-index: 1;
        }
        .neck-string {
          height: 100%;
          background: linear-gradient(180deg,
            rgba(220, 200, 160, 0.25),
            rgba(200, 180, 140, 0.15),
            rgba(220, 200, 160, 0.25)
          );
          box-shadow: 0 0 2px rgba(220, 200, 160, 0.1);
        }
        .neck-string:nth-child(1) { width: 3px; opacity: 0.35; }
        .neck-string:nth-child(2) { width: 2.5px; opacity: 0.3; }
        .neck-string:nth-child(3) { width: 2px; opacity: 0.25; }
        .neck-string:nth-child(4) { width: 1.5px; opacity: 0.25; }
        .neck-string:nth-child(5) { width: 1px; opacity: 0.22; }
        .neck-string:nth-child(6) { width: 0.5px; opacity: 0.2; }

        /* ═══════ ACT LABEL ═══════ */
        .neck-act {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #8a7a5a;
          padding: 20px 8px 8px;
          position: relative;
          z-index: 2;
          text-shadow: 0 1px 4px rgba(0,0,0,0.5);
        }

        /* ═══════ FRET CARD ═══════ */
        .neck-fret {
          position: relative;
          z-index: 2;
          margin-bottom: 0;
        }
        /* Fret wire — thin metallic bar between cards */
        .neck-fret::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: -4px; right: -4px;
          height: 3px;
          background: linear-gradient(90deg,
            rgba(140,120,80,0.05),
            rgba(190,170,120,0.35),
            rgba(230,220,190,0.55),
            rgba(190,170,120,0.35),
            rgba(140,120,80,0.05)
          );
          box-shadow: 0 1px 3px rgba(0,0,0,0.4);
          z-index: 3;
        }

        .neck-fret-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 12px;
          background: rgba(35, 25, 15, 0.35);
          cursor: pointer;
          transition: all 0.25s;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          border-left: 1px solid rgba(120, 90, 50, 0.08);
          border-right: 1px solid rgba(120, 90, 50, 0.08);
        }
        .neck-fret-card:hover {
          background: rgba(50, 35, 20, 0.5);
        }
        .neck-fret-card:active {
          transform: scale(0.98);
        }
        .neck-fret-card.active {
          background: rgba(80, 60, 30, 0.4);
          border-color: rgba(201,169,110,0.4);
        }

        /* Subtle colored glow from the left for each fret */
        .neck-fret-card::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 60px;
          pointer-events: none;
          z-index: 0;
        }

        /* Fret number badge */
        .neck-fret-num {
          width: 42px; height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 1.4rem;
          position: relative;
          z-index: 1;
        }
        /* Glow ring around the icon */
        .neck-fret-num::after {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          border: 1px solid;
          opacity: 0.2;
          transition: opacity 0.3s;
        }
        .neck-fret-card:hover .neck-fret-num::after,
        .neck-fret-card.active .neck-fret-num::after {
          opacity: 0.5;
        }

        .neck-fret-info {
          flex: 1;
          min-width: 0;
          position: relative;
          z-index: 1;
        }
        .neck-fret-interval {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 3px;
          font-weight: 600;
        }
        .neck-fret-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          color: #f0e6d2;
          line-height: 1.2;
          margin-bottom: 2px;
          text-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }
        .neck-fret-sub {
          font-size: 0.9rem;
          color: #8a7a60;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .neck-fret-arrow {
          font-family: 'JetBrains Mono', monospace;
          color: #5a4a30;
          font-size: 1rem;
          flex-shrink: 0;
          transition: all 0.2s;
          z-index: 1;
        }
        .neck-fret-card:hover .neck-fret-arrow,
        .neck-fret-card.active .neck-fret-arrow {
          color: #c9a96e;
          transform: translateX(2px) rotate(90deg);
        }

        /* ═══════ INLAY DOTS ═══════ */
        .neck-dot-row {
          display: flex;
          justify-content: center;
          gap: 14px;
          padding: 6px 0;
          position: relative;
          z-index: 2;
        }
        .neck-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%,
            rgba(240, 230, 200, 0.3),
            rgba(201, 169, 110, 0.12) 60%,
            rgba(160, 140, 100, 0.08) 100%
          );
          box-shadow:
            inset 0 1px 2px rgba(255,255,255,0.15),
            0 0 6px rgba(201, 169, 110, 0.15);
          border: 1px solid rgba(201, 169, 110, 0.08);
        }

        /* ═══════ 12TH FRET ═══════ */
        .neck-fret-12 {
          margin-top: 4px;
        }
        .neck-fret-12 .neck-fret-card {
          background: linear-gradient(135deg,
            rgba(0, 210, 211, 0.06) 0%,
            rgba(35, 25, 15, 0.3) 50%,
            rgba(0, 210, 211, 0.04) 100%
          );
          border: 1px solid rgba(0, 210, 211, 0.12);
          border-radius: 12px;
        }
        .neck-fret-12::after { display: none; }

        .back-to-portal {
          position: absolute;
          top: max(16px, env(safe-area-inset-top));
          right: max(16px, env(safe-area-inset-right));
          z-index: 50;
          display: flex;
          align-items: center;
          gap: 6px;
          color: rgba(201,169,110,0.7);
          cursor: pointer;
          background: rgba(201,169,110,0.06);
          border: 1px solid rgba(201,169,110,0.15);
          border-radius: 8px;
          padding: 8px 12px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          transition: all 0.2s;
          min-height: 36px;
        }
        .back-to-portal:hover {
          color: #c9a96e;
          background: rgba(201,169,110,0.12);
          border-color: rgba(201,169,110,0.35);
        }

        .neck-content-wrapper {
          position: relative;
          z-index: 10;
          background: rgba(10, 10, 15, 0.95);
          border-left: 1px solid rgba(201,169,110,0.2);
          border-right: 1px solid rgba(201,169,110,0.2);
          border-bottom: 1px solid rgba(201,169,110,0.2);
          margin: 0 16px;
          border-radius: 0 0 12px 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
      `}),M.jsxs("div",{className:"neck-nut",children:[P&&M.jsx("button",{className:"back-to-portal",onClick:()=>c("/"),"aria-label":"Return to portal",children:d?"← Accueil":"← Home"}),M.jsx(j.h1,{className:"neck-logo",initial:{opacity:0,y:-10},animate:{opacity:1,y:0},transition:{duration:.6},children:m}),o&&M.jsx(j.p,{className:"neck-tagline",initial:{opacity:0},animate:{opacity:1},transition:{delay:.3,duration:.6},children:o}),r&&M.jsx("div",{style:{marginTop:16},children:r})]}),M.jsxs("div",{className:"neck-board",children:[M.jsx("div",{className:"neck-strings",children:[0,1,2,3,4,5].map(i=>M.jsx("div",{className:"neck-string"},i))}),n.map((i,b)=>{const f=u(i.act),_n=b>0?u(n[b-1].act):null,Cn=f&&f!==_n,In=b1.includes(i.fret),zn=f1.includes(i.fret),G=i.fret===12,L=t===i.id;return M.jsxs(Hn.Fragment,{children:[Cn&&M.jsx("div",{className:"neck-act",children:f}),M.jsx("div",{className:`neck-fret ${G?"neck-fret-12":""}`,children:M.jsxs(j.div,{className:`neck-fret-card ${L?"active":""}`,onClick:()=>e(i.id),whileTap:{scale:.97},initial:{opacity:0,x:-15},animate:{opacity:1,x:0},transition:{delay:b*.05,duration:.35},style:{"--fret-color":i.color},children:[M.jsx("div",{style:{position:"absolute",left:0,top:0,bottom:0,width:50,background:`linear-gradient(90deg, ${i.color}12, transparent)`,pointerEvents:"none",zIndex:0}}),M.jsxs("div",{className:"neck-fret-num",style:{background:`radial-gradient(circle at 40% 40%, ${i.color}30, ${i.color}10 70%)`,boxShadow:`0 0 12px ${i.color}15, inset 0 1px 2px rgba(255,255,255,0.1)`},children:[M.jsx("span",{style:{filter:"drop-shadow(0 1px 3px rgba(0,0,0,0.3))"},children:i.symbol}),M.jsx("div",{style:{position:"absolute",inset:-3,borderRadius:"50%",border:`1px solid ${i.color}25`}})]}),M.jsxs("div",{className:"neck-fret-info",children:[M.jsxs("div",{className:"neck-fret-interval",style:{color:i.color},children:["Fret ",i.fret," ",i.interval?`· ${u(i.interval)}`:""]}),M.jsx("div",{className:"neck-fret-title",children:u(i.title)}),M.jsx("div",{className:"neck-fret-sub",children:u(i.subtitle)})]}),M.jsx("span",{className:"neck-fret-arrow",children:"›"})]})}),M.jsx(Gn,{children:L&&a&&M.jsx(j.div,{initial:{height:0,opacity:0},animate:{height:"auto",opacity:1},exit:{height:0,opacity:0},className:"neck-content-wrapper",children:a(i)})}),In&&!G&&M.jsx("div",{className:"neck-dot-row",children:M.jsx("div",{className:"neck-dot"})}),zn&&M.jsxs("div",{className:"neck-dot-row",children:[M.jsx("div",{className:"neck-dot"}),M.jsx("div",{className:"neck-dot"})]})]},i.id)}),s&&M.jsx("div",{style:{position:"relative",zIndex:10,padding:"20px 16px"},children:s})]})]})};export{v1 as N,A1 as a,g1 as i};
