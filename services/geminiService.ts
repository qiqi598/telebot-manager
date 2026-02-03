import { GoogleGenAI, Modality } from "@google/genai";

// Use process.env.API_KEY as strictly required by guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Basic text chat generation using Gemini 3 Flash
 */
export const generateChatResponse = async (history: {role: string, parts: {text: string}[]}[], message: string): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      history: history,
    });
    
    const result = await chat.sendMessage({ message });
    return result.text || "I couldn't generate a text response.";
  } catch (error) {
    console.error("Chat Error:", error);
    throw error;
  }
};

/**
 * Vision analysis using Gemini 2.5 Flash Image
 */
export const analyzeImage = async (base64Data: string, prompt: string): Promise<string> => {
  try {
    // Remove data URL prefix if present for clean base64
    const cleanBase64 = base64Data.split(',')[1] || base64Data;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/png', // Assuming PNG or JPEG, API is flexible
            },
          },
          {
            text: prompt || "Describe this image in detail.",
          },
        ],
      },
    });

    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Vision Error:", error);
    throw error;
  }
};

/**
 * Text-to-Speech generation using Gemini 2.5 Flash TTS
 */
export const generateSpeech = async (text: string): Promise<AudioBuffer> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Puck' },
            },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
      throw new Error("No audio data returned");
    }

    // Decode Logic
    const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    const audioBuffer = await decodeAudioData(
      decode(base64Audio),
      outputAudioContext,
      24000,
      1,
    );
    
    return audioBuffer;

  } catch (error) {
    console.error("TTS Error:", error);
    throw error;
  }
};

// Helper to decode base64 to Uint8Array (from Google GenAI docs)
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper to decode PCM data to AudioBuffer (from Google GenAI docs)
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}