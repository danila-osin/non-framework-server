const combineFns = require('./combine')

module.exports = class Router {
  constructor() {
    this.routes = {}

    for (const method of ['get', 'post', 'put', 'delete']) {
      this[method] = (url, ...middleware) => {
        const fns = combineFns(middleware)
        if (!this.routes[url]) this.routes[url] = {}

        this.routes[url][method] = fns
      }
    }
  }

  toMiddleware() {
    return (req, res, next) => {
      const { url, method } = req
      const meth = method.toLowerCase()

      if (!this.routes[url]) {
        res.data = { message: 'Not Found' }
        res.status = 404
        return Promise.resolve()
      }

      if (!this.routes[url][meth]) {
        res.data = { message: 'Not Found' }
        res.status = 404
        return Promise.resolve()
      }
      return this.routes[url][meth](req, res, next)
    }
  }
}
