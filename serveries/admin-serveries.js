const { Restaurant, Category } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

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
  }
}
module.exports = adminServeries
