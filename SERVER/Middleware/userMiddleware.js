const jwt = require("jsonwebtoken");
const User = require("../Models/user");
const redisClient = require("../Config/redis");

exports.userMiddleware = async (req, res, next) => {
    try {

        const token =
            req.cookies?.token ||
            req.headers.authorization?.split(" ")[1] ||
            req.body?.token;

        if (!token) {
            throw new Error("Token is not present");
        }

        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const { _id } = payload;

        if (!_id) {
            throw new Error("Invalid token");
        }

        const result = await User.findById(_id);

        if (!result) {
            throw new Error("User doesn't exist");
        }

        // blacklist check
        const isBlocked =
            await redisClient.exists(`token:${token}`);

        if (isBlocked) {
            throw new Error("Token is blocked");
        }

        req.user = result;

        next();

    } catch (err) {
        return res.status(401).json({
            success: false,
            message: err.message
        });
    }
};