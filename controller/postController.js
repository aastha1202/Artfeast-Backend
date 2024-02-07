const Post = require('../models/post')
const mongoose= require('mongoose')
const User = require('../models/user');


const upload = async (req,res)=>{
    try{
        const {postUrl}= req.body
        const {userId} = req.user
        const postId = new mongoose.Types.ObjectId();
        console.log(postUrl)
        console.log(userId)

        const newPost = new Post({postId,postUrl,userId:userId})
        await newPost.save()
        return res.status(200).json({message:'Uploaded Post'})

    }
    catch(error){
        console.error(error);

    }
}

const fetchUserPosts = async(req,res)=>{
    try{
        const userId= req.user.userId
        const userPosts= await Post.find({userId:userId}).populate({
            path: 'userId',
            model: 'User',
            select: 'userName followers followings',
            foreignField: 'userId',
          })
        return res.status(200).json(userPosts)

    }
    catch(error){
        return res.status(500).json(error)
    }
}

const fetchAllPosts = async (req,res)=>{
    try{
        const posts= await Post.find().populate({
            path: 'userId',
            model: 'User',
            select: 'userName',
            foreignField: 'userId',
          })
        console.log(posts)
        return res.json(posts)

    }
    catch(error){
        console.log(error)
    }
}


module.exports={
    upload,
    fetchUserPosts,
    fetchAllPosts
}