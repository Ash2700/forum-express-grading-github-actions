const express = require('express')
const passport = require('../../config/passport')
const router = express.Router()

const restController = require('../../controllers/apis/restaurant-controller')
const userController = require('../../controllers/apis/user-controller')
const commentController = require('../../controllers/apis/comment-controller')
const admin = require('./modules/admin')
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')
const { apiErrorHandler } = require('../../middleware/error-handle')

router.use('/admin', authenticated, authenticatedAdmin, admin)

router.post('/signUp', userController.signUp)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)

router.get('/restaurants', authenticated, restController.getRestaurants)

router.post('/comment', authenticated, commentController.postComment)

router.use('/', apiErrorHandler)
module.exports = router
