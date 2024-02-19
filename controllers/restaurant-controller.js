const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      include: Category,
      nest: true,
      raw: true
    })
      .then(restaurants => {
        const data = restaurants.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', { restaurants: data })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Promise.all([
      Restaurant.findByPk(req.params.id, {
        include: Category,
        nest: true,
        raw: true
      }),
      Restaurant.findByPk(req.params.id)
    ])
      .then(([restaurant, rawRestaurant]) => {
        if (!restaurant) throw new Error("Restaurants didn't exist!")
        rawRestaurant.increment('viewCount')
        res.render('restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category,
      nest: true,
      raw: true
    })
      .then(restaurant => {
        res.render('dashboard', { restaurant })
      })
  }
}

module.exports = restaurantController
