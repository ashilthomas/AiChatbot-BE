import { Request, Response } from 'express';
import aiModel from '../Config/chatAi';
import Chat from '../Model/AichatHIstory/chatHistory';
import User from '../Model/AichatHIstory/userModel';
import Razorpay from 'razorpay';
import crypto from "crypto";
import OrderModel from '../Model/OrderModel/OrderModel';
import "dotenv/config";

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
  $inc: { credit: -2 }, // decrement by 2 for chat
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
//  🔹 Central plan config (server side truth)

const plans: Record<string, { amount: number; credits: number }> = {
 basic: { amount: 900, credits: 100 },   // ₹9
  standard: { amount: 2900, credits: 150 },// ₹29
  premium: { amount: 9900, credits: 200 }, // ₹20
};
export const addedCredit = async (req: Request, res: Response) => {
  const userId = req.userId; // must be set by auth middleware
  const { planId } = req.body;

  if (!planId || !plans[planId]) {
    return res.status(400).json({ error: "Invalid planId" });
  }

  const { amount, credits } = plans[planId];
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  try {
    const options = {
      amount, // already in paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };
    const order = await razorpay.orders.create(options);

    await OrderModel.create({
      userId,
      planId,
      credits,
      razorpayOrderId: order.id,
      amount,
      status: "pending",
    });

    return res.json({ success: true, order });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  const userId = req.userId;
  console.log("userId",userId);
  
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  } = req.body;
  console.log("req.body",req.body);
  

  const orderId = razorpay_order_id || razorpayOrderId;
  const paymentId = razorpay_payment_id || razorpayPaymentId;
  const signature = razorpay_signature || razorpaySignature;

  if (!orderId || !paymentId || !signature) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(orderId + "|" + paymentId)
      .digest("hex");

    if (expectedSign !== signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const order = await OrderModel.findOne({ razorpayOrderId: orderId });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.status === "paid") {
      return res.json({ success: true, message: "Payment already verified" });
    }

    order.status = "paid";
    order.paymentId = paymentId;
    await order.save();

    const user = await User.findOneAndUpdate(
      { userId },
      { $inc: { credit: order.credits } },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Payment verified, credits added",
      creditLeft: user?.credit,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};




export { readOpenAi,getAllHistory,deleteChat,singleChat};