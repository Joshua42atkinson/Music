import puppeteer from 'puppeteer';

(async () => {
  console.log("Launching browser...");
  try {
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
    page.on('pageerror', err => console.error('BROWSER ERROR:', err.toString()));
    page.on('requestfailed', request => console.error('REQUEST FAILED:', request.url(), request.failure().errorText));
    
    console.log("Navigating to http://localhost:5173/workbook ...");
    await page.goto('http://localhost:5173/workbook', { waitUntil: 'networkidle2', timeout: 10000 });
    
    console.log("Done.");
    await browser.close();
  } catch(e) {
    console.error("Puppeteer script failed:", e);
  }
})();
