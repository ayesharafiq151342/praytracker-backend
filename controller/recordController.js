import medRecords from '../models/mRecordsModel.js'

export const createRecord = async(req, res)=>
{
    const { userId, heartBeat, systolic, diaSystolic, sugar,date} = req.body ;
    if(!heartBeat || !systolic || !diaSystolic || !sugar)
    {
        return res.json({success: false, message:'Fields are empty'})
    }
    try 
    {
        const isPresent = await medRecords.findOne({date});
        if(isPresent)
        {
            return res.json({success: false, message: 'Today data already exist'})
        }

        const enterData = new medRecords({user: userId,heartBeat, bloodPressure:{systolic,diaSystolic},sugar, date});
        await enterData.save();
        return res.json({success: true, message: 'Data Add Successfully'})
        
    }
    catch(error)
    {
        return res.json({success: false, message:error.message});
    }

}

export const editRecord = async(req, res)=>
{
    const date = req.params.date;
    console.log(date)
    const {heartBeat, systolic, diaSystolic, sugar,userId} = req.body ;
    if(!heartBeat || !systolic || !diaSystolic || !sugar)
    {
        return res.json({success: false, message:'Fields are empty'})
    }
    try 
    {
        const isPresent = await medRecords.findOne({date});
        if(!isPresent)
        {
            return res.json({success: false, message: 'Today data are not exist'})
        }
        const filter = {user: userId, date};
        const update = {
            heartBeat, bloodPressure:{systolic,diaSystolic},sugar
        }
        const editData = await medRecords.findOneAndUpdate(filter, update);
        await editData.save()
      

        return res.json({success: true, message: 'Update data Successfully'})

    }
    catch(error)
    {
        return res.json({success: false, message:error.message});
    }
}

export const deleteRecord = async(req, res)=>
{
    const date = req.params.date;
    const {userId} = req.body ;
    console.log(userId)
    try 
    {
        const isPresent = await medRecords.findOne({date});
        if(!isPresent)
        {
            return res.json({success: false, message: 'Today data are not exist'})
        }
        const filter = {user: userId, date};
       
        const deleteData = await medRecords.findOneAndDelete(filter);
      
      

        return res.json({success: true, message: 'Data Deleted Successfully'})

    }
    catch(error)
    {
        return res.json({success: false, message:error.message});
    }
}