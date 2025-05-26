import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
export const signup = async(req,res) =>{
    const {fullName,email,password} = req.body;
    try {
        if(!fullName || !email || !password){
            return res.status(400).json({message:"Please fill in all fields"})
        }
        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters"}); 
        }
        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({message:"Email already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            fullName,
            email,
            password:hashedPassword
        })
        if(newUser){
            generateToken(newUser._id,res);
            await newUser.save();
            return res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });

        }else{
            return res.status(400).json({message:"Failed to create new user"});
        }
    } catch (error) {
        console.log("Error in signup controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const login = async(req,res) =>{
   const {email, password} = req.body;
   try {
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message:"Invalid Credentials"})
    }
    const isPasswordCorrect = await bcrypt.compare(password,user.password);
    if(!isPasswordCorrect){
        return res.status(400).json({message:"Invalid Credentials"})
    }
    generateToken(user._id,res);
    res.status(200).json({
        _id: user._id,
        email:user.email,
    })
   } catch (error) {
    console.log("Error in Login controller",error.message);
    res.status(500).json({message:"Internal Server Error"});
   }
}

export const logout = (req,res) =>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logged out successfully"})
    } catch (error) {
        console.log("Error in Logout controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Please add a profile picture" });
    }

    // Upload image to Cloudinary inside 'chat-app' folder
    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      folder: "chat-app-03",  // <-- This will save the image inside this folder
    });

    // Update user profilePic URL in DB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in updating Profile", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const checkAuth = (req,res) =>{
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in checkAuth controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}