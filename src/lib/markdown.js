import DOMPurify from 'dompurify';

/**
 * Inkwell — Markdown to Clean HTML Parser & Sanitizer
 *
 * Converts model markdown into clean, elegant typography for stationery print.
 * Strips raw markdown hashtags, handles bold/italics, groups paragraphs,
 * and sanitizes via DOMPurify to prevent XSS.
 *
 * @param {string} text - Raw text or markdown from LLM
 * @returns {string} Sanitized HTML string safe for innerHTML rendering
 */
export function formatLetterContent(text) {
  if (!text || typeof text !== 'string') return '';

  // 1. Normalize line endings
  let cleaned = text.replace(/\r\n/g, '\n').trim();

  // 2. Strip leading hashtags from markdown headers (e.g., "# Dear...", "## Cover Letter")
  cleaned = cleaned.replace(/^#{1,6}\s*(.*)$/gm, '$1');

  // 3. Strip markdown blockquotes or code fences if model accidentally outputs them
  cleaned = cleaned.replace(/^>\s*/gm, '');
  cleaned = cleaned.replace(/```[a-z]*\n?/g, '');

  // 4. Split into distinct paragraphs on double line-breaks
  const rawParagraphs = cleaned
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  // 5. Format each paragraph: handle bold, italic, and single linebreaks
  const htmlParagraphs = rawParagraphs.map((para) => {
    // Bold: **text** or __text__
    let formatted = para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/__(.*?)__/g, '<strong>$1</strong>');

    // Italic: *text* or _text_
    formatted = formatted.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
    formatted = formatted.replace(/(?<!_)_(?!_)(.*?)(?<!_)_(?!_)/g, '<em>$1</em>');

    // Soft breaks inside a paragraph (e.g. addresses or sign-offs)
    formatted = formatted.replace(/\n/g, '<br />');

    return `<p class="letter-paragraph">${formatted}</p>`;
  });

  const assembledHtml = htmlParagraphs.join('');

  // 6. Sanitize with DOMPurify
  return DOMPurify.sanitize(assembledHtml, {
    ALLOWED_TAGS: ['p', 'strong', 'em', 'span', 'br'],
    ALLOWED_ATTR: ['class'],
  });
}
