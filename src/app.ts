import express, { Request, Response } from "express";
import connectDb from "./Config/db";
import dotenv from "dotenv"
import apiChatRouter from "./Routes/aiChatRoute";
import cors from "cors"
import { clerkMiddleware } from '@clerk/express';
import apiImageRouter from "./Routes/aiImageRoute";
import userRouter from "./Routes/userRoute";
dotenv.config()


const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: true, 
  })
);

connectDb()
app.use(clerkMiddleware());

app.use("/api/v1/chat",apiChatRouter)
app.use("/api/v1/image",apiImageRouter)
app.use("/api/v1/user",userRouter)








const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});