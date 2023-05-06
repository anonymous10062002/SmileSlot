require("dotenv").config();
const jwt=require('jsonwebtoken');
const {client}=require('../config/db');

const authenticator= async(req,res,next)=>{
    const accessToken=req.headers.authorization?.split(" ")[1];
    try {
        if(accessToken){
            const isBlacklisted=await client.SISMEMBER('blackTokens',accessToken);
            if(isBlacklisted){
                res.status(401).send('Blacklisted Token..!');
            }
            else{
                jwt.verify(accessToken,process.env.normalKey,(err,decoded)=>{
                    if(err){
                        return res.send({msg:err.message,status:"error"})
                    }
                    if(decoded){
                        res.body=decoded;
                        next();
                    }
                    else{
                        res.status(401).send('Invalid Token..!');
                    }
                })
            }
        }
        else{
            res.status(401).send('Please login first..!');
        }
    } catch (error) {
        // console.log(error);
        res.sendStatus(400);
    }
}

module.exports={authenticator}