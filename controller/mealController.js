import mealModel from '../models/mealsModel.js';



export const Meal = async (req, res) => {
    try {
        console.log("Fetching meals for user:", req.body.userId); // ✅ Debug User ID
        const meals = await mealModel.find({ user: req.body.userId });
        console.log("Meals Found:", meals); // ✅ Debugging

        res.json({ success: true, meals });
    } catch (error) {
        console.error("Error fetching meals:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};


export const createMeal = async(req, res)=>
    {
        console.log("Hello how are you")
        const { userId,category, calories, carbs, fats, protiens, sodium, sugar, fiber ,date} = req.body ;
        // const  = '2025-04-14';
        // console.log(date)
       
        if(!category || !calories || !carbs || !fats || !protiens || !sodium || !sugar || !fiber || !date)
        {
            return res.json({success: false, message:'Fields are empty'})
        }
        try 
        {
            const isPresent = await mealModel.findOne({date});
            if(isPresent)
            {
                return res.json({success: false, message: 'Today data already exist'})
            }
    
            const enterData = new mealModel({user: userId,category, calories, carbs, fats, protiens, sodium, sugar, fiber, date});
            await enterData.save();
            return res.json({success: true, message: 'Data Added Successfully'})
            
        }
        catch(error)
        {
            return res.json({success: false, message:error.message});
        }
    
    }
    
    export const editMeal = async(req, res)=>
    {
        const date = req.params.date;
        const { category, calories, carbs, fats, protiens, sodium, sugar, fiber, userId} = req.body ;
        if(!category || !calories || !carbs || !fats || !protiens || !sodium || !sugar || !fiber || !sugar )
            {
                return res.json({success: false, message:'Fields are empty'})
            }
        try 
        {
            const isPresent = await mealModel.findOne({date});
            if(!isPresent)
            {
                return res.json({success: false, message: 'Today data are not exist'})
            }
            const filter = {user: userId, date};
            const update = {
                category, calories, carbs, fats, protiens, sodium, sugar, fiber
            }
            const editData = await mealModel.findOneAndUpdate(filter, update);
            await editData.save()
          
    
            return res.json({success: true, message: 'Data Updated Successfully'})
    
        }
        catch(error)
        {
            return res.json({success: false, message:error.message});
        }
    }
    
    export const deleteMeal =  async (req, res) => {
        try {
          const mealId = req.params.id;
      
          console.log("Received delete request for meal ID:", mealId);
      
          const deletedMeal = await mealModel.findByIdAndDelete(mealId);
          
          if (!deletedMeal) {
            return res.status(404).json({ success: false, message: "Meal not found" });
          }
      
          res.json({ success: true, message: "Meal deleted successfully" });
        } catch (error) {
          console.error("Error deleting meal:", error);
          res.status(500).json({ success: false, message: "Server error" });
        }
      
    }

