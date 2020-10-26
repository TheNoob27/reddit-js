class HTTPError extends Error {
  constructor({ message, name, code = 500, method, path }) {
    super(message)
    this.name = name
    this.code = code
    this.method = method
    this.path = path
  }
}

module.exports = HTTPError