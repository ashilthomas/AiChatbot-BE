"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRouter = express_1.default.Router();
const clerkAuth_1 = __importDefault(require("../middleware/clerkAuth"));
const userController_1 = require("../Controllers/userController");
const openAiController_1 = require("../Controllers/openAiController");
userRouter.post("/createUser", clerkAuth_1.default, userController_1.createUserIfNotExists);
userRouter.post("/create-order", clerkAuth_1.default, openAiController_1.addedCredit);
userRouter.post("/verify-payment", clerkAuth_1.default, openAiController_1.verifyPayment);
exports.default = userRouter;
