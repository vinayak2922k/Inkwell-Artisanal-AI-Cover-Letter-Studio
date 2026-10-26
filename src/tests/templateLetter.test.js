import { describe, it, expect } from 'vitest';
import { buildTemplateLetter } from '../lib/templateLetter.js';

describe('buildTemplateLetter', () => {
  it('interpolates name, role, company, and skills array correctly', () => {
    const letter = buildTemplateLetter({
      name: 'Eleanor Vance',
      role: 'Staff Systems Architect',
      company: 'Meridian Labs',
      skills: ['Distributed Systems', 'Rust', 'Event Sourcing'],
      tone: 'formal',
    });

    expect(letter).toContain('Meridian Labs');
    expect(letter).toContain('Staff Systems Architect');
    expect(letter).toContain('Eleanor Vance');
    expect(letter).toContain('Distributed Systems, Rust, Event Sourcing');
    expect(letter).toContain('Sincerely,');
  });

  it('handles comma-separated skill string cleanly', () => {
    const letter = buildTemplateLetter({
      name: 'Julian Croft',
      role: 'Typographer',
      company: 'Monotype Foundry',
      skills: 'Kerning, Variable Fonts, OpenType',
      tone: 'warm',
    });

    expect(letter).toContain('Monotype Foundry');
    expect(letter).toContain('Julian Croft');
    expect(letter).toContain('Kerning, Variable Fonts, OpenType');
    expect(letter).toContain('Warm regards,');
  });

  it('provides safe fallbacks for missing input fields without throwing', () => {
    const letter = buildTemplateLetter({});
    expect(typeof letter).toBe('string');
    expect(letter.length).toBeGreaterThan(100);
    expect(letter).toContain('Dear Hiring Team');
  });

  it('avoids buzzwords like Revolutionize, Unleash, Seamless', () => {
    const letter = buildTemplateLetter({
      name: 'Sara Lin',
      role: 'Frontend Lead',
      company: 'Veritas',
      skills: ['React', 'CSS Architecture'],
    });

    expect(letter).not.toMatch(/revolutionize/i);
    expect(letter).not.toMatch(/unleash/i);
    expect(letter).not.toMatch(/seamless/i);
  });

  it('incorporates resumeText highlights when attached', () => {
    const letter = buildTemplateLetter({
      name: 'Marcus Bell',
      role: 'Site Reliability Engineer',
      company: 'Cloudflare',
      skills: ['Kubernetes', 'Go'],
      resumeText: 'Maintained 99.999% uptime across 40 global points of presence.',
    });

    expect(letter).toContain('Maintained 99.999% uptime');
    expect(letter).toContain('As highlighted in my attached record');
  });
});
