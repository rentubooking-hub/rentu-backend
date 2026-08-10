import { Router } from "express";
import Tool from "../models/Tool.js";

const router = Router();

router.get("/", async (req, res) => {
  const tools = await Tool.find().sort({ createdAt: -1 });
  res.json(tools);
});

router.get("/:id", async (req, res) => {
  const tool = await Tool.findById(req.params.id);
  if (!tool) return res.status(404).json({ error: "Tool not found" });
  res.json(tool);
});

export default router;
