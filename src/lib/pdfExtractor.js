import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure the worker source for Vite build and dev
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
}

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB limit
export const MAX_RESUME_CHAR_LIMIT = 3000;

/**
 * Validates and extracts readable text from a resume PDF file.
 *
 * @param {File} file - PDF file from dropzone or file picker
 * @returns {Promise<{ text: string, pageCount: number, wordCount: number }>}
 */
export async function extractTextFromPdf(file) {
  if (!file) {
    throw new Error('No resume file was provided.');
  }

  // Validate file type
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  if (!isPdf) {
    throw new Error('Only PDF documents are supported for resume extraction.');
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    throw new Error(
      `File is too large (${sizeInMb} MB). Please upload a PDF under 5 MB.`
    );
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    });

    const pdf = await loadingTask.promise;
    const pageCount = pdf.numPages;
    const extractedPages = [];

    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => (item.str ? item.str : ''))
        .join(' ');
      if (pageText.trim()) {
        extractedPages.push(pageText.trim());
      }
    }

    const fullRawText = extractedPages.join('\n\n');
    // Normalize excess whitespace
    const normalizedText = fullRawText.replace(/\s+/g, ' ').trim();

    if (!normalizedText || normalizedText.length < 15) {
      throw new Error(
        'Unable to extract readable text. The PDF might be scanned or image-based.'
      );
    }

    // Cap the length sent to LLM to prevent context overflow while preserving essential highlights
    const trimmedText = normalizedText.slice(0, MAX_RESUME_CHAR_LIMIT);
    const wordCount = trimmedText.split(/\s+/).filter(Boolean).length;

    return {
      text: trimmedText,
      pageCount,
      wordCount,
    };
  } catch (err) {
    if (err.message && err.message.includes('PDF')) {
      throw err;
    }
    throw new Error(
      `Failed to parse PDF: ${err.message || 'Corrupted or unreadable format.'}`
    );
  }
}
