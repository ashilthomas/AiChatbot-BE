// routes/user.ts
import { Request, Response } from "express";
import User from "../Model/AichatHIstory/userModel";


export const createUserIfNotExists = async (req: Request, res: Response) => {
 
    
  const userId = req.userId;// Clerk userId
;
  
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    // Check if user already exists
    let user = await User.findOne({ userId });
   
    

    if (user==null||user==undefined||!user) {
      // Create new user with default credits
      user = await User.create({ userId, credit: 10 });
    }

    res.json({
      success: true,
      userId: user.userId,
      creditLeft: user.credit,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
