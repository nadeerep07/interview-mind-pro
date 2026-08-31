"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
router.post("/update-profile", async (req, res) => {
    try {
        const { userId, name, email, language, stack } = req.body;
        const updated = await User_1.default.findByIdAndUpdate(userId, { name, email, language, stack }, { new: true });
        return res.json({ success: true, user: updated });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});
exports.default = router;
