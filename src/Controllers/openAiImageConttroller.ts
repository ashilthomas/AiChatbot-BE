import type { Request, Response } from "express";
import { generateImage } from "../Config/imageAi";




type ChatRequestBody = {
  prompt: string | undefined;
  userId?: string; // optional if you sometimes don’t send it
};

export const creatImage = async(req: Request<{}, {}, ChatRequestBody> ,res:Response)=>{

    console.log("hitting image api");
    
try {
    const {prompt}=req.body;
    const userId = req.userId; // Access the userId from the request object
    if(!prompt){
        return res.status(400).json({error:"Prompt is required"})
    }
    // Use the aiModel to get a response
    const response = await generateImage(prompt,userId || "");
    // Send the response back
res.json({ image: response, type: "image",userMessage:prompt });
 
    
    

} catch (error) {
    console.log(error);
    
    
}

        
       
}
// const singleChat = async (req: Request, res: Response) => {
//   try {
//     const userId = req.userId; // Access the userId from the request object
//     const { id } = req.params;

//     if (!id) {
//       return res.status(400).json({
//         success: false,
//         message: "Chat ID is required",
//       });
//     }   
//     const chat = await Chat.findOne({ _id: id, userId });

//     if (!chat) {
//         return res.status(404).json({

//             success: false,
//             message: "Chat not found or not authorized",
//           });
//     }
//     res.json({
//         success: true,
//         chat
//     })
    