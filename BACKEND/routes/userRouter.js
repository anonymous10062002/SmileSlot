const express=require('express');
const {UserModel}=require('../models/UserModel');
const userRouter=express.Router();
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
require('dotenv').config();

userRouter.post('/login',async(req,res)=>{
    let {email,password}=req.body;
    try {
        let users=await UserModel.find({email});
        if(users.length){
            bcrypt.compare(password,users[0].password,(err,result)=>{
                if(result){
                    let token=jwt.sign({userID: users[0]._id,username: users[0].username,email: users[0].email,mobile: users[0].mobile,age: users[0].age},process.env.normalKey);
                    res.status(200).send({token});
                }
                else{
                    res.status(400).send('Wrong credentials..!');
                }
            })
        }
        else{
            res.status(404).send({msg:'No user found with this eamil! Please register first.'});
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
})

userRouter.post('/signup',async(req,res)=>{
    let {username,email,password,mobile,age}=req.body;
    try {
        const isFound=await UserModel.find({email});
        if(isFound.length){
            res.status(403).send('User already exist..!');
        }
        else{
            bcrypt.hash(password,4,async(err,hash)=>{
                if(err){
                    console.log(err);
                    res.status(400).send('Oops something went wrong..!');
                }
                else{
                    let user=new UserModel({username,email,password:hash,mobile,age});
                    await user.save();
                    res.status(200).send('Registered successfully');
                }
            })
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
})

module.exports={userRouter}