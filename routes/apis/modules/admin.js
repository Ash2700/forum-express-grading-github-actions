const express = require('express')
const router = express.Router()
const adminController = require('../../../controllers/apis/admin-controller')
const upload = require('../../../middleware/multer')

router.get('/restaurants/:id', adminController.getRestaurant)
router.get('/restaurants/create', adminController.createRestaurant)
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)

router.get('/restaurants', adminController.getRestaurants)

module.exports = router
