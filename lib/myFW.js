const Server = require('./Server')
const Router = require('./Router')

module.exports = {
  createServer: () => new Server(),
  createRouter: () => new Router(),
}
