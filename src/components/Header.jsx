import React from 'react';

/**
 * Header component for Inkwell's writer desk.
 * Includes branding, mode toggle (Template / AI), and theme switcher.
 */
export function Header({ mode, onModeChange, theme, onToggleTheme }) {
  return (
    <header className="desk-header">
      <div className="desk-header__inner">
        <div className="brand">
          <span className="brand__mark" aria-hidden="true">✒️</span>
          <div>
            <h1 className="brand__title">Inkwell</h1>
          </div>
          <span className="brand__tagline">The Writer’s Desk</span>
        </div>

        <div className="desk-actions">
          {/* Mode Switcher */}
          <div className="mode-toggle" role="group" aria-label="Generation Mode">
            <button
              id="mode-btn-template"
              type="button"
              className={`mode-toggle__btn ${mode === 'template' ? 'active' : ''}`}
              onClick={() => onModeChange('template')}
              aria-pressed={mode === 'template'}
            >
              Template
            </button>
            <button
              id="mode-btn-ai"
              type="button"
              className={`mode-toggle__btn ${mode === 'ai' ? 'active' : ''}`}
              onClick={() => onModeChange('ai')}
              aria-pressed={mode === 'ai'}
            >
              AI (Gemini)
            </button>
          </div>

          {/* Theme Switcher */}
          <button
            id="theme-toggle-btn"
            type="button"
            className="btn-desk-tool"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'daylight' : 'charcoal desk'} mode`}
            title={`Switch to ${theme === 'dark' ? 'daylight' : 'charcoal'} desk`}
          >
            <span>{theme === 'dark' ? '☀️ Daylight' : '🌙 Charcoal'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
