/**
 * Serverless API Proxy for Vercel / Netlify / Cloud Functions
 *
 * Route: POST /api/generate
 * Keeps GEMINI_API_KEY securely on the server side in production.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY is not configured on the server.',
    });
  }

  try {
    const { name, role, company, skills, resumeText, tone } = req.body || {};

    const normalizedSkills = Array.isArray(skills)
      ? skills.join(', ')
      : (skills || '');

    const systemInstruction = `You are a master career coach and senior editorial letter writer at "Inkwell".
Write an authentic, persuasive cover letter between 250 and 350 words.
Structure: Hook (Dear Hiring Team at ${company}), Proof (skills: ${normalizedSkills}), Fit, Close.
Ban: revolutionize, unleash, seamless, synergy, placeholders. Output clean prose paragraphs.`;

    const userPrompt = `Candidate: ${name || 'Candidate'}
Role: ${role || 'Role'}
Company: ${company || 'Company'}
Skills: ${normalizedSkills}
Tone: ${tone || 'confident'}
Resume Context: ${resumeText ? resumeText.slice(0, 2500) : 'None'}`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 900 },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return res.status(200).json({ coverLetter: text });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal server error.' });
  }
}
