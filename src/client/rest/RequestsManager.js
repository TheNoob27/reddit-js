// const { APIError, Error } = require("../../errors/APIError.js")
const createRoute = require("./APIRouter.js")
const Constants = require("../../util/Constants")
const fetch = require("node-fetch")
const requestToken = Symbol("requestToken") // im bad

class RequestsManager {
  constructor(client) {
    this.client = client

    Object.defineProperty(this, "token", {
      value: null,
      writable: true,
      configurable: false
    })

    this.apiURL = Constants.API
    this.tokenExpireDate = null
    this.requestTimeout = this.client.options.requestTimeout
  }

  get api() {
    return createRoute(this)
  }

  async getAuth() {
    if (this.token && Date.now() / 1000 <= this.tokenExpireDate) return this.token;
    if (this.token) this.token = null
    
    const { username, password } = this.client
    const data = await this.api.accessToken.post({
      data: {
        username, password,
        grant_type: "password"
      },
      auth: requestToken
    })
    console.log(data)

    const {
      access_token: accessToken,
      expires_in: expiresIn,
      token_type: tokenType
    } = data
    if (accessToken == null || tokenType == null) throw data.error

    this.token = `${tokenType} ${accessToken}`
    this.tokenExpireDate = expiresIn + Date.now() / 1000 // might shorten to be safe
    return this.token
  }

  async request(data = {}, options = { data: {} }) {
    data.headers = {
      "content-type": data.method === "GET" || data.method === "POST" ? "application/x-www-form-urlencoded" : "application/json",
      "user-agent": this.client.options.userAgent
    }
    if (options.auth !== false)
      data.headers.authorization = options.auth === requestToken
        ? `Basic ${this.client.authForToken}`
        : await this.getAuth()

    // data for request
    if (!options.data || typeof options.data !== "object") options.data = {}
    options.data.api_type = "json"
    if (data.method === "GET") {
      options.data.raw_json = 1
      data.path += this._toQuery(options.data)
    }
    else if (data.method === "POST") data.form = this._toQuery(options.data).slice(1)
    else data.body = JSON.stringify(options.data)

    console.log(this.apiURL + data.path, data)
    return fetch(this.apiURL + data.path, data)
    .then(res => res.json())
  }
  
  _toQuery(json) {
    if (!json || typeof json !== "object") return ""
    let str = "?"
    const f = s => encodeURIComponent(typeof s === "number" && isFinite(s) ? s : typeof s !== "number" ? s : "")
    
    for (const [key, val] of Object.entries(json)) {
      const prop = f(key)
      if (!prop) continue;
      
      const value = !Array.isArray(val) ? f(val) : val.map(f).filter(v => v !== "").join(`&${prop}=`)
      if (!value) continue;
      
      str += `${str !== "?" ? "&" : ""}${prop}=${value}`
    }
    
    return str === "?" ? "" : str
  }
}

module.exports = RequestsManager