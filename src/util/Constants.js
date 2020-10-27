const package = require("../../package.json")

module.exports = {
  apiURL: "https://oauth.reddit.com", // not reddit.com/api/v1 because not all endpoints start there
  reddit: "https://www.reddit.com",
  grantType: "password",

  defaultOptions: {
    // npm/node-reddit-js (https://www.github.com/TheNoob27/reddit-js, v0.0.1) Node.js/v12.18.2
    userAgent: `npm/${package.name} (${package.homepage.split("#")[0]}, v${package.version}) Node.js/${process.version}`,
    requestTimeout: 30000
  }
}