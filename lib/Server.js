const http = require('http')
const combineFns = require('./combine')

module.exports = class Server {
  constructor() {
    this.middleware = []
  }

  use(fn) {
    this.middleware.push(fn)
  }

  listen(...args) {
    return http.createServer(this.handle()).listen(...args)
  }

  handle() {
    const fns = combineFns(this.middleware)
    return (req, res) => {
      res.data = {}
      fns(req, res)
        .then(() => {
          this.endResponse(res)
        })
        .catch((err) => {
          console.error(err)
          res.writeHead(500, { 'Content-Type': 'text/plain' })
          res.end('Error')
        })
    }
  }

  endResponse(res) {
    const {
      status = 200,
      data = '',
      contentType = 'application/json',
      setHeaders = [],
      toWrite,
    } = res

    res.statusCode = status
    setHeaders.forEach((header) => {
      res.setHeader(header[0], header[1])
    })
    toWrite && res.write(toWrite[0], toWrite[1])
    res.end(contentType === 'application/json' ? JSON.stringify(data) : data)
  }
}
