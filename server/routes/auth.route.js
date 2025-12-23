const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')
const protectRoute = require('../middlewares/protectRoute')
router.post('/login', authController.login)
router.post('/signup', authController.signup)
router.post('/logout', authController.logout)
router.get('/profile', protectRoute,authController.getProfile)

module.exports = router
