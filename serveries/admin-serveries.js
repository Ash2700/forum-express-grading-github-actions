const { Restaurant, Category, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const { localFileHandler } = require('../helpers/file-helpers')

const adminServeries = {
  getRestaurants: (req, callback) => {
    const DEFAULT_LIMIT = 10
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    Restaurant.findAndCountAll({
      raw: true,
      nest: true,
      limit,
      offset,
      include: [Category]
    })
      .then(restaurants => callback(null, { restaurants: restaurants.rows, pagination: getPagination(limit, page, restaurants.count) }))
      .catch(err => callback(err))
  },
  deleteRestaurant: (req, callback) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) {
          const err = new Error("Restaurants didn't exist!")
          err.status = 404
          throw err
        }
        return restaurant.destroy()
      })
      .then(deleteRestaurant => callback(null, { restaurant: deleteRestaurant }))
      .catch(err => callback(err))
  },
  putRestaurant: (req, callback) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name) {
      const err = new Error('Restaurant name is required!')
      err.status = 404
      throw err
    }
    const { file } = req
    Promise.all([
      Restaurant.findByPk(req.params.id),
      localFileHandler(file)
    ]).then(([restaurant, filePath]) => {
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      return restaurant.update({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || restaurant.image,
        categoryId
      })
    })
      .then(data => {
        callback(null, { restaurant: data })
      })
      .catch(err => callback(err))
  },
  postRestaurant: (req, callback) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name) throw new Error('Restaurant name is required')
    const { file } = req
    localFileHandler(file).then(filePath =>
      Restaurant.create({ name, tel, address, openingHours, description, image: filePath || null, categoryId }))
      .then(data => {
        callback(null, { restaurant: data })
      })
      .catch(err => callback(err))
  },
  getCategories: (req, callback) => {
    return Category.findAll({
      raw: true
    }).then(categories => callback(null, { categories }))
      .catch(err => callback(err))
  },
  getRestaurant: (req, callback) => {
    Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) {
          const err = new Error("Restaurant didn't exist")
          err.status = 404
          throw err
        }
        callback(null, { restaurant })
      })
      .catch(err => callback(err))
  },
  getUsers: (req, callback) => {
    return User.findAll({ raw: true })
      .then(users => {
        if (!users) {
          const err = new Error(' something make error')
          err.status = 404
          throw err
        }
        callback(null, { users })
      })
      .catch(err => callback(err))
  },
  patchUser: (req, callback) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) {
          const err = new Error('something make error')
          err.status = 404
          throw err
        }
        if (user.email === 'root@example.com') {
          const err = new Error('禁止變更 root 權限')
          err.status = 400
          throw err
        }
        return user.update({ isAdmin: (!user.isAdmin) })
      })
      .then(data => {
        callback(null, data)
      })
      .catch(err => callback(err))
  }
}
module.exports = adminServeries
