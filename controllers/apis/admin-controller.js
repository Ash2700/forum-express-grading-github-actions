const adminServeries = require('../../serveries/admin-serveries')

const adminController = {
  getRestaurants: (req, res, next) => {
    adminServeries.getRestaurants(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  deleteRestaurant: (req, res, next) => {
    adminServeries.deleteRestaurant(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}

module.exports = adminController
