function myVue(options = {}) {
  let { data, methods } = options
  this.$data = data
  this.$methods = methods
  this.$options = options
  observe(this.$data)
}

function observe(obj) {
    for(var key in obj) {
      defineProperty(obj, key, obj[key])
    }
}

function defineProperty(obj, key, value) {
  if(!obj || typeof obj !== 'object') {
    return
  }
  observe(value)
  var dep = new Dep()
  Object.defineProperty(obj, key, {
    get: ( ) => {
      if(Dep.target) {
        dep.getter(Dep.target)
      }
      return value
    },
    set: (newVal) => {
      console.log('更新set')
      dep.notifiy()
      value = newVal
    }
  })
}

function Dep() {
  this.subs = []
  this.getter = (watcher) => {
    this.subs.push(watcher)
  }
  this.notifiy = () => {
    this.subs.map(sub => {
      sub.update()
    })
  }
}

function watcher(vm, key, update) {
  this.$vm = vm
  this.$key = key
  this.update = update
  Dep.target = this
  this.$vm[this.$key]
  Dep.target = null
}