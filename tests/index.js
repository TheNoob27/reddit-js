const Reddit = require("../src")

const client = new Reddit.Client({
  id: "DPkZstas3245RQ",
  secret: "",
  username: "TheNoob27-",
  password: "",
});

client.v1.me.karma.get({ log: true }).then(console.log, console.log)