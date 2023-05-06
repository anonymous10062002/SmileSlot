require('dotenv').config();
const express=require('express');
const userRouter=express.Router();
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const {UserModel}=require('../models/UserModel');
const {ClinicModel}=require('../models/ClinicModel');
const {SlotModel}=require('../models/ClinicModel');
const {authorize}=require('../middleware/authorize');
const {authenticator} = require('../middleware/authenticator');
const {client}=require('../config/db');
const {sendmail}=require("../services/mail")


/// get all users

// userRouter.get("/allusers",async(req,res)=>{

//     try {
//         let allusers = await UserModel.find();

//         res.send({allusers:allusers,status:"success"})
        
//     } catch (error) {
//         res.send({msg:"something went wrong",status:"error"})
//     }
// })

/// signup 

userRouter.post('/signup',async(req,res)=>{
    let {username,email,password,mobile,age, role}=req.body;
    try {
        const isFound=await UserModel.findOne({email});

        if(isFound?.verified==false){
            id=isFound._id
            try {
               
                await UserModel.findByIdAndDelete({_id:id});
               
            } catch (error) {
                console.log(error)
            }
        }
        if(isFound){
           
            res.status(403).send({err:'User already exist..!'});
        }
        else{
            bcrypt.hash(password,4,async(err,hash)=>{
                if(err){
                    console.log(err);
                    res.status(400).send({err:'Oops something went wrong..!'});
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
    } catch (error) {
        // console.log(error);
        res.send({err:"Oops something went wrong..! ",status:"error"})
    }
})

/// verify email 

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
    catch(err){
        res.send({err:"Oops something went wrong..! ",status:"error"})
    }
    
})

// login 

userRouter.post('/login',async(req,res)=>{
    let {email,password}=req.body;
    try {
        let user=await UserModel.findOne({email});
        // console.log(user?.verified)
        if(user?.verified){
            bcrypt.compare(password,user.password,(err,result)=>{
                if(result){

                    //let token=jwt.sign({userID: user._id,username: user.username,email: user.email,mobile: user.mobile,age: user.age, role: user.role},process.env.normalKey,{expiresIn:"1d"});
                    let token=jwt.sign({userID: user._id},process.env.normalKey,{expiresIn:"1d"});
                    let refresh_token=jwt.sign({userID: user._id},process.env.refreshKey,{expiresIn:"30d"});

                    res.status(200).send({msg:"login successfull",token:token,status:"success"});

                }
                else{
                    // console.log(err);
                    res.status(400).send({msg:'Wrong credentials..!',status:"error"});
                }
            })
        }
        else{
            res.status(404).send({msg:'No user found with this eamil! Please register first.',status:"error"});
        }
    } catch (error) {
        // console.log(error);
        res.status(404).send({msg:'Something went wrong',status:"error"});
        
    }
})


/// refresh token

userRouter.get("/refreshtoken",(req,res)=>{

    const refreshtoken=req.headers.authorization?.split(" ")[1]

    if(!refreshtoken){
        return res.send({msg:"please login",status:"error"});
    }

    jwt.verify(token,process.env.refreshKey , function(err, decoded) {
        if(err){
            return res.send({msg:"please login"})
        }else{
            let userID=decoded.userID
            const token = jwt.sign({userID:userID}, 'hush',{expiresIn:"1d"});
            res.send({token:token,status:"success"});
        }
        
      });
    
    
})

// logout

userRouter.get('/logout',async(req,res)=>{
    let token = req.headers.authorization;
    try {
        if (token) {
          await client.SADD("blackTokens", token);
          res.status(200).send("Log out successfull");
        } else {
          res.status(401).send("Unauthorised...!");
        }
      }  catch (error) {
        // console.log(error);
        res.sendStatus(400);
    }
})

// get all cities [city1, city2, city3, ....]
userRouter.get('/allcities',authenticator,async(req,res)=>{
    try {
        const cities=await ClinicModel.distinct("city");
        res.status(200).send(cities);
    } 
    catch (error) {
       res.sendStatus(400); 
    }
})

// get clinics by city name [clinic1, clinic2, clinic3,....]
userRouter.get('/clinic/:city',authenticator,async(req,res)=>{
    const {city}=req.params;
    try {
        const clinic=await ClinicModel.find({city});
        res.status(200).send(clinic);
    } 
    catch (error) {
       res.sendStatus(400); 
    }
})

// get all clinics 
// userRouter.get('/allclinics',authenticator,authorize(["admin"]),async(req,res)=>{
//     try {
//         const clinics=await ClinicModel.distinct("clinic");
//         res.status(200).send(clinics);
//     } 
//     catch (error) {
//        res.sendStatus(400); 
//     }
// })

// ONLY FOR USERS HAVING ROLE===DENTIST //
userRouter.post('/addclinic',authenticator,authorize(["dentist"]),async(req,res)=>{
    const token=req.headers.authorization;
    const {city,clinic}=req.body;
    // const userID=token.userID;
    try {
        const data=new ClinicModel({userID,city,clinic,booked:[]});
        await data.save();
        res.status(200).send({msg:"clinic added successfully"});
    } 
    catch (error) {
       res.sendStatus(400); 
    }
})

//  BOOK APPOINTMENT

userRouter.post('/bookslot',authenticator,async(req,res)=>{
    const {userID,city,clinic,date}=req.body;  //userID need to be changed
    try {
        const clin=await ClinicModel.findOne({clinic});
        const isBooked=clin.booked.includes(date);
        if(isBooked){
            res.status(400).send({msg:"already booked"});
        }
        else{
            await ClinicModel.findOneAndUpdate({clinic},{$push:{booked:date}});
            const slot=new SlotModel({userID,city,clinic,date});
            await slot.save();
            res.status(200).send({msg:"appointment  booked successfully"});
        }
    } 
    catch (error) {
       res.sendStatus(400); 
    }
})

module.exports={userRouter}