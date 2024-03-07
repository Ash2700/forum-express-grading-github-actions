const adminServeries = require('../../serveries/admin-serveries')

const adminController = {
  getRestaurants: (req, res, next) => {
    adminServeries.getRestaurants(req)
      .then(data => res.render('admin/restaurants', data))
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    adminServeries.getRestaurant(req)
      .then(data => res.render('admin/restaurant', data))
      .catch(err => next(err))
  },
  createRestaurant: (req, res, next) => {
    adminServeries.getCategories(req)
      .then(data => res.render('admin/create-restaurant', data))
      .catch(err => next(err))
  },
  postRestaurant: (req, res, next) => {
    adminServeries.postRestaurant(req)
      .then(data => {
        req.flash('success', 'restaurants was successfully created')
        req.session.createData = data
        res.redirect('admin/restaurants')
      })
      .catch(err => next(err))
  },
  editRestaurant: (req, res, next) => {
    return Promise.all([
      adminServeries.getRestaurant(req),
      adminServeries.getCategories(req)
    ])
      .then(([restaurantData, categoriesData]) => {
        if (!restaurantData) throw new Error("Restaurant did't exist!")
        const restaurant = restaurantData.restaurant
        const categories = categoriesData.categories
        res.render('admin/edit-restaurant', { restaurant, categories })
      })
      .catch(err => next(err))
  },
  putRestaurant: (req, res, next) => {
    adminServeries.putRestaurant(req)
      .then(data => {
        req.flash('success_messages', 'restaurant was successfully updated')
        req.session.updateData = data
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  deleteRestaurant: (req, res, next) => {
    adminServeries.deleteRestaurant(req)
      .then(data => {
        req.flash('success', 'delete successfully the restaurant')
        req.session.deleteData = data
        return res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  getUsers: (req, res, next) => {
    adminServeries.getUsers(req)
      .then(data => res.render('admin/userManagement', data)
        .catch(err => next(err))
      )
  },
  patchUser: (req, res, next) => {
    adminServeries.patchUser(req)
      .then(data => {
        req.flash('success_messages', '使用者權限變更成功')
        req.session.patchData = data
        res.redirect('/admin/users')
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
