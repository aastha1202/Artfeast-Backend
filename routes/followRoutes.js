const express = require('express')
const router = express.Router();
const followController = require('../controller/followController')
const middleware = require('../middleware/auth')


router.post('/:userId',middleware,followController.followUser)
router.delete('/:userId',middleware,followController.unfollowUser)


module.exports= router