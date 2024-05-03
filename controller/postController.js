const Post = require('../models/post')
const mongoose= require('mongoose')
const User = require('../models/user');
const crypto = require('crypto');
const https = require('https');

function calculateImageHash(imageUrl) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256');
        https.get(imageUrl, (response) => {
            response.on('data', (data) => {
                hash.update(data);
            });
            response.on('end', () => {
                const imageHash = hash.digest('hex');
                resolve(imageHash);
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

const upload = async (req,res)=>{
    try{
        const {postUrl, description, price, artworkName,theme, condition,dimensions, category, customization}= req.body.postDescription
        const {userId,userType} = req.user
        if(userType!=='artist'){
            return res.status(403).json({ message: 'Only artists are allowed to upload a Post' });
        }
        const postId = new mongoose.Types.ObjectId();
        const imageHash = await calculateImageHash(postUrl); 
        const newPost = new Post({postId,postUrl,userId:userId, description,price,artworkName,theme, condition,dimensions, category, customization,imageHash})
        await newPost.save()
        return res.status(200).json({message:'Uploaded Post'})

    }
    catch(error){
        console.error(error);
        return res.status(500).json({error})

    }
}

const fetchUserPosts = async(req,res)=>{
    try{
        const userId= req.user.userId
        const userPosts= await Post.find({userId:userId}).select('postUrl likes')
        return res.status(200).json(userPosts)

    }
    catch(error){
        return res.status(500).json(error)
    }
}

const fetchAllPosts = async (req,res)=>{
    try{
        const posts= await Post.find().sort({createdAt: -1}).populate({
            path: 'userId',
            model: 'User',
            select: 'userName',
            foreignField: 'userId',
          })
        return res.json(posts)

    }
    catch(error){
        return res.status(500).json(err)
    }
}

const fetchSinglePost = async (req,res) => {
    try{
        const {postId} = req.params
        const post= await Post.findOne({postId: postId}).populate({
            path: 'userId',
            model: 'User',
            select: 'userName fullName profilePictureUrl',
            foreignField: 'userId', 
        })
        return res.json(post)
    }
    catch(err){
        return res.status(500).json(err)
    }
}

const fetchHomePageData = async(req,res) => {
    try{
        const trendingArtists= await User.aggregate([
            {
                $match: { role: "artist", followers: { $gt: 0 } }
            },
            { 
              $project: {
                fullName: 1,
                userId: 1,
                profilePictureUrl: 1,
                followerCount: { $size: "$followers" }
              }
            },
            {
              $sort: { followerCount: -1 }
            },
            {
              $limit: 10
            }
          ]);

          const trendingArts = await Post.aggregate([
            {
                $project:{
                    postUrl:1,
                    price: 1,
                    userId: 1,
                    postId: 1,
                    theme:1,
                    likesCount : {$size: '$likes'}
                }
            },
            {
                $sort : {likesCount: -1}
            },
            {
                $limit: 10
            },
            {
                $lookup: {
                    from: 'users', 
                    localField: 'userId',
                    foreignField: 'userId',
                    as: 'user'
                }
            },
            {
                $project: {
                    postUrl: 1,
                    price: 1,
                    postId:1,
                    theme:1,
                    user: { $arrayElemAt: ['$user.fullName', 0] } 
                }
            }
          ])

          const categoriesPosts = await Post.aggregate([
            {
                $match: { category: { $exists: true, $ne: null } } 
            },
            {
                $group: {
                    _id: "$category",
                    firstPost: { $first: "$$ROOT" }
                }
            },
            {
                $replaceRoot: { newRoot: "$firstPost" }
            }
        ]);

        const responseData = {
            trendingArtists,
            trendingArts,
            categoriesPosts
        }

        res.status(200).json(responseData);

    }
    catch(err){
        return res.status(500).json(err)
    }
}

const likePost = async (req,res) => {
    try{
        const {userId} = req.user;
        const { postId } = req.params;
    
        const post = await Post.findOne({postId: postId});
        if (!post) {
          return res.status(404).json({ message: 'Post not found' });
        }
    
        if (post.likes.includes(userId)) {
          return res.status(400).json({ message: 'Post already liked' });
        }

        post.likes.push(userId);
        
        await post.save();
    
        return res.status(200).json({ message: 'Post liked successfully' });

    }catch(err){
        return res.status(500).json(err)

    }
} 


const unlikePost = async (req,res) => {
    try{
        const {userId} = req.user;
        const { postId } = req.params;
    
        const post = await Post.findOne({postId: postId});
        if (!post) {
          return res.status(404).json({ message: 'Post not found' });
        }
    
        if (!post.likes.includes(userId)) {
          return res.status(400).json({ message: 'Post is not liked' });
        }

        await post.updateOne({ $pull: { likes: userId } });
        
    
        return res.status(200).json({ message: 'Post Unliked successfully' });

    }catch(err){
        return res.status(500).json(err)

    }
} 

const getPostsByCategory = async (req,res) => {
    try{
        const validCategories = ['Abstract', 'Oil Painting', 'Glass Painting', 'Pastel', 'Acrylic', 'Realism'];
        const {categoryName} = req.params
        if (!validCategories.includes(categoryName)) {
            return res.status(400).json({ error: 'Invalid category name' });
        }


        const postsbyCategory= await Post.find({category: categoryName})
        return res.status(200).json(postsbyCategory );

    }catch(err){
        return res.status(500).json(err)

    }
}


const commentOnPost = async (req,res) => {
    try{
        const {userId} = req.user;
        const { postId } = req.params;
        const {comment} = req.body
    
        const post = await Post.findOne({postId: postId});
        if (!post) {
          return res.status(404).json({ message: 'Post not found' });
        }
    
        post.comments.push({userId: userId, text : comment});
        
        await post.save();
    
        return res.status(200).json({ message: 'Successfully commented on Post' });

    }catch(err){
        return res.status(500).json(err)

    }
} 


const fetchCommentOfPost = async (req,res) => {
    try{
        // const {userId} = req.user;
        const { postId } = req.params;
    
        const post = await Post.findOne({postId: postId}).select('comments userId')
        if (!post) {
          return res.status(404).json({ message: 'Post not found' });
        }
    
       const comments = await post.populate({
        path: 'comments.userId',
        select: 'userName fullName profilePictureUrl',
        model : 'User',
        foreignField: 'userId',
       });
            
        return res.status(200).json(comments);

    }catch(err){
        return res.status(500).json(err)

    }
}

const findSimilarArtwork = async (req, res) => {
    try {
        const { imageHash } = req.params;
        const similarArtwork = await Post.find({ imageHash: imageHash });

        return res.status(200).json(similarArtwork);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error });
    }
}; 


module.exports={
    upload,
    fetchUserPosts,
    fetchAllPosts,
    fetchSinglePost,
    fetchHomePageData,
    likePost,
    getPostsByCategory,
    unlikePost,
    commentOnPost,
    fetchCommentOfPost,
    findSimilarArtwork
}