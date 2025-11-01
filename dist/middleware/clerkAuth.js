"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("@clerk/express");
const clerkAuth = (req, res, next) => {
    try {
        const { userId } = (0, express_1.getAuth)(req);
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        req.userId = userId; // attach Clerk userId
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.default = clerkAuth;
