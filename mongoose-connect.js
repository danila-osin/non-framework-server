const mongoose = require('mongoose')

const dbUri = 'mongodb://127.0.0.1:27017/nonFramework'
const dbConfig = {
  useFindAndModify: false,
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

module.exports = {
  connect: () => {
    return new Promise((resolve, reject) => {
      try {
        mongoose
          .connect(dbUri, dbConfig)
          .then(() => resolve(`Database connection established. Uri: ${dbUri}`))
      } catch (e) {
        reject(console.log('DB ERROR! - ', e.message))
      }
    })
  },
}
