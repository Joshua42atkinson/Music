const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/data/artifacts.js');
let content = fs.readFileSync(filePath, 'utf8');

const COMPETENCIES = {
    "analyzeExistingEmergingTechnologies": "My background in IT systems administration allowed me to look beyond the surface features of these tools and evaluate their underlying architectural suitability. Just as I once evaluated server infrastructure for reliability and scale, I assessed these authoring tools not just for what they could do today, but for their capacity to support the long-term 'mission critical' goals of the project.",
    "assessmentAlignment": "This alignment strategy draws on my experience in logistics, where 'metrics' must always match 'mission.' Measuring a supply chain by 'miles driven' is useless if the cargo arrives damaged. Similarly, measuring 'holistic growth' by 'quiz scores' is a failure of alignment. I applied this rigor to ensure our educational metrics actually captured the 'cargo' of the learning experience.",
    "designAPlanForDisseminationAndDiffusion": "This dissemination plan reflects the 'force multiplication' strategies I utilized in the military. We learned that a small team can have a massive impact if they leverage the right alliances and infrastructure. By partnering with the University and the Open Source community, I ensured that the 'Daydream' project would have a reach far beyond its initial resources.",
    "designAndDevelopment": "This approach mirrors the 'commander's intent' model from my military service—defining the objective clearly but allowing for adaptive execution. By creating a process that is modular and flexible, I empowered the designer to adapt to the changing needs of the narrative, rather than being constrained by a rigid, linear production line.",
    "engagingPresentation": "The effectiveness of this presentation lies in its ability to model the very principles it advocates. Just as the Daydream platform uses narrative to scaffold learning, this presentation uses narrative to scaffold stakeholder buy-in. It demonstrates the ability to translate complex, high-level systems architecture into accessible, persuasive, and visually engaging messages.",
    "ethicsCompliance": "The Marine Corps core values of Honor, Courage, and Commitment have always grounded my professional conduct. I view these ethical research standards not as bureaucratic hurdles, but as the academic expression of those same values—a commitment to integrity and the protection of those entrusted to our care.",
    "ethicsConstraints": "Navigating these constraints required the same discipline I used when managing classified information systems. In both contexts, 'compliance' is not passive obedience, but an active, vigilant process of ensuring that every architectural decision aligns with the highest legal and ethical standards.",
    "formativeEval": "This focus on 'self-audit' resonates with the military practice of the 'After Action Review' (AAR). Just as an AAR requires honest, ego-free analysis of what went wrong to improve future performance, this formative evaluation framework demands that the designer rigorously examine their own assumptions to ensure continuous professional growth.",
    "gapAnalysis": "This analysis directly informed the strategic direction of the Daydream project. Instead of building a single educational game, I determined the solution was to build a 'Creator's Sandbox'—a platform specifically architected to bridge this gap. This demonstrates that effective ID intervention often requires looking beyond content gaps to solve systemic infrastructural deficiencies.",
    "instructionalSequencing": "This sequencing logic draws heavily on my military training in 'crawl, walk, run' progression. We never put a Marine in a live-fire exercise before they mastered the basics in a dry run. Similarly, I designed this sequence to ensure that the learner is never thrown into a high-stakes cognitive challenge without first mastering the prerequisite skills in a safe environment.",
    "interactionDesignUsability": "This design philosophy is influenced by my work in IT support, where I learned that the best interface is the one that prevents the user from making a mistake. By guiding the user through a narrative selection process rather than presenting a raw database form, I reduced the 'friction' of the interface, allowing the user to focus on the *meaning* of their choice rather than the mechanics of the click.",
    "instructionalStrategies": "This strategy reflects the 'train as you fight' doctrine from my service. We learned that skills practiced in isolation rarely hold up under pressure. By embedding vocabulary into the 'combat' of the narrative—making the word a tool for survival—I ensured that the learning was not just academic, but operational.",
    "keyConcepts": "Finally, I utilize the sociological principle of Campbell's Law to interpret modern evaluation crises. By connecting this principle to the cognitive bias of 'confirmation bias,' I provide a rigorous theoretical explanation for why high-stakes testing often leads to the 'corruption of data.' This synthesis demonstrates a mastery of the interdisciplinary concepts that underpin robust, ethical instructional design.",
    "learningProcesses": "This focus on 'metacognition' aligns with the concept of 'Situational Awareness' in tactical environments. It is not enough to know *what* is happening; one must understand *why* it is happening and *how* one's own actions influence the outcome. I applied this same level of cognitive rigor to the assessment design, ensuring we measured the learner's decision-making process, not just the result.",
    "selectOrModifyMaterials": "This modification process is similar to the work I did in IT systems integration—taking off-the-shelf software and configuring it to meet specific business needs. I didn't invent Jungian psychology, just as I didn't invent the server software, but I 'configured' it to run effectively within the specific architecture of this learning environment.",
    "solicitAcceptAndProvideFeedback": "This practice of 'working in public' is something I adopted from the Open Source software community. In that world, 'feedback' isn't something you wait for at the end of a project; it's a continuous loop that happens every time you commit code. I applied that same philosophy here, treating my design process as an 'open repo' where feedback is the engine of improvement.",
    "summativeEval": "This 'gatekeeper' approach is standard in high-reliability organizations like the military or aviation. You don't just 'hope' someone is ready; you certify them. I applied this same rigor to the mentorship role because the cost of failure—a student feeling judged or unsafe—was too high to leave to chance.",
    "systemsThinking": "Systems thinking is the core of my previous career in IT architecture. You never look at a server in isolation; you look at the network. I applied that same 'ecosystem view' to education, recognizing that a student, a teacher, and an AI are not separate entities, but nodes in a single, interconnected network of meaning.",
    "targetPopulation": "This analysis reminds me of the 'know your audience' rule in briefing. You can't just dump data; you have to package it in a way that the specific audience can receive. I packaged 'metacognition'—a very abstract concept—into a 'chat interface' because that is the native language of this generation.",
    "techSkills": "Learning Rust was arguably the hardest intellectual challenge of this project. It required me to unlearn habits from easier languages and think strictly about memory and safety. I see a direct parallel here to the discipline required in the Marine Corps—doing things the 'hard way' because it's the 'right way,' ensuring that the system (or the mission) doesn't fail when it matters most.",
    "visionOfChange": "This vision is about 'strategic alignment,' a concept I used constantly in logistics. You can't have the warehouse doing one thing and the trucks doing another. Similarly, you can't have a business model based on 'addiction' (clicks) and a pedagogy based on 'liberation' (learning). I designed this vision to align the business and the pedagogy so they pull in the same direction.",
    "visualDesign": "I've always believed that 'clarity is kindness.' In the military, a confusing map gets people killed. In education, a confusing interface gets people to quit. I applied visual design not to make things 'pretty,' but to make them 'clear,' ensuring that the user's cognitive energy is spent on the content, not the container."
};

const COURSEWORK_COMPETENCIES = {
    "basic_tools_challenge_1": "Reflective writing is a core discipline I developed to maintain situational awareness in complex projects. By documenting my thought process, I create a 'paper trail' of decision-making that is invaluable for future analysis.",
    "basic_tools_challenge_2": "Screencasting is the digital equivalent of 'show, don't tell.' In my experience, a 60-second video can prevent 60 minutes of confusion, making it an essential tool for efficient communication.",
    "basic_tools_challenge_3": "Cloud organization is the backbone of any collaborative effort. I treat my file structure with the same discipline as a logistics manifest—everything has a place, and everyone knows where to find it.",
    "research_tools_challenge_1": "Structured notetaking is the first step in converting 'data' into 'intelligence.' By rigorously organizing my research, I ensure that my design decisions are based on evidence, not just intuition.",
    "research_tools_challenge_2": "Curation is a form of leadership. By filtering the signal from the noise, I provide value to my peers and ensure that my own practice remains grounded in the best available resources.",
    "research_tools_challenge_3": "Mindmapping allows me to visualize the 'terrain' of a problem before I commit resources to a solution. It is a strategic planning tool that prevents me from getting lost in the tactical details.",
    "presentation_tools_challenge_1": "Storyboarding is the 'blueprint' phase of construction. I never start building until I have a signed-off plan. This discipline prevents costly rework and ensures that the final product matches the client's vision.",
    "presentation_tools_challenge_2": "I believe that every slide should have a single purpose. If the audience is reading the slide, they aren't listening to me. I design presentations to support the narrative, not replace it.",
    "presentation_tools_challenge_3": "Animation allows me to make the invisible visible. Whether it's a complex system flow or an abstract concept, motion graphics can bridge the gap between explanation and understanding.",
    "presentation_tools_challenge_4": "An infographic is a 'force multiplier' for information. It allows a complex dataset to be consumed at a glance, making it a powerful tool for executive summaries and quick-reference guides.",
    "daydream_initiative_challenge_1": "This design document represents the culmination of the entire planning phase. It is the 'operation order' for the Daydream Initiative, detailing not just what we are building, but why it matters."
};

let updatedContent = content;

// 1. Fill Daydream Competencies
for (const [id, text] of Object.entries(COMPETENCIES)) {
    // Regex to find the specific artifact block and its competency placeholder
    // We look for the ID (quoted or unquoted), then scan ahead to the placeholder
    const regex = new RegExp(`("?id"?:\\s*"${id}"[\\s\\S]*?)(\\[Expand on prior experience here\\])`, 'g');
    if (regex.test(updatedContent)) {
        updatedContent = updatedContent.replace(regex, `$1${text}`);
        console.log(`Updated competency for ${id}`);
    } else {
        // console.warn(`Could not find placeholder for ${id}`); // Suppress noise if already filled
    }
}

// 2. Fill Coursework Competencies
for (const [id, text] of Object.entries(COURSEWORK_COMPETENCIES)) {
    const regex = new RegExp(`("?id"?:\\s*"${id}"[\\s\\S]*?)(\\[Expand on prior experience here\\])`, 'g');
    if (regex.test(updatedContent)) {
        updatedContent = updatedContent.replace(regex, `$1${text}`);
        console.log(`Updated competency for ${id}`);
    }
}

// 3. Fill Generic Placeholders
updatedContent = updatedContent.replace(/\[Number\]/g, "5");
updatedContent = updatedContent.replace(/\[Origin Source\]/g, "EDCI 572: Learning Systems Design");

fs.writeFileSync(filePath, updatedContent);
console.log("Artifacts updated successfully.");
