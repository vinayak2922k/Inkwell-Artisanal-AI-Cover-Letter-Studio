# ✒️ Inkwell — Artisanal AI Cover Letter Studio

> A bespoke, writer’s-desk experience for drafting compelling cover letters. Designed like tactile stationery, powered by Google Gemini, and tuned to produce authentic, human prose with zero corporate clichés.

---

## 🖋️ Design Philosophy: "A Writer’s Desk"

Inkwell departs from generic SaaS dashboards and AI wrappers:
- **Palette**: Warm paper off-white (`#F4EFE6`), deep iron-gall ink (`#1B1A17`), and a single restrained accent of burnt vermilion (`#D8472B`). Dark mode translates the desk into a rich charcoal surface with cream stationery—not inverted colors.
- **Editorial Typography**: Loaded via Google Fonts—**Fraunces** (editorial serif headings), **DM Sans** (clean sans body and UI), and **Space Mono** (stationery labels and metadata).
- **Tactile Details**:
  - Left notepad styled with faint ruling lines, red margin guide, and underlined stationery inputs instead of boxed fields.
  - Stamped skill chips that stamp down with textured ink upon pressing `Enter` or comma.
  - Right stationery letter featuring realistic elevation shadow, subtle paper grain, and a 1° rotation that straightens upon hover.
  - Crimson wax seal with stamp press animation upon letter generation.
  - Custom ink-fill micro-interaction on the "Copy to Clipboard" button switching into "Copied ✓".
  - Strict ban on buzzwords (*"revolutionize", "unleash", "seamless", "synergy", "paradigm shift"*).

---

## 🚀 Key Features

| Feature | Description |
| :--- | :--- |
| **Dual Generation Modes** | **Template Mode** (instant, offline artisanal template engine) and **AI Mode** (Gemini 1.5/2.0 Flash integration). |
| **Prompt Engineering Engine** | Persona-driven prompt with 4-tier structural flow (Hook, Proof, Fit, Close) and strict anti-cliché filters. |
| **PDF Resume Docket** | Client-side drag-and-drop PDF text extraction via `pdfjs-dist` (capped at 5 MB, normalized whitespace). |
| **Markdown to Clean HTML** | Custom parser converting markdown into structured paragraphs, sanitized via `DOMPurify` to prevent XSS. |
| **Stationery Archives** | Local history drawer in `localStorage` allowing users to review, reword, and restore previously penned letters. |
| **Tone Selector** | Shift between **Confident**, **Warm**, and **Formal** registers. |
| **Export & Clipboard** | One-click ink-fill clipboard copy with fallback, plus direct `.txt` letter download. |

---

## 🛠️ Setup & Installation

### Prerequisites
- **Node.js**: v18.0.0 or later (Node 20+ recommended)
- **npm** or **pnpm**

### 1. Clone & Install
```bash
git clone https://github.com/your-username/inkwell.git
cd inkwell
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to create your local `.env`:
```bash
cp .env.example .env
```

Open `.env` and insert your Gemini API Key:
```ini
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
```

> **Note**: Even without an API key, Inkwell works out of the box in **Template Mode**.

### 3. How to Obtain a Free Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sign in with your Google account.
3. Click **"Create API Key"** and copy the key.
4. Paste it into your `.env` file as `VITE_GEMINI_API_KEY`.
*(The free tier provides generous requests per minute, ideal for personal cover letter generation).*

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Run Automated Tests
```bash
npm test
```
Runs the full Vitest suite covering the template builder, prompt engineering engine, and DOMPurify markdown parser.

---

## 🔒 Security & Architecture Note

- **Client-Side Security**: Inkwell reads `VITE_GEMINI_API_KEY` strictly via `import.meta.env`. The key is never logged, printed, or sent to any third-party telemetry.
- **Git Protection**: `.gitignore` strictly excludes `.env`, `.env.local`, and all variations.
- **Serverless Proxy Hardening (Production)**:
  An optional hardened serverless proxy is included in [`api/generate.js`](api/generate.js) for Vercel or Netlify deployments. In production, this allows hosting the `GEMINI_API_KEY` on the server backend without exposing the key in client-side bundles.

---

## 🧪 Unit Testing Suite

The project includes unit test coverage across all critical transformation logic:
- `src/tests/templateLetter.test.js`: Validates template interpolation, fallbacks, and anti-cliché constraints.
- `src/tests/prompt.test.js`: Validates system instructions, banned words, resume insertion, and tone adaptation.
- `src/tests/markdown.test.js`: Validates paragraph segmentation, header stripping, and XSS sanitization via DOMPurify.

---

## 📜 License
MIT License. Crafted with care for writers and craftspeople.
