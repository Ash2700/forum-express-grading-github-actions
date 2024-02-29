const restaurantServeries = require('../../serveries/restaurant-serveries')

function callback (err, data, next, res) {
  err ? next(err) : res.json(data)
}

const restController = {
  getRestaurants: (req, res, next) => {
    restaurantServeries.getRestaurants(req, (err, data) => callback(err, data, next, res))
  }
}
module.exports = restController
