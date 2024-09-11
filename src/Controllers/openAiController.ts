import { Request, Response } from 'express';
import aiModel from '../Config/chatAi';
import Chat from '../Model/AichatHIstory/chatHistory';

type ChatRequestBody = {
  message: string;

  
};

const readOpenAi = async (req: Request<{}, {}, ChatRequestBody>, res: Response) => {
  try {
 
    const {message } = req.body;
   
    

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Use the aiModel to get a response
    const response = await aiModel.getResponse(message);

    // Send the response back
    res.json({ response });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllHistory =async(req:Request,res:Response)=>{
  try {
    const history = await Chat.find({})

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
  const { id } = req.params;
  console.log(id);
  
if(!id|| id==undefined){
  return
}
  

  // Find chat by ID
  const item = await Chat.findById(id); // No need to pass an object to `findById`

  // If item does not exist, return an error response
  if (!item) {
    return res.json({
      success: false,
      message: "No chat found"
    });
  }

  // Delete the item
  await Chat.deleteOne({ _id: id }); // Use the correct ID to delete

  // Send success response after deletion
  return res.json({
    success: true,
    message: "Chat successfully deleted"
  });
};

export { readOpenAi,getAllHistory,deleteChat};