import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NotepadForm } from './components/NotepadForm';
import { LetterCard } from './components/LetterCard';
import { DeskBanner } from './components/DeskBanner';
import { buildTemplateLetter } from './lib/templateLetter';

export function App() {
  // Theme state: daylight or dark charcoal desk
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('inkwell_theme') || 'light';
  });

  // Generation mode: 'template' | 'ai'
  const [mode, setMode] = useState('template');

  // Single controlled form object in React state
  const [formData, setFormData] = useState({
    name: 'Eleanor Vance',
    role: 'Lead Product Architect',
    company: 'Meridian Labs',
    skills: ['Design Systems', 'React Architecture', 'Cross-functional Leadership', 'TypeScript'],
    tone: 'confident',
  });

  const [errors, setErrors] = useState({});
  const [letterText, setLetterText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sync theme to DOM data-theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('inkwell_theme', theme);
  }, [theme]);

  // Initial letter generation on mount with demo values
  useEffect(() => {
    const initialLetter = buildTemplateLetter(formData);
    setLetterText(initialLetter);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Please provide your name so the correspondence can be signed.';
    }
    if (!formData.role.trim()) {
      errs.role = 'Please specify the craft or role you are applying for.';
    }
    if (!formData.company.trim()) {
      errs.company = 'Please specify the company you are addressing.';
    }
    const currentSkills = Array.isArray(formData.skills)
      ? formData.skills
      : (formData.skills || '').split(',').map((s) => s.trim()).filter(Boolean);

    if (currentSkills.length === 0) {
      errs.skills = 'Please list at least one skill or capability.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    if (mode === 'template') {
      // Simulate quick natural ink flow
      setTimeout(() => {
        const generated = buildTemplateLetter(formData);
        setLetterText(generated);
        setIsLoading(false);
      }, 350);
    } else {
      // Phase 2 will plug in Gemini here. For Phase 1 fallback with notice:
      setTimeout(() => {
        const generated = buildTemplateLetter(formData);
        setLetterText(generated);
        setIsLoading(false);
      }, 500);
    }
  };

  const hasApiKey = Boolean(import.meta.env.VITE_GEMINI_API_KEY);

  return (
    <>
      <Header
        mode={mode}
        onModeChange={setMode}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="desk-workspace">
        <div>
          <DeskBanner mode={mode} hasApiKey={hasApiKey} />
          <NotepadForm
            formData={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            mode={mode}
            errors={errors}
          />
        </div>

        <div>
          <LetterCard
            letterText={letterText}
            candidateName={formData.name}
            targetRole={formData.role}
            targetCompany={formData.company}
            mode={mode}
            isLoading={isLoading}
          />
        </div>
      </main>
    </>
  );
}

export default App;
