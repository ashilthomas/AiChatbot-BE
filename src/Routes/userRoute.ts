import express from "express";
const userRouter = express.Router();
import { createUserIfNotExists } from "../Controllers/userController";
import clerkAuth from "../middleware/clerkAuth";

userRouter.post("/createUser",clerkAuth, createUserIfNotExists);

export default userRouter;