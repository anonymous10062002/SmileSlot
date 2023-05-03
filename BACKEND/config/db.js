require("dotenv").config();

// MongoDb configuration
const mongoose=require('mongoose');
const mongoDB=mongoose.connect(process.env.mongoURL);

// Redis configuration
const redis=require('redis');
const client=redis.createClient({url:process.env.redisURL});
client.on("error", (err) => console.log("Redis Client Error", err));
module.exports={mongoDB,client}