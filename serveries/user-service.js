const { User, Comment, Restaurant, Favorite, Like, Followship } = require('../models')
const { Sequelize } = require('sequelize')
const { localFileHandler } = require('../helpers/file-helpers')
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
  },
  getUser: req => {
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
        const commentCount = comment.length
        const favoriteCount = user.FavoritedRestaurants.length
        const followerCount = user.Followers.length
        const followingCount = user.Followings.length
        return ({
          user: user.toJSON(),
          comment,
          count: commentCount,
          favoriteCount,
          followerCount,
          followingCount
        })
      })
      .catch(err => { throw err })
  },
  editUser: req => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error(" user didn't exist!")
        return user
      })
      .catch(err => { throw err })
  },
  putUser: req => {
    const { file } = req
    const { name } = req.body
    const id = req.params.id
    return Promise.all([
      User.findByPk(id),
      localFileHandler(file)
    ]).then(([user, filePath]) => {
      if (!user) throw new Error("user didn't exist!")
      return ({
        name,
        image: filePath || user.image
      })
    }).catch(err => { throw err })
  },
  addFavorite: req => {
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
        .then(data => ({ data }))
        .catch(err => { throw err })
    })
  },
  removeFavorite: req => {
    const { restaurantId } = req.params
    return Favorite.findOne({
      where: {
        userId: req.user.id,
        restaurantId
      }
    }).then(favorite => {
      if (!favorite) throw new Error("you haven't favored this restaurant")
      return favorite.destroy()
    }).then(data => ({ data }))
      .catch(err => { throw err })
  },
  addLike: req => {
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
    }).then(data => ({ data }))
      .catch(err => { throw err })
  },
  removeLike: req => {
    const { restaurantId } = req.params
    return Like.findOne({
      where: {
        userId: req.user.id,
        restaurantId
      }
    }).then(like => {
      if (!like) throw new Error("you heven't like this restaurant")
      return like.destroy()
    }).then(data => ({ data }))
      .catch(err => { throw err })
  },
  getTopUsers: req => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    }).then(users => {
      users = users.map(user => ({
        ...user.toJSON(),
        followerCount: user.Followers.length,
        isFollowed: req.user.Followings.some(data => data.id === user.id)
      })).sort((a, b) => b.followerCount - a.followerCount)
      return ({ users })
    }).catch(err => { throw err })
  },
  addFollowing: req => {
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
      .then(data => ({ data }))
      .catch(err => { throw err })
  },
  removeFollowing: req => {
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
      .then(data => ({ data }))
      .catch(err => { throw err })
  }
}
module.exports = userService
