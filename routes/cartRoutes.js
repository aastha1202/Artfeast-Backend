const express = require('express')
const router = express.Router();
const cartController = require('../controller/cartController')
const middleware = require('../middleware/auth')


router.post('/add',middleware,cartController.addPost)
router.delete('/:postId', middleware, cartController.deletePost)
router.delete('/decrease/:postId', middleware, cartController.decreasePostQuantityItem)
router.get('/', middleware,cartController.findAllPostsinCart)

module.exports= router