require("dotenv").config();
const jwt=require("jsonwebtoken");
const {client}=require('../config/db');

const adminAuth = async(req, res, next)=>{
  const accessToken=req.headers.authorization?.split(" ")[1];
  try {
    if (accessToken) {
      const isBlacklisted=await client.SISMEMBER('blackTokens',accessToken);
      if(isBlacklisted){
        res.status(401).send({err:'Blacklisted Token..!'});
      }
      else{
        jwt.verify(accessToken, process.env.adminKey, (err, decoded) => {
          if(decoded.role === "admin"){
            next();
          } 
          else{
            res.status(401).send({"err":err});
          }
        });
      }
    } 
    else {
      res.status(401).send({err:"Invalid Token..!!"});
    }
  } 
  catch(error){
    res.status(401).send({"err":error.message});
  }
};

module.exports = { adminAuth };
