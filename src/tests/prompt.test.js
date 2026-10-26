import { describe, it, expect } from 'vitest';
import { buildCoverLetterPrompt } from '../lib/prompt.js';

describe('buildCoverLetterPrompt', () => {
  it('builds system instructions with persona, structure, and constraints', () => {
    const { systemInstruction, userPrompt } = buildCoverLetterPrompt({
      name: 'Maya Lin',
      role: 'Staff Product Designer',
      company: 'Linear Labs',
      skills: ['Figma Systems', 'User Research', 'Design Operations'],
      tone: 'confident',
    });

    expect(systemInstruction).toContain('master career coach');
    expect(systemInstruction).toContain('Linear Labs');
    expect(systemInstruction).toContain('Staff Product Designer');
    expect(systemInstruction).toContain('Maya Lin');
    expect(systemInstruction).toContain('BANNED WORDS');
    expect(systemInstruction).toContain('revolutionize');
    expect(systemInstruction).toContain('seamless');

    expect(userPrompt).toContain('Candidate Name: Maya Lin');
    expect(userPrompt).toContain('Target Role: Staff Product Designer');
    expect(userPrompt).toContain('Figma Systems, User Research, Design Operations');
  });

  it('incorporates resume background when provided', () => {
    const { userPrompt } = buildCoverLetterPrompt({
      name: 'Julian Croft',
      role: 'Founding Engineer',
      company: 'Stripe',
      skills: ['Rust', 'Distributed Systems'],
      resumeText: 'Built low latency payment gateways scaling to 100k TPS.',
    });

    expect(userPrompt).toContain('Candidate Resume Summary/Background:');
    expect(userPrompt).toContain('low latency payment gateways');
  });

  it('adapts tone instructions according to selection', () => {
    const warmPrompt = buildCoverLetterPrompt({
      name: 'Sara',
      role: 'Community Lead',
      company: 'Notion',
      tone: 'warm',
    });
    expect(warmPrompt.systemInstruction).toContain('Empathetic, authentic, and collegiate');

    const formalPrompt = buildCoverLetterPrompt({
      name: 'David',
      role: 'Counsel',
      company: 'Baker & McKenzie',
      tone: 'formal',
    });
    expect(formalPrompt.systemInstruction).toContain('Distinguished, respectful, and classic');
  });
});
