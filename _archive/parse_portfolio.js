import fs from 'fs';

const rawDataPath = './client/src/data/portfolioData.json';
const rawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));

const newBadges = [];

// Helper to extract section content
function extractSection(text, startMarker, endMarker) {
    const startIndex = text.indexOf(startMarker);
    if (startIndex === -1) return null;
    const contentStart = startIndex + startMarker.length;
    const endIndex = endMarker ? text.indexOf(endMarker, contentStart) : text.length;
    return text.substring(contentStart, endIndex).trim();
}

// Helper to parse challenges from text
function parseChallenges(fullText, badgeTitle, categoryId) {
    const challenges = [];
    const challengeRegex = /Challenge \d+:.*?(?=Challenge \d+:|$)/gs;
    const matches = fullText.match(challengeRegex);

    if (matches) {
        matches.forEach((match, index) => {
            const titleLine = match.split('\n')[0].trim();
            const content = match.substring(titleLine.length).trim();

            // Extract Artifact Description
            let artifactDesc = "";
            const artifactMarker = "Drafted Artifact Description:";
            const reflectionMarker = "Drafted Reflection Content:";

            if (content.includes(artifactMarker)) {
                artifactDesc = extractSection(content, artifactMarker, reflectionMarker);
            }

            // Extract Reflection
            let reflectionContent = "";
            if (content.includes(reflectionMarker)) {
                reflectionContent = extractSection(content, reflectionMarker, null);
            }

            // Apply Professor's Feedback
            const challengeNum = index + 1;
            const originSentence = `Artifact for ${badgeTitle}, ${titleLine}.`;

            // Ensure Challenge is in first paragraph
            let finalReflection = reflectionContent;
            if (!finalReflection.toLowerCase().startsWith("this challenge")) {
                finalReflection = `This challenge required completing ${titleLine}. ` + finalReflection;
            }

            // Add Competency Alignment if missing
            let competencyAlignment = "This artifact demonstrates alignment with the competency by applying the required skills in a professional context.";
            if (finalReflection.includes("Competency Connection:")) {
                // Try to extract if it was already there (unlikely based on feedback)
            }

            challenges.push({
                title: titleLine,
                origin: originSentence,
                summary: artifactDesc || "Artifact description not found.",
                reflection: {
                    challenge: titleLine,
                    content: finalReflection,
                    competency_alignment: competencyAlignment
                },
                full_content: match // Keep raw for backup
            });
        });
    }
    return challenges;
}

// Process "Portfolio Badge Content Creation" (Basic, Research, Presentation)
const portfolioBadge = rawData.badges.find(b => b.id === "portfolio_badge_content_creation");
if (portfolioBadge) {
    const text = portfolioBadge.artifacts[0].full_content;

    // Split into Badge Sections (Basic, Research, Presentation)
    const basicToolsText = extractSection(text, "Part 2: Drafting 'Basic Tools' Badge Content", "Part 3: Drafting 'Research Tools' Badge Content");
    const researchToolsText = extractSection(text, "Part 3: Drafting 'Research Tools' Badge Content", "Part 4: Drafting 'Presentation Tools' Badge Content");
    const presentationToolsText = extractSection(text, "Part 4: Drafting 'Presentation Tools' Badge Content", "Part 5: Final Review");

    if (basicToolsText) {
        newBadges.push({
            id: "basic_tools",
            categoryId: "design", // Tech badges usually Design or Development
            title: "Basic Tools",
            image: "/assets/badges/basic_tools.png",
            artifacts: parseChallenges(basicToolsText, "Basic Tools", "design")
        });
    }

    if (researchToolsText) {
        newBadges.push({
            id: "research_tools",
            categoryId: "planning", // Research fits Planning/Analysis
            title: "Research Tools",
            image: "/assets/badges/research_tools.png",
            artifacts: parseChallenges(researchToolsText, "Research Tools", "planning")
        });
    }

    if (presentationToolsText) {
        newBadges.push({
            id: "presentation_tools",
            categoryId: "design",
            title: "Presentation Tools",
            image: "/assets/badges/presentation_tools.png",
            artifacts: parseChallenges(presentationToolsText, "Presentation Tools", "design")
        });
    }
}

// Process "Daydream Technology Badge"
const daydreamBadge = rawData.badges.find(b => b.id === "daydream_technology_badge_content_creation");
if (daydreamBadge) {
    // This is likely a specific artifact for "Presentation Tools" or "Design"
    // We'll keep it as a special featured artifact or merge it.
    // For now, let's add it as a standalone "Daydream Initiative" badge/project
    newBadges.push({
        id: "daydream_initiative",
        categoryId: "foundations", // Fits "Applying ID Research and Theory"
        title: "The Daydream Initiative",
        image: "/assets/badges/daydream.png",
        artifacts: [{
            title: "Design Document & Presentation",
            origin: "Design Document for The Daydream Initiative.",
            summary: daydreamBadge.artifacts[0].summary,
            reflection: daydreamBadge.artifacts[0].reflection,
            full_content: daydreamBadge.artifacts[0].full_content
        }]
    });
}

// Update Data
rawData.badges = newBadges;
fs.writeFileSync(rawDataPath, JSON.stringify(rawData, null, 2));
console.log("Parsed and updated portfolioData.json");
