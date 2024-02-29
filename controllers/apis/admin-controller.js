const adminServeries = require('../../serveries/admin-serveries')

const adminController = {
  getRestaurants: (req, res, next) => {
    adminServeries.getRestaurants(req, (err, data) => err ? next(err) : res.json(data))
  }
}

module.exports = adminController
