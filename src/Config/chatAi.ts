
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Chat from "../Model/AichatHIstory/chatHistory"; 

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMANIAI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

interface AIModelResponse {
  getResponse: (userMessage: string) => Promise<string>;
}


const aiModel: AIModelResponse = {
  async getResponse(userMessage: string): Promise<string> {
    try {
      const aiResponse = await getResponseFromGeminiAI(userMessage);

   
      await saveChatHistory(userMessage, aiResponse);

      return aiResponse;
    } catch (error: any) {
      console.error('Error generating AI response from Google Gemini:', error);
      throw new Error('Failed to get AI response from Google Gemini');
    }
  },
};

async function getResponseFromGeminiAI(userMessage: string): Promise<string> {
  try {
    const result = await model.generateContent(userMessage);
    return result.response.text(); // Handle response appropriately
  } catch (error) {
    console.error('Error generating AI response from Google Gemini:', error);
    throw new Error('Failed to get AI response from Google Gemini');
  }
}

async function saveChatHistory(userMessage: string, aiResponse: string) {
  try {
    const chat = new Chat({ userMessage, aiResponse });
    await chat.save();
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
}

export default aiModel;
