import type { Request, Response } from "express";
import { generateImage } from "../Config/imageAi";




type ChatRequestBody = {
  prompt: string | undefined;
  userId?: string; // optional if you sometimes don’t send it
};

export const creatImage = async(req: Request<{}, {}, ChatRequestBody> ,res:Response)=>{
    console.log("hitting image api");

    const {prompt}=req.body;
    const userId = req.userId; // Access the userId from the request object
    if(!prompt){
        return res.status(400).json({error:"Prompt is required"})
    }
    // Use the aiModel to get a response
    const response = await generateImage(prompt,userId || "");
    // Send the response back
    res.json({ image: response, type: "image",userMessage:prompt });
}