

const handler = async (req, res, next) => {
  if (req.path === '/id') {
    res.end('hello world')
    return
  }
  next()
}

module.exports = {handler}