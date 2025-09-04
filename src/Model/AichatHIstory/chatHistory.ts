import mongoose, { Document, Schema } from "mongoose";

export interface ChatDocument extends Document {
  userMessage: string;
  aiResponse: string;
  timestamp: Date;
  userId: string;
}

const ChatSchema = new Schema<ChatDocument>({
  userMessage: { type: String, required: true },
  aiResponse: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  userId: { type: String, required: true }, // Clerk userId
});

const Chat = mongoose.model<ChatDocument>("Chat", ChatSchema);

export default Chat;