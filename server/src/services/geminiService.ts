import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})

interface AIAnalysis {
    score: number;
    priority: "low" | "medium" | "high";
    summary: string;
}

export const analyzeLeadWithAI = async (
    lead: {
        name: string,
        company?: string | null,
        source?: string | null,
        notes?: string | null,
    }
): Promise<AIAnalysis>=> {
    const prompt = `
    Analyze this sales lead and return ONLY valid JSON.

    Lead Details:
    Name: ${lead.name}
    Company: ${lead.company || "N/A"}
    Source: ${lead.source || "N/A"}
    Notes: ${lead.notes || "N/A"}

    Return format: 
    {
        "score": number,
        "priority": "low" | "medium" | "high",
        "summary": "string"
    }
    `
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    })

    const text = response.text;

    const cleanedText = text
        ?.replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    const result = JSON.parse(cleanedText!);

    return result;
}

export default ai;