const { Error } = require("../errors")
const Constants = require("../util/Constants")
const RequestsManager = require("./rest/RequestsManager")

class Client {
  constructor(options = {}) {
    if (!options || typeof options !== "object") options = {}

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
  }
  
  // haha im lazy
  get reddit() { return this.rest.api }   // reddit.com/
  get api()    { return this.reddit.api } // reddit.com/api
  get v1()     { return this.reddit.v1 }  // reddit.com/api/v1

  get authForToken() {
    if (["id", "secret", "username", "password"].some(k => !this[k])) throw new Error("NO_CREDS")
    
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
