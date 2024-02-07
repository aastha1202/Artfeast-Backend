const User = require("../models/user")


const getUserDetails= async(req,res)=>{
    const {userId} = req.user
    const loggedInUser= await User.findOne({userId:userId})
    if(!loggedInUser) return res.status(400).json({message:'No user Found'})
    
    return res.status(200).json(loggedInUser)
}


module.exports ={
    getUserDetails
}