const mongoose=require('mongoose');

const userSchema= new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    mobile: Number,
    age: Number
},{versionKey:false});

const UserModel=mongoose.model('users',userSchema);

module.exports={UserModel}