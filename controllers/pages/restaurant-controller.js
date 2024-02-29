const { Restaurant, Category, User, Comment } = require('../../models')
const { getOffset, getPagination } = require('../../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || ''
    const DEFAULT_LIMIT = 9
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    return Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
        where: { ...categoryId ? { categoryId } : {} }, // equal => ...categoryId ? { where: { categoryId } } :{}
        limit,
        offset,
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
        const likeRestaurantsId = req.user && req.user.LikedRestaurants.map(like => like.id)
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: favoritedRestaurantsId.includes(r.id),
          isLike: likeRestaurantsId.includes(r.id)
        }))
        return res.render('restaurants', { restaurants: data, categories, categoryId, pagination: getPagination(limit, page, restaurants.count) })
      })
      .catch(err => next(err))
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
        console.log(isLike)
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
