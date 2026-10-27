import React from 'react';

export function DeskBanner({ mode, hasApiKey }) {
  if (mode === 'template') {
    return (
      <div className="desk-banner" role="status">
        <div className="desk-banner__status">
          <span className="desk-banner__dot" style={{ backgroundColor: '#2E7D32' }} />
          <span><strong>Template Mode Active:</strong> Instant offline generation using Inkwell's editorial stationery engine.</span>
        </div>
        <span style={{ opacity: 0.75 }}>Offline Ready</span>
      </div>
    );
  }

  return (
    <div className="desk-banner" role="status">
      <div className="desk-banner__status">
        <span
          className="desk-banner__dot"
          style={{ backgroundColor: hasApiKey ? '#2E7D32' : '#D8472B' }}
        />
        <span>
          <strong>AI Quill Mode (Gemini):</strong>{' '}
          {hasApiKey
            ? 'API key active. Letters will be authored by Gemini with authentic structure.'
            : 'No Gemini key detected in VITE_GEMINI_API_KEY. Add it to .env or switch to Template mode.'}
        </span>
      </div>
      <span style={{ opacity: 0.75 }}>Free Tier Supported</span>
    </div>
  );
}
