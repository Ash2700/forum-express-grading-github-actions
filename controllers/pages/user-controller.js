const { localFileHandler } = require('../../helpers/file-helpers')
const { User, Comment, Restaurant, Favorite, Like, Followship } = require('../../models')
const { Sequelize } = require('sequelize')
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
    return Promise.all([
      User.findByPk(req.params.id, {
        nest: true,
        include: [
          { model: Restaurant, as: 'FavoritedRestaurants' },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      }),
      Comment.findAll({
        attributes: [Sequelize.fn('DISTINCT', 'restaurantId')],
        order: [['updatedAt', 'DESC']],
        raw: true,
        include: Restaurant,
        nest: true,
        where: { userId: req.params.id }
      })
    ])
      .then(([user, comment]) => {
        if (!user) throw new Error("user didn't exist!")
        console.log(user.toJSON())
        const commentCount = comment.length
        const favoriteCount = user.FavoritedRestaurants.length
        const followerCount = user.Followers.length
        const followingCount = user.Followings.length
        res.render('users/profile', {
          user: user.toJSON(),
          comment,
          count: commentCount,
          favoriteCount,
          followerCount,
          followingCount
        })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error(" user didn't exist!")
        res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { file } = req
    const { name } = req.body
    const id = req.params.id
    return Promise.all([
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
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${id}`)
      })
      .catch(err => next(err))
  },
  addFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
    ]).then(([restaurant, favorite]) => {
      if (!restaurant) throw new Error(" Restaurant didn't exist")
      if (favorite) throw new Error('you have favored this restaurants')
      return Favorite.create({
        userId: req.user.id,
        restaurantId: req.params.restaurantId
      })
        .then(() => res.redirect('back'))
        .catch(err => next(err))
    })
  },
  removeFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    return Favorite.findOne({
      where: {
        userId: req.user.id,
        restaurantId
      }
    }).then(favorite => {
      if (!favorite) throw new Error("you haven't favored this restaurant")
      return favorite.destroy()
    }).then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  addLike: (req, res, next) => {
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Like.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
    ]).then(([restaurant, like]) => {
      if (!restaurant) throw new Error("restaurant didn't exist")
      if (like) throw new Error('you have liked this restaurant')
      return Like.create({
        userId: req.user.id,
        restaurantId: req.params.restaurantId
      })
    }).then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    const { restaurantId } = req.params
    return Like.findOne({
      where: {
        userId: req.user.id,
        restaurantId
      }
    }).then(like => {
      if (!like) throw new Error("you heven't like this restaurant")
      return like.destroy()
    }).then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  getTopUsers: (req, res, next) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    }).then(users => {
      users = users.map(user => ({
        ...user.toJSON(),
        followerCount: user.Followers.length,
        isFollowed: req.user.Followings.some(data => data.id === user.id)
      }))
        .sort((a, b) => b.followerCount - a.followerCount)
      res.render('top-user', { users: users })
    }).catch(err => next(err))
  },
  addFollowing: (req, res, next) => {
    const { userId } = req.params
    return Promise.all([
      User.findByPk(userId),
      Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: userId
        }
      })
    ]).then(([user, followship]) => {
      if (!user) throw new Error("user didn't exist!")
      if (followship) throw new Error('You are already following this user!')
      return Followship.create({
        followerId: req.user.id,
        followingId: userId
      })
    })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")
        return followship.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}

module.exports = userController
