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

    // Check user credits
    const User = require("../Model/AichatHIstory/userModel").default;
    const creditDoc = await User.findOne({ userId });
    console.log("creditDoc",creditDoc);

    if (!creditDoc || creditDoc.credit < 5) {
      return res.json({
        success:false,
         error: "Insufficient credit. Image generation requires 5 credits." });
    }

    // Use the aiModel to get a response
    const response = await generateImage(prompt,userId || "");

    // Decrement credits by 5
    const updateDocument = {
      $inc: { credit: -5 }, // decrement by 5 for image
    };

    await User.findOneAndUpdate(
      { userId: userId }, // filter
      updateDocument,
      { new: true }    // return updated doc if needed
    );

    // Send the response back
    res.json({ image: response, type: "image",userMessage:prompt });
}