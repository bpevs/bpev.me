const express = require("express");
const next = require("next");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || (dev ? 3000 : 80);

// Multi-process to utilize all CPU cores.
if (!dev && cluster.isMaster) {
  console.log(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {
  const nextApp = next({ dir: ".", dev });
  const nextHandler = nextApp.getRequestHandler();

  nextApp.prepare()
    .then(() => {
      const server = express();

      server.use("/static", express.static("static"));

      server.get("/:postId", (req, res) => {
        nextApp.render(req, res, "/post", req.params);
      });

      server.get("/post/:postId", (req, res) => {
        nextApp.render(req, res, "/post", req.params);
      });

      server.get("/:postId/:mediaId", (req, res) => {
        nextApp.render(req, res, "/media", req.params);
      })

      server.get("*", (req, res) => {
        return nextHandler(req, res);
      });

      server.listen(port, (err) => {
        if (err) throw err;
        console.log(`Listening on port ${port}`);
      });
    });
}
