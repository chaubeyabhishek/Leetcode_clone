const User = require("../Models/user");
const validate = require("../Utils/validator")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');


exports.register = async(req, res)=>{
    try {
        validate(req.body);

        const { firstName, email, password } = req.body;

    
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

    
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            ...req.body,
            password: hashedPassword
        });

        
        const token = jwt.sign(
            {
                _id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        
        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: userResponse
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.login = async(req, res)=>{
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        
        const match = await bcrypt.compare(
            password,
            user.password
        );

        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        
        const token = jwt.sign(
            {
                _id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "Login successful"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.logout = async(req,res)=>{
    try{
        
    }
    catch(err){

    }
}