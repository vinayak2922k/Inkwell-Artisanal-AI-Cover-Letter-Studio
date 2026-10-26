/**
 * Inkwell — Template Letter Builder (Phase 1)
 *
 * Generates an articulate, human-sounding cover letter interpolating candidate data
 * into a structured editorial template without clichés or buzzwords.
 *
 * @param {Object} data
 * @param {string} data.name - Candidate's full name
 * @param {string} data.role - Target job title / craft
 * @param {string} data.company - Target organization
 * @param {string[]|string} data.skills - Array of skill tags or comma-separated string
 * @param {string} [data.tone] - Optional tone ('formal', 'confident', 'warm')
 * @returns {string} Fully composed cover letter formatted with paragraph breaks
 */
export function buildTemplateLetter(data = {}) {
  const name = (data.name || '').trim() || 'Alex Mercer';
  const role = (data.role || '').trim() || 'Product Designer';
  const company = (data.company || '').trim() || 'Acme Studios';
  const tone = data.tone || 'confident';

  // Normalize skills into array
  const rawSkills = Array.isArray(data.skills)
    ? data.skills
    : (data.skills || '').split(',').map((s) => s.trim()).filter(Boolean);

  const skillsList = rawSkills.length > 0 ? rawSkills : ['thoughtful system design', 'end-to-end execution', 'cross-functional collaboration'];
  const primarySkills = skillsList.slice(0, 3).join(', ');
  const complementarySkill = skillsList[3] ? ` alongside hands-on capability in ${skillsList[3]}` : '';

  // Tone variations for authentic stationery voice
  const openings = {
    warm: `Dear Hiring Team at ${company},\n\nI have followed ${company}'s work with genuine appreciation for how you balance craft with real-world impact. When I saw the opening for a ${role}, I felt compelled to reach out directly. The opportunity to contribute to a team whose standards match my own is rare, and it is precisely the kind of work I care about doing.`,
    formal: `Dear Hiring Committee at ${company},\n\nI am writing to express my formal interest in the ${role} position currently open at ${company}. Having tracked your organization's trajectory and disciplined execution in the field, I believe my background aligns closely with the rigors and responsibilities this role demands.`,
    confident: `Dear Hiring Team at ${company},\n\nGreat teams are rarely built on templates; they are built by people who take genuine ownership of their craft. That is the conviction I bring to the ${role} role at ${company}. Having observed how your team solves problems with clarity and ambition, I am eager to put my background directly in service of your next milestones.`,
  };

  const bodyParagraph1 = `Over the course of my career as ${name}, I have focused on delivering substance over rhetoric. My everyday toolkit centers on ${primarySkills}${complementarySkill}. Rather than treating these as abstract proficiencies, I apply them to untangle complex requirements, build resilient systems, and ensure every detail serves a clear, demonstrable purpose.`;

  const bodyParagraph2 = `What draws me particularly to ${company} is the standard of work you put into the world. In taking on the responsibilities of ${role}, my focus will be on shortening the distance between strategy and reality—collaborating closely with your team, listening attentively, and executing with quiet consistency.`;

  const closings = {
    warm: `Thank you for taking the time to read through my background. I would welcome the chance to talk through how my experience can support ${company}'s current priorities.\n\nWarm regards,\n\n${name}`,
    formal: `Thank you for your consideration. I welcome an opportunity to discuss how my qualifications will advance the goals of ${company}.\n\nSincerely,\n\n${name}`,
    confident: `I would welcome thirty minutes to hear where the team's greatest challenges lie right now and how I can help solve them from day one. Thank you for your time and consideration.\n\nRespectfully,\n\n${name}`,
  };

  const chosenOpening = openings[tone] || openings.confident;
  const chosenClosing = closings[tone] || closings.confident;

  return `${chosenOpening}\n\n${bodyParagraph1}\n\n${bodyParagraph2}\n\n${chosenClosing}`;
}
