import { openai } from './client';

export async function generateEmbedding(text: string): Promise<number[]> {
    // Sanitize input
    const cleanText = text.replace(/\n/g, ' ').trim();

    if (!cleanText) return [];

    try {
        const response = await openai.embeddings.create({
            model: "text-embedding-3-small", // 1536 dimensions, matches our vector(1536) in DB
            input: cleanText,
            encoding_format: "float",
        });

        return response.data[0].embedding;
    } catch (error) {
        console.error("Error generating embedding:", error);
        return []; // Fail gracefully or throw depending on tolerance
    }
}
