const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    name:{type:String,require:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    resetToken:{ type:String},
    resetTokenExpires: {type:Date},
    role: {
      type: String,
      enum: ["employee", "hr", "admin","manager"],
      default: "employee",
    },
    isVerified:{type:Boolean,default:false},
    verificationCode:{type:String},
    verificationCodeExpires:{type:Date},
    mustChangePassword: { type: Boolean, default: false },
    pushSubscription: { type: Object, default: null },
 
    lastLogin: { type: Date, default: null },
   



},{timestamps:true})

module.exports=mongoose.model("User",userSchema)