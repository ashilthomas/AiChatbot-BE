import Chat from "../Model/AichatHIstory/chatHistory";

export async function generateImage(userMessage: string, userId: string): Promise<string> {
  const aiResponse = `https://image.pollinations.ai/prompt/${encodeURIComponent(userMessage)}`;

  const chat = new Chat({
    userId,
    type: "image",
    userMessage,
    aiResponse,
  });

  await chat.save();
  return aiResponse;
}