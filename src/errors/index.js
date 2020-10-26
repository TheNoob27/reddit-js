const ErrorMessages = {
  // this library's custom errors
  NO_CREDS: "Some required credentials were not provided.",
  INVALID_ID_SECRET: "The ID and Secret must be strings.",


  // reddit errors
  UNSUPPORTED_GRANT_TYPE: "An invalid grant type was provided.",
  INVALID_GRANT: "Invalid grants were provided, or your username/password is incorrect."
}

function Make(E = Error, _) {
  return class RedditError extends E {
    constructor(m = _) {
      super(ErrorMessages[m] || m)
      this.name = E.name || "RedditError"
      
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