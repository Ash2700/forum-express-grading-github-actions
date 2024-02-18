
const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    return Promise.all([
      Category.findAll({ raw: true }),
      req.params.id ? Category.findByPk(req.params.id) : null
    ])
      .then(([categories, category]) => {
        res.render('admin/categories', { categories, category })
      })
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required')
    Category.create({ name })
      .then(() => {
        req.flash('success_messages', '新增料理分類成功')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    const id = req.params.id
    const { name } = req.body
    if (!name) throw new Error('Category name is required')
    Category.findByPk(id)
      .then(category => {
        if (!category) throw new Error('無此分類')
        return category.update({ name })
      })
      .then(() => {
        req.flash('success_massages', '更新分類成功')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  deleteCategory: (req, res, next) => {
    const id = req.params.id
    Category.findByPk(id)
      .then(category => {
        if (!category) throw new Error('無此分類')
        return category.destroy()
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  }
}

module.exports = categoryController
