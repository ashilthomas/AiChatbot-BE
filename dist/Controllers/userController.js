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
exports.createUserIfNotExists = void 0;
const userModel_1 = __importDefault(require("../Model/AichatHIstory/userModel"));
const createUserIfNotExists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId; // Clerk userId
    ;
    if (!userId)
        return res.status(401).json({ error: "Unauthorized" });
    try {
        // Check if user already exists
        let user = yield userModel_1.default.findOne({ userId });
        if (user == null || user == undefined || !user) {
            // Create new user with default credits
            user = yield userModel_1.default.create({ userId, credit: 10 });
        }
        res.json({
            success: true,
            userId: user.userId,
            creditLeft: user.credit,
        });
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.createUserIfNotExists = createUserIfNotExists;
