import User from "../models/user.model.js";
import bcrypt from "bcrypt"
import genToken from "../utils/token.js";
export const signUp= async (req,res) => {
    try {
        const {fullName,email,password,mobile,role}=req.body;
        const user=await User.findOne({email})
        if(user){
            return res.status(400).json({message:"User Already exist"})
        }
        if(password.length<6){
            return res.status(400).json({message:"password must be atlease 6 char"})
        }
        if(mobile.length<10){
            return res.status(400).json({message:"mobileno must be atlease 10 no"})
        }

        const hashedPassword = await bcrypt.hash(password,10)
        const newUser = await User.create({
            fullName,
            email,
            role,
            mobile,
            password:hashedPassword
        })

        const token = await genToken(newUser._id)
        res.cookie("token",token,{
            secure:false,
            sameSite:"strict",
            maxAge:7*24*60*60*1000,
            httpOnly:true
        })
        return res.status(201).json({user})
    } catch (error) {
        return res.status(500).json({message: `Sign up error: ${error.message}`})
    }
    
}

export const signIn= async (req,res) => {
    try{
        const {fullName , email,password,mobile,role}=req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"User does not exists exits"})
        }

        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
           return res.status(400).json({message:"Invalid Password"})
        }
        const token = await genToken(user._id)
        res.cookie("token",token,{
            secure:false,
            sameSite:"strict",
            maxAge:7*24*60*60*1000,
            httpOnly:true
        })
        return res.status(200).json(user)
    }
    catch{
        return res.status(500).json(`sign in error${error}`)
    }
    
}

export const signOut = async (req,res) => {
    try {
        res.clearCookie("token")
       return res.status(200).json({message:"Log Out Sucessfully"})
    } catch (error) {
        return res.status(200).json({message:"log out error"})
    }
    
}