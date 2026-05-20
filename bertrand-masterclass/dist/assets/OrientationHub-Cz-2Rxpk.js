import{u as T,a as I,r as d,j as e,m as j,g as _,s as O,A as w,b as D}from"./index-COtau4ew.js";import{f as S,T as J,F as A,S as G}from"./SongwritingCompanion-BMNU75Va.js";import{g as M}from"./slideGenerator-7KC9pqWZ.js";import{F as P,P as L,X as H}from"./PlingTrainer-u6mp7PMf.js";import{N as $}from"./NeckMenu-C9e8HOTq.js";class q{constructor(){this.componentControls=new Set}subscribe(a){return this.componentControls.add(a),()=>this.componentControls.delete(a)}start(a,l){this.componentControls.forEach(r=>{r.start(a.nativeEvent||a,l)})}cancel(){this.componentControls.forEach(a=>{a.cancel()})}stop(){this.componentControls.forEach(a=>{a.stop()})}}const V=()=>new q;function W(){return T(V)}const Q={Root:4,"C/C♯":0,D:2,"D♯/E♭":3,E:4,F:5,"F♯/G♭":6,G:7,"G♯/A♭":8,A:9,"A♯/B♭":10,Octave:4},Y={"open-strings":null,"octave-e":null,"natural-notes":"major","minor-third":"minor","major-chord-tones":"major","caged-c-shape":"major",tritone:"blues","power-chord":null,"economy-picking":"pentatonicMinor","chord-progression":"major","full-scale":"minor","full-chromatic":"chromatic"},X=({isOpen:t,onClose:a,fret:l,fretboardFocus:r})=>{const{isFrench:n}=I(),s=m=>m&&typeof m=="object"?n?m.fr:m.en:m,[o,p]=d.useState("peek"),c=W(),k=d.useRef(null),N=l?Q[l.note]??0:0,u=r?.pattern?Y[r.pattern]??null:null,g=r?.endFret??14;d.useEffect(()=>{if(t){const m=setTimeout(()=>{p("peek")},0);return()=>clearTimeout(m)}},[t]),d.useEffect(()=>{t&&navigator.vibrate&&navigator.vibrate(15)},[t]);const v=d.useCallback((m,x)=>{const h=x.velocity.y,y=x.offset.y;h>400||y>120?o==="peek"?a():p("peek"):(h<-400||y<-80)&&o==="peek"&&p("full")},[o,a]),f=()=>{p(m=>m==="peek"?"full":"peek")};return t?e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
        .fbs-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }
        .fbs-sheet {
          position: fixed; left: 0; right: 0; bottom: 0;
          z-index: 210;
          border-radius: 20px 20px 0 0;
          background: rgba(8, 8, 14, 0.97);
          backdrop-filter: blur(24px) saturate(1.5);
          -webkit-backdrop-filter: blur(24px) saturate(1.5);
          border-top: 1px solid rgba(201, 169, 110, 0.15);
          box-shadow: 0 -20px 60px rgba(0,0,0,0.6);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          touch-action: none;
        }
        .fbs-handle-bar {
          display: flex; align-items: center; justify-content: center;
          padding: 12px 0 8px;
          cursor: grab; flex-shrink: 0;
        }
        .fbs-handle-bar:active { cursor: grabbing; }
        .fbs-handle-pill {
          width: 40px; height: 4px; border-radius: 2px;
          background: rgba(255,255,255,0.2);
          transition: background 0.2s;
        }
        .fbs-handle-bar:hover .fbs-handle-pill {
          background: rgba(201, 169, 110, 0.5);
        }
        .fbs-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 16px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          flex-shrink: 0;
        }
        .fbs-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem; color: #e8edf2; font-weight: 400;
        }
        .fbs-preset-badge {
          display: flex; align-items: center; gap: 8px;
        }
        .fbs-preset-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem; letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 4px 10px; border-radius: 4px;
          background: rgba(201,169,110,0.1);
          border: 1px solid rgba(201,169,110,0.25);
          color: #c9a96e;
        }
        .fbs-close-btn {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: #8090a8; border-radius: 8px;
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 1rem;
          transition: all 0.2s;
        }
        .fbs-close-btn:hover {
          color: #c9a96e;
          border-color: rgba(201,169,110,0.3);
        }
        .fbs-body {
          flex: 1; overflow-y: auto; overflow-x: hidden;
          padding: 12px 8px 24px;
          -webkit-overflow-scrolling: touch;
        }
        .fbs-fret-info {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 16px 12px;
          flex-shrink: 0;
        }
        .fbs-fret-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem; letter-spacing: 0.15em;
          text-transform: uppercase; color: #5a6a80;
        }
        .fbs-fret-range {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem; color: #c9a96e;
          padding: 3px 8px;
          background: rgba(201,169,110,0.08);
          border-radius: 3px;
        }
        .fbs-expand-btn {
          background: none; border: none;
          color: #5a6a80; cursor: pointer;
          font-size: 0.9rem; padding: 4px 8px;
          transition: color 0.2s;
        }
        .fbs-expand-btn:hover { color: #c9a96e; }

        /* Landscape: full width */
        @media (orientation: landscape) and (max-height: 500px) {
          .fbs-sheet {
            border-radius: 0;
            height: 100vh !important;
          }
        }
      `}),e.jsx(j.div,{className:"fbs-overlay",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:a}),e.jsxs(j.div,{ref:k,className:"fbs-sheet",initial:{y:"100%"},animate:{y:o==="full"?"12%":"48%",height:o==="full"?"88vh":"52vh"},exit:{y:"100%"},transition:{type:"spring",damping:28,stiffness:300},drag:"y",dragConstraints:{top:0,bottom:0},dragElastic:.15,onDragEnd:v,dragListener:!1,dragControls:c,children:[e.jsx("div",{className:"fbs-handle-bar",onPointerDown:m=>c.start(m),onClick:f,children:e.jsx("div",{className:"fbs-handle-pill"})}),e.jsxs("div",{className:"fbs-header",children:[e.jsx("div",{children:e.jsx("div",{className:"fbs-title",children:"🎸 Fretboard Explorer"})}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx("button",{className:"fbs-expand-btn",onClick:f,children:o==="full"?"▾":"▴"}),e.jsx("button",{className:"fbs-close-btn",onClick:a,children:"✕"})]})]}),l&&e.jsxs("div",{className:"fbs-fret-info",children:[e.jsxs("span",{className:"fbs-fret-label",children:["Ch.",l.id," · ",s(l.title)]}),e.jsxs("div",{className:"fbs-preset-badge",children:[r&&e.jsxs("span",{className:"fbs-fret-range",children:["Frets ",r.startFret,"–",r.endFret]}),u&&e.jsx("span",{className:"fbs-preset-tag",children:u})]})]}),e.jsx("div",{className:"fbs-body",children:e.jsx(P,{maxFret:g,fretLimit:r?.endFret,compact:!0,presetRoot:N,presetScale:u})})]})]}):null},B=50,z=300,U={enter:t=>({x:t>0?"100%":"-100%",opacity:0}),center:{x:0,opacity:1},exit:t=>({x:t<0?"100%":"-100%",opacity:0})},K=({fretId:t=1,onBack:a,onFretChange:l})=>{const{locale:r,isFrench:n}=I(),s=d.useCallback(i=>i?typeof i=="object"?i[r]||i.en||"":i:"",[r]),o=S.find(i=>i.id===t)||S[0],p=d.useMemo(()=>M(o),[o]),[c,k]=d.useState(()=>{const i=_(t);return Math.min(i,p.length-1)}),[N,u]=d.useState(0),[g,v]=d.useState(!1),[f,m]=d.useState(()=>{try{return!localStorage.getItem("voix_vive_swipe_hint_seen")}catch{return!0}}),x=p[c];d.useEffect(()=>{if(f){const i=setTimeout(()=>{m(!1),localStorage.setItem("voix_vive_swipe_hint_seen","1")},3500);return()=>clearTimeout(i)}},[f]);const h=d.useCallback((i,b)=>{i<0||i>=p.length||(u(b),k(i),O(t,i))},[p,t]),y=()=>h(c+1,1),C=()=>h(c-1,-1),R=(i,b)=>{g||(f&&(m(!1),localStorage.setItem("voix_vive_swipe_hint_seen","1")),b.offset.x<-B||b.velocity.x<-z?y():(b.offset.x>B||b.velocity.x>z)&&C())},E=()=>{const i=t<12?t+1:1;k(0),l&&l(i)},F=()=>{v(!0),navigator.vibrate&&navigator.vibrate(15)};return e.jsx("div",{className:"sv-wrapper",children:e.jsxs("div",{className:"sv-container",children:[e.jsx("style",{children:`
        .sv-wrapper {
          position: fixed; inset: 0; z-index: 100;
          display: flex; align-items: center; justify-content: center;
          pointer-events: none;
        }
        @media (min-width: 768px) {
          .sv-wrapper {
            background: rgba(3, 3, 6, 0.85);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            pointer-events: auto;
          }
        }
        .sv-container {
          position: absolute; inset: 0;
          background: #030306;
          display: flex; flex-direction: column;
          font-family: 'Inter', sans-serif;
          color: #e0e0ff;
          overflow: hidden;
          touch-action: pan-y;
          pointer-events: auto;
        }
        @media (min-width: 768px) {
          .sv-container {
            position: relative; inset: auto;
            width: 100%; max-width: 440px;
            height: 90vh; max-height: 900px;
            border-radius: 24px;
            border: 1px solid rgba(255,255,255,0.08);
            box-shadow: 0 40px 80px rgba(0,0,0,0.8);
          }
        }
        .sv-topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 16px;
          padding-top: max(12px, env(safe-area-inset-top));
          background: rgba(8,8,14,0.7);
          backdrop-filter: blur(20px) saturate(1.4);
          -webkit-backdrop-filter: blur(20px) saturate(1.4);
          z-index: 10; flex-shrink: 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .sv-back {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);
          color: #a0aab8; border-radius: 8px;
          font-size: 0.8rem; cursor: pointer; padding: 8px 14px;
          font-family: 'JetBrains Mono', monospace;
          display: flex; align-items: center; gap: 6px; transition: all 0.2s;
          min-height: 44px;
        }
        .sv-back:hover { color: #c9a96e; border-color: rgba(201,169,110,0.3); }
        .sv-back:active { transform: scale(0.95); }
        .sv-chapter-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem; letter-spacing: 0.15em;
          text-transform: uppercase; color: #5a6a80;
          max-width: 40%; text-align: center;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .sv-page-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem; color: #5a6a80;
          padding: 6px 10px; background: rgba(255,255,255,0.03); border-radius: 6px;
        }
        .sv-progress { height: 3px; background: rgba(255,255,255,0.03); flex-shrink: 0; }
        .sv-progress-fill {
          height: 100%; transition: width 0.3s ease; border-radius: 0 2px 2px 0;
          box-shadow: 0 0 8px currentColor;
        }
        .sv-slide-area { flex: 1; position: relative; overflow: hidden; }
        .sv-slide { position: absolute; inset: 0; display: flex; flex-direction: column; cursor: grab; }
        .sv-slide:active { cursor: grabbing; }
        .sv-image-zone {
          flex-shrink: 0; height: 38vh; min-height: 200px; max-height: 340px;
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
        }
        .sv-image-zone img {
          width: 100%; height: 100%; object-fit: cover; opacity: 0.9;
          transition: opacity 1.5s ease-in-out;
        }
        .sv-image-gradient {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .sv-image-icon {
          font-size: 4.5rem; opacity: 0.5;
          filter: drop-shadow(0 0 40px rgba(255,255,255,0.1));
        }
        .sv-image-overlay {
          position: absolute; bottom: 0; left: 0; right: 0; height: 100px;
          background: linear-gradient(transparent, #030306);
        }
        .sv-text-zone {
          flex: 1; overflow-y: auto; padding: 28px 24px 120px;
          -webkit-overflow-scrolling: touch;
          background: rgba(6,6,12,0.8);
          backdrop-filter: blur(16px) saturate(1.2);
          -webkit-backdrop-filter: blur(16px) saturate(1.2);
          border-top: 1px solid rgba(255,255,255,0.04);
        }
        .sv-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem; letter-spacing: 0.22em;
          text-transform: uppercase; margin-bottom: 16px;
        }
        .sv-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 7vw, 2.8rem);
          font-weight: 400; color: #e8edf2;
          margin-bottom: 16px; line-height: 1.1;
        }
        .sv-subtitle {
          font-size: 0.95rem; color: #5a6a80;
          font-style: italic; margin-bottom: 8px;
        }
        .sv-meta {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem; color: #5a6a80;
          letter-spacing: 0.1em; margin-bottom: 20px;
        }
        .sv-body {
          font-size: 1.05rem; line-height: 1.85;
          color: #b0b8c8;
        }
        .sv-body p { margin-bottom: 1.2em; }

        /* ── Quote Slide ── */
        .sv-quote {
          font-family: 'EB Garamond', serif;
          font-size: clamp(1.3rem, 5vw, 1.8rem);
          font-style: italic; color: #7aaa88;
          line-height: 1.7; text-align: center;
          padding: 0 8px;
        }
        .sv-author {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem; color: #5a6a80;
          text-align: center; margin-top: 20px;
          letter-spacing: 0.1em;
        }

        /* ── Concept Slide ── */
        .sv-concept-term {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem; font-weight: 400;
          color: #e8edf2; margin-bottom: 16px;
        }
        .sv-concept-def {
          font-size: 1.1rem; line-height: 1.85;
          color: #b0b8c8;
        }

        /* ── Meditation Slide ── */
        .sv-meditation-prompt {
          font-family: 'EB Garamond', serif;
          font-size: 1.3rem; font-style: italic;
          color: #e8edf2; line-height: 1.8;
          text-align: center; padding: 0 8px;
        }
        .sv-duration {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem; color: #7b6aaa;
          text-align: center; margin-top: 20px;
          letter-spacing: 0.15em;
        }

        /* ── Exercise Slide ── */
        .sv-step {
          display: flex; gap: 12px; align-items: flex-start;
          margin-bottom: 16px;
        }
        .sv-step-num {
          width: 28px; height: 28px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem; font-weight: 700; flex-shrink: 0;
          font-family: 'JetBrains Mono', monospace;
          margin-top: 2px;
        }
        .sv-step-text {
          font-size: 1rem; line-height: 1.7; color: #b0b8c8;
        }

        /* ── End Slide ── */
        .sv-end-icon { font-size: 4rem; text-align: center; margin-bottom: 20px; }
        .sv-end-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem; text-align: center;
          color: #e8edf2; margin-bottom: 12px;
        }
        .sv-end-body {
          font-size: 1rem; color: #8090a8;
          text-align: center; line-height: 1.7; margin-bottom: 30px;
        }
        .sv-next-btn {
          display: block; width: 100%; max-width: 300px;
          margin: 0 auto; padding: 14px 24px;
          background: rgba(201,169,110,0.12);
          border: 1px solid rgba(201,169,110,0.35);
          color: #c9a96e; border-radius: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem; letter-spacing: 0.12em;
          text-transform: uppercase; cursor: pointer;
          transition: all 0.2s; min-height: 48px;
        }
        .sv-next-btn:hover { background: rgba(201,169,110,0.22); }
        .sv-next-btn:active { transform: scale(0.97); }

        /* ── Fretboard FAB ── */
        .sv-fretboard-fab {
          display: flex; align-items: center; gap: 8px;
          margin-top: 20px; padding: 14px 20px;
          background: rgba(201,169,110,0.1);
          border: 1px solid rgba(201,169,110,0.25);
          border-radius: 12px; cursor: pointer;
          transition: all 0.25s; color: #c9a96e;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem; letter-spacing: 0.08em;
          min-height: 48px;
        }
        .sv-fretboard-fab:hover {
          background: rgba(201,169,110,0.2);
          border-color: rgba(201,169,110,0.45);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(201,169,110,0.15);
        }
        .sv-fretboard-fab:active { transform: scale(0.97); }
        .sv-fretboard-fab-icon { font-size: 1.4rem; }
        .sv-fretboard-fab-text {
          flex: 1; text-align: left;
        }
        .sv-fretboard-fab-arrow { opacity: 0.5; }

        /* ── Persistent fretboard toggle in nav ── */
        .sv-fret-toggle {
          background: rgba(201,169,110,0.08);
          border: 1px solid rgba(201,169,110,0.2);
          color: #c9a96e; width: 44px; height: 44px;
          border-radius: 50%; font-size: 1.2rem;
          cursor: pointer; display: flex;
          align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .sv-fret-toggle:hover, .sv-fret-toggle.active {
          background: rgba(201,169,110,0.2);
          border-color: rgba(201,169,110,0.5);
          box-shadow: 0 0 12px rgba(201,169,110,0.2);
        }

        /* ── Bottom Nav Dots ── */
        .sv-nav {
          position: absolute; bottom: 0; left: 0; right: 0;
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px;
          padding-bottom: max(16px, env(safe-area-inset-bottom));
          background: linear-gradient(transparent, rgba(3,3,6,0.97));
          z-index: 10;
        }
        .sv-nav-btn {
          background: rgba(255,255,255,0.06); border: none;
          color: #8090a8; width: 44px; height: 44px;
          border-radius: 50%; font-size: 1.2rem;
          cursor: pointer; display: flex;
          align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .sv-nav-btn:hover { background: rgba(201,169,110,0.15); color: #c9a96e; }
        .sv-nav-btn:disabled { opacity: 0.2; cursor: not-allowed; }
        .sv-nav-btn:active:not(:disabled) { transform: scale(0.9); }
        .sv-dots {
          display: flex; gap: 4px; align-items: center;
          max-width: 45%; overflow: hidden;
        }
        .sv-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(255,255,255,0.12);
          transition: all 0.3s; flex-shrink: 0;
          cursor: pointer;
        }
        .sv-dot.active {
          width: 20px; border-radius: 3px;
        }

        /* ── Landscape ── */
        @media (orientation: landscape) and (max-height: 500px) {
          .sv-slide { flex-direction: row; }
          .sv-image-zone {
            height: auto; min-height: auto; max-height: none;
            width: 40%; flex-shrink: 0;
          }
          .sv-image-overlay {
            height: auto; width: 40px;
            top: 0; left: auto; right: 0; bottom: 0;
            background: linear-gradient(to left, #030306, transparent);
          }
          .sv-text-zone { padding: 20px 20px 80px; }
        }
      `}),e.jsxs("div",{className:"sv-topbar",children:[e.jsx("button",{className:"sv-back",onClick:a,children:n?"← Retour":"← Back"}),e.jsxs("span",{className:"sv-chapter-label",children:["Ch.",o.id," · ",s(o.title)]}),e.jsxs("span",{className:"sv-page-num",children:[c+1,"/",p.length]})]}),e.jsx("div",{className:"sv-progress",children:e.jsx("div",{className:"sv-progress-fill",style:{width:`${(c+1)/p.length*100}%`,background:x.accent,color:x.accent}})}),e.jsxs("div",{className:"sv-slide-area",children:[e.jsx(w,{initial:!1,custom:N,mode:"popLayout",children:e.jsxs(j.div,{className:"sv-slide",custom:N,variants:U,initial:"enter",animate:"center",exit:"exit",transition:{type:"spring",stiffness:60,damping:20,mass:1.2},drag:g?!1:"x",dragConstraints:{left:0,right:0},dragElastic:.2,onDragEnd:R,children:[e.jsxs("div",{className:"sv-image-zone",children:[x.image?e.jsx("img",{src:x.image,alt:"",draggable:!1}):e.jsx("div",{className:"sv-image-gradient",style:{background:`radial-gradient(ellipse at 50% 40%, ${x.accent}20 0%, ${x.accent}08 40%, #030306 100%)`},children:x.icon&&e.jsx("span",{className:"sv-image-icon",children:x.icon})}),e.jsx("div",{className:"sv-image-overlay"})]}),e.jsx("div",{className:"sv-text-zone",children:e.jsx(Z,{slide:x,onOpenFretboard:F,onNextFret:E,localize:s,isFrench:n})})]},x.id)}),e.jsx(w,{children:f&&e.jsx(j.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},exit:{opacity:0,y:-10},transition:{duration:.4},style:{position:"absolute",bottom:80,left:0,right:0,display:"flex",justifyContent:"center",pointerEvents:"none",zIndex:20},children:e.jsx("div",{style:{background:"rgba(201,169,110,0.15)",border:"1px solid rgba(201,169,110,0.3)",borderRadius:20,padding:"10px 24px",fontFamily:"JetBrains Mono, monospace",fontSize:"0.85rem",color:"#c9a96e",letterSpacing:"0.05em",backdropFilter:"blur(8px)"},children:e.jsx(j.span,{animate:{x:[-4,4,-4]},transition:{repeat:1/0,duration:1.5,ease:"easeInOut"},style:{display:"inline-block"},children:n?"← Balayez pour lire →":"← Swipe to read →"})})})}),e.jsxs("div",{className:"sv-nav",children:[e.jsx("button",{className:"sv-nav-btn",onClick:C,disabled:c===0,children:"‹"}),e.jsx("button",{className:`sv-fret-toggle ${g?"active":""}`,onClick:()=>g?v(!1):F(),title:n?"Ouvrir la touche":"Open Fretboard",children:"🎸"}),e.jsx("div",{className:"sv-dots",children:p.map((i,b)=>e.jsx("div",{className:`sv-dot ${b===c?"active":""}`,style:b===c?{background:x.accent}:{},onClick:()=>h(b,b>c?1:-1)},b))}),e.jsx("button",{className:"sv-nav-btn",onClick:c===p.length-1?E:y,children:"›"})]})]}),e.jsx(w,{children:g&&e.jsx(X,{isOpen:g,onClose:()=>v(!1),fret:o,fretboardFocus:x.fretboardFocus||o.yang?.fretboardFocus})})]})})};function Z({slide:t,onOpenFretboard:a,onNextFret:l,localize:r,isFrench:n}){switch(t.type){case"title":return e.jsxs(e.Fragment,{children:[e.jsx("p",{className:"sv-label",style:{color:t.accent},children:r(t.label)}),e.jsx("h1",{className:"sv-title",children:r(t.title)}),e.jsx("p",{className:"sv-subtitle",children:r(t.subtitle)}),e.jsx("p",{className:"sv-meta",children:r(t.meta)}),e.jsx("div",{className:"sv-body",children:e.jsx("p",{children:r(t.body)})})]});case"yin-philosophy":return e.jsxs(e.Fragment,{children:[e.jsx("p",{className:"sv-label",style:{color:"#7b6aaa"},children:r(t.label)}),t.title&&e.jsx("h2",{className:"sv-title",style:{fontSize:"clamp(1.5rem, 6vw, 2.2rem)"},children:r(t.title)}),e.jsx("div",{className:"sv-body",children:e.jsx("p",{children:r(t.body)})})]});case"yin-quote":return e.jsxs("div",{style:{display:"flex",flexDirection:"column",justifyContent:"center",height:"100%"},children:[e.jsx("p",{className:"sv-label",style:{color:"#7b6aaa",textAlign:"center"},children:r(t.label)}),e.jsxs("p",{className:"sv-quote",children:['"',r(t.quote),'"']}),e.jsxs("p",{className:"sv-author",children:["— ",r(t.author)]})]});case"yin-concept":return e.jsxs(e.Fragment,{children:[e.jsx("p",{className:"sv-label",style:{color:"#7b6aaa"},children:r(t.label)}),e.jsx("h2",{className:"sv-concept-term",children:r(t.title)}),e.jsx("p",{className:"sv-concept-def",children:r(t.body)})]});case"yin-meditation":return e.jsxs("div",{style:{display:"flex",flexDirection:"column",justifyContent:"center",height:"100%"},children:[e.jsx("p",{className:"sv-label",style:{color:"#7b6aaa",textAlign:"center"},children:r(t.label)}),e.jsx("p",{className:"sv-meditation-prompt",children:r(t.body)}),t.duration&&e.jsxs("p",{className:"sv-duration",children:["⏱ ",t.duration," ",n?"secondes":"seconds"]})]});case"yang-instruction":return e.jsxs(e.Fragment,{children:[e.jsx("p",{className:"sv-label",style:{color:"#c9a96e"},children:r(t.label)}),e.jsx("h2",{className:"sv-title",style:{fontSize:"clamp(1.5rem, 6vw, 2.2rem)"},children:r(t.title)}),e.jsx("div",{className:"sv-body",children:e.jsx("p",{children:r(t.body)})})]});case"yang-theory":return e.jsxs(e.Fragment,{children:[e.jsx("p",{className:"sv-label",style:{color:"#0abde3"},children:r(t.label)}),e.jsx("h2",{className:"sv-title",style:{fontSize:"clamp(1.5rem, 6vw, 2.2rem)"},children:r(t.title)}),e.jsxs("div",{className:"mb-6 p-4 rounded-xl bg-[#0abde3]/10 border border-[#0abde3]/30",children:[e.jsx("h3",{className:"font-bold text-[#0abde3] text-sm mb-2 font-mono uppercase tracking-wider",children:n?"Comment fonctionne la musique":"How Music Works"}),e.jsx("p",{className:"sv-body text-sm",children:r(t.musicGrammar)})]}),e.jsxs("div",{className:"mb-6 p-4 rounded-xl bg-cf-gold/10 border border-cf-gold/30",children:[e.jsx("h3",{className:"font-bold text-cf-gold text-sm mb-2 font-mono uppercase tracking-wider",children:n?"Comment fonctionne la guitare":"How Guitar Works"}),e.jsx("p",{className:"sv-body text-sm",children:r(t.guitarGrammar)})]})]});case"yang-exercise":return e.jsxs(e.Fragment,{children:[e.jsx("p",{className:"sv-label",style:{color:"#c9a96e"},children:r(t.label)}),e.jsx("h2",{className:"sv-title",style:{fontSize:"clamp(1.4rem, 5vw, 1.8rem)"},children:r(t.title)}),e.jsx("div",{children:t.steps?.map((s,o)=>e.jsxs("div",{className:"sv-step",children:[e.jsx("span",{className:"sv-step-num",style:{background:`${t.accent}20`,color:t.accent},children:o+1}),e.jsx("span",{className:"sv-step-text",children:r(s)})]},o))}),(t.id==="4-exercise-0"||t.id==="7-exercise-0")&&e.jsx(L,{}),(()=>{const s=J.find(o=>o.id===t.fretId);return s?e.jsxs("div",{className:"mt-4 mb-4 p-4 rounded-xl bg-cf-gold/10 border border-cf-gold/30",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-2",children:[e.jsx("span",{className:"text-cf-gold",children:s.icon}),e.jsx("h3",{className:"font-bold text-cf-gold text-sm",children:s.name})]}),e.jsx("p",{className:"text-xs text-white/70 mb-3",children:s.desc}),e.jsx("button",{className:`w-full py-2 rounded text-xs font-bold transition-colors ${s.status==="available"?"bg-cf-gold text-[#030306] hover:bg-white":"bg-white/10 text-white/40 cursor-not-allowed"}`,onClick:()=>{s.status==="available"&&alert(`Opening ${s.name}... (Routing to be connected)`)},children:s.status==="available"?n?"Lancer l'Outil":"Launch Tool":n?"À Venir":"Coming Soon"})]}):null})(),e.jsxs("button",{className:"sv-fretboard-fab",onClick:a,children:[e.jsx("span",{className:"sv-fretboard-fab-icon",children:"🎸"}),e.jsx("span",{className:"sv-fretboard-fab-text",children:n?"Pratiquer sur la touche":"Practice on Fretboard"}),e.jsx("span",{className:"sv-fretboard-fab-arrow",children:"↑"})]})]});case"yang-fretboard":return e.jsxs(e.Fragment,{children:[e.jsx("p",{className:"sv-label",style:{color:"#c9a96e"},children:r(t.label)}),e.jsx("h2",{className:"sv-title",style:{fontSize:"clamp(1.4rem, 5vw, 1.8rem)"},children:r(t.title)}),e.jsx("div",{className:"sv-body",children:e.jsx("p",{children:r(t.body)})}),e.jsxs("button",{className:"sv-fretboard-fab",onClick:a,children:[e.jsx("span",{className:"sv-fretboard-fab-icon",children:"🎸"}),e.jsxs("span",{className:"sv-fretboard-fab-text",children:[n?"Ouvrir la touche — Frettes":"Open Fretboard — Frets"," ",t.fretboardFocus?.startFret,"–",t.fretboardFocus?.endFret]}),e.jsx("span",{className:"sv-fretboard-fab-arrow",children:"↑"})]})]});case"fret-end":return e.jsxs("div",{style:{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",height:"100%",textAlign:"center"},children:[e.jsx("div",{className:"sv-end-icon",children:t.icon}),e.jsx("h2",{className:"sv-end-title",children:r(t.title)}),e.jsx("p",{className:"sv-end-body",children:r(t.body)}),t.fretId<12&&e.jsx("button",{className:"sv-next-btn",onClick:l,children:n?"Frette Suivante →":"Next Fret →"})]});case"timeless-song":return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1.1rem"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("p",{className:"sv-label",style:{color:"#c9a96e",margin:0},children:r(t.label)}),t.ratio&&e.jsx("span",{style:{fontFamily:"JetBrains Mono, monospace",fontSize:"0.85rem",color:"#c9a96e",background:"rgba(201,169,110,0.1)",border:"1px solid rgba(201,169,110,0.25)",padding:"3px 8px",borderRadius:4,letterSpacing:"0.08em"},children:t.ratio})]}),e.jsx("h2",{style:{fontFamily:"Cormorant Garamond, serif",fontSize:"clamp(1.6rem, 6vw, 2.4rem)",fontWeight:400,color:"#e8edf2",lineHeight:1.15,margin:0},children:r(t.title)}),e.jsx("div",{style:{fontSize:"1rem",lineHeight:1.9,color:"#b0b8c8"},children:(r(t.body)||"").split(`

`).map((s,o)=>e.jsx("p",{style:{marginBottom:"1em"},children:s},o))}),t.subtext&&e.jsx("p",{style:{fontFamily:"JetBrains Mono, monospace",fontSize:"0.85rem",color:"#5a6a80",letterSpacing:"0.12em",textTransform:"uppercase",borderLeft:"2px solid rgba(201,169,110,0.3)",paddingLeft:"0.75rem"},children:r(t.subtext)}),t.quote&&e.jsxs("div",{style:{background:"rgba(201,169,110,0.06)",border:"1px solid rgba(201,169,110,0.15)",borderRadius:10,padding:"1rem 1.2rem"},children:[e.jsxs("p",{style:{fontFamily:"EB Garamond, serif",fontSize:"1.05rem",fontStyle:"italic",color:"#c9a96e",lineHeight:1.7,margin:0},children:['"',r(t.quote),'"']}),t.author&&e.jsxs("p",{style:{fontFamily:"JetBrains Mono, monospace",fontSize:"0.85rem",color:"#5a6a80",marginTop:"0.5rem",letterSpacing:"0.1em"},children:["— ",r(t.author)]})]}),t.references?.length>0&&e.jsx(ee,{references:t.references,isFrench:n})]});default:return e.jsx("p",{className:"sv-body",children:r(t.body)})}}function ee({references:t,isFrench:a}){const[l,r]=d.useState(!1);return e.jsxs("div",{style:{marginTop:"0.5rem"},children:[e.jsxs("button",{onClick:()=>r(n=>!n),style:{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:8,padding:"8px 14px",color:"#5a6a80",cursor:"pointer",fontFamily:"JetBrains Mono, monospace",fontSize:"0.85rem",letterSpacing:"0.1em",display:"flex",alignItems:"center",gap:8,width:"100%",textAlign:"left",transition:"all 0.2s"},children:[e.jsx("span",{style:{fontSize:"1rem"},children:"📚"}),e.jsxs("span",{style:{flex:1},children:[l?a?"MASQUER":"HIDE":a?"VOIR":"VIEW"," ",a?"LES RÉFÉRENCES":"REFERENCES"," (",t.length,")"]}),e.jsx("span",{style:{opacity:.5},children:l?"▲":"▼"})]}),l&&e.jsx("div",{style:{marginTop:8,padding:"12px 14px",background:"rgba(201,169,110,0.04)",border:"1px solid rgba(201,169,110,0.12)",borderRadius:8},children:t.map((n,s)=>e.jsxs("div",{style:{marginBottom:s<t.length-1?12:0,paddingBottom:s<t.length-1?12:0,borderBottom:s<t.length-1?"1px solid rgba(255,255,255,0.04)":"none"},children:[e.jsx("p",{style:{fontFamily:"EB Garamond, serif",fontSize:"0.95rem",fontStyle:"italic",color:"#c9a96e",margin:0},children:n.title}),e.jsxs("p",{style:{fontFamily:"JetBrains Mono, monospace",fontSize:"0.85rem",color:"#5a6a80",margin:"2px 0 4px",letterSpacing:"0.08em"},children:[n.author," · ",n.date]}),e.jsx("p",{style:{fontSize:"0.8rem",color:"#8090a8",lineHeight:1.6,margin:0},children:n.context})]},s))})]})}const te={1:{symbol:"🫁",glyph:"♩"},2:{symbol:"👁️",glyph:"♪"},3:{symbol:"🤫",glyph:"♫"},4:{symbol:"🔮",glyph:"♬"},5:{symbol:"⚗️",glyph:"♯"},6:{symbol:"🗺️",glyph:"♮"},7:{symbol:"🌀",glyph:"♭"},8:{symbol:"⚡",glyph:"𝄞"},9:{symbol:"🗡️",glyph:"𝄢"},10:{symbol:"🌅",glyph:"𝄡"},11:{symbol:"🪞",glyph:"𝄪"},12:{symbol:"∞",glyph:"𝄫"}},re={"not-started":null,"in-progress":{label:"◐",color:"#c9a96e",title:"In progress"},completed:{label:"●",color:"#2ed573",title:"Completed"}},le=()=>{const[t,a]=d.useState(null),[l,r]=d.useState(!1);if(t)return e.jsx(K,{fretId:t,onBack:()=>a(null),onFretChange:s=>a(s)});const n=S.map(s=>{const o=M(s).length,p=D(s.id,o),c=re[p];return{...s,symbol:te[s.id]?.symbol||s.icon,subtitle:c?`${s.subtitle}  ${c.label}`:s.subtitle}});return e.jsxs(e.Fragment,{children:[e.jsx($,{items:n,activeId:null,onItemClick:s=>a(s),headerTitle:"Voix Vive",headerSubtitle:"Your 12-chapter journey through the guitar",showBackButton:!0}),e.jsx("button",{onClick:()=>r(!0),"aria-label":"Open Troubadour's Quill",style:{position:"fixed",bottom:"72px",right:"16px",zIndex:400,width:"52px",height:"52px",borderRadius:"50%",background:"linear-gradient(135deg, rgba(123,106,170,0.4) 0%, rgba(123,106,170,0.15) 100%)",border:"1px solid rgba(123,106,170,0.4)",color:"#b09cd8",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px rgba(123,106,170,0.3)",transition:"all 0.3s ease"},children:e.jsx(A,{size:22})}),l&&e.jsxs("div",{style:{position:"fixed",inset:0,zIndex:600,background:"rgba(5,5,8,0.97)",backdropFilter:"blur(12px)",overflowY:"auto"},children:[e.jsx("button",{onClick:()=>r(!1),style:{position:"sticky",top:"12px",right:"16px",float:"right",zIndex:601,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"50%",width:"40px",height:"40px",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"rgba(255,255,255,0.5)",margin:"12px 16px"},children:e.jsx(H,{size:18})}),e.jsx(G,{})]})]})};export{le as default};
