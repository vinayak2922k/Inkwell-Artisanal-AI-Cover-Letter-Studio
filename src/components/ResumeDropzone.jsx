import React, { useState, useRef } from 'react';
import { extractTextFromPdf } from '../lib/pdfExtractor';

/**
 * ResumeDropzone provides a stationery-styled docket dropzone for PDF resumes.
 * Supports drag and drop, file browsing, validation (PDF only, max 5 MB),
 * extraction progress, and chip removal.
 */
export function ResumeDropzone({ onResumeExtracted, onResumeRemoved, currentResume }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleProcessFile = async (file) => {
    setErrorMessage('');
    if (!file) return;

    setIsExtracting(true);
    try {
      const result = await extractTextFromPdf(file);
      onResumeExtracted({
        fileName: file.name,
        fileSize: file.size,
        text: result.text,
        wordCount: result.wordCount,
        pageCount: result.pageCount,
      });
    } catch (err) {
      setErrorMessage(err.message || 'Unable to read the resume.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleProcessFile(files[0]);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleProcessFile(files[0]);
    }
    // Reset file input so selecting the same file triggers change
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setErrorMessage('');
    onResumeRemoved();
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) {
      return `${Math.round(bytes / 1024)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="resume-dropzone-section">
      <label className="form-field__label">Resume Docket (Optional)</label>
      <span className="form-field__microcopy">
        Drop a PDF to enrich the letter with real accomplishments from your career
      </span>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        id="resume-file-input"
        accept="application/pdf,.pdf"
        className="visually-hidden"
        onChange={handleFileChange}
        disabled={isExtracting}
      />

      {/* Render File Chip when resume is attached */}
      {currentResume && currentResume.fileName ? (
        <div className="resume-chip" role="status">
          <div className="resume-chip__info">
            <span className="resume-chip__icon" aria-hidden="true">📄</span>
            <div>
              <span className="resume-chip__name" title={currentResume.fileName}>
                {currentResume.fileName}
              </span>
              <span className="resume-chip__meta">
                {formatFileSize(currentResume.fileSize)} · ~{currentResume.wordCount} words extracted
              </span>
            </div>
          </div>

          <button
            type="button"
            className="resume-chip__remove"
            onClick={handleRemove}
            id="remove-resume-button"
            title="Remove attached resume"
            aria-label="Remove attached resume"
          >
            ×
          </button>
        </div>
      ) : (
        /* Dropzone Docket */
        <div
          className={`dropzone-box ${isDragging ? 'dragging' : ''} ${isExtracting ? 'extracting' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          aria-label="Upload resume PDF (click or drag & drop)"
          id="resume-dropzone-button"
        >
          {isExtracting ? (
            <div className="dropzone-extracting">
              <span className="quill-spin" aria-hidden="true">📜</span>
              <span>Scanning parchment with PDF optics...</span>
            </div>
          ) : (
            <div className="dropzone-content">
              <span className="dropzone-icon" aria-hidden="true">📎</span>
              <span className="dropzone-instruction">
                <strong>Click to browse</strong> or slide a PDF onto the desk
              </span>
              <span className="dropzone-sub">PDF documents only · Up to 5 MB</span>
            </div>
          )}
        </div>
      )}

      {errorMessage && (
        <span className="form-field__error" role="alert" id="resume-error">
          {errorMessage}
        </span>
      )}
    </div>
  );
}
