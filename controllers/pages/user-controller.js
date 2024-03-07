const userService = require('../../serveries/user-service')

const userController = {
  singUpPage: (req, res) => {
    res.render('signup')
  },
  singUp: (req, res, next) => {
    userService.signUp(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '成功註冊帳號')
      res.redirect('/signin')
    })
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
    userService.getUser(req)
      .then(data => res.render('users/profile', data))
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    userService.editUser(req)
      .then(data => res.render('users/edit', data))
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    userService.putUser(req)
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${req.params.id}`)
      }).catch(err => next(err))
  },
  addFavorite: (req, res, next) => {
    userService.addFavorite(req)
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFavorite: (req, res, next) => {
    userService.removeFavorite(req)
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  addLike: (req, res, next) => {
    userService.addLike(req)
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    userService.removeLike(req)
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  getTopUsers: (req, res, next) => {
    userService.getTopUsers(req)
      .then(data => res.render('top-user', data))
      .catch(err => next(err))
  },
  addFollowing: (req, res, next) => {
    userService.addFollowing(req)
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    userService.removeFollowing(req)
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}

module.exports = userController
