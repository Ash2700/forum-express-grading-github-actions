const express = require('express')

const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller.js')
const { authenticated, authenticatedAdmin } = require('../middleware/auth.js')
const { generalErrorHandler } = require('../middleware/error-handle')

router.use('/admin', authenticatedAdmin, admin)

router.get('/signup', userController.singUpPage)
router.post('/signup', userController.singUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

router.get('/restaurants/:id/dashBoard', restController.getDashboard)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants)

router.post('/comments', authenticated, commentController.postComment)

router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)
module.exports = router
