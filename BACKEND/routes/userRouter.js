require('dotenv').config();
const express=require('express');
const userRouter=express.Router();
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const {UserModel}=require('../models/UserModel');
const {ClinicModel}=require('../models/ClinicModel');
const {SlotModel}=require('../models/SlotModel');
const {authorize}=require('../middleware/authorize');
const {authenticator} = require('../middleware/authenticator');
const {client}=require('../config/db');
const {sendmail}=require("../services/mail");

// SIGNUP USER API
userRouter.post('/signup',async(req,res)=>{
    const {username,email,password,mobile,age, role}=req.body;
    try {
        const isFound=await UserModel.findOne({email});
        if(isFound?.verified==false){
            id=isFound._id
            try{
                await UserModel.findByIdAndDelete({_id:id});
            } 
            catch(error){
                res.status(400).send({ err: error.message });
            }
        }
        if(isFound){
            res.status(403).send({mag:'User already exist..!',status:"error"});
        }
        else{
            bcrypt.hash(password,4,async(err,hash)=>{
                if(err){
                    console.log(err);
                    res.status(400).send({msg:'Oops something went wrong..!',status:"error"});
                }
                else{
                    let user=new UserModel({username,email,password:hash,mobile,age,verified:false, role});
                    await user.save();
                    const sotp= sendmail(email);
                    client.set(email+"otp",sotp,"ex",300);
                    res.status(200).send({msg:"otp send to email please verify",status:"success"});
                }
            })
        }
    } 
    catch(error){
        res.status(400).send({ err: error.message });
    }
})

/// VERIFY EMAIL API
userRouter.post("/verifyuser",async(req,res)=>{
    const {email,otp}=req.body;

    if(email==undefined||otp==undefined){
        return res.send({err:"enter full details",status:"error"});
    }

    try{
        let validotp=await client.get(email+"otp")
        let user=await UserModel.findOne({email});
        let user_id=user._id

        if(otp==validotp){
                await UserModel.findByIdAndUpdate({_id:user_id},{verified:true});
                return res.send({msg:"verify successfull",status:"success"});
        }
        else{
            await UserModel.findByIdAndDelete({_id:user_id})
            return res.send({err:"invalid otp",status:"error"})
        }
    }
    catch(error){
        res.status(400).send({ err: error.message });
    }
})

// LOGIN USER API
userRouter.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    try {
        let user=await UserModel.findOne({email});
        if(user?.verified){
            if(user.blocked){
                return res.status(403).send({err:'Oops! We find you suspicious, you are blocked'});
            }
            bcrypt.compare(password,user.password,(err,result)=>{
                if(result){
                    //let token=jwt.sign({userID: user._id,username: user.username,email: user.email,mobile: user.mobile,age: user.age, role: user.role},process.env.normalKey,{expiresIn:"1d"});
                    let token=jwt.sign({userID: user._id},process.env.normalKey,{expiresIn:"1d"});
                    let refresh_token=jwt.sign({userID: user._id},process.env.refreshKey,{expiresIn:"30d"});

                    res.status(200).send({msg:"login successfull",token:token,user});
                }
                else{
                    console.log(err);
                    res.status(400).send({err:'Wrong credentials..!'});
                }
            })
        }
        else{
            res.status(404).send({err:'No user found with this eamil! Please register first.'});
        }
    }
    catch(error){
        res.status(400).send({ err: error.message });
    }
})

/// GET REFRESH TOKEN API
userRouter.get("/refreshtoken",(req,res)=>{

    const refreshtoken=req.headers.authorization?.split(" ")[1]

    if(!refreshtoken){
        return res.send({msg:"please login",status:"error"});
    }
    jwt.verify(token,process.env.refreshKey , function(err, decoded) {
        if(err){
            return res.send({msg:"please login",status:"error"})
        }else{
            let userID=decoded.userID
            const token = jwt.sign({userID:userID}, 'hush',{expiresIn:"1d"});
            res.send({token:token,status:"success"});
        }
    });
})

// LOGOUT USER API
userRouter.get('/logout',async(req,res)=>{
    let token = req.headers.authorization;
    try {
        if (token) {
          await client.SADD("blackTokens", token);
          res.status(200).send({msg:"Logged out successfully"});
        } else {
          res.status(401).send("Unauthorised...!");
        }
      }  
      catch(error){
        res.status(400).send({err:error.message });
    }
})

// GET ALL CITIES [city1, city2, city3, ....]
userRouter.get('/allcities',authenticator,async(req,res)=>{
    try {
        const cities=await ClinicModel.distinct("city");
        res.status(200).send({cities});
    } 
    catch(error){
        res.status(400).send({err:error.message});
    }
})

// GET CLINIC BY NAME [clinic1, clinic2, clinic3,....]
userRouter.get('/clinic/:city',authenticator,async(req,res)=>{
    const {city}=req.params;
    try {
        const clinic=await ClinicModel.find({city});
        res.status(200).send({clinic});
    } 
    catch(error){
        res.status(400).send({err:error.message});
    }
})

// ADD CLINIC API - FOR USER WITH ROLE = 'dentist'
userRouter.post('/addclinic',authenticator,authorize(["dentist"]),async(req,res)=>{
    const {city,clinic,userID}=req.body;
    try {
        const data=new ClinicModel({userID,city,clinic,time:[]});
        await data.save();
        res.status(200).send({msg:"clinic added successfully"});
    } 
    catch(error){
        res.status(400).send({ err: error.message });
    }
})

// GET ALL APPOINTMENTS API - FOR 'dentist'
userRouter.get('/dentist/appointments',authenticator,authorize(["dentist"]),async(req,res)=>{
    try {
        let bookedslots=await SlotModel.aggregate(
            [
                {
                    $lookup:{
                        from:"clinics",
                        localField:"clinicID",
                        foreignField:"_id",
                        as:"bookedslots"
                    }
                },
                {
                    $project:{
                        _id:1,
                        userID:1,
                        time:1
                    }
                }
            ]
        );
        if(bookedslots.length){
            res.status(200).send({bookedslots});
        }
        else{
            res.status(404).send({msg:'No slots booked yet'});
        }
    } 
    catch(error){
        res.status(400).send({err:error.message });
    }
})

//  BOOK APPOINTMENT API
userRouter.post('/bookslot/:clinicID',authenticator,async(req,res)=>{
    // just pass the "date" in request body object
    // clinicID(_id) of clinic obj
    const {clinicID} = req.params;
    const {userID,date}=req.body; 
    let d=new Date(date); 
    let time=d.getTime();  
    try {
        const data=await ClinicModel.findOne({_id:clinicID});
        const isBooked=data.time.includes(time);
        if(isBooked){
            res.status(400).send({msg:"Already booked! Choose different time slot"});
        }
        else{
            await ClinicModel.findOneAndUpdate({_id:clinicID},{$push:{time:time}});
            const slot=new SlotModel({userID,clinicID:data._id,time});
            await slot.save();
            res.status(200).send({msg:"Appointment booked successfully"});
        }
    } 
    catch(error){
        res.status(400).send({err:error.message });
    }
})

// GET MY APPOINTMENTS API
userRouter.get('/myappointments',authenticator,async(req,res)=>{
    const {userID}=req.body;
    try {
        let bookedslots=await SlotModel.find({userID});
        if(bookedslots.length){
            res.status(200).send({bookedslots});
        }
        else{
            res.status(404).send('No appointments booked yet');
        }
    } 
    catch(error){
        res.status(400).send({ err: error.message });
    }
})

module.exports={userRouter}