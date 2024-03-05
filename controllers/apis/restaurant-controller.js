const restaurantServeries = require('../../serveries/restaurant-serveries')
const wrapCode = require('../../helpers/warpCode-helper')

const restController = {
  getRestaurants: wrapCode.forApiWrapServiceCall(restaurantServeries.getRestaurants),
  getRestaurant: wrapCode.forApiWrapServiceCall(restaurantServeries.getRestaurant),
  getFeeds: wrapCode.forApiWrapServiceCall(restaurantServeries.getFeeds),
  getDashboard: wrapCode.forApiWrapServiceCall(restaurantServeries.getDashboard),
  getTopRestaurants: wrapCode.forApiWrapServiceCall(restaurantServeries.getTopRestaurants)
}
module.exports = restController
