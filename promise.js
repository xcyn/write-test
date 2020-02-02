function myPromise(fn) {
  // 状态表
  this.PENDING = 'pending'
  this.RESOLVE = 'RESOLVE'
  this.REJECT = 'REJECT'
  // 初始状态
  this.status = this.PENDING
  this.resolveFns = []
  this.rejectFns = []
  var resolve = function (value) {
    if(this.status === this.PENDING) {
      this.status = this.RESOLVE
      this.value = value
      this.resolveFns.map(fn => {
        fn(value)
      })
    }
  }
  var reject = function (value) {
    if(this.status === this.PENDING) {
      this.status = this.REJECT
      this.value = value
      this.rejectFns.map(fn => {
        fn(value)
      })
    }
  }

  try {
    fn(resolve.bind(this), reject.bind(this))
  } catch(err) {
    reject.call(this,err)
  }
}

myPromise.prototype.then = function (successFn, failFn) {
  if(!successFn) successFn = () => {}
  if(!failFn) failFn = () => {}
  if(this.status === this.PENDING) {
    return new myPromise((reolve, reject) => {
      this.resolveFns.push((value) => {
        const x = successFn(value)
        reolve(x)
      })
      this.rejectFns.push((value) => {
        const x = failFn(value)
        reject(x)
      })
    })
  }
  if(this.status === this.RESOLVE) {
    successFn(this.value)
  }
  if(this.status === this.REJECT) {
    failFn(this.value)
  }
}

myPromise.prototype.catch = function (fn) {
  return this.then(null, fn)
}