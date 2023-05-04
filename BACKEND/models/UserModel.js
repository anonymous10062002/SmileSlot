const mongoose=require('mongoose');

const userSchema= new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    mobile: Number,
    age: Number,
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"],
    }
},{versionKey:false});

const UserModel=mongoose.model('users',userSchema);

module.exports={UserModel}