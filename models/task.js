const mongoose=require("mongoose")
const taskSchema=new mongoose.Schema({
    description:{
        type:String,
       required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    id:{
         //type:String,
         //required:true
    },
    users:{
       type:[Number]
    }

})


module.exports=mongoose.model("task",taskSchema)