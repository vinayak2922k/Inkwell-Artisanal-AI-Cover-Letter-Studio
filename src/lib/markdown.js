import DOMPurify from 'dompurify';

export function formatLetterContent(text) {
  if (!text || typeof text !== 'string') return '';

  let cleaned = text.replace(/\r\n/g, '\n').trim();
  cleaned = cleaned.replace(/^#{1,6}\s*(.*)$/gm, '$1');
  cleaned = cleaned.replace(/^>\s*/gm, '');
  cleaned = cleaned.replace(/```[a-z]*\n?/g, '');

  const rawParagraphs = cleaned
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const htmlParagraphs = rawParagraphs.map((para) => {
    let formatted = para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/__(.*?)__/g, '<strong>$1</strong>');
    formatted = formatted.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
    formatted = formatted.replace(/(?<!_)_(?!_)(.*?)(?<!_)_(?!_)/g, '<em>$1</em>');
    formatted = formatted.replace(/\n/g, '<br />');

    return `<p class="letter-paragraph">${formatted}</p>`;
  });

  const assembledHtml = htmlParagraphs.join('');

  return DOMPurify.sanitize(assembledHtml, {
    ALLOWED_TAGS: ['p', 'strong', 'em', 'span', 'br'],
    ALLOWED_ATTR: ['class'],
  });
}
