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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChat = exports.getAllHistory = exports.readOpenAi = void 0;
const chatAi_1 = __importDefault(require("../Config/chatAi"));
const chatHistory_1 = __importDefault(require("../Model/AichatHIstory/chatHistory"));
const readOpenAi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        // Use the aiModel to get a response
        const response = yield chatAi_1.default.getResponse(message);
        // Send the response back
        res.json({ response });
    }
    catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.readOpenAi = readOpenAi;
const getAllHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const history = yield chatHistory_1.default.find({});
        if (!history || history.length == 0) {
            return res.json({
                success: false,
                message: "no history"
            });
        }
        res.json({
            success: true,
            history
        });
    }
    catch (error) {
        res.json({
            success: false,
            message: error
        });
    }
});
exports.getAllHistory = getAllHistory;
const deleteChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(id);
    if (!id || id == undefined) {
        return;
    }
    // Find chat by ID
    const item = yield chatHistory_1.default.findById(id); // No need to pass an object to `findById`
    // If item does not exist, return an error response
    if (!item) {
        return res.json({
            success: false,
            message: "No chat found"
        });
    }
    // Delete the item
    yield chatHistory_1.default.deleteOne({ _id: id }); // Use the correct ID to delete
    // Send success response after deletion
    return res.json({
        success: true,
        message: "Chat successfully deleted"
    });
});
exports.deleteChat = deleteChat;
