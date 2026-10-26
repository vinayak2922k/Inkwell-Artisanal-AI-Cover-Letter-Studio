import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildCoverLetterPrompt } from './prompt.js';

/**
 * Inkwell — Gemini API Client
 *
 * Secure client for generating artisanal cover letters using Google Gemini.
 * Never logs or prints the API key. Supports multi-model fallback across
 * modern flash models, 429 rate limits, and network errors.
 */

export class GeminiError extends Error {
  constructor(message, code, details) {
    super(message);
    this.name = 'GeminiError';
    this.code = code;
    this.details = details;
  }
}

// Ordered list of candidate models for resilience across Google AI Studio tiers
const CANDIDATE_MODELS = [
  'gemini-flash-lite-latest',
  'gemini-3-flash-preview',
  'gemini-2.5-flash',
  'gemini-1.5-flash',
];

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
    // 30-second timeout controller
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(
            new GeminiError(
              'The Inkwell studio timed out waiting for the muse. Please try again.',
              'TIMEOUT'
            )
          ),
        30000
      )
    );

    const callPromise = (async () => {
      const cleanKey = apiKey.trim();
      let lastError = null;

      // Try SDK first across candidate models
      for (const modelName of CANDIDATE_MODELS) {
        try {
          const genAI = new GoogleGenerativeAI(cleanKey);
          const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: systemInstruction,
            generationConfig: {
              temperature: 0.7,
              topP: 0.9,
              maxOutputTokens: 900,
            },
          });

          const response = await model.generateContent(userPrompt);
          const text = response?.response?.text();

          if (text && text.trim().length > 0) {
            return text.trim();
          }
        } catch (err) {
          lastError = err;
          // Continue to next model on 404/503/400
        }
      }

      // If SDK pass fails, attempt direct REST fallback with candidate models
      return await callGeminiViaRest(cleanKey, systemInstruction, userPrompt, lastError);
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
 * Direct REST fallback for Google Gemini v1beta endpoint with model rotation
 */
async function callGeminiViaRest(apiKey, systemInstruction, userPrompt, previousError) {
  let lastResponseText = '';

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

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

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim().length > 0) {
          return text.trim();
        }
      } else {
        lastResponseText = await response.text();
        if (response.status === 429) {
          throw new GeminiError(
            'Gemini rate limit reached on free tier. Please wait a moment before trying again.',
            'RATE_LIMIT'
          );
        }
      }
    } catch (e) {
      if (e instanceof GeminiError) throw e;
      // continue to next model
    }
  }

  throw new GeminiError(
    `Unable to generate letter with available Gemini models. ${lastResponseText || previousError?.message || ''}`,
    'REST_ERROR'
  );
}
