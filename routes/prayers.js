// routes/prayers.js
import express from "express";
import PrayerRecord from "../models/PrayerRecord.js";

const router = express.Router();

/**
 * POST /api/prayers/update
 * Create or update a prayer record for a given user and date.
 * Request body should include: { userId, date, prayer, status }
 */
router.post("/update", async (req, res) => {
  try {
    const { userId, date, prayer, status } = req.body;
    if (!userId || !date || !prayer || !status) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (userId, date, prayer, status).",
      });
    }

    // Convert the provided date into a Date object (set time to midnight)
    const day = new Date(date);
    day.setHours(0, 0, 0, 0);

    // Find or create a record for this user and date
    let record = await PrayerRecord.findOne({ userId, date: day });
    if (!record) {
      record = new PrayerRecord({ userId, date: day, prayers: {} });
    }

    // Update the specific prayer status
    record.prayers.set(prayer, status);
    await record.save();

    return res.json({ success: true, message: "Prayer status updated.", record });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

/**
 * GET /api/prayers
 * Retrieve the prayer record for a specific user and date.
 * Query parameters: userId and date
 */
router.get("/", async (req, res) => {
  try {
    const { userId, date } = req.query;
    if (!userId || !date) {
      return res.status(400).json({
        success: false,
        message: "Missing userId or date.",
      });
    }
    const day = new Date(date);
    day.setHours(0, 0, 0, 0);
    const record = await PrayerRecord.findOne({ userId, date: day });
    return res.json({ success: true, record });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

/**
 * POST /api/prayers/reset
 * Reset (delete) all prayer records for a specific user.
 * Request body should include: { userId }
 */
router.post("/reset", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Missing userId.",
      });
    }
    await PrayerRecord.deleteMany({ userId });
    return res.json({ success: true, message: "Prayer progress reset." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

/**
 * GET /api/prayers/summary
 * Get overall summary for a user.
 * Query parameter: userId
 * Returns counts for each status ("completed", "missed", "qaza") across all records.
 */
router.get("/summary", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ success: false, message: "Missing userId." });
    }
    const records = await PrayerRecord.find({ userId });
    const summary = { completed: 0, missed: 0, qaza: 0 };
    records.forEach(record => {
      Object.values(record.prayers).forEach((status) => {
        if (status === "completed") summary.completed++;
        else if (status === "missed") summary.missed++;
        else if (status === "qaza") summary.qaza++;
      });
    });
    return res.json({ success: true, summary });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});
export default router;
