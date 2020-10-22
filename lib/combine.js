module.exports = (middleware) => (req, res, next) =>
  (function dispatch(i) {
    let fn = middleware[i]
    if (i === middleware.length) fn = next
    return !!fn
      ? Promise.resolve(fn(req, res, () => dispatch(++i)))
      : Promise.resolve()
  })(0)
