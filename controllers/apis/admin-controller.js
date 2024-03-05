const adminServeries = require('../../serveries/admin-serveries')
const wrapCode = require('../../helpers/warpCode-helper')

const adminController = {
  getRestaurants: wrapCode.forApiWrapServiceCall(adminServeries.getRestaurants),
  deleteRestaurant: wrapCode.forApiWrapServiceCall(adminServeries.deleteRestaurant),
  putRestaurant: wrapCode.forApiWrapServiceCall(adminServeries.putRestaurant),
  postRestaurant: wrapCode.forApiWrapServiceCall(adminServeries.postRestaurant),
  getCategories: wrapCode.forApiWrapServiceCall(adminServeries.getCategories),
  getRestaurant: wrapCode.forApiWrapServiceCall(adminServeries.getRestaurant),
  getUsers: wrapCode.forApiWrapServiceCall(adminServeries.getUsers),
  patchUser: wrapCode.forApiWrapServiceCall(adminServeries.patchUser)
}

module.exports = adminController
