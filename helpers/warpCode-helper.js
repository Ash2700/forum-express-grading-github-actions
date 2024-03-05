
const wrapCode = {
  forApiWrapServiceCall: serviceFunc => {
    return (req, res, next) => {
      serviceFunc(req)
        .then(data => res.json({ status: 'success', data }))
        .catch(err => next(err))
    }
  },
  forPageWrapServiceCall: (serviceFunc, renderPagePath) => {
    return (req, res, next) => {
      serviceFunc(req)
        .then(data => res.render(`${renderPagePath}`, data))
        .catch(err => next(err))
    }
  }
}
module.exports = wrapCode
