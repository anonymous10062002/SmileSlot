const mongoose=require('mongoose');

const slotSchema= new mongoose.Schema({
    userID: String,
    city: String,
    clinic: String,
    date: [{type:Date}]
},{versionKey:false});

const SlotModel=mongoose.model('slots',slotSchema);

module.exports={SlotModel}