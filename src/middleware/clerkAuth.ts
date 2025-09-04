import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { log } from "console";

const clerkAuth = (req: Request, res: Response, next: NextFunction) => {
    console.log("htting clerk middleware");
    
  try {
    const { userId } = getAuth(req);
    console.log("Clerk userId:", userId);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.userId = userId; // attach Clerk userId
    next();
  } catch (error) {
      console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  
    
  }
};

export default clerkAuth;
