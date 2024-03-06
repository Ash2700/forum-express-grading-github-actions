
const categoryService = require('../../serveries/category-service')

const categoryController = {
  getCategories: (req, res, next) => {
    categoryService.getCategories(req)
      .then(data => { res.render('admin/categories', data) })
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => {
    categoryService.postCategory(req)
      .then(() => {
        req.flash('success_messages', '新增料理分類成功')
        res.redirect('/admin/categories')
      }).catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    categoryService.putCategory(req)
      .then(() => {
        req.flash('success_massages', '更新分類成功')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  deleteCategory: (req, res, next) => {
    categoryService.deleteCategory(req)
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  }
}

module.exports = categoryController
