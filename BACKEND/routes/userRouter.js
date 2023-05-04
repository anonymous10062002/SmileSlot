require('dotenv').config();
const express=require('express');
const userRouter=express.Router();
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const {UserModel}=require('../models/UserModel');
const {authenticator} = require('../middleware/authenticator');
const {client}=require('../config/db');

userRouter.post('/login',async(req,res)=>{
    let {email,password}=req.body;
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
        // console.log(error);
        res.sendStatus(400);
    }
})

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
                    let user=new UserModel({username,email,password:hash,mobile,age, role});
                    await user.save();
                    res.status(200).send('Registered successfully');
                }
            })
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