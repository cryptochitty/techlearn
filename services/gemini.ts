
import { GoogleGenAI, Type } from "@google/genai";

export const generateDraft = async () => {
  // Safe check for process.env to prevent crashes if undefined
  const apiKey = typeof process !== 'undefined' ? process.env?.API_KEY : null;
  
  if (!apiKey) {
    console.warn("API Key is missing. AI Generation is disabled.");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
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

    const data = JSON.parse(response.text);
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
    console.error("AI service error:", e);
    return null;
  }
};
