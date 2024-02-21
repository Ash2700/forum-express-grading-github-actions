const bcrypt = require('bcryptjs')
const db = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')
const { User } = db
const userController = {
  singUpPage: (req, res) => {
    res.render('signup')
  },
  singUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('password do not match!')
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    User.findByPk(req.user.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("user didn't exist!")
        res.render('profile', { user })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    User.findByPk(req.user.id, { raw: true })
      .then(user => {
        if (!user) throw new Error(" user didn't exist!")
        return res.render('editProfile', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { file } = req
    const { name } = req.body
    const id = req.user.id
    console.log(name)
    Promise.all([
      User.findByPk(id),
      localFileHandler(file)
    ]).then(([user, filePath]) => {
      if (!user) throw new Error("user didn't exist!")
      return user.update({
        name,
        image: filePath || user.image
      })
    })
      .then(() => {
        req.flash('succuss_massages', 'update profile success')
        res.redirect(`/users/${id}`)
      })
      .catch(err => next(err))
  }
}

module.exports = userController
