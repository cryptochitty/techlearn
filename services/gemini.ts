
import { GoogleGenAI, Type } from "@google/genai";

export const generateDraft = async () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please ensure your environment is configured.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Use gemini-3-pro-preview for complex reasoning and grounding
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Act as an elite technology journalist and SEO specialist.
    1. Research the absolute latest, breaking tech news or a trending high-impact topic in the industry.
    2. Write an authoritative, professional blog post (minimum 400 words) with deep analysis.
    3. The response MUST be valid JSON.
    4. Provide:
       - 'title': A headline optimized for clicks and SEO.
       - 'excerpt': A concise, intriguing hook.
       - 'content': Markdown-formatted body with multiple sections.
       - 'category': One of: Artificial Intelligence, Crypto & Web3, Software Development, Cloud Computing, Hardware & Gadgets, Cybersecurity, Future Tech.
       - 'metaDescription': A 155-character search snippet.
       - 'metaKeywords': 6 comma-separated high-volume keywords.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          excerpt: { type: Type.STRING },
          content: { type: Type.STRING },
          category: { type: Type.STRING },
          metaDescription: { type: Type.STRING },
          metaKeywords: { type: Type.STRING }
        },
        required: ["title", "excerpt", "content", "category", "metaDescription", "metaKeywords"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text);
    
    // Extract grounding URLs from metadata if present
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const urls = groundingChunks
      ?.filter(chunk => chunk.web)
      ?.map(chunk => ({
        uri: chunk.web?.uri || '',
        title: chunk.web?.title || 'Source'
      }))
      .filter(item => item.uri !== '');

    return { ...data, groundingUrls: urls };
  } catch (e) {
    console.error("Failed to parse AI response or grounding metadata", e);
    return null;
  }
};
