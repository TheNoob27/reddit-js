class APIError extends Error {
  constructor(error, path, method, status) {
    super(
      error.errors && errors.map(([a, b, c]) => `${a}: ${b} (${c})`).join('//')
      || error.message
      || error
    )
    this.name = "RedditAPIError"
    this.code = error.code || error.error
    this.path = path
    this.method = method
    this.status = status

    if (Error.captureStackTrace) Error.captureStackTrace(this, APIError)
  }
}

module.exports = APIError