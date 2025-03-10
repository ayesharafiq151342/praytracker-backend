// models/PrayerRecord.js
import mongoose from "mongoose";

const PrayerRecordSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: Date, required: true },
  // "prayers" is a map where keys are prayer names (Fajr, Dhuhr, etc.)
  // and values are statuses ("completed", "missed", or "qaza").
  prayers: { type: Map, of: String, default: {} },
});

// If the model already exists, use it; otherwise create a new model.
const PrayerRecord =
  mongoose.models.PrayerRecord || mongoose.model("PrayerRecord", PrayerRecordSchema);

export default PrayerRecord;
