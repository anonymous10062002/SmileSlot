const mongoose=require('mongoose');

const clinicSchema= new mongoose.Schema({
    dentistID: String,
    city: String,
    clinic: String,
    availability: [{type:Date}]
},{versionKey:false});

const ClinicModel=mongoose.model('clinics',clinicSchema);

module.exports={ClinicModel}