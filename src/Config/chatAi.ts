import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Chat from "../Model/AichatHIstory/chatHistory";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

interface AIModelResponse {
  getResponse: (userMessage: string, userId: string) => Promise<string>;
}

const aiModel: AIModelResponse = {
  async getResponse(userMessage: string, userId: string): Promise<string> {
    try {
      const aiResponse = await getResponseFromGeminiAI(userMessage);
      await saveChatHistory(userMessage, aiResponse, userId);
      return aiResponse;
    } catch (error: any) {
      console.error("Error generating AI response from Google Gemini:", error);
      throw new Error("Failed to get AI response from Google Gemini");
    }
  },
};

async function getResponseFromGeminiAI(userMessage: string): Promise<string> {
  try {
    const result = await model.generateContent(userMessage);
    const text = result.response.text();
    return text || "I'm sorry, I couldn’t generate a response.";
  } catch (error) {
    console.error("Error generating AI response from Google Gemini:", error);
    throw new Error("Failed to get AI response from Google Gemini");
  }
}

async function saveChatHistory(userMessage: string, aiResponse: string, userId: string) {
  try {
    const chat = new Chat({
      userId,
      type: "chat",
      userMessage,
      aiResponse,
    });
    await chat.save();
  } catch (error) {
    console.error("Error saving chat history:", error);
  }
}

export default aiModel;
