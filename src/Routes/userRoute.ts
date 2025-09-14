import express from "express";
const userRouter = express.Router();
import clerkAuth from "../middleware/clerkAuth";
import { createUserIfNotExists } from "../Controllers/userController";

userRouter.post("/createUser",clerkAuth,createUserIfNotExists);

export default userRouter;