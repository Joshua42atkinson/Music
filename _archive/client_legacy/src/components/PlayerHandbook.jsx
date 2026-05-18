import React, { useState } from 'react';

const handbookData = {
  tome1: {
    title: "Tome 1: The Biology of the Bard",
    subtitle: "The Science of How the Brain Learns Music",
    icon: "🧬",
    sections: [
      {
        heading: "The Myth of 10,000 Hours",
        content: "You've likely heard the adage that true mastery requires 10,000 hours of practice. But here is the critical truth: 10,000 hours of mindless repetition doesn't make you a master; it merely makes you a master of your own mistakes. Mindless practice actively rewires your brain to be sloppy, anxious, and inefficient."
      },
      {
        heading: "Myelination: The Highway of Sound",
        content: "To understand why Bertrand says 'Practice TOO SLOW', you must understand Myelin. Myelin is a fatty, insulating sheath that wraps around your neural pathways. When you play a scale, electricity travels from your brain to your fingers. If you play it sloppy, you myelinate a sloppy pathway. If you play it incredibly slowly and perfectly, you build a lightning-fast, heavily insulated neural highway. Speed is not forced; speed is a byproduct of accuracy.",
        image: "/assets/slides/turtle.png"
      },
      {
        heading: "Kinesthetic Sleep",
        content: "Here is the ultimate permission slip: You do not get better while you are holding the guitar. You get better when you sleep. Muscle memory—known as kinesthetic knowledge—is actively consolidated during deep and REM sleep. A one-hour mindful practice followed by rest yields exponentially more growth than four hours of frustrated playing. Rest is a weapon in the Bard's arsenal.",
        image: "/assets/slides/brain.png"
      }
    ]
  },
  tome2: {
    title: "Tome 2: The Sacred Nook & The Grimoire",
    subtitle: "Attention Management and Environmental Scaffolding",
    icon: "🕯️",
    sections: [
      {
        heading: "The Practice Nook",
        content: "The flow state is fragile; it cannot survive in chaos. Your external environment dictates your internal state. A cluttered desk creates a cluttered mind. To enter flow, you must first create a dedicated Practice Nook—a sacred space where the only objective is sound. When you cross the threshold of this space, your brain should automatically prepare to play.",
        image: "/assets/slides/desk.png"
      },
      {
        heading: "The Grimoire (Binder Control)",
        content: "Every Bard needs a Grimoire. We call this 'Binder Control'. This physical binder is an external hard drive for your attention. By physically logging your minutes, your chord charts, and your habits, you offload the cognitive burden of remembering *what* to practice. You free up 100% of your mental RAM to focus entirely on *how* you play."
      }
    ]
  },
  tome3: {
    title: "Tome 3: Tuning the Biological Instrument",
    subtitle: "Physical Mechanics and the Body Scan",
    icon: "🧘",
    sections: [
      {
        heading: "Tension is the Enemy of Flow",
        content: "Before you tune the wooden instrument, you must tune the biological one. Tension blocks the flow state. If your jaw is tight, your music will sound tight. Before you play a full song, loop a small musical sentence. As you loop it, perform a mental 'body scan'. Are your shoulders raised? Drop them. Is your breathing shallow? Deepen it."
      },
      {
        heading: "The Microscopic Dance",
        content: "Analyze your movements under a microscope. Look at the precise relationship—the dance—between your fretting hand and your striking hand. Shift your focus away from the anxiety of 'hitting the right note' and focus entirely on executing the perfect, relaxed physical movement."
      }
    ]
  },
  tome4: {
    title: "Tome 4: The Architecture of Sound",
    subtitle: "Navigating the Fretboard Continent",
    icon: "🏰",
    sections: [
      {
        heading: "Learn Two Things at Once",
        content: "Standard notation tells you *what* to play. Bertrand teaches you the mechanical instrument and the musical theory simultaneously. We do not just memorize songs; we map the continent."
      },
      {
        heading: "The CAGED System & Vertiscales",
        content: "The guitar is built on repeating geometric patterns. We use visual maps like the CAGED system and Vertiscales to understand this geometry. These maps act as cognitive scaffolding. They tell you exactly *where* you are on the fretboard and *why* you are there, completely eliminating the cognitive overload of feeling 'lost'.",
        image: "/assets/slides/caged_system.png"
      }
    ]
  },
  tome5: {
    title: "Tome 5: The Metaphysics of Flow",
    subtitle: "Bringing It All Together",
    icon: "✨",
    sections: [
      {
        heading: "Notes → Chords → Songs",
        content: "The progression is simple but profound. You learn the notes that make the chord. You understand why the chord fits the map. And only then, do you build the song. This is the foundation."
      },
      {
        heading: "Metaphysical Surrender",
        content: "Once the biology is wired, the environment is set, the tension is released, and the architecture is understood, you reach the final stage: Surrender. You stop 'trying' to play. You surrender to the heavily myelinated pathways you have built. You stop thinking about the fretboard, and you let the music play you. Welcome to the flow state. Welcome to the Masterclass."
      }
    ]
  }
};

const PlayerHandbook = () => {
  const [activeTome, setActiveTome] = useState('tome1');

  const containerStyle = {
    display: 'flex',
    maxWidth: '1200px',
    margin: '2rem auto',
    minHeight: '80vh',
    background: '#0a0a0f',
    borderRadius: '16px',
    border: '1px solid rgba(0, 240, 255, 0.2)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
    overflow: 'hidden',
    fontFamily: "'Inter', sans-serif",
    color: '#e0e0ff'
  };

  const sidebarStyle = {
    width: '300px',
    background: '#050508',
    borderRight: '1px solid rgba(0, 240, 255, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    padding: '2rem 0'
  };

  const headerStyle = {
    padding: '0 2rem 2rem 2rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    marginBottom: '1rem'
  };

  const navBtnStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.2rem 2rem',
    background: isActive ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
    border: 'none',
    borderLeft: isActive ? '4px solid #00f0ff' : '4px solid transparent',
    color: isActive ? '#00f0ff' : '#888',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: isActive ? '600' : '400',
    transition: 'all 0.2s ease',
    width: '100%'
  });

  const contentAreaStyle = {
    flex: 1,
    padding: '4rem',
    overflowY: 'auto',
    background: 'radial-gradient(circle at center, #11111a 0%, #0a0a0f 100%)'
  };

  const currentTome = handbookData[activeTome];

  return (
    <div style={containerStyle}>
      {/* Sidebar Navigation */}
      <div style={sidebarStyle}>
        <div style={headerStyle}>
          <h2 style={{ fontSize: '1.5rem', color: '#fff', fontFamily: "'Outfit', sans-serif", margin: 0, letterSpacing: '2px', textTransform: 'uppercase' }}>
            The Bard's
          </h2>
          <h1 style={{ fontSize: '2rem', color: '#ff8a00', fontFamily: "'Outfit', sans-serif", margin: 0, textShadow: '0 0 20px rgba(255, 138, 0, 0.4)' }}>
            Handbook
          </h1>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {Object.entries(handbookData).map(([key, tome]) => (
            <button 
              key={key} 
              style={navBtnStyle(activeTome === key)}
              onClick={() => setActiveTome(key)}
            >
              <span style={{ fontSize: '1.5rem' }}>{tome.icon}</span>
              {tome.title.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={contentAreaStyle}>
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
          <h1 style={{ fontSize: '3.5rem', color: '#fff', fontFamily: "'Outfit', sans-serif", marginBottom: '0.5rem', lineHeight: '1.1' }}>
            {currentTome.title}
          </h1>
          <h3 style={{ fontSize: '1.5rem', color: '#00f0ff', fontWeight: '400', marginBottom: '4rem', borderBottom: '1px solid rgba(0,240,255,0.2)', paddingBottom: '2rem' }}>
            {currentTome.subtitle}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            {currentTome.sections.map((section, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h2 style={{ fontSize: '2.2rem', color: '#ff8a00', fontFamily: "'Outfit', sans-serif", margin: 0 }}>
                  {section.heading}
                </h2>
                
                {section.image && (
                  <div style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', margin: '1rem 0' }}>
                    <img src={section.image} alt={section.heading} style={{ width: '100%', height: 'auto', display: 'block', opacity: 0.85 }} />
                  </div>
                )}
                
                <p style={{ fontSize: '1.25rem', lineHeight: '1.8', color: '#b0b0c0', margin: 0 }}>
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerHandbook;
