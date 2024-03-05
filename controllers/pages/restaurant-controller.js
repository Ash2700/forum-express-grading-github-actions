const restaurantServeries = require('../../serveries/restaurant-serveries')
const wrapCode = require('../../helpers/warpCode-helper')

const restaurantController = {
  getRestaurants:
    wrapCode.forPageWrapServiceCall(restaurantServeries.getRestaurants, 'restaurants'),
  getRestaurant:
    wrapCode.forPageWrapServiceCall(restaurantServeries.getRestaurant, 'restaurant'),
  getDashboard:
    wrapCode.forPageWrapServiceCall(restaurantServeries.getDashboard, 'dashboard'),
  getFeeds:
    wrapCode.forPageWrapServiceCall(restaurantServeries.getFeeds, 'feed'),
  getTopRestaurants:
  wrapCode.forPageWrapServiceCall(restaurantServeries.getTopRestaurants, 'top-restaurants')
}

module.exports = restaurantController
