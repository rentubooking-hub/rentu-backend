import { Router } from "express";
import Booking from "../models/Booking.js";
import Tool from "../models/Tool.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// Customer creates a booking
router.post("/", requireAuth, requireRole("customer"), async (req, res) => {
  try {
    const { toolId, date, timeSlot, durationHours } = req.body;
    if (!toolId || !date || !timeSlot || !durationHours) {
      return res.status(400).json({ error: "toolId, date, timeSlot, durationHours are required" });
    }

    const tool = await Tool.findById(toolId);
    if (!tool) return res.status(404).json({ error: "Tool not found" });

    const totalAmount = tool.price * durationHours;

    const booking = await Booking.create({
      tool: tool._id,
      customer: req.user.id,
      date,
      timeSlot,
      durationHours,
      totalAmount,
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: "Could not create booking", detail: err.message });
  }
});

// List bookings.
// - customer role: only their own bookings
// - provider role: all pending + accepted bookings (single shared pool for this MVP —
//   once tools have an `owner`, filter to bookings for that provider's tools instead)
router.get("/", requireAuth, async (req, res) => {
  const filter = req.user.role === "customer" ? { customer: req.user.id } : {};
  const bookings = await Booking.find(filter)
    .populate("tool")
    .populate("customer", "name email")
    .sort({ createdAt: -1 });
  res.json(bookings);
});

// Provider accepts or declines a booking
router.patch("/:id", requireAuth, requireRole("provider"), async (req, res) => {
  const { status } = req.body;
  if (!["accepted", "declined", "completed"].includes(status)) {
    return res.status(400).json({ error: "status must be accepted, declined, or completed" });
  }

  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  ).populate("tool").populate("customer", "name email");

  if (!booking) return res.status(404).json({ error: "Booking not found" });
  res.json(booking);
});

export default router;
