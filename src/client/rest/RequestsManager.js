// const { APIError, Error } = require("../../errors/APIError.js")
const createRoute = require("./APIRouter.js")
const Constants = require("../../util/Constants")
const fetch = require("node-fetch")
const { APIError, Error } = require("../../errors/index.js")
const HTTPError = require("../../errors/HTTPError.js")
const requestToken = Symbol("requestToken") // im bad

class RequestsManager {
  constructor(client) {
    this.client = client

    Object.defineProperty(this, "token", {
      value: null,
      writable: true,
      configurable: false
    })

    this.apiURL = Constants.apiURL
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
    const data = await this.api.v1.accessToken.post({
      form: {
        username, password,
        grant_type: Constants.grantType
      },
      auth: requestToken
    })

    const {
      access_token: accessToken,
      expires_in: expiresIn,
      token_type: tokenType
    } = data
    // if (accessToken == null || tokenType == null) throw data.error

    this.token = `${tokenType} ${accessToken}`
    this.tokenExpireDate = expiresIn + Date.now() / 1000 // might shorten to be safe
    return this.token
  }

  async request(data = {}, options = { data: {} }) {
    data.headers = {
      "user-agent": this.client.options.userAgent,
      accept: "application/json",
      "accept-encoding": "gzip, deflate" // idk
    }
    if (data.method !== "GET" && !options.form) data.headers["content-type"] = "application/json"
    else if (options.form) data.headers["content-type"] = "application/x-www-form-urlencoded"

    if (options.auth !== false)
      data.headers.authorization = options.auth === requestToken
        ? `Basic ${this.client.authForToken}`
        : await this.getAuth()

    // data for request
    if (!options.data || typeof options.data !== "object") options.data = {}
    options.data.api_type = "json"
    if (data.method === "GET") {
      if (options.auth === false && !data.path.endsWith(".json")) options.path += ".json"
      options.data.raw_json = 1 // make reddit return "hello >:)" instead of "hello &gt;:)"
      data.path += this._toQuery(options.data)
    }
    else if (options.form) data.body = this._toQuery(options.form).slice(1)
    else data.body = JSON.stringify(options.data)

    return fetch(`${options.auth === requestToken || options.auth === false ? Constants.reddit : this.apiURL}${data.path}`, data)
    .catch(e => {
      throw new HTTPError({
        name: e.constructor.name,
        message: e.message,
        code: e.status,
        path: data.path,
        method: data.method,
      })
    })
    .then(async res => {
      const parse = (r) =>
        r.headers.get("content-type").startsWith("application/json")
          ? r.json()
          : r.text(); // maybe it should be buffer

      if (res.ok) {
        const d = await parse(res)
        if (d && typeof d === "object" && d.error)
          throw new APIError(new Error(d.error.toUpperCase()), data.path, data.method, res.status)
        return d
      }

      // 4xx responses
      if (res.status >= 400 && res.status < 500) {
        await parse(res)
          .then((d) => new APIError(d, data.path, data.method, res.status))
          .catch(
            (e) =>
              new HTTPError({
                name: e.constructor.name,
                message: e.message,
                code: e.status,
                path: data.path,
                method: data.method,
              })
          )
          .then((error) => {
            throw error;
          });
      }

      // 5xx responses
      if (res.status >= 500 && res.status < 600)
        throw new HTTPError(
          res.statusText,
          res.constructor.name,
          res.status,
          data.method,
          data.path
        )
    })
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