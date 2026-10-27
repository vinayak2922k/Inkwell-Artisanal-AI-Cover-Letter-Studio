# Prompts & Design Iteration Log — Inkwell

> **Development Scope & Attribution Declaration:**
> Artificial Intelligence was utilized strictly for **Creative Concept Brainstorming and CSS / Visual Aesthetic Styling**. All application architecture, React 19 component logic, state management, PDF parsing, DOM sanitization, error boundaries, test suites, and CI/CD workflows were hand-engineered by the developer without AI code generation.

---

## Technical Division of Labor

| Layer | Responsibility | Handled By |
| :--- | :--- | :--- |
| **Product Concept & Metaphor** | Brainstorming "A Writer's Desk" metaphor | **AI (Prompted)** |
| **Color Palette & Design Tokens** | HSL/Hex tokens, parchment & ink harmony, dark mode contrast | **AI (Prompted)** |
| **CSS Micro-interactions & Polish** | 1° hover-straightening tilt, wax seal badge, ink-fill button styles | **AI (Prompted)** |
| **Application Architecture** | React 19, Vite modular tree, component hierarchy | **Developer (Manual)** |
| **State Management & Data Flow** | Controlled forms, localStorage sync, draft archive restoration | **Developer (Manual)** |
| **Resume PDF Text Extraction** | Browser-side PDF.js worker setup, text extraction & sanitization | **Developer (Manual)** |
| **Template Letter Generator** | Bespoke editorial composition engine (`templateLetter.js`) | **Developer (Manual)** |
| **LLM Integration & Resilience** | Gemini client, candidate model rotation, timeout & REST fallback | **Developer (Manual)** |
| **Security & XSS Prevention** | DOMPurify typography sanitization, safe HTML parser | **Developer (Manual)** |
| **Unit Testing & QA** | Vitest test suites (12 tests across 3 modules) | **Developer (Manual)** |
| **CI/CD & Deployment** | GitHub Actions workflow, Vite base path routing for GitHub Pages | **Developer (Manual)** |

---

## Logged AI Prompts (Concept & CSS Only)

### Prompt 1: Creative Concept & Mood Board Exploration

**Category:** *Concept Ideation*

> **Prompt:**
> "I want to build a cover letter generator that feels completely distinct from generic corporate SaaS tools. Instead of sterile blue/purple gradients, I want the metaphor of an 'Artisanal Writer's Desk'—tactile, intentional, and editorial. What visual metaphors, stationery motifs, and interface details would bring this vintage-yet-modern writer's studio to life?"

**AI Provided Guidance:**
- Metaphor: A split-screen desk workspace. Left side: a spiral/binding notepad where the writer notes down intentions. Right side: a premium stationery sheet resting on the desk.
- Tactile motifs: Brass/leather binding strip at the top of the notepad, red margin rule line, stamped chip tags for skills, an ink-flowing typewriter reveal, and a crimson wax seal stamp at the bottom of the finished letter.
- Voice & microcopy: "Who’s the letter from?", "Where are you aiming?", "Pen the Letter", "The Quill Stumbled".

---

### Prompt 2: Color Harmony & Design Tokens

**Category:** *CSS Design System*

> **Prompt:**
> "Generate a cohesive set of CSS custom property tokens for this writer's desk theme in both light and dark modes:
> - Light theme: Warm daylight desk with off-white textured parchment (#F4EFE6), deep iron-gall ink (#1B1A17), and a single accent of burnt vermilion (#D8472B).
> - Dark theme: A charcoal wooden desk with cream paper that stays legible and elegant.
> - Include font token recommendations for an editorial serif heading, clean body sans, and typewriter monospace."

**AI Provided Guidance (CSS Tokens):**
```css
:root {
  --bg-desk: #ECE6DC;
  --bg-desk-grain: rgba(27, 26, 23, 0.03);
  --paper-notepad: #FAF7F2;
  --paper-letter: #FFFDF9;
  --paper-border: #E2DACB;
  --color-ink: #1B1A17;
  --color-ink-faint: #636059;
  --color-ink-muted: #8F8B82;
  --color-ink-rule: rgba(27, 26, 23, 0.08);
  --color-margin-rule: rgba(216, 71, 43, 0.22);
  --color-vermilion: #D8472B;
  --color-vermilion-hover: #BF3A20;
  --color-vermilion-tint: rgba(216, 71, 43, 0.08);
  --color-stamp-bg: #F0EAE1;
  --color-stamp-border: #7F7A71;
  --color-seal: #B32815;

  --font-serif: 'Fraunces', Georgia, 'Times New Roman', serif;
  --font-sans: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'Space Mono', 'Courier New', monospace;
}

[data-theme='dark'] {
  --bg-desk: #141517;
  --bg-desk-grain: rgba(255, 255, 255, 0.02);
  --paper-notepad: #202226;
  --paper-letter: #F6F1E7;
  --paper-border: #2D3036;
  --color-ink: #F2EFE9;
  --color-ink-faint: #A6A39D;
  --color-ink-muted: #72706A;
  --color-margin-rule: rgba(216, 71, 43, 0.35);
  --color-stamp-bg: #2A2D33;
  --color-stamp-border: #9C968B;
}
```

---

### Prompt 3: Stationery Micro-Interactions & CSS Animations

**Category:** *CSS Animation & Tactile Styling*

> **Prompt:**
> "Provide pure CSS styling and animation rules for:
> 1. A letter sheet that rests at a subtle 1-degree tilt (`rotate(1deg)`) with soft elevation shadow, and smoothly straightens to `rotate(0deg)` when hovered.
> 2. A stamped chip effect for skill tags with a vintage bordered stamp aesthetic.
> 3. An ink-fill button effect where a dark ink gradient sweeps across the button upon clicking or copying.
> 4. An embossed wax seal badge styled with a rich crimson radial gradient and gold rim."

**AI Provided Guidance (CSS Snippets):**
```css
/* 1. Letter sheet tilt & elevation */
.letter-sheet {
  background: var(--paper-letter);
  border: 1px solid var(--paper-border);
  box-shadow: var(--shadow-paper);
  transform: rotate(1deg);
  transition: transform var(--transition-paper), box-shadow var(--transition-paper);
}

.letter-sheet:hover {
  transform: rotate(0deg) translateY(-2px);
  box-shadow: var(--shadow-paper-hover);
}

/* 2. Stamped Chip */
.stamped-chip {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  background: var(--color-stamp-bg);
  border: 1px dashed var(--color-stamp-border);
  padding: 0.28rem 0.65rem;
  border-radius: 2px;
}

/* 3. Wax Seal Badge */
.wax-seal {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #D8472B 0%, var(--color-seal) 70%);
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.25), 0 4px 10px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

### Prompt 4: Two-Pane Split Desk Layout

**Category:** *CSS Layout & Responsive Grid*

> **Prompt:**
> "Provide a clean CSS Grid layout for a 2-column writer desk on desktop (`min-width: 960px`) with the notepad on the left and the stationery preview on the right, collapsing to a single centered column on mobile and tablet devices with balanced padding."

**AI Provided Guidance:**
- Responsive grid definition:
```css
.desk-workspace {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 1320px;
  margin: 0 auto;
  padding: 2rem 1.25rem 4rem;
}

@media (min-width: 960px) {
  .desk-workspace {
    grid-template-columns: minmax(360px, 440px) 1fr;
    gap: 3rem;
    align-items: start;
  }
}
```

---

## Conclusion

Every other piece of functionality—including the React architecture, state synchronization, PDF.js parsing, custom template engine, DOMPurify sanitization, Gemini multi-model fallback client, unit tests, and GitHub Pages automated deployment—was authored directly by the developer. AI served exclusively as an editorial designer and CSS stylesheet consultant.
