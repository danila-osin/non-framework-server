const fs = require('fs')

const { createRouter } = require('./lib/myFW')

const User = require('./models/User')

const Redis = require('ioredis')
const bcrypt = require('bcrypt')

const router = createRouter()

const redis = new Redis({
  port: 6379,
  host: 'localhost',
  family: 4,
})

//Проверка: авторизован ли пользователь
router.post('/getUser', async (req, res) => {
  try {
    const username = req.data.username
    const userId = await redis.get(username + 'Session')

    if (!userId) {
      res.status = 400
      res.data = { error: 'Token expired or you are not logined' }
    } else {
      const user = await User.findById(userId)

      if (!user) {
        res.status = 400
        res.data = { error: 'No user exists' }
      } else {
        res.data.username = username
      }
    }
  } catch (err) {
    res.data = { error: err.message }
  }
})

//Регистрация
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.data
    const candidate = await User.findOne({ username })

    if (candidate) {
      res.data = { error: 'This username already taken!' }
    } else {
      await User.create({
        username,
        password: await bcrypt.hash(password, 9),
      })

      res.status = 201
      res.data = { message: `You are registered as ${username}` }
    }
  } catch (err) {
    res.data = { error: err.message }
  }
})

//Вход
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.data
    const candidate = await User.findOne({ username })

    if (candidate) {
      const isMatch = await bcrypt.compare(password, candidate.password)

      // Реализация сессий такого вида достаточна,
      // так как без клиентской части нет смысла её усложнять
      if (isMatch) {
        await redis.set(
          username + 'Session',
          candidate._id,
          'ex',
          1000 * 60 * 60 * 24 * 30 //30 дней
        )

        res.data = { message: 'Successfully logined!' }
      } else {
        res.status = 400
        res.data = { error: 'Wrong password!' }
      }
    } else {
      res.status = 400
      res.data = { error: 'User with this name does not exists!' }
    }
  } catch (err) {
    res.data = { error: err.message }
  }
})

//Выход
router.post('/logout', async (req, res) => {
  try {
    const username = req.data.username

    await redis.del(username + 'Session')

    res.data = { message: 'Session deleted' }
  } catch (err) {
    res.data = { error: err.message }
  }
})

//Загрузка файла
router.post('/uploadFile', (req, res) => {
  try {
    const file = req.file

    try {
      const stream = fs.createWriteStream(`./files/${file.filename}`)
      fs.mkdir('./files/', (_) => {})

      stream.write(file.data, 'binary')

      stream.on('finish', () => {
        stream.close()
      })

      file.data = 'bin'
    } catch (err) {
      console.error(err)
      return (res.data = { error: err })
    }

    res.data = { message: 'File uploaded' }
  } catch (err) {
    res.data = { error: err }
  }
})

router.post('/getFile', (req, res) => {
  const filename = req.data.filename

  const file = fs.readFileSync(`./files/${filename}`, { encoding: 'binary' })

  res.setHeaders = [['Content-Disposition', `attachment;filename=${filename}`]]
  res.toWrite = [file, 'binary']
})

module.exports = router.toMiddleware()
