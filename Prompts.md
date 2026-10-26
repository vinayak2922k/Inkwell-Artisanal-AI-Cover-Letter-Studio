# Prompts & Iteration Log — Inkwell

## Entry 1: Project Initialization & Phase 1 — Base MVP

### User Prompt
> You are a senior front-end engineer and product designer. Build "Inkwell", an AI Cover Letter Generator web app (SaaS-style). Work in clear phases, and after each phase run the app and fix errors before moving on.
> 
> Concept: "a writer's desk". Warm paper off-white (#F4EFE6), deep ink (#1B1A17), one accent of burnt vermilion (#D8472B). Dark mode = charcoal desk with cream paper.
> Type: editorial serif (Playfair Display / Fraunces), clean sans (DM Sans / Inter Tight), monospace for labels.
> Layout: split screen notepad left, live letter right with 1° tilt straightens on hover. Stamped skill chips, wax-seal animation, typewriter reveal, ink-fill copy button.
> Phase 1: Form fields (Candidate Name, Job Role, Target Company, Key Skills tags/comma), controlled form state, `buildTemplateLetter` in `/src/lib/templateLetter.js`, `LetterCard` output with clipboard copy + textarea fallback, Mode toggle "Template / AI".

### Actions & Architecture
1. Initialized repository, Git configuration, and strict `.gitignore` to prevent any API key leakage.
2. Created `.env.example` and git-ignored `.env`.
3. Created `package.json` with React 19 / Vite, Vitest for unit tests, DOMPurify, pdfjs-dist.
4. Structured clean directories: `/src/components`, `/src/lib`, `/src/styles`, `/src/hooks`, `/src/tests`.
5. Built Phase 1 Base MVP:
   - Notepad form with underlined inputs, real human microcopy ("Who's the letter from?", "Where are you aiming?"), stamped skill chips with tag entry & removal.
   - Live "letter on paper" preview with paper grain texture, soft elevation shadow, and subtle 1° hover-straightening tilt.
   - `buildTemplateLetter` template engine with structured paragraphs, professional flow, and real personalization.
   - `LetterCard` with wax-seal stamp completion effect, typewriter-style reveal, and custom ink-fill copy button with fallback.
   - Mode switcher ("Template Mode" / "AI Mode") with friendly setup banner for API key configuration.
   - Dark mode toggle supporting "Charcoal Desk & Cream Paper" palette.
6. Added Vitest unit test suite covering `buildTemplateLetter` and edge cases.

## Entry 2: Phase 2 — LLM Integration & Security

### User Prompt
> yes proceed for the phase 2

### Actions & Architecture
1. **Prompt Engineering Engine (`src/lib/prompt.js`)**:
   - Master career coach persona with editorial guidelines.
   - 4-tier structural composition: Hook (informed interest in target company), Proof (tangible impact & skills), Fit (connecting candidate craft to company mission), Close (grounded call to action).
   - Strict ban on buzzwords & clichés (*"revolutionize", "unleash", "seamless", "synergy", "paradigm shift"*, etc.) and placeholders.
   - Tone adaptation for Confident, Warm, and Formal stationery styles.
   - Unit tests created in `src/tests/prompt.test.js` (**all 7 unit tests passing**).
2. **Gemini API Integration & Client Hardening (`src/lib/gemini.js`)**:
   - Primary `@google/generative-ai` integration targeting `gemini-1.5-flash` with direct REST API fallback.
   - 25-second timeout controller, 429 rate limit detection, offline connection checking, and sanitized error classes (`GeminiError`).
   - Zero API key logging or exposure: keys read strictly via `import.meta.env.VITE_GEMINI_API_KEY`.
3. **UI States & Stationery Feedback**:
   - `InkLoader` component: pen-writing / ink-drip animation with 6 rotating status lines.
   - `ErrorNotice` component: "The Quill Stumbled" stationery alert with inline advice, "Try Again" action, and "Switch to Template Mode" fallback.
   - Mode switcher connected in `App.jsx`, updating `DeskBanner` context dynamically.
4. **Hardened Serverless Deployment (`api/generate.js`)**:
   - Added serverless proxy for Vercel/Netlify holding `GEMINI_API_KEY` entirely server-side.
5. **Testing & Quality Assurance**:
   - Full Vitest suite passing (7/7 tests).
   - `npm run build` completed with 0 errors.
   - End-to-end browser subagent test: validated mode switching, missing key handling, error presentation, and clean fallback recovery to template mode.

## Entry 3: Phase 3 — SaaS Features & Production Polish

### Actions & Architecture
1. **Resume PDF Text Extraction (`src/lib/pdfExtractor.js`)**:
   - Browser-side PDF parsing using `pdfjs-dist` with worker asset URL configured for Vite.
   - Enforces 5 MB file size limit and strict PDF type validation.
   - Normalizes whitespace, extracts multi-page text, and caps payload at 3000 characters to prevent context overflow.
2. **Resume Docket Component (`src/components/ResumeDropzone.jsx`)**:
   - Stationery-styled docket pocket supporting drag & drop and click-to-upload.
   - Animated extraction indicator ("Scanning parchment with PDF optics...").
   - Stamped file chip displaying filename, formatted size (KB/MB), word count preview, and one-click removal button.
   - Injects extracted resume background into Gemini prompt.
3. **Markdown to Clean HTML Parser & Sanitizer (`src/lib/markdown.js`)**:
   - Converts markdown bold/italic and paragraphs into semantic HTML.
   - Strips raw hashtags (`#`) and markdown fences.
   - Rigorous XSS protection via `DOMPurify` allowing only safe typography tags.
   - Unit tests created in `src/tests/markdown.test.js` (**all 11 tests passing across suites**).
4. **Stationery Archives Drawer (`src/components/HistoryDrawer.jsx`)**:
   - Saves drafted letters into `localStorage` with timestamp, company, role, tone, and full text.
   - Slide-in stationery archive drawer to review, reword, and restore previous drafts.
   - Clear archive option.
5. **Quality & Security Assurance**:
   - Complete Vitest suite passed: 11 tests across 3 files.
   - Production bundle compiled with zero errors (`npm run build`).
   - Browser subagent validation verified archive open/close, reword action, copy action, and theme switching.
   - Comprehensive `README.md` created with setup steps, Gemini free key instructions, and security guide.

## Entry 4: GitHub Pages Blank Screen Diagnosis & Automated Deployment Workflow

### User Prompt
> My Vite + React app "Inkwell" is deployed on GitHub Pages but shows a blank white page (the tab title loads, nothing renders).
> Live URL: https://vinayak2922k.github.io/Inkwell-Artisanal-AI-Cover-Letter-Studio/
> Repo name: Inkwell-Artisanal-AI-Cover-Letter-Studio
> Diagnose and fix this end to end...

### Diagnosis
- The default Vite build emitted root-relative asset paths (`/assets/index-xxx.js`), which on GitHub Pages resolved to `https://vinayak2922k.github.io/assets/...` instead of `https://vinayak2922k.github.io/Inkwell-Artisanal-AI-Cover-Letter-Studio/assets/...`, triggering 404 errors for scripts and styles and leaving a blank white page.

### Actions & Fixes
1. **Configured Base Path (`vite.config.js`)**:
   - Set `base: '/Inkwell-Artisanal-AI-Cover-Letter-Studio/'` ensuring all assets, scripts, stylesheets, and workers bundle with the correct repository path prefix.
2. **Asset Path Audit & PDF Worker Compatibility**:
   - Audited all files for hardcoded root-relative paths (`/assets`, `/favicon`, etc.).
   - Updated `index.html` script tag to `./src/main.jsx`.
   - Verified `pdfjs-dist` worker URL resolves under `/Inkwell-Artisanal-AI-Cover-Letter-Studio/assets/pdf.worker.min-...mjs`.
3. **Automated GitHub Pages Workflow (`.github/workflows/deploy.yml`)**:
   - Created workflow triggered on push to `main` and `workflow_dispatch`.
   - Configured Node.js 20 with npm caching, `npm ci`, and `npm run build` with `VITE_GEMINI_API_KEY: ${{ secrets.VITE_GEMINI_API_KEY }}`.
   - Configured `actions/upload-pages-artifact` (`./dist`) and `actions/deploy-pages`.
   - Granted necessary permissions: `contents: read`, `pages: write`, `id-token: write`.
4. **Security Scan**:
   - Confirmed `.env` is git-ignored, `.env.example` has placeholder only, and scanned git log confirms 0 secret keys committed.
5. **Local Validation**:
   - Built production bundle with `npm run build`.
   - Verified locally via `npm run preview -- --port 4173` on `http://localhost:4173/Inkwell-Artisanal-AI-Cover-Letter-Studio/`.
   - Confirmed full UI rendering with zero console errors and zero 404s.



