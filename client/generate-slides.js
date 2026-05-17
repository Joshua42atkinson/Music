import pptxgen from "pptxgenjs";

const generatePresentation = async () => {
  let pres = new pptxgen();

  pres.layout = 'LAYOUT_16x9';

  pres.defineSlideMaster({
    title: 'MASTER_SLIDE',
    background: { color: '0A0A0F' }, // Twilight dark
    objects: [
      { text: { text: "BERTRAND LAURENCE GUITAR STUDIO", options: { x: 0.5, y: 0.3, w: '90%', h: 0.5, color: 'A0A0C0', fontSize: 14, fontFace: 'Inter', letterSpacing: 1 } } }
    ]
  });

  const addSlide = (title, subtitle, visual, voiceover) => {
    let slide = pres.addSlide({ masterName: 'MASTER_SLIDE' });
    
    // Title
    slide.addText(title, { x: 0.5, y: 1.0, w: '90%', h: 1.0, fontSize: 44, color: 'FFFFFF', fontFace: 'Outfit', bold: true });
    
    // Subtitle / Visual Cue
    slide.addText(subtitle, { x: 0.5, y: 2.2, w: '90%', h: 0.5, fontSize: 24, color: '00F0FF', fontFace: 'Inter' });
    
    // Visual description box
    slide.addText(`[Visual: ${visual}]`, {
      x: 0.5, y: 3.5, w: '90%', h: 1.5,
      fontSize: 18, color: 'FF8A00', fontFace: 'Inter', italic: true,
      fill: { color: '20202A' }, align: 'center', valign: 'middle'
    });

    // Voiceover in Speaker Notes for Google Vids AI
    slide.addNotes(voiceover);
  };

  // Slide 1
  addSlide(
    "The Myth of 10,000 Hours",
    "Quantity vs. Quality in Practice",
    "A clock ticking alongside a person looking frustrated.",
    "We've all heard it takes 10,000 hours to master a skill. But quantity without quality is just spinning your wheels. Mindless practice fosters mistakes and negative self-judgment. We are here to practice mindfully."
  );

  // Slide 2
  addSlide(
    "Practice TOO SLOW",
    "Teaching the Nervous System",
    "A turtle icon; a close-up of fingers moving deliberately on a fretboard.",
    "The secret to mastering the guitar? Practice slow. Slow way the f down. Impatience is your worst enemy. Teach your nervous system to relax. Rushing and fumbling is like running headfirst into a wall. Make your muscles heavy and lazy to teach your mind to slow down."
  );

  // Slide 3
  addSlide(
    "The Microscopic Dance",
    "Analyzing the Movements",
    "A magnifying glass over a guitarist's left hand and right hand working together.",
    "Analyze your movements under a microscope. Look at the relationship—the dance—between your fretting hand and your striking fingers."
  );

  // Slide 4
  addSlide(
    "Deep Sleep & Kinesthetic Knowledge",
    "The Anatomy of Learning",
    "A brain glowing while a person sleeps.",
    "How do you improve motor skills the fastest? Sleep. Kinesthetic knowledge—body mechanics—is consolidated during deep sleep. A one-hour mindful practice followed by a good night's rest is worth four hours of frustrated noodling."
  );

  // Slide 5
  addSlide(
    "The Practice Nook & Binder Control",
    "Preparing the Environment",
    "A beautifully organized desk with a guitar stand, a metronome, and a 3-ring binder.",
    "Create a dedicated Practice Nook. Your environment dictates your focus. Use a physical Binder to track your progress, organize your sheet music, and log your mindful repetition."
  );

  // Slide 6
  addSlide(
    "The Body Scan",
    "Identifying Tension",
    "An anatomical outline of a human body, highlighting the shoulders and hands.",
    "Before you play, loop a small musical sentence. As you loop it, check your body. Are your shoulders raised? Is your jaw tight? Identify zones of tension and release them."
  );

  // Slide 7
  addSlide(
    "The Vertiscape & CAGED System",
    "Learn Two Things at Once",
    "One of Bertrand's 'E Vertiscales' or 'CAGED' PDF maps dynamically highlighting.",
    "You aren't just memorizing songs; you are learning the architecture of the fretboard. We use visual maps—like the CAGED system and Vertiscales—to show you how chords and scales interlock across the neck."
  );

  // Slide 8
  addSlide(
    "Ear Training is a Game You Can Win",
    "Perfect Pitch is Teachable",
    "The 'Pitch Room' UI, showing a Perfect 4th vs a Major 3rd.",
    "Perfect pitch isn't just magic you are born with—it is teachable. Ear training is a game of recognizing intervals. Once you can hear the difference between a Perfect 5th and a Major 3rd, the guitar neck unlocks entirely."
  );

  // Slide 9
  addSlide(
    "Notes → Chords → Songs",
    "The Foundation",
    "A flowchart moving from single dots to chord blocks to full sheet music.",
    "Don't just rush to play the song. Learn the notes that make the chord, understand why the chord fits the map, and only then, build the song. Welcome to The Foundation."
  );

  // Save the Presentation
  const fileName = "bertrand_orientation_slides.pptx";
  await pres.writeFile({ fileName: fileName });
  console.log(`Successfully generated ${fileName}`);
};

generatePresentation().catch(err => console.error(err));
