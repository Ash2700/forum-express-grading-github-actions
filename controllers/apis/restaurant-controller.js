const restaurantServeries = require('../../serveries/restaurant-serveries')

const restController = {
  getRestaurants: (req, res, next) => {
    restaurantServeries.getRestaurants(req)
      .then(data => res.json({ status: 'success', data }))
      .catch(err => next(err))
  }
}
module.exports = restController
