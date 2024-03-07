const { Comment, User, Restaurant } = require('../models')
const commentService = {
  postComment: req => {
    const { restaurantId, text } = req.body
    const userId = req.user.id
    if (!text) throw new Error('Comment text is required')
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      User.findByPk(userId)
    ])
      .then(([restaurant, user]) => {
        if (!user) throw new Error(" User didn't exist!")
        if (!restaurant) throw new Error(" Restaurant didn't exist!")
        return Comment.create({ text, userId, restaurantId })
      })
      .then(data => ({ data }))
      .catch(err => { throw err })
  },
  deleteComment: req => {
    return Comment.findByPk(req.params.id)
      .then(comment => {
        if (!comment) throw new Error("Comment didn't exist!")
        return comment.destroy()
      })
      .then(data => ({ data: data.toJSON() }))
      .catch(err => { throw err })
  }
}

module.exports = commentService
