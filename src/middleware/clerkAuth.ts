import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";

const clerkAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.userId = userId; // attach Clerk userId
    next();
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default clerkAuth;
