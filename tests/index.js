// const client = new (require("reddit"))({
//   appId: "DPkZstas3245RQ",
//   appSecret: "",
//   username: "TheNoob27",
//   password: "",
// })
// client._getToken()

const Reddit = require("../src")

const client = new Reddit.Client({
  id: "DPkZstas3245RQ",
  secret: "",
  username: "TheNoob27",
  password: "",
});

client.rest.getAuth().then(console.log, console.log)
//.api.me.karma.get().then(console.log, console.log)