const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Ensure cheerio is installed for parsing
try {
  require.resolve('cheerio');
} catch (e) {
  console.log('Installing cheerio...');
  execSync('npm install cheerio', { stdio: 'inherit' });
}

const cheerio = require('cheerio');

const BASE_URL = 'https://bertrandguitarstudio.duetpartner.com';
const DATA_DIR = path.join(__dirname, 'data', 'bertrand_raw_data');
const RESOURCES_DIR = path.join(DATA_DIR, 'resources');
const POSTS_DIR = path.join(DATA_DIR, 'posts');

// Create directories
[DATA_DIR, RESOURCES_DIR, POSTS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

async function downloadFile(url, destPath) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Unexpected status ${res.status}`);
    const buffer = await res.arrayBuffer();
    fs.writeFileSync(destPath, Buffer.from(buffer));
    console.log(`Downloaded: ${path.basename(destPath)}`);
  } catch (err) {
    console.error(`Error downloading ${url}:`, err.message);
  }
}

async function scrapeResources() {
  console.log('Scraping resources...');
  const res = await fetch(`${BASE_URL}/resources`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const downloadLinks = [];
  $('a[href*="download=true"]').each((i, el) => {
    let href = $(el).attr('href');
    if (!href.startsWith('http')) href = BASE_URL + (href.startsWith('/') ? href : '/' + href);
    let filename = $(el).text().trim() || `resource_${i}`;
    
    // Attempt to extract filename from URL if text is empty or just generic
    if (filename.includes('\n')) filename = filename.split('\n')[0].trim();
    // remove invalid chars
    filename = filename.replace(/[/\\?%*:|"<>]/g, '-');
    
    // Guess extension if missing
    if (!filename.match(/\.[a-zA-Z0-9]{3,4}$/)) {
        if (href.includes('.pdf')) filename += '.pdf';
        else if (href.includes('.png')) filename += '.png';
        else if (href.includes('.jpg')) filename += '.jpg';
    }

    downloadLinks.push({ url: href, filename });
  });

  // Unique links
  const unique = [];
  const seen = new Set();
  downloadLinks.forEach(item => {
      if (!seen.has(item.url)) {
          seen.add(item.url);
          unique.push(item);
      }
  });

  console.log(`Found ${unique.length} resources to download.`);
  for (const item of unique) {
    await downloadFile(item.url, path.join(RESOURCES_DIR, item.filename));
  }
}

async function scrapePosts() {
  console.log('Scraping blog posts...');
  const res = await fetch(`${BASE_URL}/posts`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const postLinks = [];
  $('a[href*="postID="]').each((i, el) => {
    let href = $(el).attr('href');
    if (!href.startsWith('http')) href = BASE_URL + (href.startsWith('/') ? href : '/' + href);
    if (!postLinks.includes(href) && $(el).text().trim() !== 'Read More') {
        postLinks.push(href);
    }
  });

  console.log(`Found ${postLinks.length} posts to scrape.`);

  for (let i = 0; i < postLinks.length; i++) {
    const postUrl = postLinks[i];
    try {
        const postRes = await fetch(postUrl);
        const postHtml = await postRes.text();
        const post$ = cheerio.load(postHtml);
        
        // Find main content - duetpartner sites usually have a container
        // Looking for headers, paragraphs, iframes
        // Use index and URL path to ensure unique names
        const urlParts = postUrl.split('postID=');
        const postId = urlParts.length > 1 ? urlParts[1] : i;
        const cleanTitle = `post_${postId}_${i}`;
        
        let content = `# Post ${postId}\n\nURL: ${postUrl}\n\n`;
        
        // Find iframes for videos
        post$('iframe').each((j, iframe) => {
            content += `[EMBEDDED VIDEO]: ${post$(iframe).attr('src')}\n\n`;
        });

        // Try to get main text (very rough heuristic: look at paragraphs or main divs)
        // Duetpartner often uses a main `.body-content` or just inside `#main`
        const textContent = post$('body').text().replace(/\s+/g, ' ').trim();
        // Since getting exact selector is hard without DOM inspection, we just dump text of paragraphs
        let pText = '';
        post$('p, li').each((j, el) => {
            const t = post$(el).text().trim();
            if (t.length > 20) pText += t + '\n\n';
        });

        content += `## Extracted Text:\n${pText}`;

        fs.writeFileSync(path.join(POSTS_DIR, `${cleanTitle}.md`), content);
        console.log(`Saved post: ${cleanTitle}`);
    } catch (err) {
        console.error(`Error scraping post ${postUrl}:`, err.message);
    }
  }
}

async function main() {
  await scrapeResources();
  await scrapePosts();
  console.log('Datamining complete!');
}

main();
