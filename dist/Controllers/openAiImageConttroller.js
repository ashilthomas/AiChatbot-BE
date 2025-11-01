"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.creatImage = void 0;
const imageAi_1 = require("../Config/imageAi");
const creatImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("hitting image api");
    try {
        const { prompt } = req.body;
        const userId = req.userId; // Access the userId from the request object
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }
        // Use the aiModel to get a response
        const response = yield (0, imageAi_1.generateImage)(prompt, userId || "");
        // Send the response back
        res.json({ image: response, type: "image", userMessage: prompt });
    }
    catch (error) {
        console.log(error);
    }
});
exports.creatImage = creatImage;
// const singleChat = async (req: Request, res: Response) => {
//   try {
//     const userId = req.userId; // Access the userId from the request object
//     const { id } = req.params;
//     if (!id) {
//       return res.status(400).json({
//         success: false,
//         message: "Chat ID is required",
//       });
//     }   
//     const chat = await Chat.findOne({ _id: id, userId });
//     if (!chat) {
//         return res.status(404).json({
//             success: false,
//             message: "Chat not found or not authorized",
//           });
//     }
//     res.json({
//         success: true,
//         chat
//     })
