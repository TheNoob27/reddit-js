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
			
      if (methods.includes(name)) {
        return (options) => manager.request({
          path: route.map(encodeURIComponent).join("/"),
          method: name.toUpperCase(),
        }, options)
      }

      route.push(name)
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
