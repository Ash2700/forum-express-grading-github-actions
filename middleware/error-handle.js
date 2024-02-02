module.exports = {
  generalErrorHandler (error, req, res, next) {
    if (error instanceof Error) {
      req.flash('error_messages', `${error.name}:${error.message}`)
    } else {
      req.flash('error_messages', `${error}`)
    }
    res.redirect('back')
    next(error)
  }
}
