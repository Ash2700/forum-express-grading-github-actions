module.exports = {
  generalErrorHandler (error, req, res, next) {
    if (error instanceof Error) {
      req.flash('error_messages', `${error.name}:${error.message}`)
    } else {
      console.log(error)
      req.flash('error_messages', `${error}`)
    }
    res.redirect('back')
    next(error)
  },
  apiErrorHandler (err, req, res, next) {
    if (err instanceof Error) {
      res.status(err.status || 500).json({
        status: 'error',
        message: `${err.name} : ${err.message}`
      })
    } else {
      req.status(500).json({
        status: 'error',
        message: `${err}`
      })
    }
    next(err)
  }
}
