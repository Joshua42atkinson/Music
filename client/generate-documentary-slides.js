import pptxgen from "pptxgenjs";

const generateDocumentarySeries = async () => {
  const series = [
    {
      filename: "Part1_The_Myth_Of_Mastery.pptx",
      title: "Part 1: The Myth of Mastery",
      slides: [
        {
          title: "The 10,000 Hour Illusion",
          subtitle: "Quantity vs Quality",
          visual: "A clock ticking with a blurred, frustrated guitarist in the background.",
          notes: "Welcome to Bertrand Laurence's Masterclass. You've likely heard that mastery takes 10,000 hours. But here is the truth: 10,000 hours of mindless practice doesn't make you a master. It just makes you a master of your own mistakes. It actively rewires your brain to be sloppy and anxious."
        },
        {
          title: "The Permission Slip",
          subtitle: "Stop Trying So Hard",
          visual: "A glowing, signed document reading 'Permission to Slow Down'.",
          notes: "Consider this video your permission slip. You no longer have to rush. You no longer have to prove anything to the metronome. When you understand that practicing slowly actually builds faster neural pathways, the pressure disappears. Mindless practice is a chore. Mindful practice is an exciting challenge."
        }
      ]
    },
    {
      filename: "Part2_The_Practice_Nook.pptx",
      title: "Part 2: The Practice Nook & Binder Control",
      slides: [
        {
          title: "Environmental Scaffolding",
          subtitle: "External Order, Internal Flow",
          visual: "A beautifully organized, moody musician's desk with twilight lighting.",
          notes: "Flow state is fragile. It cannot survive in chaos. The external environment dictates your internal state. A cluttered desk creates a cluttered mind. To enter flow, you must first create a dedicated Practice Nook. A sacred space where the only objective is sound."
        },
        {
          title: "Binder Control",
          subtitle: "Offloading Cognitive Burden",
          visual: "A 3-ring binder glowing with neon accents.",
          notes: "Enter 'Binder Control'. This isn't just a folder; it is an external hard drive for your attention. By logging your minutes and habits physically, you offload the cognitive burden of remembering what to practice. You free up 100 percent of your mental RAM to focus entirely on how you play."
        }
      ]
    },
    {
      filename: "Part3_The_Microscopic_Dance.pptx",
      title: "Part 3: The Microscopic Dance",
      slides: [
        {
          title: "The Body Scan",
          subtitle: "Identifying Tension",
          visual: "An anatomical outline of a human body, highlighting the shoulders and jaw in glowing red.",
          notes: "Before you tune the guitar, you must tune yourself. Tension is the enemy of flow. Before you play a full song, loop a small musical sentence. As you loop it, perform a mental body scan. Are your shoulders raised? Is your jaw tight? Identify these zones of tension and release them."
        },
        {
          title: "The Microscopic Dance",
          subtitle: "Executing Perfect Movement",
          visual: "A magnifying glass analyzing the precise interaction between fretting and picking hands.",
          notes: "Now, analyze your movements under a microscope. Look at the relationship—the dance—between your fretting hand and your striking fingers. Shift your focus away from hitting the right note, and focus entirely on executing the perfect, relaxed movement."
        }
      ]
    },
    {
      filename: "Part4_Practice_TOO_SLOW.pptx",
      title: "Part 4: Practice TOO SLOW",
      slides: [
        {
          title: "The Biology of Myelination",
          subtitle: "Rewiring the Nervous System",
          visual: "A glowing neural pathway being coated in a bright, energetic sheath.",
          notes: "Let's talk about Myelin. It's a biological substance that wraps around your nerves to make signals travel faster. Playing fast and sloppy builds sloppy myelin. Playing slowly and perfectly builds perfect, lightning-fast myelin. You are literally rewiring your nervous system."
        },
        {
          title: "Heavy, Lazy, Sleepy",
          subtitle: "Forcing Relaxation",
          visual: "A neon turtle graphic swimming smoothly through a dark ocean.",
          notes: "So, practice slow. Slow way the f down. Make your muscles feel heavy, lazy, and sleepy. You have to forcefully calm your nervous system. Remember, patience isn't just a virtue here; it is a biological requirement for speed."
        }
      ]
    },
    {
      filename: "Part5_Kinesthetic_Sleep.pptx",
      title: "Part 5: Kinesthetic Sleep",
      slides: [
        {
          title: "The Anatomy of Learning",
          subtitle: "When the Magic Happens",
          visual: "An anatomical human brain glowing with neon cyan circuitry against a dark background.",
          notes: "Here is the shocking truth about learning the guitar: You do not actually get better while you are holding the instrument. You get better when you sleep. Muscle memory—or kinesthetic knowledge—is consolidated during deep sleep."
        },
        {
          title: "The Yield",
          subtitle: "Rest as a Weapon",
          visual: "A person resting peacefully, with musical notes gently floating above.",
          notes: "This biological fact relieves you of the pressure to get it right immediately. A mindful, hyper-focused one-hour practice session, followed by a nap or a good night's rest, yields exponentially more growth than four hours of frustrated, exhausted playing. Rest is a weapon."
        }
      ]
    },
    {
      filename: "Part6_The_Architecture_Of_Sound.pptx",
      title: "Part 6: The Architecture of Sound",
      slides: [
        {
          title: "Learn Two Things At Once",
          subtitle: "Physical Mechanics + Musical Theory",
          visual: "A split screen showing a physical guitar neck on one side and a music theory chart on the other.",
          notes: "Standard notation tells you what to play. But Bertrand teaches you two things at once: the mechanical instrument, and the musical theory. We don't just want you to memorize a song; we want you to understand the architecture of the fretboard."
        },
        {
          title: "Visual Scaffolding",
          subtitle: "CAGED and Vertiscales",
          visual: "Bertrand's actual CAGED system or Vertiscales PDF map, dynamically glowing.",
          notes: "We use visual maps—like the CAGED system and Vertiscales. These maps tell you where you are and why you are there. This is visual scaffolding. It prevents the cognitive overload of feeling lost on the fretboard, allowing you to navigate the neck with total confidence."
        }
      ]
    },
    {
      filename: "Part7_Inducing_The_Flow_State.pptx",
      title: "Part 7: Inducing The Flow State",
      slides: [
        {
          title: "Tying It Together",
          subtitle: "Notes → Chords → Songs",
          visual: "A glowing flowchart showing the progression from simple dots to full musical expression.",
          notes: "Let's tie it all together. Your environment is controlled. Your body is relaxed. Your nervous system is deliberately wired. And the architecture of the fretboard is understood. Now, you can stop trying to play."
        },
        {
          title: "The Flow State",
          subtitle: "Metaphysical Surrender",
          visual: "A guitarist completely lost in the music, surrounded by abstract, flowing neon energy.",
          notes: "This is the metaphysical goal of Bertrand's teachings. You surrender to the muscle memory you have built. You stop thinking about the fretboard. You let the music play you. Welcome to the flow state. Welcome to the Masterclass."
        }
      ]
    }
  ];

  for (const part of series) {
    let pres = new pptxgen();
    pres.layout = 'LAYOUT_16x9';

    pres.defineSlideMaster({
      title: 'MASTER_SLIDE',
      background: { color: '0A0A0F' }, 
      objects: [
        { text: { text: "BERTRAND LAURENCE GUITAR STUDIO | MASTERCLASS", options: { x: 0.5, y: 0.3, w: '90%', h: 0.5, color: 'A0A0C0', fontSize: 12, fontFace: 'Inter', letterSpacing: 1 } } }
      ]
    });

    // Title Slide for the Part
    let titleSlide = pres.addSlide({ masterName: 'MASTER_SLIDE' });
    titleSlide.addText(part.title, { x: 0.5, y: '40%', w: '90%', h: 1.0, fontSize: 54, color: 'FFFFFF', fontFace: 'Outfit', bold: true, align: 'center' });
    titleSlide.addNotes("Title Slide: " + part.title);

    // Content Slides
    for (const slideData of part.slides) {
      let slide = pres.addSlide({ masterName: 'MASTER_SLIDE' });
      
      slide.addText(slideData.title, { x: 0.5, y: 0.8, w: '90%', h: 1.0, fontSize: 40, color: 'FFFFFF', fontFace: 'Outfit', bold: true });
      slide.addText(slideData.subtitle, { x: 0.5, y: 1.8, w: '90%', h: 0.5, fontSize: 24, color: '00F0FF', fontFace: 'Inter' });
      
      slide.addText(`[Visual: ${slideData.visual}]`, {
        x: 0.5, y: 3.0, w: '90%', h: 2.0,
        fontSize: 18, color: 'FF8A00', fontFace: 'Inter', italic: true,
        fill: { color: '20202A' }, align: 'center', valign: 'middle'
      });

      slide.addNotes(slideData.notes);
    }

    await pres.writeFile({ fileName: part.filename });
    console.log(`Successfully generated ${part.filename}`);
  }
};

generateDocumentarySeries().catch(err => console.error(err));
