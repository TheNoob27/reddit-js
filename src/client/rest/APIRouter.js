const other = [
  "toString",
  "valueOf",
  "constructor", 
  "inspect",
  Symbol.toPrimitive
],
methods = [
  "get",
  "put",
  "post",
  "patch",
  "delete"
]

const blank = () => {}
module.exports = function createRoute(manager) {
  const route = [""]
  const handler = {
    get(_, name) {
      if (other.includes(name)) return () => route.join("/")
      if (route.length === 1 && name === "v1") route.push("api")
      
      if (methods.includes(name)) {
        // Preserve async stack
        let stackTrace = null;
        if (Error.captureStackTrace) {
          stackTrace = {};
          Error.captureStackTrace(stackTrace, this.get);
        }
        return (options) => 
          manager.request({
            path: route.map(encodeURIComponent).join("/"),
            method: name.toUpperCase(),
            timeout: manager.requestTimeout,
          }, options)
          .catch(error => {
            if (stackTrace && (error instanceof Error)) {
              stackTrace.name = error.name;
              stackTrace.message = error.message;
              error.stack = stackTrace.stack;
            }
            throw error;
          })
      }

      route.push(name.replace(/[A-Z]/g, w => `_${w.toLowerCase()}`)) // camelCase to snake_case - accessToken -> access_token
      return p(handler)
    },
    apply(_t, _, args) {
      route.push(...args.filter((x) => x != null))
      return p(handler)
    }
  }
  
  return p(handler)
}

function p(h){
  return new Proxy(blank, h)
}

module.exports.p = p
