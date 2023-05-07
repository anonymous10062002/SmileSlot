const mongoose=require('mongoose');

const slotSchema= new mongoose.Schema({
    userID: String,
    clinicID: String,
    time: Number
},{versionKey:false});

const SlotModel=mongoose.model('slots',slotSchema);

module.exports={SlotModel}