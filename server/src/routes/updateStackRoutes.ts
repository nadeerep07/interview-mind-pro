import express from "express";
import User from "../models/User";

const router = express.Router();

router.post("/update-stack", async (req, res) => {
  try {
    const { userId, stack } = req.body;

    const updated = await User.findByIdAndUpdate(
      userId,
      { stack },
      { new: true }
    );

    return res.json({ success: true, user: updated });

  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
