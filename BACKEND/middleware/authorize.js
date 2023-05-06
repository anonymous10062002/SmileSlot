const {UserModel}=require('../models/UserModel');
const authorize=(roleArray)=>{
    
    return async (req,res,next)=>{
        const user=req.body;
        const id=user.userID;
        const userData=await UserModel.findById({_id:id});
        if(roleArray.includes(userData.role)){
            next();
        }
        else{
            res.status(401).send('Not authorised..!!');
        }
    }
}

module.exports={authorize}