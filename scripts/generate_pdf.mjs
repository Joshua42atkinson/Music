import fs from 'fs';
import { marked } from 'marked';
import puppeteer from 'puppeteer';

const mdPath = '/home/joshua/.gemini/antigravity/brain/6d7b15dd-dd95-4cf2-9a45-d8799b141962/artifacts/12M_Executive_Summary.md';
const md = fs.readFileSync(mdPath, 'utf-8');
const content = marked.parse(md);

const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
      padding: 60px; 
      color: #1a1a1a; 
      line-height: 1.6; 
    }
    h1 { 
      color: #6d28d9; 
      font-size: 32px; 
      border-bottom: 3px solid #8b5cf6; 
      padding-bottom: 10px; 
      margin-bottom: 10px;
    }
    h2 { 
      color: #4c1d95; 
      font-size: 22px; 
      margin-top: 30px; 
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 5px;
    }
    p, li {
      font-size: 14px;
      color: #374151;
    }
    strong { 
      color: #5b21b6; 
    }
    ul {
      margin-top: 5px;
    }
    li { 
      margin-bottom: 8px; 
    }
    .header-sub {
      font-size: 16px;
      color: #6b7280;
      margin-bottom: 40px;
      font-style: italic;
    }
  </style>
</head>
<body>
  ${content}
</body>
</html>
`;

(async () => {
  try {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    console.log('Setting content...');
    await page.setContent(html, { waitUntil: 'networkidle0' });
    console.log('Generating PDF...');
    await page.pdf({ 
      path: './public/assets/Voix_Vive_12M_Executive_Summary.pdf', 
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px' }
    });
    await browser.close();
    console.log('PDF generated successfully at public/assets/Voix_Vive_12M_Executive_Summary.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
    process.exit(1);
  }
})();
