const jwt = require("jsonwebtoken");
const User = require("../Models/user");
const redisClient = require("../Config/redis");

exports.adminMiddleware = async (req, res, next) => {
    try {

        const token =
            req.cookies?.token ||
            (
                req.headers?.authorization?.startsWith("Bearer ")
                    ? req.headers.authorization.split(" ")[1]
                    : null
            ) ||
            req.body?.token;

        if (!token) {
            throw new Error("Token not found");
        }

        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(payload._id);

        if (!user) {
            throw new Error("User not found");
        }

        const isBlocked =
            await redisClient.exists(`token:${token}`);

        if (isBlocked) {
            throw new Error("Token blocked");
        }

        if (user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        req.user = user;

        next();

    } catch (err) {
        return res.status(401).json({
            success: false,
            message: err.message
        });
    }
};

