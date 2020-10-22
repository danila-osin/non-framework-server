const { createServer } = require('./lib/myFW')
const jsonParser = require('./lib/json-parser')
const filesParser = require('./lib/files-parser')

const routes = require('./routes')
const mongoDB = require('./mongoose-connect')

const main = async () => {
  const app = createServer()

  app.use(jsonParser)
  app.use(filesParser)
  app.use(routes)

  mongoDB.connect().then((message) => {
    console.log(message)
    app.listen(5000, () => console.log(`=====Server started on port 5000=====`))
  })
}

main().catch((err) => console.error(err))
