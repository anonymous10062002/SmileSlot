require("dotenv").config();
const jwt=require('jsonwebtoken');
const {client}=require('../config/db');

const authenticator= async(req,res,next)=>{
    const accessToken=req.headers.authorization?.split(" ")[1];
    try {
        if(accessToken){
            const isBlacklisted=await client.SISMEMBER('blackTokens',accessToken);
            if(isBlacklisted){
                res.status(401).send({msg:'Blacklisted Token..!',status:error});
            }
            else{
                jwt.verify(accessToken,process.env.normalKey,(err,decoded)=>{
                    if(err){
                        return res.send({msg:err.message,status:"error"});
                    }
                    else{
                        let userID=decoded.userID;
                        req.body.userID=userID;
                        next();
                    }
                    
                })
            }
        }
        else{
            res.status(401).send({msg:'Please login first..!',status:error});
        }
    } catch (error) {
        // console.log(error);
        res.status(401).send({msg:'Something went wrong!',status:error});
    }
}

module.exports={authenticator}