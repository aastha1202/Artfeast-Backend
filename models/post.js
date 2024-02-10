const mongoose = require('mongoose')
const User = require('./user')
// const Cart 

const postSchema = new mongoose.Schema({
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    postUrl:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    price :{
      type: Number,
      default: 0
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: User, 
      }],
      comments: [{
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: User, 
        },
        text: {
          type: String,
        },
      }],
      createdAt: {
        type: Date,
        default: Date.now,
      },
    
    
})


// postSchema.path('userId').ref(User, 'userId');
const Post = mongoose.model('Post',postSchema)

// postSchema.path('userId').ref('User'); 
// console.log(postSchema.paths.userId)


module.exports=Post;