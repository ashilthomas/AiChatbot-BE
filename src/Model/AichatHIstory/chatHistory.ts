import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
  userId: string;
  type: "chat" | "image";
  userMessage: string;
  aiResponse: string; // text OR image URL
  createdAt: Date;
}

const ChatSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
  type: { type: String, enum: ["chat", "image"], required: true },
    userMessage: { type: String, required: true },
    aiResponse: { type: String, required: true },
  },
  { timestamps: true }
);

const Chat = mongoose.model<IChat>("Chat", ChatSchema);
export default Chat;
