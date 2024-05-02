const express = require('express')
const router = express.Router();
const userController = require('../controller/userController')
const middleware = require('../middleware/auth')


router.get('/',middleware,userController.getUserDetails)
router.post('/switchRole',middleware,userController.switchtoArtist)
router.get('/:userId',middleware,userController.getUserProfile)
router.put('/',middleware,userController.updateProfilePhoto)






module.exports= router

