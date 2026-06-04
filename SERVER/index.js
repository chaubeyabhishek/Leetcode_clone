const express = require('express');
const app = express();
require('dotenv').config();
const main = require('./Config/db');
const cookie = require('cookie-parser');
const authRouter = require("./Routes/userAuth");
const redisClient = require('./Config/redis');

app.use(express.json());
app.use(cookie());

app.use('/user',authRouter);
redisClient.on("error", (err) => {
    console.log(
        "Redis Error:",
        err.message
    );
});
const InitalizeConnection = async ()=>{
    try{
        await Promise.all([main(),redisClient.connect()]);
        console.log("DB Connected");

        app.listen(process.env.PORT,()=>{
            console.log("Server listening at port number: "+ process.env.PORT);
        })
    }
    catch(err){

    }
}

InitalizeConnection();
