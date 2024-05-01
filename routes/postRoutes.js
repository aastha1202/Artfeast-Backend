const express = require('express')
const router = express.Router();
const postController = require('../controller/postController')
const middleware = require('../middleware/auth')


router.post('/upload',middleware,postController.upload)
router.get('/userPosts',middleware,postController.fetchUserPosts)
router.get('/posts',middleware,postController.fetchAllPosts)
router.get('/:postId', middleware, postController.fetchSinglePost)
router.get('/', postController.fetchHomePageData)
router.post('/like/:postId',middleware, postController.likePost)
router.post('/unlike/:postId',middleware, postController.unlikePost)
router.post('/comment/:postId',middleware, postController.commentOnPost)
router.get('/comment/:postId',middleware, postController.fetchCommentOfPost)
router.get('/category/:categoryName',middleware, postController.getPostsByCategory)





module.exports= router

