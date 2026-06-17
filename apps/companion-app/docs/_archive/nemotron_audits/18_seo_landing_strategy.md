---
title: 18_seo_landing_strategy
status: archive
tags: []
date: 2026-06-14
---
# Voix Vive – Public‑Facing & SEO Action Plan  
*(Beta launch focus)*  

---  

## 1️⃣ What’s Currently in the `<head>`?  

| Element | Status (as of `public/index.html`) |
|---------|------------------------------------|
| `<title>` | **Missing** – falls back to Vite default (`vite-app`). |
| `<meta name="description">` | Not present. |
| Open Graph / Twitter Card tags (`og:`, `twitter:` ) | Absent → shared links show a generic preview (no image, no title). |
| Structured data JSON‑LD | None in the markup or injected via React Helmet. |
| Robots directive | No explicit rule – SPA is indexable by default; however you may want to **temporarily block** indexing while beta is private. |

*Result:* Search engines see a blank title/description and have no rich snippet data → low CTR from SERPs, poor social preview.

---  

## 2️⃣ Immediate Fixes (≤ 30 min)

### A. Add a static `<head>` scaffold in `public/index.html` that can be overridden by React‑Helmet on each route  

```html
<!-- public/index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- 1️⃣ Core SEO (will be overridden by Helmet on SPA routes) -->
    <title>Voix Vive – Online Guitar Academy</title>
    <meta
      name="description"
      content="Learn guitar with a somatic, breath‑first approach. Courses for adults: Song, Workbook & Studio. Free trial available."
    />

    <!-- 2️⃣ Open Graph / Twitter (fallback image) -->
    <meta property="og:title" content="Voix Vive – Online Guitar Academy" />
    <property="og:description"
      content="Somatic guitar lessons for adults – guided path + AI mentorship."
    />
    <property="og:image"
      content="https://voix-vive.com/assets/wordmark-img.png" /> <!-- adjust if different -->
    <property="og:url"
      content="https://voix-vive.com/" />
    <property="og:type"
      content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Voix Vive – Online Guitar Academy" />
    <meta name="twitter:description" content="Somatic guitar lessons for adults – guided path + AI mentorship.">
    <property="twitter:image"
      content="https://voix-vive.com/assets/wordmark-img.png" />

    <!-- 3️⃣ Structured data placeholder (JSON‑LD will be injected by Helmet) -->
    <script type="application/ld+json" id="voixvive-schema">
      {}
    </script>

    <!-- 4️⃣ Robots – remove for production, keep for dev/staging if needed -->
    <% if (process.env.NODE_ENV !== 'production') { %>
      <meta name="robots" content="noindex, nofollow">
    <% } %>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

> **Why this works:**  
> * The static tags give crawlers something to read before the SPA hydrates.  
> * React‑Helmet (see next step) will replace the `<title>`, `<meta description>`, OG tags, and the JSON‑LD block on each route, keeping the data fresh for SEO bots that execute JS (Google) and providing a solid fallback for those that don’t (some social crawlers).  

### B. Install & use **react‑helmet‑async** (compatible with React 18 & Vite)

```bash
npm i react-helmet-async
```

Wrap your app in `HelmetProvider` (`src/main.jsx`):

```jsx
import { HelmetProvider } from 'react-helmet-async';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
```

Now each page can set its own meta data.  

#### Example: LandingScreen.jsx – add Helmet block at the top

```jsx
import { Helmet } from 'react-helmet-async';

export default function LandingScreen() {
  const { locale, t } = useLocale();
  const localizedTitle = locale === 'fr' ? 'Voix Vive – Académie de guitare en ligne' : 'Voix Vive – Online Guitar Academy';
  const localizedDesc = locale === 'fr'
    ? 'Apprenez la guitare avec une approche somatique, respiration‑first. Cours pour adultes : Le Chant, Le Grimoire, Le Studio. Essai gratuit.'
    : 'Learn guitar with a somatic, breath‑first approach. Courses for adults: The Song, The Workbook, The Studio. Free trial.';

  return (
    <>
      <Helmet>
        <title>{localizedTitle}</title>
        <meta name="description" content={localizedDesc} />
        {/* OG – can reuse same values or tweak for social */}
        <property="og:title" content={localizedTitle} />
        <property="og:description" content={localizedDesc} />
        <property="og:image"
          content="https://voix-vive.com/assets/wordmark-img.png" />
        <property="og:url"
          content="https://voix-vive.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={localizedTitle} />
        <meta name="twitter:description" content={localizedDesc} />
        <property="twitter:image"
          content="https://voix-vive.com/assets/wordmark-img.png" />

        {/* JSON‑LD for MusicSchool */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MusicSchool",
            "name": localizedTitle,
            "url": "https://voix-vive.com/",
            "logo": "https://voix-vive.com/assets/wordmark-img.png",
            "description": localizedDesc,
            "sameAs": [
              "https://www.linkedin.com/company/voix-vive",
              "https://twitter.com/voixvive"
            ],
            "offers": {
              "@type": "Offer",
              "url": "https://voix-vive.com/auth",
              "priceCurrency": "USD",
              "price": "0",
              "itemCondition": "https://schema.org/NewCondition",
              "availability": "http://schema.org/InStock"
            },
            "course": [
              {
                "@type": "Course",
                "name": t('portal.song.name'),
                "description": t('portal.song.description'),
                "url": "https://voix-vive.com/song"
              },
              {
                "@type": "Course",
                "name": t('portal.workbook.name'),
                "description": t('portal.workbook.description'),
                "url": "https://voix-vive.com/workbook"
              },
              {
                "@type": "Course",
                "name": t('portal.player.name'),
                "description": t('portal.player.description'),
                "url": "https://voix-vive.com/player"
              }
            ]
          }, null, 2)}
        </script>
      </Helmet>

      {/* existing LandingScreen JSX … */}
    </>
  );
}
```

> **Impact:**  
> * Search engines now receive a meaningful title/description + structured data → richer SERP snippets (star‑rating‑ready, course carousel).  
> * Social platforms show a branded image, title, and description when the URL is shared.  

---  

## 3️⃣ Structured Data Opportunities (Music Academy)

| Schema Type | What to Include | Where to Inject |
|-------------|----------------|-----------------|
| `MusicSchool` (or `EducationalOrganization`) | `name`, `url`, `logo`, `description`, `sameAs` (social profiles), `offers` (free trial), `course` array | LandingScreen Helmet (see above) |
| `Course` (for each portal) | `name`, `description`, `url`, `educationalLevel` (`"beginner"`/`"intermediate"`), `timeRequired` (approx. weekly hours) | Same JSON‑LD block – repeat for Song, Workbook, Player |
| `FAQPage` | Common questions: “What is somatic guitar learning?”, “Do I need prior experience?”, “How does the AI mentor work?” | Create a `/faq` page or embed in Footer via Helmet |
| `BlogPosting` (if you add a blog) | `headline`, `image`, `datePublished`, `author` | Future – not required for beta |

**Tip:** Validate with Google’s Rich Results Test after deployment.

---  

## 4️⃣ Target Keywords & On‑Page Optimization  

| Keyword | Intent | Where to place (on LandingScreen) |
|---------|--------|------------------------------------|
| **online guitar lessons** | Informational / commercial | `<h1>` inside the wordmark area or a hero banner above the portals; repeat once in the manifesto body (natural language). |
| **somatic guitar** | Niche informational | Use in the **Academy Manifesto** title/subtitle and as a `data‑term` attribute for screen‑reader accessibility (`aria-label`). |
| **guitar for adults** | Commercial / local | Add a short badge or pill under the wordmark: “Adult‑focused • Somatic • AI‑enhanced”. Ensure the text is crawlable (not hidden in an image). |

*Implementation example (add above the portals):*

```jsx
<section className="hero-banner">
  <h1>Online Guitar Lessons for Adults</h1>
  <p className="tagline">Somatic, breath‑first learning with AI mentorship.</p>
  {/* CTA button that opens the Auth modal */}
  <AuthButton variant="primary" size="large" onClick={() => setShowCoaching(true)} />
</section>
```

Style it with a subtle background (`rgba(201,169,110,0.05)`) to keep the dark aesthetic but improve contrast for SEO crawlers.

---  

## 5️⃣ Conversion‑Focused Sections on the Landing Page  

| Section | Current Role | Recommended Tweak (impact ↑) |
|---------|--------------|------------------------------|
| **Hero / Wordmark** | Pure branding – no CTA. | Add a clear, above‑the‑fold **“Start Free Trial”** button (`AuthButton`) that triggers the signup modal. Use contrasting color (`#c9a96e` portal‑song hue) and micro‑animation (Framer Motion `whileTap`). |
| **Manifesto** | Educational story – good for trust. | Insert a **micro‑testimonial** carousel (2‑3 quotes from beta users) right after the manifesto body, using `<motion.div>` for fade‑in. Social proof lifts conversion ~15 %. |
| **Portals Grid** | Navigation to content areas. | Add a **small badge** (“Free access”) on the lower‑right corner of each portal card (CSS `::after`). Signals no cost upfront, reduces friction. |
| **Footer** | Minimal. | Include a **newsletter sign‑up** (`<input>` + button) linked to Supabase email collection; capture leads even if users don’t click a portal immediately. |

All added elements should be accessible: proper `aria-label`, focusable, and respect reduced‑motion prefers.

---  

## 6️⃣ Ideal Hero Section (above the fold)

```html
<section className="hero" style={{textAlign:'center', padding:'2rem 1rem'}}>
  {/* Wordmark logo – already exists */}
  <img src="/assets/wordmark-img.png" alt="Voix Vive logo" className="logo" />

  <h1>Online Guitar Lessons for Adults</h1>
  <p className="subtitle">Somatic, breath‑first learning + AI mentorship.</p>

  {/* Primary CTA */}
  <AuthButton
    variant="primary"
    size="large"
    onClick={() => setShowCoaching(true)}
    data-testid="hero-cta"
  >
    Start Free Trial
  </AuthButton>

  {/* Secondary cue – scroll down to portals */}
  <motion.p
    whileHover={{scale:1.05}}
    whileTap={{scale:0.95}}
    className="mt-4 text-sm opacity-70"
  >
    Scroll to explore the Song, Workbook & Studio
  </motion.p>
</section>
```

*Why it works:*  
- **Clear value proposition** (keyword‑rich headline).  
- **Immediate CTA** reduces bounce and drives sign‑ups.  
- **Visual hierarchy** guides the eye to the portal grid after the hero.

---  

## 7️⃣ Social Sharing Preview (OG/Twitter)

| Platform | Desired Image | Title (≤ 60 chars) | Description (≤ 120 chars) |
|----------|---------------|--------------------|---------------------------|
| Facebook / LinkedIn | `wordmark-img.png` (or a custom 1200×630 px banner showing a guitarist breathing) | “Voix Vive – Somatic Guitar Academy” | “Learn guitar with breath‑first, body‑aware method. Free trial for adults.” |
| Twitter | Same image (or a 1200×675 px variant) | “Voix Vive – Online Guitar Lessons” | “Somatic lessons + AI mentorship. Start free today.” |

**Action:**  
- Create a 1200×630 px OG banner (`assets/og-banner.png`) that overlays the wordmark on a subtle gradient and adds a short tagline (“Somatic • Adult‑focused • AI”).  
- Reference it in the Helmet block (`og:image`, `twitter:image`).  

Test with:  
- Facebook Sharing Debugger  
- Twitter Card Validator  

---  

## 8️⃣ Indexing Strategy  

| Environment | Recommended `<meta name="robots">` |
|-------------|------------------------------------|
| **Local / Staging** (pre‑beta) | `noindex, nofollow` – prevents premature SERP exposure. |
| **Production (Beta launch)** | Remove the tag or set `index, follow`. Ensure `sitemap.xml` (auto‑generated by Vite) is submitted to Google Search Console. |

*Implementation:* Keep the conditional block in `public/index.html` (see snippet above) that reads `process.env.NODE_ENV !== 'production'` → adds `noindex`. When you build for production (`vite build`), the condition fails and the tag disappears.

---  

## 9️⃣ Backlink & Outreach Plan (High‑Impact, Low‑Effort)

| Target | Why it works | Suggested Action (with URL examples) |
|--------|--------------|--------------------------------------|
| **Guitar‑specific forums** (Reddit r/Guitar, Harmony Central, Guitar World Forums) | Community trusts peer recommendations. | Post a short “Ask Me Anything” about somatic learning; include a signature link to `voix-vive.com`. |
| **Music education blogs** (e.g., *Bulletproof Musician*, *No Treble*) | SEO‑authoritative domains. | Pitch a guest post: “Why Breath First Improves Guitar Technique”. Provide a custom canonical URL pointing back to your site. |
| **LinkedIn Articles** (Bertrand Laurence) | Professional audience, adult learners. | Publish a 800‑word piece on “Somatic Guitar for Busy Professionals”; embed a CTA button linking to the free trial. |
| **YouTube channel** (if you have one) | Video drives high engagement; description links are followed. | Create a 5‑minute demo of the AI somatic mentor; in the description: “Full course → voix-vive.com”. Pin the comment with the link. |
| **Local music schools / adult education centers** | Partnerships can yield .edu backlinks. | Offer a free workshop (online) in exchange for a link from their resources page. |

*Tip:* Use UTM parameters (`?utm_source=reddit&utm_medium=post&utm_campaign=beta-launch`) to track referral traffic in Supabase analytics.

---  

## 10️⃣ A/B Test Ideas (First 3 Experiments)

| Variant | Element to Test | Hypothesis | Metric |
|---------|----------------|------------|--------|
| **A** | Hero headline: *“Online Guitar Lessons for Adults”* vs **B** *“Somatic Guitar – Breath‑First Learning”* | Which phrasing captures the target’s search intent better? | Click‑through rate on the CTA button (AuthButton) + time on page. |
| **A** | Primary CTA button color: portal‑song `#c9a96e` vs **B** high‑contrast `#fbbf24` (exploration orange) | Does a brighter, more urgent hue increase conversions? | Conversion rate (sign‑up completions). |
| **A** | Order of portal cards: Song → Workbook → Player (current) vs **B** Workbook → Song → Player (highlight practice tools first) | Does leading with the “practice” portal reduce friction for newcomers? | Funnel drop‑off between landing page and first portal view. |

*How to run:*  
- Use a lightweight feature flag (e.g., `localStorage`‑based or a Supabase edge function) to serve each variant to 50 % of new visitors.  
- Log events (`hero_cta_click`, `signup_complete`) via Supabase Realtime or an analytics endpoint.  
- Run for **≥ 1,000 unique visits** per variant before deciding.

---  

## 📋 Quick‑Start Checklist (Copy‑Paste into your TODO)

```
[ ] Add react-helmet-async and wrap <App/> in HelmetProvider.
[ ] Replace public/index.html with the SEO scaffold (title, description, OG, JSON-LD placeholder, conditional noindex).
[ ] Implement Helmet block in LandingScreen.jsx (title, description, OG, JSON‑LD for MusicSchool + Course array).
[ ] Create /assets/og-banner.png (1200x630) and reference it in og:image/twitter:image.
[ ] Add hero section with CTA button above the portals (see code snippet).
[ ] Add “Free access” badge to each portal card (CSS ::after).
[ ] Insert micro‑testimonial carousel after manifesto (optional but recommended for trust).
[ ] Verify robots meta: noindex in dev, removed in prod build.
[ ] Submit sitemap.xml to Google Search Console after production deploy.
[ ] Reach out to 2 guitar forums + 1 music‑education blog with guest‑post pitch (include UTM links).
[ ] Set up A/B test framework (feature flag) for the three experiments above.
```

---  

**Result:** After these changes, Voix Vive will have:

* Crawlable, keyword‑rich title/description + rich social previews.  
* Structured data that enables Google’s course carousel and knowledge panel.  
* A conversion‑optimized hero that drives immediate sign‑ups.  
* Clear pathways for backlink acquisition and ongoing SEO measurement.  

Implement the items in order of impact (meta tags → Helmet → hero CTA → OG image → structured data) and you’ll be ready for a search‑friendly, high‑converting beta launch. 🎸🚀