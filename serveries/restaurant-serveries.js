const { Restaurant, Category, User, Comment, Favorite } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantServeries = {
  getRestaurants: req => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    return Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
        where: {
          ...categoryId ? { categoryId } : {}
        },
        limit,
        offset,
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const favoritedRestaurantsId = req.user?.FavoritedRestaurants ? req.user.FavoritedRestaurants.map(fr => fr.id) : []
        const likedRestaurantsId = req.user?.LikedRestaurants ? req.user.LikedRestaurants.map(lr => lr.id) : []
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description?.substring(0, 50),
          isFavorited: favoritedRestaurantsId.includes(r.id),
          isLiked: likedRestaurantsId.includes(r.id)
        }))
        return ({
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
      .catch(err => { throw err })
  },
  getRestaurant: req => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikeUsers' }
      ]
    }).then(restaurant => {
      if (!restaurant) throw new Error("Restaurants didn't exist!")
      const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
      const isLike = restaurant.LikeUsers.some(f => f.id === req.user.id)
      restaurant.increment('viewCount')
      return { restaurant: restaurant.toJSON(), isFavorited, isLike }
    })
      .catch(err => { throw err })
  },
  getDashboard: req => {
    return Promise.all([
      Restaurant.findByPk(req.params.id, {
        include: Category,
        nest: true,
        raw: true
      }),
      Comment.count({ where: { restaurantId: req.params.id } }),
      Favorite.count({ where: { restaurantId: req.params.id } })
    ])
      .then(([restaurant, commentCount, favoriteCount]) => {
        return ({ restaurant, commentCount, favoriteCount })
      })
      .catch(err => { throw err })
  },
  getFeeds: req => {
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
      console.log(restaurants)
      const backData = restaurants.map(item => ({
        ...item,
        description: item.description?.substring(0, 100)
      }))
      return ({
        restaurants: backData,
        comments,
        categories,
        categoryId
      })
    }).catch(err => { throw err })
  },
  getTopRestaurants: req => {
    return Restaurant.findAll({
      include: [{ model: User, as: 'FavoritedUsers' }]
    }).then(restaurants => {
      restaurants = restaurants.map(restaurant => ({
        ...restaurant.toJSON(),
        favoritedCount: restaurant.FavoritedUsers.length,
        description: restaurant.description?.substring(0, 50),
        isFavorited: req.user && req.user.FavoritedRestaurants
          .some(data => data.id === restaurant.id)
      }))
        .sort((a, b) => b.favoritedCount - a.favoritedCount)
        .slice(0, 10)
      return ({ restaurants })
    }).catch(err => { throw err })
  }
}

module.exports = restaurantServeries
