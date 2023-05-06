const mongoose=require('mongoose');

const slotSchema= new mongoose.Schema({
    userID: String,
    city: String,
    clinic: String,
    time: Number
},{versionKey:false});

const SlotModel=mongoose.model('slots',slotSchema);

module.exports={SlotModel}