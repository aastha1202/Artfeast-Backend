const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Post",
        required: true,
        unique: true
    },
    fullName:{
        type:String,
        required:true,
    },
    userName:{
        type:String,
        unique: true,
        required:true, 
    },
    password:{
        type:String,
        required: true,
    },
    role: {
        type: String, 
        enum: ['artist', 'customer'], 
    },
    profilePictureUrl:{
        type:String,
        default:'https://th.bing.com/th/id/OIP.Vkq2M9ypBsn7NpZwDZeNyQHaHa?rs=1&pid=ImgDetMain'
    },
    followers:[
        {type: mongoose.Schema.Types.ObjectId, ref:'User'}
    ],
    followings:
    [
        {type: mongoose.Schema.Types.ObjectId, ref:'User'}
    ],
});

const User = mongoose.model("User", userSchema)

module.exports = User;
