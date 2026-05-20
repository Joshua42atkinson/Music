import{k as w,r as l,d as Q,j as e,z as I,M as X,P as Y}from"./index-CL_oGdFf.js";import{i as ee,a as te}from"./NeckMenu-lzu3eJW0.js";const ae=[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]],oe=w("book-open",ae);const re=[["path",{d:"M12 6v6l4 2",key:"mmk7yg"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],ne=w("clock",re);const ie=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 9h18",key:"1pudct"}],["path",{d:"M3 15h18",key:"5xshup"}],["path",{d:"M9 3v18",key:"fh3hqa"}],["path",{d:"M15 3v18",key:"14nvp0"}]],se=w("grid-3x3",ie);const le=[["path",{d:"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",key:"zw3jo"}],["path",{d:"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",key:"1wduqc"}],["path",{d:"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",key:"kqbvx6"}]],ce=w("layers",le);const de=[["path",{d:"M12 19v3",key:"npa21l"}],["path",{d:"M15 9.34V5a3 3 0 0 0-5.68-1.33",key:"1gzdoj"}],["path",{d:"M16.95 16.95A7 7 0 0 1 5 12v-2",key:"cqa7eg"}],["path",{d:"M18.89 13.23A7 7 0 0 0 19 12v-2",key:"16hl24"}],["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M9 9v3a3 3 0 0 0 5.12 2.12",key:"r2i35w"}]],me=w("mic-off",de);const he=[["path",{d:"M12 19v3",key:"npa21l"}],["path",{d:"M19 10v2a7 7 0 0 1-14 0v-2",key:"1vc78b"}],["rect",{x:"9",y:"2",width:"6",height:"13",rx:"3",key:"s6n7sd"}]],B=w("mic",he);const fe=[["line",{x1:"10",x2:"14",y1:"2",y2:"2",key:"14vaq8"}],["line",{x1:"12",x2:"15",y1:"14",y2:"11",key:"17fdiu"}],["circle",{cx:"12",cy:"14",r:"8",key:"1e1u0o"}]],be=w("timer",fe);const pe=[["path",{d:"m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",key:"ftymec"}],["rect",{x:"2",y:"6",width:"14",height:"12",rx:"2",key:"158x01"}]],ue=w("video",pe);const xe=[["path",{d:"M12.8 19.6A2 2 0 1 0 14 16H2",key:"148xed"}],["path",{d:"M17.5 8a2.5 2.5 0 1 1 2 4H2",key:"1u4tom"}],["path",{d:"M9.8 4.4A2 2 0 1 1 11 8H2",key:"75valh"}]],ge=w("wind",xe);const ve=[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]],ye=w("zap",ve),$=["C","C♯","D","D♯","E","F","F♯","G","G♯","A","A♯","B"],we=[{name:"E",octave:4,midiBase:64},{name:"B",octave:3,midiBase:59},{name:"G",octave:3,midiBase:55},{name:"D",octave:3,midiBase:50},{name:"A",octave:2,midiBase:45},{name:"E",octave:2,midiBase:40}],Ne=14;function je(r){return 440*Math.pow(2,(r-69)/12)}function _(r){return $[r%12]}const L={major:{label:"Major",tonalName:"major",color:"#3498db"},minor:{label:"Natural Minor",tonalName:"minor",color:"#e74c3c"},pentatonicMajor:{label:"Major Pentatonic",tonalName:"major pentatonic",color:"#2ecc71"},pentatonicMinor:{label:"Minor Pentatonic",tonalName:"minor pentatonic",color:"#f39c12"},blues:{label:"Blues",tonalName:"minor blues",color:"#9b59b6"},dorian:{label:"Dorian",tonalName:"dorian",color:"#1abc9c"},mixolydian:{label:"Mixolydian",tonalName:"mixolydian",color:"#e67e22"},chromatic:{label:"Chromatic",tonalName:"chromatic",color:"#95a5a6"}},Le=({maxFret:r,highlightPattern:N,fretLimit:n,compact:v=!1,presetRoot:h,presetScale:y})=>{const[x,b]=l.useState(null),[f,j]=l.useState(y||null),[m,d]=l.useState(h??0),[p,S]=l.useState(!0),[k,T]=l.useState(!0),[M,t]=l.useState("auto"),s=typeof window<"u"?window.matchMedia("(orientation: portrait)").matches:!1,[A,z]=l.useState(s);l.useEffect(()=>{const o=window.matchMedia("(orientation: portrait)"),a=u=>z(u.matches);return o.addEventListener("change",a),()=>o.removeEventListener("change",a)},[]);const g=M==="vertical"||M==="auto"&&A,C=r||Ne;l.useEffect(()=>{h!=null&&d(h)},[h]),l.useEffect(()=>{y!==void 0&&j(y)},[y]);const E=l.useCallback(o=>{const a=Q();if(!a)return;const u=a.createOscillator(),c=a.createGain(),i=a.currentTime;u.type="triangle",u.frequency.setValueAtTime(o,i),c.gain.setValueAtTime(0,i),c.gain.linearRampToValueAtTime(.45,i+.04),c.gain.exponentialRampToValueAtTime(.001,i+1.5),u.connect(c),c.connect(a.destination),u.start(i),u.stop(i+1.5)},[]),F=(o,a,u)=>{const c=je(o),i=_(o);b({midi:o,name:i,freq:c,stringIdx:a,fret:u}),E(c),navigator.vibrate&&navigator.vibrate(10)},O=we.map((o,a)=>{const u=[];for(let c=0;c<=C;c++){const i=o.midiBase+c,V=_(i),P=i%12;let G=!1;if(f&&L[f]){const W=_(m).replace("♯","#"),R=ee.get(`${W} ${L[f].tonalName}`);if(R&&R.intervals){const K=R.intervals.map(Z=>te.semitones(Z)),U=((P-m)%12+12)%12;G=K.includes(U)}}const q=P===m,J=n==null||c<=n;u.push({midi:i,noteName:V,noteClass:P,fret:c,stringIdx:a,inScale:G,isRoot:q,inFretRange:J})}return{string:o,notes:u}}),D=[3,5,7,9,12],H=[12];return e.jsxs("div",{className:`fretboard-explorer-v2 ${v?"fb-compact":""} ${g?"fb-vertical":"fb-horizontal"}`,children:[e.jsx("style",{children:`
        .fretboard-explorer-v2 {
          background: rgba(10, 10, 15, 0.97);
          border-radius: 16px; padding: 2rem;
          border: 1px solid rgba(201, 169, 110, 0.1);
          font-family: 'Inter', sans-serif; color: #e0e0ff;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          overflow-x: auto;
        }
        .fb-compact {
          padding: 0.75rem 0.5rem;
          border-radius: 8px;
          border: none;
          box-shadow: none;
          background: transparent;
        }
        .fb-compact .fb-header { margin-bottom: 0.75rem; }
        .fb-compact .fb-title { font-size: 1.1rem; }
        .fb-compact .fb-note-cell { width: 44px; height: 44px; }
        .fb-compact .fb-note-cell:first-child { width: 36px; }
        .fb-compact .fb-note { width: 32px; height: 32px; font-size: 0.85rem; }
        .fb-compact .fb-string-row { height: 44px; }
        .fb-compact .fb-dot-cell { width: 44px; }
        .fb-compact .fb-dot-cell:first-child { width: 36px; }
        .fb-compact .fb-fret-num { width: 44px; }
        .fb-compact .fb-fret-num:first-child { width: 36px; }
        .fb-compact .fb-status { margin-top: 0.75rem; padding: 0.75rem; }
        .fb-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; }
        .fb-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem; color: #e8edf2; font-weight: 400;
        }
        .fb-controls { display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; }
        .fb-select, .fb-toggle {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          color: #b0b8c8; padding: 0.4rem 0.8rem; border-radius: 6px;
          font-size: 0.9rem; font-family: 'JetBrains Mono', monospace;
          cursor: pointer; transition: all 0.2s;
        }
        .fb-select:hover, .fb-toggle:hover { border-color: rgba(201,169,110,0.3); }
        .fb-toggle.active { background: rgba(201,169,110,0.15); border-color: rgba(201,169,110,0.4); color: #c9a96e; }
        .fb-select option { background: #0a0a0f; color: #b0b8c8; }
        .fb-landscape-hint {
          display: none; background: rgba(201,169,110,0.1);
          border: 1px solid rgba(201,169,110,0.3); color: #c9a96e;
          padding: 0.75rem 1rem; border-radius: 8px; text-align: center;
          font-size: 0.85rem; margin-bottom: 1rem;
        }
        @media (max-width: 768px) and (orientation: portrait) {
          .fb-landscape-hint { display: block; }
        }
        /* ── VERTICAL MODE (portrait phone) ── */
        /* Rotate the entire neck 90° so strings run left-right, frets run top-bottom */
        .fb-vertical .fb-neck-wrap {
          overflow-x: hidden;
          overflow-y: auto;
          max-height: 70vh;
        }
        .fb-vertical .fb-neck {
          /* Transpose: rotate the grid so it reads like a vertical guitar neck */
          writing-mode: initial;
          transform: rotate(90deg);
          transform-origin: top left;
          /* After rotation, the width becomes the height — set to viewport width */
          width: calc(100vh - 120px);
          position: absolute;
          left: 0; top: 0;
        }
        .fb-vertical .fb-neck-outer {
          position: relative;
          /* Height = rotated width of the neck */
          min-height: 200px;
          overflow: hidden;
          width: 100%;
        }
        /* Horizontal mode — default, no changes */
        .fb-horizontal .fb-neck-outer {
          overflow-x: auto;
          overflow-y: hidden;
        }
        /* Orientation toggle button */
        .fb-orient-btn {
          background: rgba(201,169,110,0.08);
          border: 1px solid rgba(201,169,110,0.2);
          color: #c9a96e;
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          font-size: 0.85rem;
          font-family: 'JetBrains Mono', monospace;
          cursor: pointer;
          transition: all 0.2s;
          display: flex; align-items: center; gap: 5px;
        }
        .fb-orient-btn:hover {
          background: rgba(201,169,110,0.18);
          border-color: rgba(201,169,110,0.4);
        }
        .fb-neck {
          position: relative; background: linear-gradient(180deg, #3d2b1a, #2c1e14, #3d2b1a);
          border-radius: 6px; padding: 12px 0;
          border: 1px solid rgba(74, 51, 36, 0.6);
          box-shadow: inset 0 0 40px rgba(0,0,0,0.7);
          min-width: fit-content;
        }
        .fb-fret-markers {
          display: flex; position: absolute; bottom: -28px; left: 0; width: 100%;
          pointer-events: none;
        }
        .fb-string-row {
          display: flex; align-items: center; position: relative;
          height: 38px; border-bottom: 1px solid rgba(255,255,255,0.03);
        }
        .fb-string-row:last-child { border-bottom: none; }
        .fb-string-label {
          width: 28px; text-align: center; font-weight: 700;
          font-size: 0.8rem; color: #a0a0b0; flex-shrink: 0;
          font-family: 'JetBrains Mono', monospace;
        }
        .fb-string-line {
          position: absolute; top: 50%; left: 28px; right: 0;
          border-bottom: 2px solid; z-index: 0;
        }
        .fb-note-cell {
          width: 52px; height: 38px; display: flex; align-items: center;
          justify-content: center; position: relative; z-index: 1; flex-shrink: 0;
          border-right: 2px solid rgba(212, 175, 55, 0.15);
        }
        .fb-note-cell:first-child {
          width: 40px; border-right: 4px solid rgba(212, 175, 55, 0.6);
        }
        .fb-note {
          width: 28px; height: 28px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.8rem; font-weight: 700; cursor: pointer;
          transition: all 0.15s ease; position: relative;
          font-family: 'JetBrains Mono', monospace;
          border: 1.5px solid transparent;
        }
        .fb-note.in-scale {
          background: rgba(201, 169, 110, 0.2);
          border-color: rgba(201, 169, 110, 0.5);
          color: #c9a96e;
        }
        .fb-note.root-note {
          background: rgba(201, 169, 110, 0.5) !important;
          border-color: #c9a96e !important;
          color: #000 !important;
          box-shadow: 0 0 10px rgba(201, 169, 110, 0.4);
          font-weight: 900;
        }
        .fb-note.dim { opacity: 0.15; pointer-events: none; }
        .fb-note.idle {
          background: rgba(255,255,255,0.03);
          border-color: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.2);
        }
        .fb-note:hover:not(.dim) {
          transform: scale(1.25);
          background: rgba(201,169,110,0.3);
          border-color: #c9a96e;
          color: #fff;
          box-shadow: 0 0 12px rgba(201,169,110,0.3);
        }
        .fb-note.playing {
          background: #c9a96e !important; color: #000 !important;
          border-color: #fff !important;
          box-shadow: 0 0 20px rgba(201,169,110,0.6);
          transform: scale(1.3);
        }
        .fb-dot-row {
          display: flex; padding-left: 28px; margin-top: 8px;
        }
        .fb-dot-cell {
          width: 52px; display: flex; justify-content: center; flex-shrink: 0;
        }
        .fb-dot-cell:first-child { width: 40px; }
        .fb-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(201, 169, 110, 0.25);
        }
        .fb-dot.double { width: 6px; height: 6px; box-shadow: -8px 0 0 rgba(201,169,110,0.25); }
        .fb-fret-num {
          width: 52px; text-align: center; font-size: 0.85rem;
          color: #5a6a80; font-family: 'JetBrains Mono', monospace;
          flex-shrink: 0;
        }
        .fb-fret-num:first-child { width: 40px; }
        .fb-status {
          margin-top: 1.5rem; display: flex; justify-content: space-between;
          align-items: center; flex-wrap: wrap; gap: 1rem;
          padding: 1rem; background: rgba(0,0,0,0.3); border-radius: 8px;
        }
        .fb-playing-label {
          font-size: 1.1rem; font-weight: 600;
          color: ${x?"#c9a96e":"#5a6a80"};
          font-family: 'JetBrains Mono', monospace;
        }
        .fb-scale-legend {
          display: flex; gap: 1rem; flex-wrap: wrap;
        }
        .fb-legend-item {
          display: flex; align-items: center; gap: 0.4rem;
          font-size: 0.85rem; color: #8090a8;
        }
        .fb-legend-dot {
          width: 10px; height: 10px; border-radius: 50%;
        }
      `}),!v&&e.jsxs("div",{className:"fb-header",children:[e.jsx("h2",{className:"fb-title",children:"Playable Guitar"}),e.jsxs("div",{className:"fb-controls",children:[e.jsx("select",{className:"fb-select",value:m,onChange:o=>d(parseInt(o.target.value)),children:$.map((o,a)=>e.jsx("option",{value:a,children:o},a))}),e.jsxs("select",{className:"fb-select",value:f||"",onChange:o=>j(o.target.value||null),children:[e.jsx("option",{value:"",children:"No Scale"}),Object.entries(L).map(([o,a])=>e.jsx("option",{value:o,children:a.label},o))]}),e.jsx("button",{className:`fb-toggle ${p?"active":""}`,onClick:()=>S(!p),children:"Notes"}),e.jsx("button",{className:"fb-orient-btn",onClick:()=>{t(M==="auto"?g?"horizontal":"vertical":"auto")},title:g?"Switch to horizontal":"Switch to vertical",children:g?"↔ Horizontal":"↕ Vertical"})]})]}),v&&e.jsx("div",{className:"fb-header",style:{marginBottom:"0.5rem"},children:e.jsxs("div",{className:"fb-controls",style:{width:"100%",justifyContent:"space-between"},children:[e.jsx("select",{className:"fb-select",value:m,onChange:o=>d(parseInt(o.target.value)),children:$.map((o,a)=>e.jsx("option",{value:a,children:o},a))}),e.jsxs("select",{className:"fb-select",value:f||"",onChange:o=>j(o.target.value||null),children:[e.jsx("option",{value:"",children:"No Scale"}),Object.entries(L).map(([o,a])=>e.jsx("option",{value:o,children:a.label},o))]}),e.jsx("button",{className:`fb-toggle ${p?"active":""}`,onClick:()=>S(!p),children:p?"♪":"·"})]})}),e.jsx("div",{className:"fb-neck-outer",children:e.jsx("div",{className:"fb-neck-wrap",children:e.jsxs("div",{className:"fb-neck",children:[O.map((o,a)=>{const u=1+a*.4,c=Math.max(100,200-a*20);return e.jsxs("div",{className:"fb-string-row",children:[e.jsx("span",{className:"fb-string-label",children:o.string.name}),e.jsx("div",{className:"fb-string-line",style:{borderBottomWidth:`${u}px`,borderColor:`rgba(${c}, ${c-20}, ${c-40}, 0.5)`}}),o.notes.map(i=>e.jsx("div",{className:"fb-note-cell",children:e.jsx("div",{className:`fb-note ${i.inFretRange?x?.midi===i.midi&&x?.stringIdx===a?"playing":i.isRoot&&f?"root-note":i.inScale?"in-scale":"idle":"dim"}`,onClick:()=>F(i.midi,a,i.fret),children:p?i.noteName:""})},i.fret))]},a)}),k&&e.jsx("div",{className:"fb-dot-row",children:Array.from({length:C+1},(o,a)=>e.jsx("div",{className:"fb-dot-cell",children:D.includes(a)&&e.jsx("div",{className:`fb-dot ${H.includes(a)?"double":""}`})},a))})]})})}),e.jsxs("div",{style:{display:"flex",paddingLeft:0,marginTop:4},children:[e.jsx("div",{style:{width:28,flexShrink:0}}),Array.from({length:C+1},(o,a)=>e.jsx("div",{className:"fb-fret-num",children:a===0?"Open":a},a))]}),e.jsxs("div",{className:"fb-status",children:[e.jsx("span",{className:"fb-playing-label",children:x?`${x.name} · Fret ${x.fret} · ${x.freq.toFixed(1)} Hz`:"Tap a note to begin"}),f&&e.jsxs("div",{className:"fb-scale-legend",children:[e.jsxs("div",{className:"fb-legend-item",children:[e.jsx("div",{className:"fb-legend-dot",style:{background:"rgba(201,169,110,0.5)"}}),"Root"]}),e.jsxs("div",{className:"fb-legend-item",children:[e.jsx("div",{className:"fb-legend-dot",style:{background:"rgba(201,169,110,0.2)",border:"1px solid rgba(201,169,110,0.5)"}}),"Scale Tone"]})]})]})]})},ke=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];function Me(r){const N=12*(Math.log(r/440)/Math.log(2));return Math.round(N)+69}function Ae(r){return 440*Math.pow(2,(r-69)/12)}function Se(r,N){return Math.floor(1200*Math.log(r/Ae(N))/Math.log(2))}function Te(r,N){let n=r.length,v=0;for(let t=0;t<n;t++){let s=r[t];v+=s*s}if(v=Math.sqrt(v/n),v<.002)return-1;let h=0,y=n-1,x=.2;for(let t=0;t<n/2;t++)if(Math.abs(r[t])<x){h=t;break}for(let t=1;t<n/2;t++)if(Math.abs(r[n-t])<x){y=n-t;break}r=r.slice(h,y),n=r.length;let b=new Array(n).fill(0);for(let t=0;t<n;t++)for(let s=0;s<n-t;s++)b[t]=b[t]+r[s]*r[s+t];let f=0;for(;b[f]>b[f+1];)f++;let j=-1,m=-1;for(let t=f;t<n;t++)b[t]>j&&(j=b[t],m=t);let d=m,p=b[d-1],S=b[d],k=b[d+1],T=(p+k-2*S)/2,M=(k-p)/2;return T&&(d=d-M/(2*T)),N/d}function Ee(){const[r,N]=l.useState(!1),[n,v]=l.useState(null),[h,y]=l.useState({name:"--",cents:0,octave:0}),[x,b]=l.useState(0),[f,j]=l.useState(null),m=l.useRef(null),d=l.useRef(null),p=l.useRef(null),S=async()=>{try{const s=await navigator.mediaDevices.getUserMedia({audio:!0});m.current=new(window.AudioContext||window.webkitAudioContext),d.current=m.current.createAnalyser(),d.current.fftSize=2048,m.current.createMediaStreamSource(s).connect(d.current),N(!0),j(null),T()}catch(s){console.error("Microphone access denied:",s),j("Please allow microphone access to use the PLING! trainer.")}},k=()=>{m.current&&(m.current.close(),m.current=null),p.current&&cancelAnimationFrame(p.current),N(!1),v(null),b(0),y({name:"--",cents:0,octave:0})},T=()=>{if(!d.current||!r)return;const s=new Float32Array(d.current.fftSize);d.current.getFloatTimeDomainData(s);let A=0;for(let g=0;g<s.length;g++)A+=s[g]*s[g];A=Math.sqrt(A/s.length),b(Math.min(100,A*1500));const z=Te(s,m.current.sampleRate);if(z!==-1){const g=Me(z),C=ke[g%12],E=Math.floor(g/12)-1,F=Se(z,g);v(z),y({name:C,cents:F,octave:E})}else v(null);p.current=requestAnimationFrame(T)};l.useEffect(()=>()=>k(),[]);const M=n?Math.abs(h.cents):0,t=n&&Math.abs(h.cents)<10;return n&&h.cents*1.5,e.jsxs("div",{className:"bard-card my-6 relative overflow-hidden backdrop-blur-xl border border-white/10 bg-white/5 rounded-2xl p-6 text-center",children:[e.jsx("div",{className:`absolute inset-0 transition-opacity duration-500 ease-in-out ${t?"opacity-20":"opacity-0"}`,style:{background:"radial-gradient(circle at center, #2ecc71 0%, transparent 70%)"}}),e.jsxs("div",{className:"relative z-10",children:[e.jsxs("h3",{className:"text-xl font-cormorant font-bold mb-2 flex items-center justify-center gap-2",children:[e.jsx(I,{size:20,className:r?"animate-pulse text-cf-gold":"text-white/50"}),"The PLING! Trainer"]}),e.jsx("p",{className:"text-sm text-white/70 mb-6 font-inter",children:"Sing a note. Let the Living Voice respond."}),f&&e.jsx("p",{className:"text-red-400 text-sm mb-4",children:f}),e.jsxs("div",{className:"flex flex-col items-center justify-center space-y-8 mb-8 w-full max-w-sm mx-auto",children:[e.jsxs("div",{className:"w-full",children:[e.jsxs("div",{className:"flex justify-between text-[10px] text-white/40 mb-1 font-mono uppercase",children:[e.jsx("span",{children:"Mic Input"}),x>5?e.jsx("span",{className:"text-cf-gold animate-pulse",children:"Detecting..."}):e.jsx("span",{children:"Waiting"})]}),e.jsx("div",{className:"h-1.5 w-full bg-white/10 rounded-full overflow-hidden",children:e.jsx("div",{className:"h-full bg-cf-gold transition-all duration-75 ease-out",style:{width:`${x}%`}})})]}),e.jsxs("div",{className:`relative w-28 h-28 rounded-full flex flex-col items-center justify-center border-2 transition-colors duration-300 ${n?t?"border-green-400 bg-green-400/20 shadow-[0_0_30px_rgba(46,204,113,0.4)]":"border-cf-gold bg-cf-gold/20":"border-white/20 bg-black/20"}`,children:[e.jsx("span",{className:"text-5xl font-bold font-inter text-white",children:h.name}),e.jsx("span",{className:"text-sm text-white/60",children:n?`Octave ${h.octave}`:"--"})]}),e.jsxs("div",{className:"w-full relative",children:[e.jsxs("div",{className:"flex justify-between w-full text-[10px] text-white/40 mb-2 font-mono",children:[e.jsx("span",{children:"-50 Flat"}),e.jsx("span",{children:"In Tune"}),e.jsx("span",{children:"+50 Sharp"})]}),e.jsxs("div",{className:"relative h-3 w-full bg-black/40 border border-white/10 rounded-full overflow-hidden flex items-center",children:[e.jsx("div",{className:"absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/30 -translate-x-1/2 z-10"}),n&&e.jsx("div",{className:`absolute h-full w-4 rounded-full -translate-x-1/2 transition-all duration-100 ease-out shadow-[0_0_10px_currentColor] ${t?"bg-green-400 text-green-400":"bg-cf-gold text-cf-gold"}`,style:{left:`${50+h.cents}%`}})]})]}),e.jsx("div",{className:"h-6",children:n?e.jsxs("span",{className:`text-sm font-bold tracking-widest uppercase transition-colors ${t?"text-green-400":"text-cf-gold"}`,children:[t?"Perfect Pitch":h.cents<0?"FLAT":"SHARP",!t&&e.jsxs("span",{className:"ml-2 opacity-70",children:["(",M," cents)"]})]}):e.jsx("span",{className:"text-sm text-white/40 tracking-widest uppercase",children:"Waiting for pitch..."})})]}),e.jsxs("button",{onClick:r?k:S,className:`flex items-center justify-center gap-2 mx-auto px-6 py-3 rounded-full font-bold transition-all ${r?"bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30":"bg-white/10 text-white border border-white/20 hover:bg-white/20"}`,children:[r?e.jsx(me,{size:18}):e.jsx(B,{size:18}),r?"Stop Listening":"Activate Microphone"]})]})]})}const Fe=[{id:1,name:"Breathing Gate",shortName:"Breathe",desc:"Somatic Scan",telemetry:"Clearing physical and mental Distortion before playing",protocol:"SHEARL",phase:"Prepare",chromatic:"C",monomyth:"Call to Adventure",status:"available",icon:e.jsx(ge,{size:20})},{id:2,name:"Practice Timer",shortName:"Timer",desc:"Tuning The Player",telemetry:"Pomodoro-style session tracking — Practice TOO SLOW",protocol:"SHEARL",phase:"Prepare",chromatic:"C#",monomyth:"Refusal of the Call",status:"available",icon:e.jsx(be,{size:20})},{id:3,name:"Pitch Room",shortName:"Pitch",desc:"Listening & Pitch Alignment",telemetry:"Interval ear training — hear two notes, name the interval",protocol:"PLING!",phase:"Listen",chromatic:"D",monomyth:"Meeting the Mentor",status:"available",icon:e.jsx(X,{size:20})},{id:4,name:"Metronome",shortName:"Click",desc:"Tactile Fretboard Contact",telemetry:"Tap tempo, BPM control, and rhythmic alignment",protocol:"SHEARL",phase:"Align",chromatic:"D#",monomyth:"Crossing the Threshold",status:"available",icon:e.jsx(ne,{size:20})},{id:5,name:"Interval Visualizer",shortName:"Intervals",desc:"Interval Visualization",telemetry:"Tap two notes — see and hear the interval between them",protocol:"SHEARL",phase:"See",chromatic:"E",monomyth:"Tests, Allies, Enemies",status:"available",icon:e.jsx(se,{size:20})},{id:6,name:"The Grid Map",shortName:"Grid",desc:"Spatial Chord Shifting",telemetry:"Illuminating The Grid — explore CAGED geometry interactively",protocol:"SHEARL",phase:"See",chromatic:"F",monomyth:"Approach to the Inmost Cave",status:"available",icon:e.jsx(oe,{size:20})},{id:7,name:"PLING! Trainer",shortName:"PLING!",desc:"Vocal-Motor Integration",telemetry:"Sing a note into the mic — see if your voice matches the guitar",protocol:"PLING!",phase:"Sing & Play",chromatic:"F#",monomyth:"The Ordeal",status:"available",icon:e.jsx(B,{size:20})},{id:8,name:"Microtonal Tracker",shortName:"Micro",desc:"Expressive Interpretation",telemetry:"Real-time cents deviation — perfect for vibrato and bending intonation",protocol:"FHEAL",phase:"Feel",chromatic:"G",monomyth:"The Reward",status:"available",icon:e.jsx(I,{size:20})},{id:9,name:"Playable Guitar",shortName:"Guitar",desc:"Interactive Fretboard",telemetry:"Full 12-fret interactive guitar map — tap notes to explore intervals and scales",protocol:"SHEARL",phase:"Play",chromatic:"G#",monomyth:"The Road Back",status:"available",icon:e.jsx(ye,{size:20})},{id:10,name:"Async Assessor",shortName:"Submit",desc:"Mentor Feedback",telemetry:"Capture your performance for Bertrand's asynchronous review",protocol:"FHEAL",phase:"Perform",chromatic:"A",monomyth:"The Resurrection",status:"available",icon:e.jsx(ue,{size:20})},{id:11,name:"Multi-Key Hub",shortName:"Multi-Key",desc:"Multi-Key Fluency",telemetry:"See any scale across all 12 keys at once — tap to explore each pattern",protocol:"FHEAL",phase:"Transcend",chromatic:"A#",monomyth:"Return with the Elixir",status:"available",icon:e.jsx(ce,{size:20})},{id:12,name:"Rhythm Engine",shortName:"Rhythm",desc:"Channeling The Song",telemetry:"Free-form improvisation over backing tracks — reach Rubedo",protocol:"FHEAL",phase:"Create",chromatic:"B",monomyth:"Master of Two Worlds",status:"available",icon:e.jsx(Y,{size:20})}];export{ne as C,Le as F,B as M,Ee as P,Fe as T,ue as V};
