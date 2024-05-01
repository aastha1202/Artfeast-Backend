const express = require('express')
const router = express.Router();
const orderController = require('../controller/orderController')
const middleware = require('../middleware/auth')


router.post('/add',middleware,orderController.addOrder)
router.get('/',middleware,orderController.fetchAllOrders)
router.get('/artists',middleware,orderController.fetchOrdersForArtist)






module.exports= router

