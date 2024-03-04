const { User } = require('../models')
const bcrypt = require('bcryptjs')
const userService = {
  signUp: (req, callback) => {
    if (req.body.password !== req.body.passwordCheck) {
      const err = new Error('password do not match!')
      err.status = 400
      throw err
    }
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) {
          const err = new Error('Email already exists!')
          err.status = 400
          throw err
        }
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => {
        User.create({
          name: req.body.name,
          email: req.body.email,
          password: hash
        })
      })
      .then(data => {
        callback(null, data)
      })
      .catch(err => callback(err))
  }
}
module.exports = userService
