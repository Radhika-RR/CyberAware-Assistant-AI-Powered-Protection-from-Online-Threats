import { GoogleGenAI, Type } from "@google/genai";
import type { Source, PhishingResult } from '../types';

// FIX: Corrected API key access to use process.env.API_KEY as per guidelines. This resolves the TypeScript error for `import.meta.env`.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface ChatbotResponse {
    summary: string;
    sources: Source[];
}

export const getCybersecurityInfo = async (query: string): Promise<ChatbotResponse> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: query,
            config: {
                tools: [{ googleSearch: {} }],
                systemInstruction: "You are an expert cybersecurity assistant. Your goal is to answer user questions about cybersecurity topics concisely and accurately in under 150 words. Use the provided search results to formulate your answer. Always cite your sources by providing the title and URI.",
            },
        });

        const summary = response.text;
        
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources: Source[] = groundingChunks
            .map((chunk: any) => ({
                title: chunk.web?.title || 'Untitled',
                link: chunk.web?.uri || '#',
            }))
            .filter((source: Source) => source.link !== '#');

        // Deduplicate sources based on the link
        const uniqueSources = Array.from(new Map(sources.map(item => [item['link'], item])).values());


        return { summary, sources: uniqueSources };

    } catch (error) {
        console.error("Error fetching from Gemini API:", error);
        return {
            summary: "I'm sorry, I encountered an error while trying to find information. Please check your API key and network connection, then try again.",
            sources: [],
        };
    }
};

export const analyzePhishingThreat = async (text: string): Promise<PhishingResult> => {
    try {
        const prompt = `Analyze the following text for phishing indicators. Classify it as "SAFE" or "PHISHING". Provide a confidence score (probability) and a list of detected features that influenced your decision. Focus on common phishing tactics like urgency, suspicious links, grammatical errors, and unusual sender details.
        
Text to analyze:
---
${text}
---`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        prediction: {
                            type: Type.STRING,
                            enum: ['SAFE', 'PHISHING'],
                            description: 'The final classification of the text.'
                        },
                        probability: {
                            type: Type.NUMBER,
                            description: 'The confidence score for the prediction, from 0.0 to 1.0.'
                        },
                        features: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING, description: 'Name of the detected phishing indicator.' },
                                    detected: { type: Type.BOOLEAN, description: 'True if the indicator was detected.' }
                                },
                                required: ['name', 'detected']
                            },
                            description: 'A list of phishing indicators and their detection status.'
                        }
                    },
                    required: ['prediction', 'probability', 'features']
                }
            }
        });

        const jsonStr = response.text.trim();
        const result: PhishingResult = JSON.parse(jsonStr);
        return result;
    } catch (error) {
        console.error("Error analyzing phishing threat:", error);
        return {
            prediction: 'SAFE',
            probability: 0,
            features: [{ name: 'An error occurred during analysis. Please try again.', detected: true }],
        };
    }
};