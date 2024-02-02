const express = require('express')

const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handle')

router.use('/admin', admin)
router.get('/signup', userController.singUpPage)
router.post('/signup', userController.singUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn) // 注意是 post
router.get('/logout', userController.logout)
router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/signin'))
router.use('/', generalErrorHandler)
module.exports = router
