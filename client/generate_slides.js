import pptxgen from "pptxgenjs";
import fs from "fs";
import impactStages from './src/data/impactData.js';
import authorityStages from './src/data/authorityData.js';
import selfStages from './src/data/selfData.js';

async function generateDeck(title, stages, outputFile) {
    let pres = new pptxgen();
    pres.layout = 'LAYOUT_16x9';

    // Slideology Palette (Happy Sky Blue & Burnt Orange)
    const bgSkyBlue = 'BAE6FD'; // Happy, vibrant powdery sky blue
    const textDeepNavy = '172554'; // Harmonized deep navy for primary text/quotes
    const textSubtleBlue = '1E40AF'; // Medium-dark blue for subtitles
    const textBurntOrange = 'C2410C'; // Rich burnt orange

    // Title Slide
    let titleSlide = pres.addSlide();
    titleSlide.background = { color: bgSkyBlue };
    titleSlide.addText(`MODULE: ${title.toUpperCase()}`, { 
        x: 1, y: 2.4, w: 8, h: 1, fontSize: 48, color: textDeepNavy, align: 'center', bold: true, fontFace: 'Arial'
    });
    titleSlide.addText('The Conscious Framework', { 
        x: 1, y: 3.5, w: 8, h: 1, fontSize: 24, color: textBurntOrange, align: 'center', fontFace: 'Arial'
    });

    for (const stage of stages) {
        let slide = pres.addSlide();
        slide.background = { color: bgSkyBlue };

        // 1. The Visual Anchor (Left Half)
        const imagePathWebp = `./public${stage.setAndSetting.imagePath}`;
        const imagePathPng = imagePathWebp.replace('.webp', '.png');
        
        if (fs.existsSync(imagePathPng)) {
            // Full bleed on the left half of the slide
            slide.addImage({ path: imagePathPng, x: 0, y: 0, w: 5, h: 5.625, sizing: { type: 'cover' } });
        } else {
            // Placeholder if image doesn't exist yet
            slide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 5, h: 5.625, fill: { color: '7DD3FC' } });
            slide.addText('Image Placeholder', { x: 0, y: 2.5, w: 5, h: 0.5, color: textDeepNavy, align: 'center' });
        }

        // 2. The Clean Typography Stack (Right Half)
        const stageNum = stage.number < 10 ? '0' + stage.number : stage.number;
        
        slide.addText(`STAGE ${stageNum}`, { 
            x: 5.3, y: 1.2, w: 4.4, h: 0.4, fontSize: 14, color: textSubtleBlue, bold: true, fontFace: 'Arial'
        });
        
        // Power word is now Burnt Orange
        slide.addText(stage.power, { 
            x: 5.3, y: 1.6, w: 4.4, h: 0.8, fontSize: 28, color: textBurntOrange, bold: true, fontFace: 'Arial'
        });

        slide.addText(stage.title, { 
            x: 5.3, y: 2.4, w: 4.4, h: 0.4, fontSize: 18, color: textSubtleBlue, italic: true, fontFace: 'Georgia'
        });

        // The philosophical anchor (Deep Navy)
        slide.addText(stage.taoQuote, { 
            x: 5.3, y: 3.0, w: 4.4, h: 2.0, fontSize: 16, color: textDeepNavy, valign: 'top', fontFace: 'Georgia'
        });

        // 3. Offload Narrative to Speaker Notes for Voiceover
        const notes = `${stage.scenario.title}.\n\n${stage.scenario.content}\n\nMeditation One. ${stage.meditations[0].question}\n\nMeditation Two. ${stage.meditations[1].question}`;
        slide.addNotes(notes);
    }

    await pres.writeFile({ fileName: outputFile });
    console.log(`Successfully generated ${outputFile}`);
}

async function main() {
    console.log("Starting Masterclass generation with sky blue palette...");
    await generateDeck('Impact', impactStages, 'Impact_Masterclass.pptx');
    await generateDeck('Authority', authorityStages, 'Authority_Masterclass.pptx');
    await generateDeck('The Self', selfStages, 'Self_Masterclass.pptx');
    console.log("All professional slide decks generated successfully! Ready for Google Vids import.");
}

main().catch(console.error);
