import express from "express";
import User from "../models/User";

const router = express.Router();

router.post("/update-profile", async (req, res) => {
  try {
    const { userId, name, email, language, stack } = req.body;

    const updated = await User.findByIdAndUpdate(
      userId,
      { name, email, language, stack },
      { new: true }
    );

    return res.json({ success: true, user: updated });

  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
