import React, { useState, useEffect } from 'react';

const STATUS_LINES = [
  'Dipping quill into deep iron-gall ink...',
  'Scrutinizing candidate craft and strengths...',
  'Composing an unignorable opening hook...',
  'Weaving genuine proof of impact...',
  'Purging all corporate jargon and clichés...',
  'Applying the warm wax seal to the parchment...',
];

export function InkLoader() {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLineIndex((prev) => (prev + 1) % STATUS_LINES.length);
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ink-loader-stage" role="status" aria-live="polite">
      <div className="quill-animation-wrapper">
        <span className="quill-icon" aria-hidden="true">✒️</span>
        <div className="ink-drop" aria-hidden="true" />
      </div>

      <div className="ink-status-container">
        <p className="ink-status-text" key={currentLineIndex}>
          {STATUS_LINES[currentLineIndex]}
        </p>
        <span className="ink-status-subtext">The Inkwell studio is drafting your letter...</span>
      </div>
    </div>
  );
}
