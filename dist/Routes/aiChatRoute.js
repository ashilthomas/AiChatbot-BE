"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import readOpenAi from "../Controllers/openAiController"
const openAiController_1 = require("../Controllers/openAiController");
const clerkAuth_1 = __importDefault(require("../middleware/clerkAuth"));
const apiChatRouter = express_1.default.Router();
apiChatRouter.post('/apireq', clerkAuth_1.default, openAiController_1.readOpenAi);
apiChatRouter.get('/history', clerkAuth_1.default, openAiController_1.getAllHistory);
apiChatRouter.delete('/delete/:id', clerkAuth_1.default, openAiController_1.deleteChat);
apiChatRouter.get('/singleChat/:id', clerkAuth_1.default, openAiController_1.singleChat);
exports.default = apiChatRouter;
