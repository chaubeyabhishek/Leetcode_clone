const User = require("../Models/user");
const validate = require("../Utils/validator")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const redisClient = require("../Config/redis");

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
        req.body.role = 'user';

        const user = await User.create({
            ...req.body,
            role : "user",
            password: hashedPassword
        });

        
        const token = jwt.sign(
            {
                _id: user._id,
                email: user.email,
                role:"user"
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
                email: user.email,
                role:user.role
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

exports.logout = async (req, res) => {
    try {

        const { token } = req.cookies;

        if (!token) {
            throw new Error("Token not found");
        }

        const payload = jwt.decode(token);

        if (!payload?.exp) {
            throw new Error("Invalid token");
        }

       
        await redisClient.set(
            `token:${token}`,
            "Blocked"
        );

        await redisClient.expireAt(
            `token:${token}`,
            payload.exp
        );

        
        res.clearCookie("token");

        return res.status(200).json({
            success: true,
            message: "Logged Out Successfully"
        });

    } catch (err) {

        return res.status(401).json({
            success: false,
            message: err.message
        });
    }
};

exports.adminRegister = async (req,res) => {

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
        req.body.role = 'user';

        const user = await User.create({
            ...req.body,
            role : "admin",
            password: hashedPassword
        });

        
        const token = jwt.sign(
            {
                _id: user._id,
                email: user.email,
                role:"admin"
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
    
}



