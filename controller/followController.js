const User = require('../models/user')
const mongoose=require('mongoose')


const followUser= async (req, res)=>{
  try{
    const userId= req.params.userId
    const loggedInUser = req.user.userId
    if(loggedInUser===userId){
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }
    const followerId = await User.findOne({userId:loggedInUser})
    followerId.followings.push(userId)
    const followingId= await User.findOne({userId:userId})
    followingId.followers.push(loggedInUser)
    await followerId.save()
    await followingId.save()
    return res.status(200).json({message:'successful'})
  }
  catch(error){
    res.status(500).json({ error: error });
  }
  }
  const unfollowUser= async (req, res)=>{
    try{
      const userId= req.params.userId
      const loggedInUser= req.user.userId
      const followerId = await User.findOne({userId:loggedInUser})
      await followerId.updateOne({ $pull: { followings: userId } });
      const followingId= await User.findOne({userId:userId})
      await followingId.updateOne({$pull:{followers:loggedInUser}})
      return res.status(200).json({message:'successful'})
    }
    catch(error){
      res.status(500).json({ error: error });
    }
    
    }
module.exports= {
    followUser,
    unfollowUser
}

