const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:2,
        maxLength:20,
    },
    LastName:{
        type:String,
        minLength:3,
        maxLength:20,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        immutable:true,
    },
    age:{
        type:Number,
        min:6,
        max:80,
    },
    role:{
        type:String,
        enum:['user','admin'],
        default: "user"
    },
    password:{
        type:String,
        required:true,
    },
    problemSolved:{
        type:[string]
    }

},{
    timestamps:true
});

const User = mongoose.model("user",userSchema);
module.exports = User;