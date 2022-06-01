const mongoose=require("mongoose")
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    id:{
        type:Number
    },
    email: {
        type: String,
        unique: true,
        default: true,
        trim: true,
        lowercase: true,
        minlength: 7,
        validate(value) {
          if (!value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/))
            throw "email is error";
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
          if (!value.match(/^(?=.*[0-9])(?=.*[!@#$%^&*]){2}/))
            throw "invalid password";
        },
    },
    age:{
        type:String,
        default:0,
        validate(value){
            if(value<-0)throw "Age can not be negative"
        }
    },    
    tasks:{
        type:[Number]
    }

})


module.exports=mongoose.model("user",userSchema)