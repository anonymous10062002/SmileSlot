const mongoose=require('mongoose');
require("dotenv").config();

const mongoDB=mongoose.connect(process.env.mongoURL);

module.exports={mongoDB}