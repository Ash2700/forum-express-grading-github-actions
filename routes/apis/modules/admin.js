const express = require('express')
const router = express.Router()
const adminController = require('../../../controllers/apis/admin-controller')
const categoryController = require('../../../controllers/apis/category-controller')
const upload = require('../../../middleware/multer')

router.get('/restaurants/categories', adminController.getCategories)
router.get('/restaurants/:id', adminController.getRestaurant)
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)

router.get('/restaurants', adminController.getRestaurants)

router.get('/categories/:id', categoryController.getCategories)
router.post('/categories', categoryController.postCategory)
router.get('/categories', categoryController.getCategories)
router.put('/categories/:id', categoryController.putCategory)
router.delete('/categories/:id', categoryController.deleteCategory)

router.get('/users', adminController.getUsers)
router.patch('/users/:id', adminController.patchUser)

module.exports = router
