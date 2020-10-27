# node-reddit-js
A Node.js Reddit module that attempts to fully cover the Reddit API.

This is not done yet, currently YOU have to make the requests to the endpoints yourself, but soon it'll all be done in the background for you.

## Examples
### Importing the package:
```js
// import the package
const Reddit = require("node-reddit-js")
// import only the client class
const { Client } = require("node-reddit-js")
```

### Using the package - with credentials
```js
const client = new Reddit.Client({
  id: "APP_ID",
  secret: "APP_SECRET",
  username: "REDDIT_USERNAME",
  password: "REDDIT_PASSWORD",
})

client.api.v1.me.karma.get() // GET https://oauth.reddit.com/api/v1/me/karma
/*
{
  kind: 'KarmaList',
  data: [
    { sr: 'dankmemes', comment_karma: 65, link_karma: 6985 },
    { sr: 'memes', comment_karma: 231, link_karma: 6074 },
    // ...
  ]
}
*/
```
Some endpoints don't require authorisation:
```js
// don't authorise with the token
client.reddit.new.get({ auth: false }) // GET https://reddit.com/new
/*
{
  kind: "Listing",
  data: {
    // ...
  }
}
*/
```

### Using the package - without credentials
```js
const client = new Reddit.Client()
client.reddit.r.dankmemes.comments.jiiz5o.get({ auth: false }) // GET https://www.reddit.com/r/dankmemes/comments/jiiz5o
/*
[
  // post
  {
    kind: "Listing",
    data: {
      // ...
    }
  },

  // comments
  { 
    kind: "Listing",
    data: {
      // ...
    }
  }
]
*/
```

## API
```js
// The url changes from oauth.reddit.com to www.reddit.com if you're not authorising
// i'll just use reddit.com here to keep things simple

client.reddit // https://reddit.com
client.api    // https://reddit.com/api (shortcut, client.reddit.api)
client.v1     // https://reddit.com/api/v1 (shortcut again, client.reddit.api.v1 or client.api.v1)

client.reddit.top         // https://reddit.com/top
client.reddit.r.subreddit // https://reddit.com/r/subreddit

client.reddit("r/subreddit") // https://reddit.com/r/subreddit
client.reddit["r/subreddit"] // https://reddit.com/r/subreddit

client.reddit.a.b("c", "d").e["f"]  // https://reddit.com/a/b/c/d/e/f

// Making requests
client.reddit.new.get({             // GET https://reddit.com/new?limit=2
  data: {
    limit: 2
  }
})
client.api.whatever.you.want.post({ // POST https://reddit.com/whatever/you/want with data {"some":"thing"}
  data: {
    some: "thing"
  }
}) 
client.v1.me.prefs.patch({          // PATCH https://reddit.com/api/v1/me/prefs with data {...}
  data: {
    // ...
  }
})
// any data you need to send or query onto the url goes into the data field
```