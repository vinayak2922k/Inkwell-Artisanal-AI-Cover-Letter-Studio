import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildCoverLetterPrompt } from './prompt.js';

/**
 * Inkwell — Gemini API Client
 *
 * Secure client for generating artisanal cover letters using Google Gemini free tier.
 * Never logs or prints the API key. Handles missing keys, 429 rate limits, network
 * drops, and timeouts gracefully.
 */

export class GeminiError extends Error {
  constructor(message, code, details) {
    super(message);
    this.name = 'GeminiError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Calls Google Gemini to author a bespoke cover letter.
 *
 * @param {Object} params
 * @param {string} params.name - Candidate name
 * @param {string} params.role - Target job role
 * @param {string} params.company - Target organization
 * @param {string[]|string} params.skills - Skills list or comma-separated string
 * @param {string} [params.resumeText] - Optional resume summary text
 * @param {string} [params.tone='confident'] - Tone of the letter
 * @returns {Promise<string>} Clean cover letter text
 */
export async function generateCoverLetter({
  name,
  role,
  company,
  skills,
  resumeText = '',
  tone = 'confident',
}) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_gemini_api_key_here')) {
    throw new GeminiError(
      'Gemini API key is not configured. Add your key to .env as VITE_GEMINI_API_KEY or toggle to Template Mode.',
      'MISSING_KEY'
    );
  }

  const { systemInstruction, userPrompt } = buildCoverLetterPrompt({
    name,
    role,
    company,
    skills,
    resumeText,
    tone,
  });

  try {
    // 25-second timeout controller
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(
            new GeminiError(
              'The Inkwell studio timed out waiting for the muse. Please try again.',
              'TIMEOUT'
            )
          ),
        25000
      )
    );

    const callPromise = (async () => {
      try {
        const genAI = new GoogleGenerativeAI(apiKey.trim());
        // Use gemini-1.5-flash which is widely supported on the free tier
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          systemInstruction: systemInstruction,
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            maxOutputTokens: 900,
          },
        });

        const response = await model.generateContent(userPrompt);
        const text = response?.response?.text();

        if (!text || text.trim().length === 0) {
          throw new GeminiError(
            'Received an empty draft from the AI model. Please retry.',
            'EMPTY_RESPONSE'
          );
        }

        return text.trim();
      } catch (sdkError) {
        // Fallback to direct REST API if SDK encounters any transport issues
        return await callGeminiViaRest(apiKey.trim(), systemInstruction, userPrompt, sdkError);
      }
    })();

    return await Promise.race([callPromise, timeoutPromise]);
  } catch (err) {
    if (err instanceof GeminiError) {
      throw err;
    }

    const errorMsg = String(err?.message || '');

    if (errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED')) {
      throw new GeminiError(
        'Gemini rate limit reached on the free tier quota. Please pause for 15 seconds and try again.',
        'RATE_LIMIT',
        err
      );
    }

    if (errorMsg.includes('API_KEY_INVALID') || errorMsg.includes('403') || errorMsg.includes('PERMISSION_DENIED')) {
      throw new GeminiError(
        'The provided Gemini API key appears invalid or lacks permissions. Please check your .env file.',
        'INVALID_KEY',
        err
      );
    }

    if (!navigator.onLine) {
      throw new GeminiError(
        'You appear to be offline. Check your network connection.',
        'OFFLINE',
        err
      );
    }

    throw new GeminiError(
      `Generation failed: ${errorMsg || 'Unable to connect to Gemini API.'}`,
      'API_ERROR',
      err
    );
  }
}

/**
 * Direct REST fallback for Google Gemini v1beta endpoint
 */
async function callGeminiViaRest(apiKey, systemInstruction, userPrompt, previousError) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    system_instruction: {
      parts: [{ text: systemInstruction }],
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 900,
    },
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    if (response.status === 429) {
      throw new GeminiError(
        'Gemini rate limit reached on free tier. Please wait a moment before trying again.',
        'RATE_LIMIT'
      );
    }
    if (response.status === 403 || response.status === 400) {
      throw new GeminiError(
        'Gemini request was rejected. Verify your API key in .env.',
        'AUTH_ERROR'
      );
    }
    throw new GeminiError(
      `REST endpoint returned status ${response.status}`,
      'REST_ERROR',
      errorBody
    );
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new GeminiError('Received empty content from Gemini REST.', 'EMPTY_RESPONSE');
  }

  return text.trim();
}
