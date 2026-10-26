import React, { useState } from 'react';
import { InkLoader } from './InkLoader';
import { ErrorNotice } from './ErrorNotice';
import { formatLetterContent } from '../lib/markdown';

/**
 * LetterCard displays the finalized cover letter on an artisanal stationery sheet,
 * styled with subtle paper grain, 1° tilt that straightens on hover, wax seal badge,
 * sanitized markdown-to-HTML rendering, and ink-fill copy button with fallback.
 */
export function LetterCard({
  letterText,
  candidateName,
  targetRole,
  targetCompany,
  mode,
  isLoading,
  error,
  onRetry,
  onSwitchToTemplate,
  onRegenerate,
}) {
  const [copied, setCopied] = useState(false);

  // Fallback clipboard copying for environments without navigator.clipboard
  const copyToClipboard = async () => {
    if (!letterText) return;

    let successful = false;
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(letterText);
        successful = true;
      } catch (err) {
        successful = false;
      }
    }

    if (!successful) {
      // Fallback via temporary textarea
      const textArea = document.createElement('textarea');
      textArea.value = letterText;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        successful = true;
      } catch (err) {
        console.error('Fallback copy failed', err);
      }
      document.body.removeChild(textArea);
    }

    if (successful) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  const downloadTextFile = () => {
    if (!letterText) return;
    const blob = new Blob([letterText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeName = (candidateName || 'Cover_Letter').replace(/[^a-zA-Z0-9]/g, '_');
    link.download = `${safeName}_Inkwell_Letter.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Convert model's markdown into clean, sanitized HTML paragraphs via DOMPurify
  const sanitizedHtml = letterText ? formatLetterContent(letterText) : '';
  const wordCount = letterText ? letterText.trim().split(/\s+/).filter(Boolean).length : 0;
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <section className="letter-stage" aria-label="Letter Preview">
      {/* If an error occurred during generation, display stationery notice */}
      {error && (
        <ErrorNotice
          error={error}
          onRetry={onRetry}
          onSwitchToTemplate={onSwitchToTemplate}
        />
      )}

      <div className="letter-sheet" id="letter-sheet-card">
        {/* Stationery Header */}
        <div className="letter-header">
          <div>
            <h2 className="letter-candidate-name">
              {candidateName || 'Alex Mercer'}
            </h2>
            <div className="letter-candidate-role">
              {targetRole || 'Candidate for Role'}
              {targetCompany ? ` · For ${targetCompany}` : ''}
            </div>
          </div>
          <div className="letter-date">
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Dynamic Display: InkLoader while drafting, sanitized prose when ready, or placeholder */}
        {isLoading ? (
          <InkLoader />
        ) : sanitizedHtml ? (
          <div className="letter-content" id="letter-content-body">
            <div
              className="letter-prose"
              dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            />

            {/* Wax Seal / Stamp badge */}
            <div className="wax-seal" title="Sealed at the Inkwell Desk" aria-hidden="true">
              <span>✒</span>
            </div>
          </div>
        ) : (
          <div className="letter-placeholder">
            <span className="letter-placeholder__icon" aria-hidden="true">📜</span>
            <h3 className="letter-placeholder__heading">The Stationery is Blank</h3>
            <p className="letter-placeholder__text">
              Fill in your candidate details on the notepad to the left and click
              <strong> "Pen the Letter"</strong> to draft your bespoke correspondence.
            </p>
          </div>
        )}
      </div>

      {/* Toolbar beneath the paper sheet */}
      {!isLoading && letterText && (
        <div className="letter-toolbar">
          <div className="letter-meta-badge">
            <span>{wordCount} words</span>
            <span>·</span>
            <span>{mode === 'ai' ? 'Drafted via Gemini' : 'Drafted via Template'}</span>
          </div>

          <div className="letter-toolbar__actions">
            {onRegenerate && (
              <button
                type="button"
                className="btn-desk-tool"
                onClick={onRegenerate}
                id="btn-regenerate-letter"
                title="Draft another variation with the same details"
              >
                <span>↺ Reword</span>
              </button>
            )}

            <button
              type="button"
              className="btn-desk-tool"
              onClick={downloadTextFile}
              id="btn-download-txt"
              title="Download letter as .txt file"
            >
              <span>💾 .txt</span>
            </button>

            {/* Custom ink-fill Copy button */}
            <button
              type="button"
              className={`btn-copy-ink ${copied ? 'copied' : ''}`}
              onClick={copyToClipboard}
              id="copy-letter-button"
              aria-label="Copy letter to clipboard"
            >
              <div className="btn-copy-ink__fill" aria-hidden="true" />
              <span>{copied ? 'Copied ✓' : 'Copy to Clipboard'}</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
