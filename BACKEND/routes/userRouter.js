require('dotenv').config();
const express=require('express');
const userRouter=express.Router();
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const {UserModel}=require('../models/UserModel');
const {authenticator} = require('../middleware/authenticator');
const {client}=require('../config/db');
const {sendmail}=require("../services/mail")


/// get all users

userRouter.get("/allusers",async(req,res)=>{

    try {

        let user=await UserModel.findOne({email});
        if(user){
            bcrypt.compare(password,user.password,(err,result)=>{
                if(result){
                    let token=jwt.sign({userID: user._id,username: user.username,email: user.email,mobile: user.mobile,age: user.age, role:user.role}, process.env.normalKey);
                    res.status(200).send({token,userData:user});
                }
                else{
                    // console.log(err);
                    res.status(400).send('Wrong credentials..!');
                }
            })
        }
        else{
            res.status(404).send({msg:'No user found with this eamil! Please register first.'});
        }

    } catch (error) {
        res.send({msg:"something went wrong",status:"error"})
    }
})

/// signup 

userRouter.post('/signup',async(req,res)=>{
    let {username,email,password,mobile,age, role}=req.body;
    try {
        const isFound=await UserModel.findOne({email});
        if(isFound){
            res.status(403).send('User already exist..!');
        }
        else{
            bcrypt.hash(password,4,async(err,hash)=>{
                if(err){
                    console.log(err);
                    res.status(400).send('Oops something went wrong..!');
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
        res.send({msg:"Oops something went wrong..! ",status:"error"})
    }
})

/// verify email 

userRouter.post("/verifyuser",async(req,res)=>{
    const {email,otp}=req.body;

    if(email==undefined||otp==undefined){
        return res.send({msg:"enter full details",status:"error"});
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
            return res.send({msg:"invalid otp",status:"error"})
        }
    }
    catch(err){
        res.send({msg:"Oops something went wrong..! ",status:"error"})
    }
    
})

// login 

userRouter.post('/login',async(req,res)=>{
    let {email,password}=req.body;
    try {
        let user=await UserModel.findOne({email});
        if(user?.verified){
            bcrypt.compare(password,user.password,(err,result)=>{
                if(result){
                    let token=jwt.sign({userID: user._id,username: user.username,email: user.email,mobile: user.mobile,age: user.age, role: user.role},process.env.normalKey);
                    res.status(200).send({token,userData:user});
                }
                else{
                    // console.log(err);
                    res.status(400).send('Wrong credentials..!');
                }
            })
        }
        else{
            res.status(404).send({msg:'No user found with this eamil! Please register first.'});
        }
    } catch (error) {
        // console.log(error);
        res.sendStatus(400);
    }
})







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

// SECURED ROUTE
userRouter.get('/slots',authenticator,async(req,res)=>{
    res.send('SECURE ROUTED');
})

module.exports={userRouter}