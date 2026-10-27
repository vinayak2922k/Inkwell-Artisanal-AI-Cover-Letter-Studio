import React from 'react';

export function ErrorNotice({ error, onRetry, onSwitchToTemplate }) {
  if (!error) return null;

  const isKeyError = error.code === 'MISSING_KEY' || error.code === 'AUTH_ERROR' || error.code === 'INVALID_KEY';
  const isRateLimit = error.code === 'RATE_LIMIT';

  return (
    <div className="error-stationery" role="alert">
      <div className="error-stationery__header">
        <span className="error-stationery__icon" aria-hidden="true">⚠️</span>
        <h4 className="error-stationery__title">The Quill Stumbled</h4>
      </div>

      <p className="error-stationery__message">{error.message || 'An unexpected interruption occurred while writing.'}</p>

      {isKeyError && (
        <div className="error-stationery__hint">
          <strong>Tip:</strong> Create or update <code>.env</code> with <code>VITE_GEMINI_API_KEY=your_key</code>. Alternatively, switch to <strong>Template Mode</strong> above for instantaneous, keyless offline letter generation.
        </div>
      )}

      {isRateLimit && (
        <div className="error-stationery__hint">
          <strong>Tip:</strong> The free tier quota has a per-minute limit. Wait a few moments before retrying, or use Template Mode immediately.
        </div>
      )}

      <div className="error-stationery__actions">
        <button id="btn-retry-generation" type="button" className="btn-quill" onClick={onRetry}>
          <span>Try Again</span>
          <span aria-hidden="true">↺</span>
        </button>

        {onSwitchToTemplate && (
          <button id="btn-switch-to-template" type="button" className="btn-desk-tool" onClick={onSwitchToTemplate}>
            <span>Switch to Template Mode</span>
          </button>
        )}
      </div>
    </div>
  );
}
