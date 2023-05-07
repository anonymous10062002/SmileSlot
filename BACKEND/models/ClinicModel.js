const mongoose=require('mongoose');

const clinicSchema= new mongoose.Schema({
    userID: String,
    city: String,
    clinic: String,
    time: [{type:Number,unique:true}]
},{versionKey:false});

const ClinicModel=mongoose.model('clinics',clinicSchema);

module.exports={ClinicModel}