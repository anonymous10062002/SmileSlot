const mongoose=require('mongoose');

const clinicSchema= new mongoose.Schema({
    userID: String,  //dentistID
    city: String,
    clinic: String,   //clinic name
    time: [{type:Number,unique:true}]
},{versionKey:false});

const ClinicModel=mongoose.model('clinics',clinicSchema);

module.exports={ClinicModel}