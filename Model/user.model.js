const mongoose=require("mongoose");
const userSchema=mongoose.Schema({
    username:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    status:{type:String, enum:["veryfied","unveryfied"]},
})
const UserModel= mongoose.model("user", userSchema);
module.exports={
    UserModel
}