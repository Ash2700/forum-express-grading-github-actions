const categoryService = require('../../serveries/category-service')
const wrapCode = require('../../helpers/warpCode-helper')

const categoryController = {
  getCategories: wrapCode.forApiWrapServiceCall(categoryService.getCategories),
  postCategory: wrapCode.forApiWrapServiceCall(categoryService.postCategory),
  putCategory: wrapCode.forApiWrapServiceCall(categoryService.deleteCategory),
  deleteCategory: wrapCode.forApiWrapServiceCall(categoryService.deleteCategory)
}

module.exports = categoryController
