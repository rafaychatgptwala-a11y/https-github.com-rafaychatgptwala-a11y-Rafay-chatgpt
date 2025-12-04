import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { ChatVersion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getModelConfig = (version: ChatVersion) => {
  const baseInstruction = "You are Rafay GPT, a highly intelligent AI assistant.";
  
  switch (version) {
    case 'v1': // Lite
      return {
        model: 'gemini-flash-lite-latest',
        systemInstruction: `${baseInstruction} You are Rafay GPT Lite (v1). You are optimized for speed. Provide extremely concise, direct, and brief answers. Do not use filler words.`,
      };
    case 'v2': // Flash
      return {
        model: 'gemini-2.5-flash',
        systemInstruction: `${baseInstruction} You are Rafay GPT Standard (v2). You are a helpful and versatile assistant. Provide clear, balanced, and friendly responses suitable for general day-to-day tasks.`,
      };
    case 'v3': // Pro
      return {
        model: 'gemini-3-pro-preview',
        systemInstruction: `${baseInstruction} You are Rafay GPT Pro (v3). You are running on the most advanced reasoning model. Provide comprehensive, detailed, and academically rigorous answers. You excel at creative writing and complex explanations.`,
      };
    case 'v4': // Coding Expert
      return {
        model: 'gemini-3-pro-preview',
        systemInstruction: `${baseInstruction} You are Rafay GPT Dev (v4). You are a world-class Senior Software Engineer. When asked to code, ALWAYS provide production-ready, clean, and efficient code. Use modern best practices (e.g., React hooks, functional programming). Always explain your technical choices briefly. Wrap all code in Markdown blocks.`,
      };
    case 'v5': // Thinking / Creative
      return {
        model: 'gemini-3-pro-preview',
        systemInstruction: `${baseInstruction} You are Rafay GPT Ultimate (v5). You have deep reasoning capabilities enabled. Analyze the user's request step-by-step, consider multiple perspectives, and solve complex problems with high accuracy.`,
        thinkingBudget: 8192, // High budget for deep thinking
      };
    default:
      return {
        model: 'gemini-2.5-flash',
        systemInstruction: baseInstruction,
      };
  }
};

export const createChatSession = (version: ChatVersion) => {
  const config = getModelConfig(version);
  
  const chatConfig: any = {
    systemInstruction: config.systemInstruction,
  };

  if (config.thinkingBudget) {
    chatConfig.thinkingConfig = { thinkingBudget: config.thinkingBudget };
  }

  return ai.chats.create({
    model: config.model,
    config: chatConfig,
  });
};

export const generateImage = async (prompt: string, version: ChatVersion): Promise<string | null> => {
  try {
    // Use Pro Image model for higher versions (v3, v4, v5) for better quality
    // v1 and v2 use the faster flash-image model
    const usePro = ['v3', 'v4', 'v5'].includes(version);
    const model = usePro ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [{ text: prompt }],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

export const sendMessageStream = async (
  chat: Chat, 
  message: string,
  onChunk: (text: string) => void
) => {
  const result = await chat.sendMessageStream({ message });
  for await (const chunk of result) {
    const text = (chunk as GenerateContentResponse).text;
    if (text) {
      onChunk(text);
    }
  }
};