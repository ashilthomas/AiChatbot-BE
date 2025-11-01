import express from "express";
const userRouter = express.Router();
import clerkAuth from "../middleware/clerkAuth";
import { createUserIfNotExists } from "../Controllers/userController";
import { addedCredit, verifyPayment } from "../Controllers/openAiController";


userRouter.post("/createUser",clerkAuth,createUserIfNotExists);
userRouter.post("/create-order",clerkAuth,addedCredit);
userRouter.post("/verify-payment",clerkAuth,verifyPayment);

export default userRouter;