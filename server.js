const express = require("express");
const next = require("next");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;

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

      if (!dev) {
        // Enforce SSL & HSTS in production
        server.use(function(req, res, next) {
          var proto = req.headers["x-forwarded-proto"];
          if (proto === "https") {
            res.set({
              "Strict-Transport-Security": "max-age=31557600" // one-year
            });
            return next();
          }
          res.redirect("https://" + req.headers.host + req.url);
        });
      }

      server.use("/static", express.static("static"));

      server.get("/post/:id", (req, res) => {
        const actualPage = "/post";
        const queryParams = { id: req.params.id };
        nextApp.render(req, res, actualPage, queryParams);
      });

      server.get("/media/:post/:id", (req, res) => {
        const actualPage = "/media";
        const queryParams = {
          id: req.params.id,
          post: req.params.post,
        };
        nextApp.render(req, res, actualPage, queryParams);
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
