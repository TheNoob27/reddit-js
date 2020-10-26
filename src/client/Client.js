const { Error } = require("../errors")
const Constants = require("../util/Constants")
const RequestsManager = require("./rest/RequestsManager")

class Client {
  constructor(options = {}) {
    if (
      !options ||
      typeof options !== "object" ||
      ["id", "secret", "username", "password"].some(k => !(k in options))
    ) throw new Error("NO_CREDS")

    this.username = options.username
    this.id = options.id
    Object.defineProperties(this, {
      password: {
        value: options.password,
        writable: true,
        configurable: true,
        enumerable: false
      },
      secret: {
        value: options.secret,
        writable: true,
        configurable: true,
        enumerable: false
      }
    })
    
    this._validateOptions(options.options)
    this.rest = new RequestsManager(this)
    console.log(this)
  }
  
  get api() {
    return this.rest.api
  }

  get authForToken() {
    if (typeof this.id !== "string" || typeof this.secret !== "string") throw new Error("INVALID_ID_SECRET")
    return `${Buffer.from(`${this.id}:${this.secret}`).toString('base64')}`
  }

  get token() {
    return this.rest.token
  }

  _validateOptions(ops) {
    this.options = {}
    if (!ops || typeof ops !== "object") ops = {};

    if (ops.userAgent && typeof ops.userAgent === "string") this.options.userAgent = ops.userAgent
    else this.options.userAgent = Constants.defaultOptions.userAgent

    if (!isNaN(ops.requestTimeout) && ops.requestTimeout >= 1000) this.options.requestTimeout = ops.requestTimeout
    else this.options.requestTimeout = Constants.defaultOptions.requestTimeout
  }
}

module.exports = Client
