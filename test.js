const promise = new Promise(function (resolveParam, rejectParam) {
  //resolveParam(1)
  rejectParam(new Error('error!'))
})

promise
  .then(value => {
    console.log(value) // 1
    return value + 1
  }, err => console.log(err))
  .then(value => {
    console.log(value) // 2
    return value + 2
  })
  .catch(err => console.log(err.message))