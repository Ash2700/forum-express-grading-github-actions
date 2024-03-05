const { User } = require('../models')
const bcrypt = require('bcryptjs')
const userService = {
  signUp: req => {
    if (req.body.password !== req.body.passwordCheck) {
      const err = new Error('password do not match!')
      err.status = 400
      throw err
    }
    return User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) {
          const err = new Error('Email already exists!')
          err.status = 400
          throw err
        }
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => {
        return User.create({
          name: req.body.name,
          email: req.body.email,
          password: hash
        })
      })
      .catch(err => { throw err })
  }
}
module.exports = userService
