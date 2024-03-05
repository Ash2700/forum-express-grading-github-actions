const { Restaurant, Category, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const { localFileHandler } = require('../helpers/file-helpers')

const adminServeries = {
  getRestaurants: req => {
    const DEFAULT_LIMIT = 10
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    return Restaurant.findAndCountAll({
      raw: true,
      nest: true,
      limit,
      offset,
      include: [Category]
    })
      .then(restaurants => ({ restaurants: restaurants.rows, pagination: getPagination(limit, page, restaurants.count) }))
      .catch(err => { throw err })
  },
  deleteRestaurant: req => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) {
          const err = new Error("Restaurants didn't exist!")
          err.status = 404
          throw err
        }
        return restaurant.destroy()
      })
      .then(deleteRestaurant => ({ restaurant: deleteRestaurant }))
      .catch(err => { throw err })
  },
  putRestaurant: req => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name) {
      const err = new Error('Restaurant name is required!')
      err.status = 404
      throw err
    }
    const { file } = req
    return Promise.all([
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
      .then(data => ({ restaurant: data }))
      .catch(err => { throw err })
  },
  postRestaurant: req => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name) throw new Error('Restaurant name is required')
    const { file } = req
    return localFileHandler(file).then(filePath =>
      Restaurant.create({ name, tel, address, openingHours, description, image: filePath || categoryId }))
      .then(data => {
        return ({ restaurant: data })
      })
      .catch(err => { throw err })
  },
  getCategories: req => {
    return Category.findAll({
      raw: true
    }).then(categories => ({ categories }))
      .catch(err => { throw err })
  },
  getRestaurant: req => {
    return Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist")
        return ({ restaurant })
      })
      .catch(err => { throw err })
  },
  getUsers: req => {
    return User.findAll({ raw: true })
      .then(users => {
        if (!users) {
          const err = new Error(' something make error')
          err.status = 404
          throw err
        }
        return ({ users })
      })
      .catch(err => { throw err })
  },
  patchUser: req => {
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
      .then(data => ({ data }))
      .catch(err => { throw err })
  }
}
module.exports = adminServeries
