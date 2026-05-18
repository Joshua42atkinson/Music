// Video 2: Authority — "Who is in charge of the definition of truth, quality, and the expansion of perspective?"
// The Hero's Journey Arc: The journey of relinquishing the teacher's ego as the "Gatekeeper of Truth"
// and awakening the student as the ultimate sovereign author of meaning through play and autonomy.
// Source: THE CONSCIOUS FRAMEWORK: MASTER ARCHITECTURE (Joshua Atkinson, EDCI 57300)

const authorityStages = [
  {
    number: 1,
    power: 'INSTITUTION',
    title: 'The Ordinary World',
    context: 'The rigid environment where truth is dictated from the top down.',
    taoChapter: 57,
    taoChapterName: 'The Illusion of Rules',
    taoQuote: '"The more prohibitions you have, the less virtuous people will be. [...] The more laws and regulations, the more thieves and robbers."',
    taoSource: 'Laozi, Tao Te Ching, Ch. 57 (S. Mitchell, Trans., 1988)',
    meditations: [
      {
        id: 'authority-1-1',
        question: 'How does dictating truth from the top down create resistance rather than genuine understanding?',
      },
      {
        id: 'authority-1-2',
        question: 'If we govern learning entirely through strict institutional rules, what natural, intuitive wisdom are we stifling within the student?',
      },
    ],
    setAndSetting: {
      description: 'A perfectly aligned row of desks. A stack of glossy, district-mandated "Financial Literacy" workbooks sits at the front. The teacher stands next to the whiteboard, pointing aggressively at a multiple-choice question. A student sits in the back, staring at the textbook, a crumpled, pink final-notice utility bill poking out of the front pocket of her faded backpack.',
      imagePath: '/images/authority/stage-01.webp',
    },
    scenario: {
      title: 'The Institution',
      content: 'Mr. Sterling tapped the whiteboard with his dry-erase marker. "Question four. To build emergency savings, a household must allocate twenty percent of its income. A, B, C, or D?"\n\nIn the back row, Sierra stared at the glossy page. Underneath her workbook was a pink final-notice utility bill she had taken from her mother\'s kitchen table that morning.\n\n"The answer is C," Mr. Sterling announced, writing a large \'C\' on the board. "Fill in the bubble."\n\nSierra looked at the perfectly drawn circle on the board. She looked at the pink envelope sticking out of her bag. Without changing her expression, she picked up her dull pencil and filled in bubble \'C\' on her scantron sheet, handing the institution its required lie so she could pass the class and get to her evening shift at the grocery store.',
    },
  },
  {
    number: 2,
    power: 'ABUNDANCE',
    title: 'Call to Adventure',
    context: 'The realization that information is infinite and free.',
    taoChapter: 4,
    taoChapterName: 'The Infinite Source',
    taoQuote: '"The Tao is like a well: used but never used up. It is like the eternal void: filled with infinite possibilities."',
    taoSource: 'Laozi, Tao Te Ching, Ch. 4 (S. Mitchell, Trans., 1988)',
    meditations: [
      {
        id: 'authority-2-1',
        question: 'When we stop hoarding knowledge as a scarce resource to be dispensed, how does its infinite abundance change our role as educators?',
      },
      {
        id: 'authority-2-2',
        question: 'How can we invite the student to drink from an infinite well of information rather than offering them a rigidly measured cup?',
      },
    ],
    setAndSetting: {
      description: 'A dark classroom lit only by the glare of an old, malfunctioning overhead projector. The teacher points to a faded, heavily redacted transparency from a 1998 textbook. In the back corner, a student holds a smartphone with a severely cracked screen under his desk, its blue light illuminating his face as he scrolls silently through a massive, global database.',
      imagePath: '/images/authority/stage-02.webp',
    },
    scenario: {
      title: 'The Abundance',
      content: 'Mrs. Gable handed out a photocopied article on global ecosystems. The text was blurred, the black-and-white photos completely unintelligible blocks of dark ink.\n\n"Read the two paragraphs and answer the questions at the bottom," she instructed, sitting behind her desk to grade papers.\n\nMarcus placed the blurry paper face down. He reached into his pocket and slid out a phone held together by a thick rubber band. He kept it below the desk line, turned the brightness down, and loaded a live-feed satellite map from a university research site. He zoomed in on the deforestation of the Amazon, watching real-time data overlays cascade across the shattered glass of his screen. He bypassed the rationed, blurry paper entirely, drinking directly from an ocean of information the school couldn\'t control.',
    },
  },
  {
    number: 3,
    power: 'LABOR',
    title: 'Refusal of the Call',
    context: 'The anxiety of losing authority, trying to force "work" upon the student.',
    taoChapter: 43,
    taoChapterName: 'The Power of Non-Action',
    taoQuote: '"The softest thing in the universe overcomes the hardest thing in the universe. That without substance can enter where there is no room. Hence I know the value of non-action."',
    taoSource: 'Laozi, Tao Te Ching, Ch. 43 (S. Mitchell, Trans., 1988)',
    meditations: [
      {
        id: 'authority-3-1',
        question: 'Does forcing "labor" upon the student secretly mask my own anxiety of becoming obsolete as an authority figure?',
      },
      {
        id: 'authority-3-2',
        question: 'How can "non-action" (wu-wei) accomplish what forced effort and forced assignments cannot?',
      },
    ],
    setAndSetting: {
      description: 'A close-up of a student\'s hand gripping a pencil so tightly the knuckles are white. The forearm is marked with a fresh, angry red grease burn from a fast-food deep fryer. The student is mindlessly copying definitions from a heavy dictionary onto a lined sheet of paper. The teacher paces the aisles, a stopwatch hanging from a lanyard around his neck.',
      imagePath: '/images/authority/stage-03.webp',
    },
    scenario: {
      title: 'The Labor',
      content: '"Fifty vocabulary words, copied exactly from the glossary," Mr. Harris said, pacing the center aisle. "No talking. Keep working until the bell."\n\nLuis didn\'t read the words. He didn\'t process the definitions. His eyes were glazed over, his heavy eyelids drooping as his hand moved in a robotic, continuous motion. He was running purely on muscle memory, his forearm resting on the desk, the angry red burn from last night\'s shift at the drive-thru scraping against the spiral binding of his notebook.\n\nMr. Harris stopped at Luis\'s desk, looked at the half-filled page of copied text, and nodded in satisfaction. The graphite moved across the paper. The silence was maintained. The labor was successfully extracted.',
    },
  },
  {
    number: 4,
    power: 'CURIOSITY',
    title: 'Meeting the Mentor',
    context: 'The spark of self-driven interest that cannot be assigned or graded.',
    taoChapter: 15,
    taoChapterName: 'Waiting for Clarity',
    taoQuote: '"Do you have the patience to wait till your mud settles and the water is clear? Can you remain unmoving till the right action arises by itself?"',
    taoSource: 'Laozi, Tao Te Ching, Ch. 15 (S. Mitchell, Trans., 1988)',
    meditations: [
      {
        id: 'authority-4-1',
        question: 'Are we patient enough to hold space so the student\'s mental "mud" can settle, allowing their true curiosity to arise naturally?',
      },
      {
        id: 'authority-4-2',
        question: 'What changes in the dynamic when we wait for interest to spark independently instead of trying to ignite it by force?',
      },
    ],
    setAndSetting: {
      description: 'A sterile biology lab with broken sinks. A stack of fill-in-the-blank worksheets on cell structure sits on a desk. The student has pushed the worksheet entirely out of the way. She is hunched over the dusty windowsill, staring intently at the intricate wing pattern of a dead moth.',
      imagePath: '/images/authority/stage-04.webp',
    },
    scenario: {
      title: 'The Curiosity',
      content: 'The worksheet required labeling the parts of a plant cell. It lay blank on the corner of Elena\'s desk.\n\nShe had found a large, dead Luna moth on the windowsill. She had carefully carried it to her desk on a piece of scrap paper. With the tip of her mechanical pencil, she was gently separating the fragile antennae, her face inches from the insect, studying the pale green scales on its wings.\n\nMr. Vance walked down the aisle to collect the worksheets. He saw the blank paper. He saw Elena completely absorbed in the moth, entirely ignoring his lesson.\n\nVance didn\'t tap the desk. He didn\'t point to the worksheet. He silently reached into his lab coat, placed a small, scratchy magnifying glass next to the moth, and kept walking.',
    },
  },
  {
    number: 5,
    power: 'PLAY',
    title: 'Crossing the Threshold',
    context: 'Stepping into the sandbox of serious, self-directed discovery without institutional penalties.',
    taoChapter: 55,
    taoChapterName: 'The Childlike State',
    taoQuote: '"He who is in harmony with the Tao is like a newborn child. Its bones are soft, its muscles are weak, but its grip is powerful."',
    taoSource: 'Laozi, Tao Te Ching, Ch. 55 (S. Mitchell, Trans., 1988)',
    meditations: [
      {
        id: 'authority-5-1',
        question: 'Can we allow the classroom to become a space of childlike discovery, acting and observing without rigid expectations?',
      },
      {
        id: 'authority-5-2',
        question: 'How does removing the threat of a penalty transform a student\'s "work" into profound "play"?',
      },
    ],
    setAndSetting: {
      description: 'A classroom completely stripped of desks, resembling a makeshift junkyard. The district had defunded the science budget, leaving empty cabinets. Students are kneeling on the linoleum floor, using rubber bands, bent paperclips, heavy textbooks, and splintered pieces of broken chairs to build a complex, chaotic structure.',
      imagePath: '/images/authority/stage-05.webp',
    },
    scenario: {
      title: 'The Play',
      content: 'The official physics kits hadn\'t arrived. The requisition forms had been denied for the third year in a row.\n\nInstead of passing out a reading packet, Ms. Torres dumped a cardboard box of scavenged junk onto the center floor: zip ties, rubber bands, dowel rods, and empty soup cans.\n\n"Make it hold a textbook," she said.\n\nThere were no rubrics, no grades, and no instructions. For forty minutes, the room was a chaotic symphony of snapping rubber bands, collapsing towers, and loud arguments. When a tower of cans and zip ties completely collapsed, scattering across the room, the group of students didn\'t panic or look to Torres for a grade. They laughed, grabbed a roll of duct tape, and immediately started rebuilding the base. Torres sat on the radiator, just watching them work.',
    },
  },
  {
    number: 6,
    power: 'FRICTION',
    title: 'Tests, Allies, Enemies',
    context: 'The messy, beautiful process of self-directed failure and boundary testing.',
    taoChapter: 58,
    taoChapterName: 'The Edge of Growth',
    taoQuote: '"If a government is unobtrusive, the people will become pure and honest. [...] Bad fortune is what good fortune leans on, good fortune is what bad fortune hides in."',
    taoSource: 'Laozi, Tao Te Ching, Ch. 58 (S. Mitchell, Trans., 1988)',
    meditations: [
      {
        id: 'authority-6-1',
        question: 'How does stepping back allow the natural friction of failure to become the student\'s greatest, unmediated teacher?',
      },
      {
        id: 'authority-6-2',
        question: 'If "good fortune" hides in "bad fortune," how do we reframe failure as a necessary and safe edge of growth rather than a flaw?',
      },
    ],
    setAndSetting: {
      description: 'A moment of sudden failure. A rubber band snaps, and a scavenged structure collapses onto the floor with a loud clatter. The student freezes, bracing for a failing grade or a reprimand. The teacher, sitting nearby, just slowly turns the page of a book, doing absolutely nothing to fix it.',
      imagePath: '/images/authority/stage-06.webp',
    },
    scenario: {
      title: 'The Friction',
      content: 'The rubber band snapped with a sharp crack.\n\nThe soda-can bridge collapsed, scattering aluminum and tape across the floor with a deafening clatter. In most classrooms, this meant a failed project, a mess to clean up, and a lecture on following instructions.\n\nSarah froze, her hands still hovering in the air where the bridge had been. She looked over at Mr. Vance, bracing herself.\n\nMr. Vance was sitting at his desk, drinking coffee. He didn\'t look up. He didn\'t offer to help her fix it, he didn\'t sigh in frustration, and he didn\'t reach for his red pen. He simply turned the page of his book.\n\nSlowly, Sarah lowered her hands, picked up a dented can, and began re-threading the tape.',
    },
  },
  {
    number: 7,
    power: 'INITIATIVE',
    title: 'Approach to Inmost Cave',
    context: 'The student taking charge of navigating the subject matter without a predefined map.',
    taoChapter: 64,
    taoChapterName: 'The Journey Begins',
    taoQuote: '"A journey of a thousand miles starts under one\'s feet. He who acts defeats his own purpose; he who grasps loses."',
    taoSource: 'Laozi, Tao Te Ching, Ch. 64 (S. Mitchell, Trans., 1988)',
    meditations: [
      {
        id: 'authority-7-1',
        question: 'If we stop forcing the direction, how does the student\'s true journey begin organically from exactly where they stand?',
      },
      {
        id: 'authority-7-2',
        question: 'What vital autonomy do we strip away when we try to map out every step of their understanding in advance?',
      },
    ],
    setAndSetting: {
      description: 'A blank whiteboard. A district-approved map of the city hangs next to it, showing pristine zoning lines and shopping districts. A student completely ignores the printed map. He is holding three different colored markers, aggressively drawing a chaotic, overlapping web on the whiteboard, charting a completely different version of the city.',
      imagePath: '/images/authority/stage-07.webp',
    },
    scenario: {
      title: 'The Initiative',
      content: 'The prompt asked students to identify the city\'s commercial centers on the printed map.\n\nTrey walked right past the stack of maps. He picked up a black marker and drew a rough, jagged outline of the city limits on the whiteboard. He grabbed a red marker and drew three heavy circles.\n\n"Food deserts," Trey said aloud, capping the red marker.\n\nHe grabbed a blue marker and drew dotted lines connecting the circles, actively bypassing the highway routes. "Safe walking paths to the corner stores that accept EBT." He drew two heavy black X\'s on the major intersections. "Police checkpoints."\n\nHe completely abandoned the official curriculum, drafting a survival map of the city as he actually lived it.',
    },
  },
  {
    number: 8,
    power: 'MEANING',
    title: 'The Supreme Ordeal',
    context: 'The exact moment the inert subject matter collides with the student\'s "Self".',
    taoChapter: 1,
    taoChapterName: 'The Unnameable',
    taoQuote: '"The tao that can be told is not the eternal Tao. The name that can be named is not the eternal name."',
    taoSource: 'Laozi, Tao Te Ching, Ch. 1 (S. Mitchell, Trans., 1988)',
    meditations: [
      {
        id: 'authority-8-1',
        question: 'When meaning is intimately discovered rather than externally told, how does its impact change within the student\'s mind?',
      },
      {
        id: 'authority-8-2',
        question: 'How does a student finding their own meaning transcend any definition or rubric we could provide them?',
      },
    ],
    setAndSetting: {
      description: 'A quiet classroom. Dust motes drift in the sunlight from the windows. A heavy literature anthology lies open on a desk. A student\'s finger rests on a specific stanza of a poem about displacement. Her eyes are not on the page. She is staring blankly at the brick wall, a profound, heavy realization settling across her face.',
      imagePath: '/images/authority/stage-08.webp',
    },
    scenario: {
      title: 'The Meaning',
      content: 'The class was supposed to be answering the five comprehension questions at the end of the chapter.\n\nMaya hadn\'t touched her pencil. Her finger was resting on a photograph from 1935—a family standing next to a rusted truck, all their belongings piled in the back, an eviction notice nailed to the door of their home.\n\nMaya slowly pulled her hand back. She looked down at her own backpack, bulging with everything she owned because her family had been locked out of their apartment that morning. She looked back at the faces of the people in the eighty-year-old photograph. The chronological distance evaporated. She quietly closed the textbook, leaving the comprehension questions completely blank.',
    },
  },
  {
    number: 9,
    power: 'OWNERSHIP',
    title: 'Seizing the Reward',
    context: 'The knowledge is no longer borrowed; it belongs to the student.',
    taoChapter: 9,
    taoChapterName: 'Stepping Back',
    taoQuote: '"Fill your bowl to the brim and it will spill. Keep sharpening your knife and it will blunt. [...] Do your work, then step back. The only path to serenity."',
    taoSource: 'Laozi, Tao Te Ching, Ch. 9 (S. Mitchell, Trans., 1988)',
    meditations: [
      {
        id: 'authority-9-1',
        question: 'If our ultimate goal is the student\'s ownership of knowledge, how do we practice the difficult art of doing our work and then stepping completely back?',
      },
      {
        id: 'authority-9-2',
        question: 'In what ways does clinging to our contribution as teachers prevent the student from fully claiming the reward as their own?',
      },
    ],
    setAndSetting: {
      description: 'A stark role reversal. A student stands confidently at the front of the classroom, his hands stained permanently black with motor oil. He is holding up a rusted, blackened spark plug. The teacher is sitting in a cramped student desk in the third row, taking notes in a small pad, giving the student his undivided attention.',
      imagePath: '/images/authority/stage-09.webp',
    },
    scenario: {
      title: 'The Ownership',
      content: 'The chemistry textbook chapter was on combustion reactions.\n\nLeo stood at the front board. He set the rusted spark plug on the podium. He picked up a piece of chalk and quickly drew the chemical equation for the ignition of gasoline, a process he managed every night from 4 PM to midnight at his uncle\'s auto shop.\n\n"If the carbon buildup here gets too thick," Leo said, pointing to the tip of the spark plug, "the reaction chokes. The engine misfires."\n\nMr. Reed didn\'t interrupt. He didn\'t correct Leo\'s terminology. He sat in a plastic student chair in the third row, his notebook open, writing down exactly what Leo was saying.',
    },
  },
  {
    number: 10,
    power: 'VALIDATION',
    title: 'The Road Back',
    context: 'The teacher recognizing and honoring the student\'s internal truth.',
    taoChapter: 49,
    taoChapterName: 'True Trust',
    taoQuote: '"The Master has no mind of her own. She works with the mind of the people. [...] She trusts people who are trustworthy. She also trusts people who aren\'t trustworthy. This is true trust."',
    taoSource: 'Laozi, Tao Te Ching, Ch. 49 (S. Mitchell, Trans., 1988)',
    meditations: [
      {
        id: 'authority-10-1',
        question: 'Can I genuinely validate a student\'s internal truth even if it directly contradicts my own perspective?',
      },
      {
        id: 'authority-10-2',
        question: 'How does extending unwavering trust cultivate and validate the student\'s own inner compass?',
      },
    ],
    setAndSetting: {
      description: 'A teacher\'s desk covered in grading. A handwritten essay rests on top. The title, "The Myth of the Dream," is underlined twice. The essay argues fiercely against the core narrative of the curriculum. The teacher\'s hand enters the frame, writing a single word at the top of the paper in bold blue ink: "Unflinching."',
      imagePath: '/images/authority/stage-10.webp',
    },
    scenario: {
      title: 'The Validation',
      content: 'The district prompt was standard: Write a persuasive essay on the attainability of the American Dream.\n\nMarcus handed in three pages titled The American Scam. His paragraphs didn\'t mention upward mobility or homeownership. They detailed the exact interest rates of the payday loan center on the corner of 8th Avenue, and the mechanics of medical debt that had recently cost his mother their apartment.\n\nMs. Lin read the essay at her desk. It directly contradicted the district\'s provided rubric. It lacked the mandated optimistic conclusion.\n\nMs. Lin picked up her pen. She didn\'t write "off topic." She didn\'t correct Marcus\'s cynical tone. She wrote 100% - Publish this at the top of the page, walked to the bulletin board in the hallway, and pinned it dead center for everyone to read.',
    },
  },
  {
    number: 11,
    power: 'SOVEREIGNTY',
    title: 'Resurrection',
    context: 'The definitive shift of power: the student claims absolute authority over their own perspective.',
    taoChapter: 57,
    taoChapterName: 'Letting Go',
    taoQuote: '"Therefore the Master says: I let go of the law, and people become honest. [...] I let go of all desire for the common good, and the good becomes common as grass."',
    taoSource: 'Laozi, Tao Te Ching, Ch. 57 (S. Mitchell, Trans., 1988)',
    meditations: [
      {
        id: 'authority-11-1',
        question: 'By entirely letting go of our desire to dictate the narrative, how does the student\'s true sovereignty emerge as naturally as grass?',
      },
      {
        id: 'authority-11-2',
        question: 'What internal shift happens when we stop interfering entirely with the student\'s internal governance?',
      },
    ],
    setAndSetting: {
      description: 'A tense confrontation in the hallway. A vice-principal in a sharp suit stands pointing a rigid finger at a controversial, unsanctioned art project covering the lockers. A student stands firmly between the administrator and the art. The teacher leans casually against the doorframe a few feet away, sipping coffee, refusing to intervene or speak for the student.',
      imagePath: '/images/authority/stage-11.webp',
    },
    scenario: {
      title: 'The Sovereignty',
      content: 'Vice-Principal Harmon stopped in the middle of the hallway. He pointed at the massive mural taped to the lockers—a stark, graphic timeline of local police violence drawn on butcher paper.\n\n"Who authorized this?" Harmon demanded, looking directly at Mr. Davis.\n\nMr. Davis took a slow sip from his travel mug. He didn\'t say a word. He didn\'t look at Harmon.\n\nElias stepped forward from the group of students. He planted his feet directly in front of the mural, crossing his arms. He wore a faded, ripped hoodie, but his posture was immovable steel.\n\n"I did," Elias said, looking Harmon dead in the eye.\n\nHarmon waited for the teacher to apologize or take control of the situation. Mr. Davis just leaned his shoulder against the doorframe, completely relinquishing the space, and the power, to Elias.',
    },
  },
  {
    number: 12,
    power: 'AUTHORITY',
    title: 'Return with the Elixir',
    context: 'Learning is put fully back into the student\'s hands.',
    taoChapter: 51,
    taoChapterName: 'Creating without Possessing',
    taoQuote: '"The Tao gives birth to them, nourishes them, maintains them, cares for them [...] creating without possessing, acting without expecting, guiding without interfering."',
    taoSource: 'Laozi, Tao Te Ching, Ch. 51 (S. Mitchell, Trans., 1988)',
    meditations: [
      {
        id: 'authority-12-1',
        question: 'How do we guide without interfering, allowing the student to hold the ultimate authority of their own mind?',
      },
      {
        id: 'authority-12-2',
        question: 'If we create an educational space without demanding to possess it, how does the student naturally step into their own leadership?',
      },
    ],
    setAndSetting: {
      description: 'A classroom operating entirely without a center of gravity. The bell rings, but the teacher remains seated by the window, reading a book. Without a single command, the students automatically push their desks into a circle. One opens a textbook, another grabs a marker and walks to the board. The system is running entirely on its own.',
      imagePath: '/images/authority/stage-12.webp',
    },
    scenario: {
      title: 'The Authority',
      content: 'The morning bell screamed through the PA system.\n\nMs. Lin did not stand up. She did not walk to the whiteboard or ask for quiet. She remained sitting on the radiator by the window, an open paperback resting on her knee.\n\nWithout waiting for a cue, Marcus dragged his desk to the center of the room. Sarah and Trey immediately followed, forming a tight circle of six desks. Sarah dropped her notebook in the center, tapped a paragraph they had debated yesterday, and started talking. Trey walked to the board and started charting the argument.\n\nMs. Lin turned the page of her book. The classroom had become a living organism, fully breathing, navigating its own curriculum. She was no longer the engine; she was just the walls holding the space.',
    },
  },
];

export default authorityStages;
