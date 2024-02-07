const express = require('express')
const router = express.Router();
const postController = require('../controller/postController')
const middleware = require('../middleware/auth')


router.post('/upload',middleware,postController.upload)
router.get('/userPosts',middleware,postController.fetchUserPosts)
router.get('/posts',middleware,postController.fetchAllPosts)



module.exports= router

