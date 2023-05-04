const authorize=(roleArray)=>{
    
    return (req,res,next)=>{
        const user=req.body.user;
        const userRole=user.role;
        if(roleArray.includes(userRole)){
            next();
        }
        else{
            res.status(401).send('Not authorised..!!');
        }
    }
}

module.exports={authorize}