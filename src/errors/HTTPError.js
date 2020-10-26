class HTTPError extends Error {
  constructor({ message, name, code = 500, method, path }) {
    console.log("error:", { message, name, code, method, path })
    super(message)
    this.name = name
    this.code = code
    this.method = method
    this.path = path
  }
}

module.exports = HTTPError