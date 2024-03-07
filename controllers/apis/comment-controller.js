const commentService = require('../../serveries/comment-service')

const commentController = {
  postComment: (req, res, next) => {
    commentService.postComment(req)
      .then(data => res.json({ status: 'success', data }))
      .catch(err => next(err))
  },
  deleteComment: (req, res, next) => {
    commentService.deleteComment(req)
      .then(data => res.json({ status: 'susccess', data }))
      .catch(err => next(err))
  }
}

module.exports = commentController
