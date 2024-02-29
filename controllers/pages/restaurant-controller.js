const { Restaurant, Category, User, Comment } = require('../../models')
const restaurantServeries = require('../../serveries/restaurant-serveries')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    restaurantServeries.getRestaurants(req, (err, data) => err ? next(err) : res.render('restaurants', data))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: User },
        { model: User, as: 'FavoriteUsers' },
        { model: User, as: 'LikeUsers' }
      ]
    })
      .then(restaurant => {
        const isFavorited = restaurant.FavoriteUsers.some(f => f.id === req.user.id)
        const isLike = restaurant.LikeUsers.some(f => f.id === req.user.id)
        if (!restaurant) throw new Error("Restaurants didn't exist!")
        restaurant.increment('viewCount')
        res.render('restaurant', { restaurant: restaurant.toJSON(), isFavorited, isLike })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Promise.all([
      Restaurant.findByPk(req.params.id, {
        include: Category,
        nest: true,
        raw: true
      }),
      Comment.count({ where: { restaurantId: req.params.id } })
    ])
      .then(([restaurant, commentCount]) => {
        res.render('dashboard', { restaurant, commentCount })
      })
  },
  getFeeds: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || ''
    return Promise.all([
      Restaurant.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        where: { ...categoryId ? { categoryId } : {} },
        include: Category,
        raw: true,
        nest: true
      }),
      Comment.findAll({
        limit: 12,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant],
        raw: true,
        nest: true
      }),
      Category.findAll({ raw: true })
    ]).then(([restaurants, comments, categories]) => {
      const backData = restaurants.map(item => ({
        ...item,
        description: item.description.substring(0, 100)
      }))
      return res.render('feed', {
        restaurants: backData,
        comments,
        categories,
        categoryId
      })
    }).catch(err => next(err))
  },
  getTopRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      include: [{ model: User, as: 'FavoritedUsers' }]
    }).then(restaurants => {
      restaurants = restaurants.map(restaurant => ({
        ...restaurant.toJSON(),
        favoritedCount: restaurant.FavoritedUsers.length,
        description: restaurant.description.substring(0, 50),
        isFavorited: req.user && req.user.FavoritedRestaurants
          .some(data => data.id === restaurant.id)
      }))
        .sort((a, b) => b.favoritedCount - a.favoritedCount)
        .slice(0, 10)
      console.log('111111111')
      return res.render('top-restaurants', { restaurants })
    }).catch(err => next(err))
  }
}

module.exports = restaurantController
