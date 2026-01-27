import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_PREMIUM || process.env.OPENAI_API_KEY_FREE;

if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY environment variable (checked standard, premium, and free)');
}

export const openai = new OpenAI({
    apiKey: apiKey,
});
