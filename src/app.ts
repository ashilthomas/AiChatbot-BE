import express, { Request, Response } from "express";
import connectDb from "./Config/db";
import dotenv from "dotenv"
import apiChatRouter from "./Routes/aiChatRoute";
import cors from "cors"
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

app.use("/api/v1/chat",apiChatRouter)








const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});