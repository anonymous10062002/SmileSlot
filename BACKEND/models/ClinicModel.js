const mongoose=require('mongoose');

const clinicSchema= new mongoose.Schema({
    userID: String,
    city: String,
    clinic: String,
    booked: [{type:Date}]
},{versionKey:false});

const ClinicModel=mongoose.model('clinics',clinicSchema);

module.exports={ClinicModel}