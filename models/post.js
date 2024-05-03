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
        type: String,
        required : true 
    },
    artworkName: {
      type: String,
      required: true
    },
    theme: {
        type: String,
        required: true
    },
    condition: {
        type: String,
        required: true
    },
    dimensions: {
        height: { type: Number, required: true },
        width: { type: Number, required: true },
        depth: { type: Number, required: true }
    },
    category: {
        type: String,
        enum: ['Abstract', 'Oil Painting', 'Glass Painting', 'Pastel', 'Acrylic', 'Realism'],
    },
    customization: {
        type: Boolean,
        required: true
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
      imageHash: {
        type: String,
        // required: true
    }
    
    
})


// postSchema.path('userId').ref(User, 'userId');
const Post = mongoose.model('Post',postSchema)


module.exports=Post;