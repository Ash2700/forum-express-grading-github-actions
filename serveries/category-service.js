const { Category } = require('../models')

const categoryService = {
  getCategories: req => {
    return Promise.all([
      Category.findAll({ raw: true }),
      req.params.id ? Category.findByPk(req.params.id) : null
    ])
      .then(([categories, category]) => {
        return ({ categories, category })
      })
      .catch(err => { throw err })
  },
  postCategory: req => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required')
    return Category.create({ name })
      .then(data => ({ data }))
      .catch(err => { throw err })
  },
  putCategory: req => {
    const id = req.params.id
    const { name } = req.body
    if (!name) throw new Error('Category name is required')
    return Category.findByPk(id)
      .then(category => {
        if (!category) throw new Error('無此分類')
        return category.update({ name })
      })
      .then(data => ({ data }))
      .catch(err => { throw err })
  },
  deleteCategory: req => {
    const id = req.params.id
    return Category.findByPk(id)
      .then(category => {
        if (!category) throw new Error('無此分類')
        return category.destroy()
      })
      .then(data => ({ data }))
      .catch(err => { throw err })
  }
}

module.exports = categoryService
