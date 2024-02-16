const dayjs = require('dayjs')
module.exports = {
  currentYear: () => dayjs().year(),
  displayRole: function (a, option) {
    return a === 1 ? option.fn(this) : option.inverse(this)
  }
}
