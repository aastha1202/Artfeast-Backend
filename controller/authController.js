const User = require('../models/user')
const bcrypt = require('bcrypt');
const mongoose=require('mongoose')
const jwt= require('jsonwebtoken')
require('dotenv').config()


const signup = async (req,res)=>{

 try{
    const { fullName,userName, password} = req.body;
    const user = await User.findOne({userName})
    if(user){
      return res.status(400).json({message: 'User already exists'})
    }
    const hashedPassword= await bcrypt.hash(password,10)
    const userId = new mongoose.Types.ObjectId();

    const newUser = new User({userId:userId,fullName:fullName, userName:userName, password:hashedPassword})
    await newUser.save()
    return res.status(201).json({ message: 'User registered successfully', userId:newUser.userId });

 }
 catch(error){

    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
 }
}

const login = async (req, res) => {
   try {
     const { userName, password } = req.body;
     const user = await User.findOne({ userName });
     const secretKey = process.env.JWT_SECRET
     
     if (!user) {
       return res.status(401).json({ message: 'User not found' });
     }
 
     const passwordMatch = await bcrypt.compare(password, user.password);
 
     if (passwordMatch) {
      const token= jwt.sign({userId: user.userId, userName: user.userName, userType: user.role}, secretKey)
       return res.status(200).json({ message: 'Login successful'  ,userId:user.userId , token});
     } else {
       return res.status(401).json({ message: 'Invalid password' });
     }
   } catch (error) {
     console.error(error);
     return res.status(500).json({ message: 'Internal server error' });
   }
 }
 
 const updateRole=async(req,res)=>{
  try{
     const {userId, role} =req.body;
     const updatedRole= await  User.findOneAndUpdate({userId:userId},{$set:{role: role}},{ new: true })
     if(updatedRole){
      return res.status(200).json({message:`${role} for ${userId} updated successfully`})
     }
     else{
      return res.status(404).json({message:'User not found'})
     }
  }
  catch(error){
    return res.status(500).json({ message: 'Internal server error' });
  }
 }



module.exports={
    signup,
    login,
    updateRole
}

