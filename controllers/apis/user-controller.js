const jwt = require('jsonwebtoken')
const userService = require('../../serveries/user-service')
const wrapCode = require('../../helpers/warpCode-helper')
const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) { next(err) }
  },
  signUp: wrapCode.forApiWrapServiceCall(userService.signUp),
  getUser: wrapCode.forApiWrapServiceCall(userService.getUser),
  getTopUsers: wrapCode.forApiWrapServiceCall(userService.getTopUsers),
  editUser: wrapCode.forApiWrapServiceCall(userService.editUser),
  putUser: wrapCode.forApiWrapServiceCall(userService.putUser),
  addLike: wrapCode.forApiWrapServiceCall(userService.addLike),
  removeLike: wrapCode.forApiWrapServiceCall(userService.removeLike),
  addFavorite: wrapCode.forApiWrapServiceCall(userService.addFavorite),
  removeFavorite: wrapCode.forApiWrapServiceCall(userService.removeFavorite),
  addFollowing: wrapCode.forApiWrapServiceCall(userService.addFollowing),
  removeFollowing: wrapCode.forApiWrapServiceCall(userService.removeFollowing)
}
module.exports = userController
