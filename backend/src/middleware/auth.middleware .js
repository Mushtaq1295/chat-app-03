import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        // Add null checks for req.cookies
        const token = req.cookies?.jwt;

        if (!token) {
            return res.status(401).json({ msg: "Unauthorized - No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        
        if (!user) {
            return res.status(401).json({ msg: "Unauthorized - User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware:", error.message);
        return res.status(401).json({ msg: "Unauthorized - Invalid token" });
    }
};
