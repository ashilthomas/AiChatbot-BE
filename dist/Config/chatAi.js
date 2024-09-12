"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const generative_ai_1 = require("@google/generative-ai");
const chatHistory_1 = __importDefault(require("../Model/AichatHIstory/chatHistory"));
dotenv_1.default.config();
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMANIAI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const aiModel = {
    getResponse(userMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const aiResponse = yield getResponseFromGeminiAI(userMessage);
                yield saveChatHistory(userMessage, aiResponse);
                return aiResponse;
            }
            catch (error) {
                console.error('Error generating AI response from Google Gemini:', error);
                throw new Error('Failed to get AI response from Google Gemini');
            }
        });
    },
};
function getResponseFromGeminiAI(userMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield model.generateContent(userMessage);
            return result.response.text(); // Handle response appropriately
        }
        catch (error) {
            console.error('Error generating AI response from Google Gemini:', error);
            throw new Error('Failed to get AI response from Google Gemini');
        }
    });
}
function saveChatHistory(userMessage, aiResponse) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const chat = new chatHistory_1.default({ userMessage, aiResponse });
            yield chat.save();
        }
        catch (error) {
            console.error('Error saving chat history:', error);
        }
    });
}
exports.default = aiModel;
