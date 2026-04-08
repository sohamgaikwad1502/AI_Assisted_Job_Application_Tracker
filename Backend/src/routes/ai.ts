import express from "express";
import { authMiddleware } from "../middleware/auth";
import {
  generateResumeSuggestions,
  parseJobDescription
} from "../services/aiService";

const router = express.Router();

router.post("/parse", authMiddleware, async (req, res) => {
  try {
    const { jobDescription } = req.body as { jobDescription?: string };
    if (!jobDescription) {
      return res.status(400).json({ error: "Job description required" });
    }

    const parsed = await parseJobDescription(jobDescription);
    const suggestions = await generateResumeSuggestions(
      jobDescription,
      parsed.role,
      parsed.company
    );

    res.json({ parsed, suggestions });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "AI parse failed",
      error_message:err
     });
  }
});

export default router;
