const jwt = require('jsonwebtoken')
const userService = require('../../serveries/user-service')
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
  signUp: (req, res, next) => {
    console.log(req.body)
    userService.signUp(req, (err, data) => {
      if (err) next(err)
      else res.json({ status: 'success', data })
    })
  }
}
module.exports = userController
