const User = require("../models/user")
const Post = require("../models/post")



const getUserDetails= async(req,res)=>{
    const {userId} = req.user
    const loggedInUser= await User.findOne({userId:userId})
    if(!loggedInUser) return res.status(400).json({message:'No user Found'})

    const {followings , followers, fullName,  userName , role} = loggedInUser
    return res.status(200).json(loggedInUser)
}

const switchtoArtist = async(req,res)=>{
    try{
        const {userId} = req.user
        const user = await User.findOne({userId})
        user.role= 'artist'
        await user.save()
        return res.status(200).json({message:'Successfuly converted the role to artist'})

    }catch(err){
        return res.status(500).json(err)

    }
}

const getUserProfile = async (req,res) => {
    try{
        const {userId} = req.params
        const user = await User.findOne({userId})
        if(!user){
            return res.status(404).json({nessage: 'No user found'}) 
        }

        const postsOfUser = await Post.find({userId: userId}).select('postUrl likes postId')
        return res.status(200).json({
            user, postsOfUser
        })
    }
    catch(err){
        return res.status(500).json(err)
  
    }
}


module.exports ={
    getUserDetails,
    switchtoArtist,
    getUserProfile
}