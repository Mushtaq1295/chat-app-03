import jwt from "jsonwebtoken"
export const generateToken = (userId, res) =>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7h"
    })
   res.cookie("jwt", token, {
    maxAge: 7 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
    domain: "localhost", // Add this for local development
    path: "/", // Ensure cookie is sent for all paths
});
    return token;
};