const mongoose=require('mongoose');

const clinicSchema= new mongoose.Schema({
    dentistID: String,
    city: String,
    clinic: String,
    availability: [String]
},{versionKey:false});

const ClinicModel=mongoose.model('clinics',clinicSchema);

module.exports={ClinicModel}