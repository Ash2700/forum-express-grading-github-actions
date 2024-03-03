const adminServeries = require('../../serveries/admin-serveries')
const wrapServiceCall = serviceFunc => {
  return (req, res, next) => {
    serviceFunc(req, (err, data) => {
      if (err) next(err)
      else res.json({ status: 'success', data })
    })
  }
}

const adminController = {
  getRestaurants: wrapServiceCall(adminServeries.getRestaurants),
  deleteRestaurant: wrapServiceCall(adminServeries.deleteRestaurant),
  putRestaurant: wrapServiceCall(adminServeries.putRestaurant),
  postRestaurant: wrapServiceCall(adminServeries.postRestaurant),
  createRestaurant: wrapServiceCall(adminServeries.createRestaurant),
  getRestaurant: wrapServiceCall(adminServeries.getRestaurant)
}

module.exports = adminController
