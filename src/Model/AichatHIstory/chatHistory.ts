import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  userMessage: String,
  aiResponse: String,
  timestamp: { type: Date, default: Date.now }
});

const Chat = mongoose.model('Chat', ChatSchema);

 export default Chat
