const restaurantServeries = require('../../serveries/restaurant-serveries')
const wrapCode = require('../../helpers/warpCode-helper')

const restController = {
  getRestaurants: wrapCode.forApiWrapServiceCall(restaurantServeries.getRestaurants),
  getRestaurant: wrapCode.forApiWrapServiceCall(restaurantServeries.getRestaurant),
  getNewComments: wrapCode.forApiWrapServiceCall(restaurantServeries.getNewComments),
  getNewRestaurants: wrapCode.forApiWrapServiceCall(restaurantServeries.getNewRestaurants),
  getTopRestaurants: wrapCode.forApiWrapServiceCall(restaurantServeries.getTopRestaurants),
  getCategories: wrapCode.forApiWrapServiceCall(restaurantServeries.getCategories),
  getCommentCountByRestaurantId: wrapCode.forApiWrapServiceCall(restaurantServeries.getCommentCount),
  getFavoriteCountByRestaurantId: wrapCode.forApiWrapServiceCall(restaurantServeries.getFavoriteCount)
}
module.exports = restController
