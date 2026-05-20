import{f as P,r as d,q as W,j as e,x as U,M as X}from"./index-CNmSeRp3.js";import{i as Z,a as K}from"./NeckMenu-CnCpmT2X.js";const Q=[["path",{d:"M12 19v3",key:"npa21l"}],["path",{d:"M15 9.34V5a3 3 0 0 0-5.68-1.33",key:"1gzdoj"}],["path",{d:"M16.95 16.95A7 7 0 0 1 5 12v-2",key:"cqa7eg"}],["path",{d:"M18.89 13.23A7 7 0 0 0 19 12v-2",key:"16hl24"}],["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M9 9v3a3 3 0 0 0 5.12 2.12",key:"r2i35w"}]],Y=P("mic-off",Q);const ee=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],fe=P("x",ee),_=["C","C♯","D","D♯","E","F","F♯","G","G♯","A","A♯","B"],te=[{name:"E",octave:4,midiBase:64},{name:"B",octave:3,midiBase:59},{name:"G",octave:3,midiBase:55},{name:"D",octave:3,midiBase:50},{name:"A",octave:2,midiBase:45},{name:"E",octave:2,midiBase:40}],ae=14;function oe(r){return 440*Math.pow(2,(r-69)/12)}function B(r){return _[r%12]}const z={major:{label:"Major",tonalName:"major",color:"#3498db"},minor:{label:"Natural Minor",tonalName:"minor",color:"#e74c3c"},pentatonicMajor:{label:"Major Pentatonic",tonalName:"major pentatonic",color:"#2ecc71"},pentatonicMinor:{label:"Minor Pentatonic",tonalName:"minor pentatonic",color:"#f39c12"},blues:{label:"Blues",tonalName:"minor blues",color:"#9b59b6"},dorian:{label:"Dorian",tonalName:"dorian",color:"#1abc9c"},mixolydian:{label:"Mixolydian",tonalName:"mixolydian",color:"#e67e22"},chromatic:{label:"Chromatic",tonalName:"chromatic",color:"#95a5a6"}},be=({maxFret:r,fretLimit:x,compact:n=!1,presetRoot:p,presetScale:b})=>{const[u,S]=d.useState(null),[l,g]=d.useState(b||null),[v,m]=d.useState(p??0),[i,j]=d.useState(!0),[T]=d.useState(!0),[y,k]=d.useState("auto"),A=typeof window<"u"?window.matchMedia("(orientation: portrait)").matches:!1,[o,c]=d.useState(A);d.useEffect(()=>{const t=window.matchMedia("(orientation: portrait)"),a=h=>c(h.matches);return t.addEventListener("change",a),()=>t.removeEventListener("change",a)},[]);const w=y==="vertical"||y==="auto"&&o,M=r||ae;d.useEffect(()=>{if(p!=null){const t=setTimeout(()=>{m(p)},0);return()=>clearTimeout(t)}},[p]),d.useEffect(()=>{if(b!==void 0){const t=setTimeout(()=>{g(b)},0);return()=>clearTimeout(t)}},[b]);const N=d.useCallback(t=>{const a=W();if(!a)return;const h=a.createOscillator(),f=a.createGain(),s=a.currentTime;h.type="triangle",h.frequency.setValueAtTime(t,s),f.gain.setValueAtTime(0,s),f.gain.linearRampToValueAtTime(.45,s+.04),f.gain.exponentialRampToValueAtTime(.001,s+1.5),h.connect(f),f.connect(a.destination),h.start(s),h.stop(s+1.5)},[]),C=(t,a,h)=>{const f=oe(t),s=B(t);S({midi:t,name:s,freq:f,stringIdx:a,fret:h}),N(f),navigator.vibrate&&navigator.vibrate(10)},F=te.map((t,a)=>{const h=[];for(let f=0;f<=M;f++){const s=t.midiBase+f,G=B(s),E=s%12;let L=!1;if(l&&z[l]){const q=B(v).replace("♯","#"),R=Z.get(`${q} ${z[l].tonalName}`);if(R&&R.intervals){const V=R.intervals.map(H=>K.semitones(H)),J=((E-v)%12+12)%12;L=V.includes(J)}}const I=E===v,O=x==null||f<=x;h.push({midi:s,noteName:G,noteClass:E,fret:f,stringIdx:a,inScale:L,isRoot:I,inFretRange:O})}return{string:t,notes:h}}),$=[3,5,7,9,12],D=[12];return e.jsxs("div",{className:`fretboard-explorer-v2 ${n?"fb-compact":""} ${w?"fb-vertical":"fb-horizontal"}`,children:[e.jsx("style",{children:`
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
          color: ${u?"#c9a96e":"#5a6a80"};
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
      `}),!n&&e.jsxs("div",{className:"fb-header",children:[e.jsx("h2",{className:"fb-title",children:"Playable Guitar"}),e.jsxs("div",{className:"fb-controls",children:[e.jsx("select",{className:"fb-select",value:v,onChange:t=>m(parseInt(t.target.value)),children:_.map((t,a)=>e.jsx("option",{value:a,children:t},a))}),e.jsxs("select",{className:"fb-select",value:l||"",onChange:t=>g(t.target.value||null),children:[e.jsx("option",{value:"",children:"No Scale"}),Object.entries(z).map(([t,a])=>e.jsx("option",{value:t,children:a.label},t))]}),e.jsx("button",{className:`fb-toggle ${i?"active":""}`,onClick:()=>j(!i),children:"Notes"}),e.jsx("button",{className:"fb-orient-btn",onClick:()=>{k(y==="auto"?w?"horizontal":"vertical":"auto")},title:w?"Switch to horizontal":"Switch to vertical",children:w?"↔ Horizontal":"↕ Vertical"})]})]}),n&&e.jsx("div",{className:"fb-header",style:{marginBottom:"0.5rem"},children:e.jsxs("div",{className:"fb-controls",style:{width:"100%",justifyContent:"space-between"},children:[e.jsx("select",{className:"fb-select",value:v,onChange:t=>m(parseInt(t.target.value)),children:_.map((t,a)=>e.jsx("option",{value:a,children:t},a))}),e.jsxs("select",{className:"fb-select",value:l||"",onChange:t=>g(t.target.value||null),children:[e.jsx("option",{value:"",children:"No Scale"}),Object.entries(z).map(([t,a])=>e.jsx("option",{value:t,children:a.label},t))]}),e.jsx("button",{className:`fb-toggle ${i?"active":""}`,onClick:()=>j(!i),children:i?"♪":"·"})]})}),e.jsx("div",{className:"fb-neck-outer",children:e.jsx("div",{className:"fb-neck-wrap",children:e.jsxs("div",{className:"fb-neck",children:[F.map((t,a)=>{const h=1+a*.4,f=Math.max(100,200-a*20);return e.jsxs("div",{className:"fb-string-row",children:[e.jsx("span",{className:"fb-string-label",children:t.string.name}),e.jsx("div",{className:"fb-string-line",style:{borderBottomWidth:`${h}px`,borderColor:`rgba(${f}, ${f-20}, ${f-40}, 0.5)`}}),t.notes.map(s=>e.jsx("div",{className:"fb-note-cell",children:e.jsx("div",{className:`fb-note ${s.inFretRange?u?.midi===s.midi&&u?.stringIdx===a?"playing":s.isRoot&&l?"root-note":s.inScale?"in-scale":"idle":"dim"}`,onClick:()=>C(s.midi,a,s.fret),children:i?s.noteName:""})},s.fret))]},a)}),T&&e.jsx("div",{className:"fb-dot-row",children:Array.from({length:M+1},(t,a)=>e.jsx("div",{className:"fb-dot-cell",children:$.includes(a)&&e.jsx("div",{className:`fb-dot ${D.includes(a)?"double":""}`})},a))})]})})}),e.jsxs("div",{style:{display:"flex",paddingLeft:0,marginTop:4},children:[e.jsx("div",{style:{width:28,flexShrink:0}}),Array.from({length:M+1},(t,a)=>e.jsx("div",{className:"fb-fret-num",children:a===0?"Open":a},a))]}),e.jsxs("div",{className:"fb-status",children:[e.jsx("span",{className:"fb-playing-label",children:u?`${u.name} · Fret ${u.fret} · ${u.freq.toFixed(1)} Hz`:"Tap a note to begin"}),l&&e.jsxs("div",{className:"fb-scale-legend",children:[e.jsxs("div",{className:"fb-legend-item",children:[e.jsx("div",{className:"fb-legend-dot",style:{background:"rgba(201,169,110,0.5)"}}),"Root"]}),e.jsxs("div",{className:"fb-legend-item",children:[e.jsx("div",{className:"fb-legend-dot",style:{background:"rgba(201,169,110,0.2)",border:"1px solid rgba(201,169,110,0.5)"}}),"Scale Tone"]})]})]})]})},re=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];function ne(r){const x=12*(Math.log(r/440)/Math.log(2));return Math.round(x)+69}function ie(r){return 440*Math.pow(2,(r-69)/12)}function se(r,x){return Math.floor(1200*Math.log(r/ie(x))/Math.log(2))}function le(r,x){let n=r.length,p=0;for(let o=0;o<n;o++){let c=r[o];p+=c*c}if(p=Math.sqrt(p/n),p<.002)return-1;let b=0,u=n-1,S=.2;for(let o=0;o<n/2;o++)if(Math.abs(r[o])<S){b=o;break}for(let o=1;o<n/2;o++)if(Math.abs(r[n-o])<S){u=n-o;break}r=r.slice(b,u),n=r.length;let l=new Array(n).fill(0);for(let o=0;o<n;o++)for(let c=0;c<n-o;c++)l[o]=l[o]+r[c]*r[c+o];let g=0;for(;l[g]>l[g+1];)g++;let v=-1,m=-1;for(let o=g;o<n;o++)l[o]>v&&(v=l[o],m=o);let i=m,j=l[i-1],T=l[i],y=l[i+1],k=(j+y-2*T)/2,A=(y-j)/2;return k&&(i=i-A/(2*k)),x/i}function me(){const[r,x]=d.useState(!1),[n,p]=d.useState(null),[b,u]=d.useState({name:"--",cents:0,octave:0}),[S,l]=d.useState(0),[g,v]=d.useState(null),m=d.useRef(null),i=d.useRef(null),j=d.useRef(null),T=async()=>{try{const c=await navigator.mediaDevices.getUserMedia({audio:!0});m.current=new(window.AudioContext||window.webkitAudioContext),i.current=m.current.createAnalyser(),i.current.fftSize=2048,m.current.createMediaStreamSource(c).connect(i.current),x(!0),v(null),k()}catch(c){console.error("Microphone access denied:",c),v("Please allow microphone access to use the PLING! trainer.")}},y=()=>{m.current&&(m.current.close(),m.current=null),j.current&&cancelAnimationFrame(j.current),x(!1),p(null),l(0),u({name:"--",cents:0,octave:0})},k=()=>{if(!i.current||!r)return;const c=new Float32Array(i.current.fftSize);i.current.getFloatTimeDomainData(c);let w=0;for(let N=0;N<c.length;N++)w+=c[N]*c[N];w=Math.sqrt(w/c.length),l(Math.min(100,w*1500));const M=le(c,m.current.sampleRate);if(M!==-1){const N=ne(M),C=re[N%12],F=Math.floor(N/12)-1,$=se(M,N);p(M),u({name:C,cents:$,octave:F})}else p(null);j.current=requestAnimationFrame(k)};d.useEffect(()=>()=>y(),[]);const A=n?Math.abs(b.cents):0,o=n&&Math.abs(b.cents)<10;return e.jsxs("div",{className:"bard-card my-6 relative overflow-hidden backdrop-blur-xl border border-white/10 bg-white/5 rounded-2xl p-6 text-center",children:[e.jsx("div",{className:`absolute inset-0 transition-opacity duration-500 ease-in-out ${o?"opacity-20":"opacity-0"}`,style:{background:"radial-gradient(circle at center, #2ecc71 0%, transparent 70%)"}}),e.jsxs("div",{className:"relative z-10",children:[e.jsxs("h3",{className:"text-xl font-cormorant font-bold mb-2 flex items-center justify-center gap-2",children:[e.jsx(U,{size:20,className:r?"animate-pulse text-cf-gold":"text-white/50"}),"The PLING! Trainer"]}),e.jsx("p",{className:"text-sm text-white/70 mb-6 font-inter",children:"Sing a note. Let the Living Voice respond."}),g&&e.jsx("p",{className:"text-red-400 text-sm mb-4",children:g}),e.jsxs("div",{className:"flex flex-col items-center justify-center space-y-8 mb-8 w-full max-w-sm mx-auto",children:[e.jsxs("div",{className:"w-full",children:[e.jsxs("div",{className:"flex justify-between text-[10px] text-white/40 mb-1 font-mono uppercase",children:[e.jsx("span",{children:"Mic Input"}),S>5?e.jsx("span",{className:"text-cf-gold animate-pulse",children:"Detecting..."}):e.jsx("span",{children:"Waiting"})]}),e.jsx("div",{className:"h-1.5 w-full bg-white/10 rounded-full overflow-hidden",children:e.jsx("div",{className:"h-full bg-cf-gold transition-all duration-75 ease-out",style:{width:`${S}%`}})})]}),e.jsxs("div",{className:`relative w-28 h-28 rounded-full flex flex-col items-center justify-center border-2 transition-colors duration-300 ${n?o?"border-green-400 bg-green-400/20 shadow-[0_0_30px_rgba(46,204,113,0.4)]":"border-cf-gold bg-cf-gold/20":"border-white/20 bg-black/20"}`,children:[e.jsx("span",{className:"text-5xl font-bold font-inter text-white",children:b.name}),e.jsx("span",{className:"text-sm text-white/60",children:n?`Octave ${b.octave}`:"--"})]}),e.jsxs("div",{className:"w-full relative",children:[e.jsxs("div",{className:"flex justify-between w-full text-[10px] text-white/40 mb-2 font-mono",children:[e.jsx("span",{children:"-50 Flat"}),e.jsx("span",{children:"In Tune"}),e.jsx("span",{children:"+50 Sharp"})]}),e.jsxs("div",{className:"relative h-3 w-full bg-black/40 border border-white/10 rounded-full overflow-hidden flex items-center",children:[e.jsx("div",{className:"absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/30 -translate-x-1/2 z-10"}),n&&e.jsx("div",{className:`absolute h-full w-4 rounded-full -translate-x-1/2 transition-all duration-100 ease-out shadow-[0_0_10px_currentColor] ${o?"bg-green-400 text-green-400":"bg-cf-gold text-cf-gold"}`,style:{left:`${50+b.cents}%`}})]})]}),e.jsx("div",{className:"h-6",children:n?e.jsxs("span",{className:`text-sm font-bold tracking-widest uppercase transition-colors ${o?"text-green-400":"text-cf-gold"}`,children:[o?"Perfect Pitch":b.cents<0?"FLAT":"SHARP",!o&&e.jsxs("span",{className:"ml-2 opacity-70",children:["(",A," cents)"]})]}):e.jsx("span",{className:"text-sm text-white/40 tracking-widest uppercase",children:"Waiting for pitch..."})})]}),e.jsxs("button",{onClick:r?y:T,className:`flex items-center justify-center gap-2 mx-auto px-6 py-3 rounded-full font-bold transition-all ${r?"bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30":"bg-white/10 text-white border border-white/20 hover:bg-white/20"}`,children:[r?e.jsx(Y,{size:18}):e.jsx(X,{size:18}),r?"Stop Listening":"Activate Microphone"]})]})]})}export{be as F,me as P,fe as X};
