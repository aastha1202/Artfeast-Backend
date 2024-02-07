const express = require('express')
const router = express.Router();
const userController = require('../controller/userController')
const middleware = require('../middleware/auth')


router.get('/',middleware,userController.getUserDetails)



module.exports= router

