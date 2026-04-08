import express from "express";
import { Application } from "../models/Application";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = express.Router();

router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const apps = await Application.find({ userId: req.userId }).sort({
      createdAt: -1
    });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch" });
  }
});

router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { company, role } = req.body as { company?: string; role?: string };
    if (!company || !role) {
      return res.status(400).json({ error: "Company and role required" });
    }

    const created = await Application.create({
      ...req.body,
      userId: req.userId
    });

    res.json(created);
  } catch (err) {
    res.status(500).json({ error: "Create failed" });
  }
});

router.put("/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const updated = await Application.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

router.delete("/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const deleted = await Application.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!deleted) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;
