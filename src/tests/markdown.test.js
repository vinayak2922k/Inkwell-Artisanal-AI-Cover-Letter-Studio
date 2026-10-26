import { describe, it, expect } from 'vitest';
import { formatLetterContent } from '../lib/markdown.js';

describe('formatLetterContent', () => {
  it('converts markdown double line-breaks into distinct paragraphs', () => {
    const raw = 'Paragraph 1.\n\nParagraph 2.';
    const html = formatLetterContent(raw);
    expect(html).toContain('<p class="letter-paragraph">Paragraph 1.</p>');
    expect(html).toContain('<p class="letter-paragraph">Paragraph 2.</p>');
  });

  it('strips markdown headers and formats bold & italic properly', () => {
    const raw = '# Subject: Application\n\nI have **5+ years** of experience in *design*.';
    const html = formatLetterContent(raw);
    expect(html).not.toContain('#');
    expect(html).toContain('<strong>5+ years</strong>');
    expect(html).toContain('<em>design</em>');
  });

  it('sanitizes malicious script tags and event handlers via DOMPurify', () => {
    const malicious = 'Good morning.<script>alert("hacked")</script><img src="x" onerror="alert(1)" />\n\nSincerely.';
    const html = formatLetterContent(malicious);
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('onerror');
    expect(html).not.toContain('<img>');
    expect(html).toContain('Good morning.');
  });

  it('returns empty string for null or empty inputs safely', () => {
    expect(formatLetterContent('')).toBe('');
    expect(formatLetterContent(null)).toBe('');
    expect(formatLetterContent(undefined)).toBe('');
  });
});
