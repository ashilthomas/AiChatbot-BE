import { Request, Response } from 'express';
import aiModel from '../Config/chatAi';
import Chat from '../Model/AichatHIstory/chatHistory';
import User from '../Model/AichatHIstory/userModel';
type ChatRequestBody = {
  message: string;
  userId?: string; // optional if you sometimes don’t send it
};

const readOpenAi = async (req: Request<{}, {}, ChatRequestBody>, res: Response) => {
  try {
    const userId = req.userId; 
    const { message } = req.body; 

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    const creditDoc = await User.findOne({ userId });
    console.log("creditDoc",creditDoc);
    
    if (!creditDoc || creditDoc.credit <= 0) {
      return res.json({
        success:false, 
         error: "Insufficient credit" });
    }

    const response = await aiModel.getResponse(message, userId || "");


  const updateDocument = {
  $inc: { credit: -1 }, // decrement by 1
};

   
  await User.findOneAndUpdate(
  { userId: userId }, // filter
  updateDocument,
  { new: true }    // return updated doc if needed
);


    res.json({
      response: response,
      type: "chat",
      userMessage: message,
      
    });

  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const getAllHistory =async(req:Request,res:Response)=>{
  const userId = req.userId; // Access the userId from the request object
  try {
    const history = await Chat.find({userId}).sort({ createdAt: -1 });
    
    

  if(!history|| history.length ==0){
    return res.json({
     success:false,
     message:"no history"
    })
  }

  res.json({
    success:true,
    history
  })
  } catch (error:any) {
    res.json({
      success:false,
      message:error
     })

    
  }

}

const deleteChat = async (req: Request, res: Response) => {
  try {
    const userId = req.userId; // should come from auth middleware
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Chat ID is required",
      });
    }

    // Find chat that belongs to this user
    const item = await Chat.findOne({ _id: id, userId });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Chat not found or not authorized",
      });
    }

    // Delete the chat
    await Chat.deleteOne({ _id: id, userId });

    return res.json({
      success: true,
      message: "Chat successfully deleted",
    });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const singleChat = async (req: Request, res: Response) => {
  console.log("hitting single chat api");
  
  try {
    const userId = req.userId; // should come from auth middleware
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Chat ID is required",
      });
    } 
    // Find chat that belongs to this user
    const item = await Chat.findOne({ _id: id, userId });
console.log("item",item);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Chat not found or not authorized",
      });
    }
    return res.json({
      success: true,
      item
    })
  } catch (error) {
    console.error("Error fetching previous chat:", error);
    return res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};





export { readOpenAi,getAllHistory,deleteChat,singleChat};