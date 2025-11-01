"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apiImageRouter = express_1.default.Router();
const clerkAuth_1 = __importDefault(require("../middleware/clerkAuth"));
const openAiImageConttroller_1 = require("../Controllers/openAiImageConttroller");
apiImageRouter.post('/createImage', clerkAuth_1.default, openAiImageConttroller_1.creatImage);
exports.default = apiImageRouter;
