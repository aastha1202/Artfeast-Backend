const express = require('express')
const router = express.Router();
const authController = require('../controller/authController')
const middleware = require('../middleware/auth')

router.post('/signup',authController.signup)
router.post('/login', authController.login)
router.put('/updateRole' ,authController.updateRole)


module.exports= router

