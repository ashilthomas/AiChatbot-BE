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
exports.singleChat = exports.deleteChat = exports.getAllHistory = exports.readOpenAi = exports.verifyPayment = exports.addedCredit = void 0;
const chatAi_1 = __importDefault(require("../Config/chatAi"));
const chatHistory_1 = __importDefault(require("../Model/AichatHIstory/chatHistory"));
const userModel_1 = __importDefault(require("../Model/AichatHIstory/userModel"));
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const OrderModel_1 = __importDefault(require("../Model/OrderModel/OrderModel"));
require("dotenv/config");
const readOpenAi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }
        const creditDoc = yield userModel_1.default.findOne({ userId });
        console.log("creditDoc", creditDoc);
        if (!creditDoc || creditDoc.credit <= 0) {
            return res.json({
                success: false,
                error: "Insufficient credit"
            });
        }
        const response = yield chatAi_1.default.getResponse(message, userId || "");
        const updateDocument = {
            $inc: { credit: -1 }, // decrement by 1
        };
        yield userModel_1.default.findOneAndUpdate({ userId: userId }, // filter
        updateDocument, { new: true } // return updated doc if needed
        );
        res.json({
            response: response,
            type: "chat",
            userMessage: message,
        });
    }
    catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.readOpenAi = readOpenAi;
const getAllHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId; // Access the userId from the request object
    try {
        const history = yield chatHistory_1.default.find({ userId }).sort({ createdAt: -1 });
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
    try {
        const userId = req.userId; // should come from auth middleware
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Chat ID is required",
            });
        }
        // Find chat that belongs to this user
        const item = yield chatHistory_1.default.findOne({ _id: id, userId });
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Chat not found or not authorized",
            });
        }
        // Delete the chat
        yield chatHistory_1.default.deleteOne({ _id: id, userId });
        return res.json({
            success: true,
            message: "Chat successfully deleted",
        });
    }
    catch (error) {
        console.error("Error deleting chat:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.deleteChat = deleteChat;
const singleChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("hitting single chat api");
    try {
        const userId = req.userId; // should come from auth middleware
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Chat ID is required",
            });
        }
        // Find chat that belongs to this user
        const item = yield chatHistory_1.default.findOne({ _id: id, userId });
        console.log("item", item);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Chat not found or not authorized",
            });
        }
        return res.json({
            success: true,
            item
        });
    }
    catch (error) {
        console.error("Error fetching previous chat:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.singleChat = singleChat;
//  🔹 Central plan config (server side truth)
const plans = {
    basic: { amount: 900, credits: 100 }, // ₹9
    standard: { amount: 2900, credits: 150 }, // ₹29
    premium: { amount: 9900, credits: 200 }, // ₹20
};
const addedCredit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId; // must be set by auth middleware
    const { planId } = req.body;
    if (!planId || !plans[planId]) {
        return res.status(400).json({ error: "Invalid planId" });
    }
    const { amount, credits } = plans[planId];
    const razorpay = new razorpay_1.default({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    try {
        const options = {
            amount, // already in paise
            currency: "INR",
            receipt: "receipt_" + Date.now(),
        };
        const order = yield razorpay.orders.create(options);
        yield OrderModel_1.default.create({
            userId,
            planId,
            credits,
            razorpayOrderId: order.id,
            amount,
            status: "pending",
        });
        return res.json({ success: true, order });
    }
    catch (error) {
        console.error("Error creating order:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.addedCredit = addedCredit;
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    console.log("userId", userId);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, razorpayOrderId, razorpayPaymentId, razorpaySignature, } = req.body;
    console.log("req.body", req.body);
    const orderId = razorpay_order_id || razorpayOrderId;
    const paymentId = razorpay_payment_id || razorpayPaymentId;
    const signature = razorpay_signature || razorpaySignature;
    if (!orderId || !paymentId || !signature) {
        return res.status(400).json({ success: false, message: "Missing fields" });
    }
    try {
        const expectedSign = crypto_1.default
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
            .update(orderId + "|" + paymentId)
            .digest("hex");
        if (expectedSign !== signature) {
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }
        const order = yield OrderModel_1.default.findOne({ razorpayOrderId: orderId });
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        if (order.status === "paid") {
            return res.json({ success: true, message: "Payment already verified" });
        }
        order.status = "paid";
        order.paymentId = paymentId;
        yield order.save();
        const user = yield userModel_1.default.findOneAndUpdate({ userId }, { $inc: { credit: order.credits } }, { new: true });
        return res.json({
            success: true,
            message: "Payment verified, credits added",
            creditLeft: user === null || user === void 0 ? void 0 : user.credit,
        });
    }
    catch (error) {
        console.error("Error verifying payment:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.verifyPayment = verifyPayment;
