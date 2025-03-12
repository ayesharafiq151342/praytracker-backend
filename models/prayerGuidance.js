import mongoose from "mongoose";

const prayerGuidance = new mongoose.Schema({

    category:{type: String, required:true},
    path:{type: String, required:true},
    fileName:{type:String, require: true},
    description:{type:String, required:true}
},{timestamps: true});

export default mongoose.model('prayerGuidance',prayerGuidance);