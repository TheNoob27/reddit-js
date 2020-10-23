class Client {
  constructor(options = {}) {
    if (
      !options ||
      typeof options !== "object" ||
      ["id", "secret", "username", "password"].some(k => !(k in options))
    ) throw new Error("Some option fields were not provided.")
    
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
  }
  
  get authForToken() {
    if (typeof this.id !== "string" || typeof this.secret !== "string") throw new Error("The ID and Secret must be strings.")
    return `Basic ${Buffer.from(`${this.id}:${this.secret}`).toString('base64')}`
  }
}

module.exports = Client
