const restaurantServeries = require('../../serveries/restaurant-serveries')
const wrapCode = require('../../helpers/warpCode-helper')

const restaurantController = {
  getRestaurants:
    wrapCode.forPageWrapServiceCall(restaurantServeries.getRestaurants, 'restaurants'),
  getRestaurant:
    wrapCode.forPageWrapServiceCall(restaurantServeries.getRestaurant, 'restaurant'),
  getDashboard: (req, res, next) => {
    return Promise.all([
      restaurantServeries.getRestaurant(req),
      restaurantServeries.getCommentCount(req),
      restaurantServeries.getFavoriteCount(req)
    ]).then(([restaurantsObject, commentCount, favoriteCount]) => {
      const restaurant = restaurantsObject.restaurant
      res.render('dashboard', { restaurant, commentCount, favoriteCount }
      )
    }).catch(err => next(err))
  },
  getFeeds: (req, res, next) => {
    return Promise.all([
      restaurantServeries.newComments(req),
      restaurantServeries.newRestaurants(req),
      restaurantServeries.getCategories()
    ]).then(([comments, restaurantsObject, categories]) => {
      const restaurants = restaurantsObject.restaurants
      res.render('feed', { restaurants, comments, categories, categoryId: restaurants.categoryId })
    }).catch(err => next(err))
  },
  getTopRestaurants:
    wrapCode.forPageWrapServiceCall(restaurantServeries.getTopRestaurants, 'top-restaurants')
}

module.exports = restaurantController
