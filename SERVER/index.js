const express = require('express');
const app = express();
require('dotenv').config();
const main = require('./Config/db');
const cookie = require('cookie-parser');
app.use(express.json());
app.use(cookie());


main()
.then(async ()=>{
    app.listen(process.env.PORT,()=>{
        console.log("Server listening at port number: "+ process.env.PORT);
    })
})
.catch(err=>console.log("Error Occurred:"+err));

