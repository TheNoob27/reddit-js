const ErrorMessages = {
  NO_CREDS: "Some required credentials were not provided.",
  INVALID_ID_SECRET: "The ID and Secret must be strings.",
}

function Make(E = Error, _) {
  return class RedditError extends E {
    constructor(m = _) {
      super(ErrorMessages[m] || m)
      this.name = E && E.name || "RedditError"
      
      if (Error.captureStackTrace) Error.captureStackTrace(this, RedditError);
    }
  }
}

module.exports = {
  create: Make,
  TypeError: Make(TypeError),
  RangeError: Make(RangeError),
  Error: Make(),
  APIError: require("./APIError.js"),
  messages: ErrorMessages
}