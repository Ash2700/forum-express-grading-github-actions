const commentService = require('../../serveries/comment-service')
const commentController = {
  postComment: (req, res, next) => {
    commentService.postComment(req)
      .then(data => res.redirect(`restaurants/${data.data.restaurantId}`))
      .catch(err => next(err))
  },
  deleteComment: (req, res, next) => {
    commentService.deleteComment(req)
      .then(deleteComment => {
        console.log(deleteComment)
        res.redirect(`/restaurants/${deleteComment.data.restaurantId}`)
      })
      .catch(err => next(err))
  }
}

module.exports = commentController
