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
        enum: ["user","dentist","admin"]
    },
    verified: Boolean,
    blocked: {
        type: Boolean,
        default: false
    }
},{versionKey:false});

const UserModel=mongoose.model('users',userSchema);

module.exports={UserModel}

