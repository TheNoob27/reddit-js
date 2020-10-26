const Reddit = require("../src")

const client = new Reddit.Client({
  id: "DPkZstas3245RQ",
  secret: "",
  username: "TheNoob27-",
  password: "",
});

// get karma 
client.v1.me.karma.get().then(console.log, console.log);

// get a reddit post
client.reddit.r.dankmemes.comments
  .jiiz5o
  .get({ auth: false })
  .then(console.log);

// post (doesnt seem to work yet)
client.api.submit
  .post({
    data: {
      sr: "testingground4bots",
      kind: "link",
      resubmit: true,
      title: "My first bot post",
      text: "if this works, then hello world!",
    },
  })

  .then(console.log, console.log);

module.exports = client // to work in node in the terminal