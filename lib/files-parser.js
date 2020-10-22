function getMatching(string, regex) {
  const matches = string.match(regex)
  if (!matches || matches.length < 2) {
    return null
  }
  return matches[1]
}

function getBoundary(req) {
  let contentType = req.headers['content-type']
  const contentTypeArray = contentType.split(';').map((item) => item.trim())
  const boundaryPrefix = 'boundary='
  let boundary = contentTypeArray.find((item) =>
    item.startsWith(boundaryPrefix)
  )

  if (!boundary) return null
  boundary = boundary.slice(boundaryPrefix.length)

  if (boundary) boundary = boundary.trim()
  return boundary
}

module.exports = (req, _, next) => {
  if (req.headers['content-type'].includes('multipart/form-data'))
    return new Promise((resolve) => {
      console.log('files-parser is working')

      req.setEncoding('latin1')
      let rawData = ''
      req.on('data', (chunk) => (rawData += chunk))

      req.on('end', () => {
        const boundary = getBoundary(req)

        let result = {}
        const rawDataArray = rawData.split(boundary)
        for (let item of rawDataArray) {
          let name = getMatching(item, /(?:name=")(.+?)(?:")/)

          if (!name || !(name = name.trim())) continue
          let value = getMatching(item, /(?:\r\n\r\n)([\S\s]*)(?:\r\n--$)/)

          if (!value) continue
          let filename = getMatching(item, /(?:filename=")(.*?)(?:")/)

          if (filename && (filename = filename.trim())) {
            let file = {}
            file['name'] = name
            file['data'] = value
            file['filename'] = filename
            let contentType = getMatching(
              item,
              /(?:Content-Type:)(.*?)(?:\r\n)/
            )
            if (contentType && (contentType = contentType.trim())) {
              file['Content-Type'] = contentType
            }
            result = file
          } else {
            result[name] = value
          }
        }

        req.file = result
        resolve()
      })
    }).then(() => next())

  return next()
}
