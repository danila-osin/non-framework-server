module.exports = (req, _, next) => {
  if (req.headers['content-type'] === 'application/json')
    return new Promise((resolve) => {
      console.log('json-parser is working')

      let buffer = ''

      req.on('data', (chunk) => (buffer += chunk))
      req.on('end', () => {
        try {
          req.data = JSON.parse(buffer)
        } catch (err) {
          req.data = {}
        }

        resolve()
      })
    }).then(() => next())

  return next()
}
