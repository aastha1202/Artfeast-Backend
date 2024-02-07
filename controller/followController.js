const User = require('../models/user')
const mongoose=require('mongoose')


const followUser= async (req, res)=>{
  try{
    const userId= req.params.userId
    console.log(userId)
    const loggedInUser = req.user.userId
    console.log(loggedInUser)
    const followerId = await User.findOne({userId:loggedInUser})
    followerId.followings.push(userId)
    const followingId= await User.findOne({userId:userId})
    followingId.followers.push(loggedInUser)
    console.log(await User.findOne({userId:userId}).populate('followers'))
    await followerId.save()
    await followingId.save()
    return res.send(200).json({message:'successful'})
  }
  catch(error){
    console.log(error)
  }
  }
  const unfollowUser= async (req, res)=>{
    try{
      const userId= req.params.userId
      console.log(userId)
      const loggedInUser= req.user.userId
      console.log(loggedInUser)
      const followerId = await User.findOne({userId:loggedInUser})
      await followerId.updateOne({ $pull: { followings: userId } });
      const followingId= await User.findOne({userId:userId})
      await followingId.updateOne({$pull:{followers:loggedInUser}})
      return res.send(200).json({message:'successful'})
    }
    catch(error){
      console.log(error)
    }
    
    }
module.exports= {
    followUser,
    unfollowUser
}

