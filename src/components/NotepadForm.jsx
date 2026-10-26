import React, { useState } from 'react';

/**
 * NotepadForm renders a vintage notepad stationery sheet with underlined inputs,
 * real human microcopy, stamped skill tags, and validation.
 */
export function NotepadForm({
  formData,
  onChange,
  onSubmit,
  isLoading,
  mode,
  errors = {},
}) {
  const [tagInput, setTagInput] = useState('');

  const handleInputChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  const handleKeyDownTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = tagInput.trim().replace(/^,+|,+$/g, '');
      if (trimmed) {
        const currentSkills = Array.isArray(formData.skills) ? formData.skills : [];
        if (!currentSkills.includes(trimmed)) {
          onChange({
            ...formData,
            skills: [...currentSkills, trimmed],
          });
        }
        setTagInput('');
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const currentSkills = Array.isArray(formData.skills) ? formData.skills : [];
    onChange({
      ...formData,
      skills: currentSkills.filter((s) => s !== skillToRemove),
    });
  };

  const currentSkills = Array.isArray(formData.skills)
    ? formData.skills
    : (formData.skills || '').split(',').map((s) => s.trim()).filter(Boolean);

  return (
    <aside className="notepad-sheet" aria-labelledby="notepad-heading">
      {/* Top brass/leather binding strip */}
      <div className="notepad-binding">
        <span>Desk Notepad · No. 04</span>
        <span className="notepad-binding__perforation">┈┈┈┈┈┈┈┈┈┈┈┈┈</span>
        <span>{mode === 'ai' ? 'AI Quill Mode' : 'Stationery Draft'}</span>
      </div>

      <div className="notepad-body">
        <h2 id="notepad-heading" className="notepad-title">The Letter Brief</h2>
        <p className="notepad-subtitle">
          Lay down your intentions. We will turn them into a letter worthy of print.
        </p>

        <form onSubmit={onSubmit} noValidate>
          {/* Candidate Name */}
          <div className="form-field">
            <label htmlFor="field-name" className="form-field__label">
              Who’s the letter from?
            </label>
            <span className="form-field__microcopy">Your full name as you wish it signed</span>
            <input
              id="field-name"
              type="text"
              className="form-input-underlined"
              placeholder="e.g. Eleanor Vance"
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'error-name' : undefined}
            />
            {errors.name && (
              <span id="error-name" className="form-field__error" role="alert">
                {errors.name}
              </span>
            )}
          </div>

          {/* Target Role */}
          <div className="form-field">
            <label htmlFor="field-role" className="form-field__label">
              What craft are you bringing?
            </label>
            <span className="form-field__microcopy">The role or title you are stepping into</span>
            <input
              id="field-role"
              type="text"
              className="form-input-underlined"
              placeholder="e.g. Lead Product Architect"
              value={formData.role || ''}
              onChange={(e) => handleInputChange('role', e.target.value)}
              aria-invalid={Boolean(errors.role)}
              aria-describedby={errors.role ? 'error-role' : undefined}
            />
            {errors.role && (
              <span id="error-role" className="form-field__error" role="alert">
                {errors.role}
              </span>
            )}
          </div>

          {/* Target Company */}
          <div className="form-field">
            <label htmlFor="field-company" className="form-field__label">
              Where are you aiming?
            </label>
            <span className="form-field__microcopy">The organization you want to write to</span>
            <input
              id="field-company"
              type="text"
              className="form-input-underlined"
              placeholder="e.g. Meridian Studios"
              value={formData.company || ''}
              onChange={(e) => handleInputChange('company', e.target.value)}
              aria-invalid={Boolean(errors.company)}
              aria-describedby={errors.company ? 'error-company' : undefined}
            />
            {errors.company && (
              <span id="error-company" className="form-field__error" role="alert">
                {errors.company}
              </span>
            )}
          </div>

          {/* Key Skills Tags */}
          <div className="form-field">
            <label htmlFor="field-skills" className="form-field__label">
              Key Skills & Specialties
            </label>
            <span className="form-field__microcopy">
              Press Enter or comma to stamp tags (e.g. Design Systems, React, Mentorship)
            </span>

            <div className="skills-input-wrapper">
              {currentSkills.length > 0 && (
                <div className="skills-tags-container" aria-label="Stamped skills list">
                  {currentSkills.map((skill) => (
                    <span key={skill} className="stamped-chip">
                      <span>{skill}</span>
                      <button
                        type="button"
                        className="stamped-chip__remove"
                        onClick={() => handleRemoveSkill(skill)}
                        aria-label={`Remove skill tag ${skill}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <input
                id="field-skills"
                type="text"
                className="form-input-underlined"
                placeholder={currentSkills.length === 0 ? "Type a skill and hit Enter..." : "Add another skill..."}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDownTag}
                aria-invalid={Boolean(errors.skills)}
                aria-describedby={errors.skills ? 'error-skills' : undefined}
              />
            </div>
            {errors.skills && (
              <span id="error-skills" className="form-field__error" role="alert">
                {errors.skills}
              </span>
            )}
          </div>

          {/* Tone Selector */}
          <div className="form-field">
            <label className="form-field__label">Tone of Voice</label>
            <span className="form-field__microcopy">Set the temper of the parchment</span>
            <div className="tone-selector" role="radiogroup" aria-label="Tone of voice">
              {['confident', 'warm', 'formal'].map((t) => (
                <button
                  key={t}
                  type="button"
                  role="radio"
                  aria-checked={formData.tone === t}
                  className={`tone-option ${formData.tone === t ? 'active' : ''}`}
                  onClick={() => handleInputChange('tone', t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Action button */}
          <div className="notepad-actions">
            <button
              type="submit"
              className="btn-quill"
              disabled={isLoading}
              id="pen-letter-button"
            >
              <span>{isLoading ? 'Ink is Flowing...' : 'Pen the Letter'}</span>
              <span aria-hidden="true">{isLoading ? '⏳' : '✒️'}</span>
            </button>
          </div>
        </form>
      </div>
    </aside>
  );
}
