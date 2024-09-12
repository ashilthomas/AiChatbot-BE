"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ChatSchema = new mongoose_1.default.Schema({
    userMessage: String,
    aiResponse: String,
    timestamp: { type: Date, default: Date.now }
});
const Chat = mongoose_1.default.model('Chat', ChatSchema);
exports.default = Chat;
