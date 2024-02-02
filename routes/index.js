const express = require('express')

const router = express.Router()

const admin = require('./modules/admin')
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handle')

router.use('/admin', admin)
router.get('/signup', userController.singUpPage)
router.post('/signup', userController.singUp)
router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/signup'))
router.use('/', generalErrorHandler)
module.exports = router
