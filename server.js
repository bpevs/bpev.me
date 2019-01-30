const express = require("express")
const next = require("next")
const cluster = require("cluster")
const numCPUs = require("os").cpus().length

const dev = process.env.NODE_ENV !== "production"
const port = Number(process.env.PORT) || 3000
const host = dev ? "localhost" : "0.0.0.0"

// Multi-process to utilize all CPU cores.
if (!dev && cluster.isMaster) {
  console.log(`Node cluster master ${process.pid} is running`)

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on("exit", (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`)
  })

} else {
  const nextApp = next({ dir: ".", dev })
  const nextHandler = nextApp.getRequestHandler()

  nextApp.prepare()
    .then(() => {
      const server = express()

      server.use("/static", express.static("static"))

      server.get("/login", renderRoute("/signin"))
      server.get("/signin", renderRoute("/signin"))
      server.get("/search", renderRoute("/search"))
      server.get("/vx1", renderRoute("/vx1"))
      server.get("/:postId/:mediaId", renderRoute("/media"))
      server.get("/:postId", renderRoute("/index"))
      server.get("/post/:postId", renderRoute("/index"))
      server.get("/", renderRoute("/index"))
      server.get("*", (req, res) => nextHandler(req, res))

      server.listen(port, host, (err) => {
        if (err) throw err
        console.log(`Listening on port ${port}`)
      })
    })

  function renderRoute(route) {
    return (req, res) => {
      const query = { ...req.query, ...req.params }
      const host = (req.headers.host || "").split(".")
      const subDomain = host.length > 2 ? host[0] : ""

      if (subDomain === "vx1") {
        return nextApp.render(req, res, "/vx1", query)
      }

      if (subDomain && subDomain !== "www") {
        query.subDomain = subDomain
      }

      nextApp.render(req, res, route, query)
    }
  }
}
