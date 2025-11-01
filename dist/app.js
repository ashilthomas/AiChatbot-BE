"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./Config/db"));
const dotenv_1 = __importDefault(require("dotenv"));
const aiChatRoute_1 = __importDefault(require("./Routes/aiChatRoute"));
const cors_1 = __importDefault(require("cors"));
const express_2 = require("@clerk/express");
const aiImageRoute_1 = __importDefault(require("./Routes/aiImageRoute"));
const userRoute_1 = __importDefault(require("./Routes/userRoute"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    credentials: true,
    origin: true,
}));
(0, db_1.default)();
app.use((0, express_2.clerkMiddleware)());
app.use("/api/v1/chat", aiChatRoute_1.default);
app.use("/api/v1/image", aiImageRoute_1.default);
app.use("/api/v1/user", userRoute_1.default);
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
