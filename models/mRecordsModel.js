import mongoose, { Mongoose } from "mongoose";
 
const medicalRecordsSchema = new mongoose.Schema({
user :
{
    type:  mongoose.Schema.Types.ObjectId,
    required: true
},
heartBeat:
{
    type: Number,
    required: true,

},
bloodPressure:
{
    systolic: {
        type: Number,
        required: true
    },
    diaSystolic:
    {
        type: Number,
        required: true
    }
},
sugar:
{
    type: Number,
    required: true
},
date: 
{
    type: Date,
    default: Date.now(),
    min: '2020-01-01',
    max: '2035-01-01'
}
},{timestamps: true});

const userModel = mongoose.models.medRecords || mongoose.model('medRecords', medicalRecordsSchema);
export default userModel;