# JJR Demos — Claude Context File

Paste this into any new Claude conversation to resume the workflow for building client demo sites.

---

## Project Overview

We build one-page HTML demo websites for local service businesses. Each demo lives in its own folder inside `/Users/jacobrobinson/JJR Demos/`. When a client demo is ready it gets deployed to Netlify on its own custom domain.

There is also a copy of each demo kept in `/Users/jacobrobinson/Downloads/JJR Demos/` — this is the upload folder used for Netlify manual deploys. Always sync both folders when changes are made (see Syncing below).

---

## Folder Structure

```
/Users/jacobrobinson/JJR Demos/
├── grantham-decorators/       ← example completed demo
├── willoughby/                ← another completed demo
├── dlh-cleaning/
├── HTML Templates/            ← reusable component library
│   ├── Template 1/            ← base full-page template
│   ├── New Template/
│   ├── Hero 1/
│   ├── Nav 1/
│   ├── Services 1/
│   ├── Services 2/
│   ├── Services Cards 1/
│   ├── Reviews 1/
│   ├── Reviews 2/
│   ├── FAQ 1/
│   ├── FAQ 2/
│   ├── Footer 1/
│   ├── Side By Side 1/
│   ├── Contact 1/
│   └── Meet The Team 1/
└── index.html                 ← JJR Demos homepage/directory
```

Each client folder contains:
```
client-name/
├── index.html
├── css/
│   ├── styles.css       ← CSS variables & global styles
│   ├── nav.css
│   ├── hero.css
│   ├── services.css
│   ├── servicescards.css
│   ├── sidebyside.css
│   ├── reviews.css
│   ├── ctabanner.css
│   ├── faq.css
│   ├── footer.css
│   ├── beforeafter.css  ← before/after slider section
│   ├── howitworks.css   ← 3-step process section
│   ├── servicearea.css  ← map + towns section
│   └── quotebar.css     ← sticky quote form bar on scroll
├── images/
│   └── icons/           ← SVG service icons
├── js/
│   └── nav.js
└── .claude/
    └── launch.json      ← preview server config
```

---

## Setting Up a New Client Folder

1. **Copy the base template:**
   ```
   cp -r "/Users/jacobrobinson/JJR Demos/grantham-decorators/" "/Users/jacobrobinson/JJR Demos/new-client-name/"
   ```
   The grantham-decorators folder is the most up-to-date complete template to copy from.

2. **Update `.claude/launch.json`** — change the server name to match the new client:
   ```json
   {
     "version": "0.0.1",
     "configurations": [
       {
         "name": "new-client-name",
         "runtimeExecutable": "python3",
         "runtimeArgs": ["-m", "http.server", "8772"],
         "port": 8772
       }
     ]
   }
   ```
   Use a different port for each client (8765, 8766, 8767... etc).

3. **Start the preview server** using the `preview_start` tool with the config name.

4. **Update the colour scheme** in `css/styles.css` — change the CSS variables:
   ```css
   :root {
       --primary: #ff751f;       /* main brand colour */
       --primaryLight: #ff751f;
       --primaryDark: #d95e0f;   /* hover state — slightly darker */
       --secondary: #ff751f;
       --secondaryLight: #ff751f;
   }
   ```
   After updating variables, **grep all CSS files** for any hardcoded hex values that weren't using the variable:
   ```bash
   grep -rn "#[0-9a-fA-F]\{6\}" css/
   ```
   Replace any hardcoded brand colours with `var(--primary)` or `var(--primaryDark)`.
   Also check SVG icon files in `images/icons/` for hardcoded fill colours.

5. **Update fonts** in `index.html` Google Fonts link and `css/styles.css`.
   Current font stack:
   - **Headings (h1–h6, .cs-title):** Sora
   - **Nav & UI elements:** Outfit  
   - **Body text:** Inter

6. **Swap in client images** — drop into `images/` folder and update `src` attributes in `index.html`. Key image references:
   - `images/[client]hero.jpg` — hero background
   - `images/[client]image1.jpg` — about/side-by-side section
   - `images/[client]image2.jpg` — service cards
   - `images/[client]before1-3.jpg` / `images/[client]after1-3.jpg` — before/after sliders
   - `images/[ClientName]WhiteLogo.png` — white logo for nav & footer

7. **Update all business content** in `index.html`:
   - Page `<title>`
   - Phone number (appears in nav, hero, footer)
   - Email address
   - Business name, tagline, address
   - H1 hero heading
   - Hero subtext
   - Services (5 icon strip + 4 service cards)
   - About/side-by-side copy
   - Reviews (names, locations, service types)
   - FAQ questions and answers
   - Footer columns (quicklinks, services list, map embed)
   - Google Maps iframe `src` — update coordinates to client's town
   - Service area towns list
   - How It Works copy (usually stays generic)
   - CTA banner text

8. **Sync to Downloads folder** when done:
   ```bash
   rsync -av --delete "/Users/jacobrobinson/JJR Demos/client-name/" "/Users/jacobrobinson/Downloads/JJR Demos/client-name/"
   ```

---

## Design System

### Colour Variables
Always use CSS variables, never hardcode brand colours.
```css
var(--primary)      /* main CTA colour */
var(--primaryDark)  /* hover states */
```

### Typography
```css
font-family: 'Sora', sans-serif;    /* headings */
font-family: 'Outfit', sans-serif;  /* nav, UI, buttons */
font-family: 'Inter', sans-serif;   /* body text */
```

### Navigation Behaviour
- **Transparent** at the top of the page
- **Nav links:** white text, orange on hover/active
- **On mobile scroll:** nav goes full-width with `background-color: #1a1a1a`
- **On desktop scroll (past 150px):** nav fades out (`cs-hidden` class), sticky quote bar slides in from top
- Nav hide/show logic lives in `js/nav.js` in the `scrollManager` object

### Quote Bar
- Hidden by default, slides in on scroll past 150px (desktop only, min-width 768px)
- Replaces the nav on scroll
- Dark background `#1a1a1a` with orange bottom border
- Has: label, first name / email / phone inputs, service dropdown, CTA button
- Controlled by `qb-visible` class toggled in `js/nav.js`

### Before/After Sliders
- Drag handle to reveal before/after images
- **Before image = `ba-before` class (underneath), After image = `ba-after` class (on top, clipped)**
- After image sits on the LEFT by default (clip-path reveals from left)
- JS handles mouse and touch drag events

### Sections (in page order)
1. Quote Bar (fixed, appears on scroll)
2. Nav
3. Hero
4. Services strip (5 icons + banner)
5. Side By Side / About
6. Services Cards (4 cards)
7. Before & After sliders
8. How It Works (3 steps)
9. Reviews carousel
10. CTA Banner
11. Service Area (map + towns)
12. FAQ accordion
13. Footer (logo, contact, quicklinks, services, map)

---

## Deploying to Netlify

1. Sync the Downloads folder (step 8 above)
2. Go to **app.netlify.com → Add new site → Deploy manually**
3. Drag and drop the client folder from `/Users/jacobrobinson/Downloads/JJR Demos/client-name/`
4. Once live, go to **Domain management → Add a domain** and enter the client's domain
5. Update DNS at the domain registrar — either point nameservers to Netlify or add a CNAME/A record

---

## Preview Servers

Each client folder has a `.claude/launch.json`. Start the preview using the `preview_start` MCP tool with the config name. Current port assignments:
- willoughby: 8765
- grantham-decorators: 8771
- new clients: use next available port

To view the preview, open `localhost:[port]` in a browser.

---

## Common Tasks Reference

**Change brand colour:**
1. Update `--primary` and `--primaryDark` in `css/styles.css`
2. Run grep for hardcoded hex values across all CSS files
3. Update SVG icon fill colours in `images/icons/`
4. Check URL-encoded SVG backgrounds in CSS (look for `%23` followed by old hex)

**Add a new CSS section:**
1. Create `css/sectionname.css`
2. Add `<link rel="stylesheet" href="css/sectionname.css">` in `index.html` head
3. Add HTML in the correct position in `index.html`

**Sync both folders after changes:**
```bash
rsync -av --delete "/Users/jacobrobinson/JJR Demos/[client]/" "/Users/jacobrobinson/Downloads/JJR Demos/[client]/"
```
