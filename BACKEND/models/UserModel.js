const mongoose=require('mongoose');

const userSchema= new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    mobile: Number,
    age: Number,
    verified: Boolean
},{versionKey:false});

const UserModel=mongoose.model('users',userSchema);

module.exports={UserModel}