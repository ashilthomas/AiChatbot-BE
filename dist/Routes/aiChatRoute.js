"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import readOpenAi from "../Controllers/openAiController"
const openAiController_1 = require("../Controllers/openAiController");
const apiChatRouter = express_1.default.Router();
apiChatRouter.post('/apireq', openAiController_1.readOpenAi);
apiChatRouter.get('/history', openAiController_1.getAllHistory);
apiChatRouter.delete('/delete/:id', openAiController_1.deleteChat);
exports.default = apiChatRouter;
