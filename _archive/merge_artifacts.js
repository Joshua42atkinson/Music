import fs from 'fs';
import { ARTIFACTS as existingArtifacts } from './client/src/data/artifacts.js'; // This won't work directly in node without package.json type module or .mjs extension.
// I will read the file as text and parse it manually to avoid module issues in this temporary script.

const rawDataPath = './client/src/data/portfolioData.json';
const existingArtifactsPath = './client/src/data/artifacts.js';

const rawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));
const existingFileContent = fs.readFileSync(existingArtifactsPath, 'utf8');

// Extract the array part from the JS file string (hacky but effective for this one-off)
const startMarker = 'export const ARTIFACTS = [';
const endMarker = '];';
const startIndex = existingFileContent.indexOf(startMarker) + startMarker.length;
const endIndex = existingFileContent.lastIndexOf(endMarker);

// We'll just construct the new objects and append them to the text.
// Actually, let's just reconstruct the file.

// Helper to map category IDs to full names
const categoryMap = {
    'foundations': 'Professional Foundations',
    'planning': 'Planning & Analysis',
    'design': 'Design & Development',
    'evaluation': 'Evaluation & Implementation',
    'research': 'Applying ID Research & Theory' // Assuming this maps
};

const newArtifacts = [];

rawData.badges.forEach(badge => {
    badge.artifacts.forEach((artifact, index) => {
        // Skip if it's the Daydream one we already have? 
        // existing artifacts.js has "Daydream Initiative" stuff. 
        // Let's include them but maybe check for duplicates by title?
        // The existing ones have specific IDs.

        const category = categoryMap[badge.categoryId] || "Professional Foundations";

        // Create HTML reflection
        const reflectionHtml = `<p>${artifact.reflection.content.replace(/\n/g, '</p><p>')}</p>
    <div class="mt-4 p-4 bg-indigo-950/30 rounded border border-indigo-500/30">
      <strong class="text-indigo-300">Competency Alignment:</strong>
      <p class="text-sm text-slate-300 mt-1">${artifact.reflection.competency_alignment}</p>
    </div>`;

        newArtifacts.push({
            id: `${badge.id}_challenge_${index + 1}`,
            title: artifact.title, // e.g. "Challenge 1: Reflective Writing"
            challenge: artifact.reflection.challenge,
            category: category,
            iconPath: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4", // Generic settings icon
            summary: artifact.summary,
            reflection: reflectionHtml,
            linkText: "View Artifact Details",
            linkUrl: "#" // We don't have real links for these yet
        });
    });
});

// Generate new file content
// We will replace the existing ARTIFACTS array with the merged one.
// Since I can't easily eval the existing file, I'll use a regex to insert before the closing bracket of the array.

const newArtifactsString = newArtifacts.map(a => JSON.stringify(a, null, 4)).join(',\n    ');

const newContent = existingFileContent.replace(
    /export const ARTIFACTS = \[\s*([\s\S]*?)\];/m,
    (match, p1) => {
        return `export const ARTIFACTS = [\n    ${p1.trim()},\n    ${newArtifactsString}\n];`;
    }
);

fs.writeFileSync(existingArtifactsPath, newContent);
console.log(`Added ${newArtifacts.length} new artifacts to artifacts.js`);
