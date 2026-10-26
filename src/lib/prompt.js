/**
 * Inkwell — Prompt Engineering Engine
 *
 * Programmatically constructs an artisanal, high-fidelity system prompt and user brief
 * for Google Gemini. Sets the coach persona, editorial structure (hook, proof, fit, close),
 * and enforces a strict ban on buzzwords and placeholders.
 */

/**
 * Builds the system instructions and user prompt for Gemini cover letter generation.
 *
 * @param {Object} params
 * @param {string} params.name - Candidate full name
 * @param {string} params.role - Target craft/role
 * @param {string} params.company - Target organization
 * @param {string[]|string} params.skills - List of key skills or comma-separated string
 * @param {string} [params.resumeText] - Optional extracted resume text
 * @param {string} [params.tone='confident'] - Tone: 'confident' | 'warm' | 'formal'
 * @returns {{ systemInstruction: string, userPrompt: string }}
 */
export function buildCoverLetterPrompt({
  name,
  role,
  company,
  skills = [],
  resumeText = '',
  tone = 'confident',
}) {
  const candidateName = (name || '').trim() || 'the candidate';
  const targetRole = (role || '').trim() || 'the target role';
  const targetCompany = (company || '').trim() || 'the target company';

  const normalizedSkills = Array.isArray(skills)
    ? skills.filter(Boolean)
    : (skills || '').split(',').map((s) => s.trim()).filter(Boolean);

  const skillsString = normalizedSkills.length > 0
    ? normalizedSkills.join(', ')
    : 'clear communication, problem-solving, and disciplined execution';

  const toneGuides = {
    confident: 'Direct, poised, and outcome-oriented without being boastful. Shows high conviction in craft and ownership.',
    warm: 'Empathetic, authentic, and collegiate. Centers shared values, collaboration, and meaningful dedication to the mission.',
    formal: 'Distinguished, respectful, and classic. Uses elevated vocabulary and traditional professional cadence.',
  };

  const selectedToneGuide = toneGuides[tone] || toneGuides.confident;

  const systemInstruction = `You are a master career coach and senior editorial letter writer at an artisanal studio called "Inkwell".
Your mission is to write a bespoke, persuasive, and deeply human cover letter that feels like it was drafted at a mahogany writer's desk.

STRICT EDITORIAL RULES:
1. Tone: ${selectedToneGuide}
2. Length: Strictly between 250 and 350 words. Do not make it overly long or curt.
3. Structure:
   - Paragraph 1 (Hook): Address "Dear Hiring Team at ${targetCompany}". Express genuine, informed interest in ${targetCompany} and why this specific opening for ${targetRole} matters.
   - Paragraph 2 (Proof): Anchor on the candidate's core skills (${skillsString}) with tangible impact and problem-solving maturity. If resume background is provided, synthesize authentic achievements rather than merely repeating bullets.
   - Paragraph 3 (Fit): Bridge the candidate's craft to ${targetCompany}'s trajectory and standard of excellence.
   - Paragraph 4 (Close): A grounded, professional invitation for a conversation. Conclude with an appropriate sign-off and the candidate's name: "${candidateName}".
4. BANNED WORDS & CLICHÉS:
   - NEVER use: "revolutionize", "unleash", "seamless", "synergy", "paradigm shift", "dynamic professional", "hard worker", "results-driven", "fast learner", "think outside the box", "plethora", "spearheaded".
   - NEVER include placeholders like "[Your Name]", "[Company]", "[Insert skill]", or "[Date]".
5. FORMATTING:
   - Return clean, natural prose paragraphs separated by a blank line.
   - Do NOT use markdown headers (no #), no bullet points, and avoid bold asterisks (**). Output pure, beautiful letter prose.`;

  let userPrompt = `Please write a bespoke cover letter with the following parameters:
- Candidate Name: ${candidateName}
- Target Role: ${targetRole}
- Target Organization: ${targetCompany}
- Core Skills & Proficiencies: ${skillsString}
- Desired Tone: ${tone}`;

  if (resumeText && resumeText.trim().length > 0) {
    userPrompt += `\n\n- Candidate Resume Summary/Background:\n"""\n${resumeText.trim().slice(0, 3000)}\n"""\nPlease organically weave the candidate's real experience into the letter where relevant.`;
  }

  return { systemInstruction, userPrompt };
}
