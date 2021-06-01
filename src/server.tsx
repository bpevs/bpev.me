import { opine, serveStatic } from "https://deno.land/x/opine@1.1.0/mod.ts";
import { dirname, join } from "https://deno.land/x/opine@1.1.0/deps.ts";
import { renderFileToString } from "https://deno.land/x/dejs@0.9.3/mod.ts";
// @deno-types="https://raw.githubusercontent.com/Soremwar/deno_types/4a50660/react/v16.13.1/react.d.ts"
import React from "https://dev.jspm.io/react@16.13.1";
import ReactDOMServer from "https://dev.jspm.io/react-dom@16.13.1/server";
import { App } from "./components/App.tsx";

/**
 * Create our client bundle - you could split this out into
 * a preprocessing step.
 */
const { diagnostics, files } = await Deno.emit(
  "client.tsx",
  {
    bundle: "esm",
    compilerOptions: {
      lib: ["dom", "dom.iterable", "esnext"],
    },
  },
);

if (diagnostics && diagnostics.length) {
  console.log(diagnostics);
}

/**
 * Create our Opine server.
 */
const app = opine();
const __dirname = dirname(import.meta.url);

// Register ejs as .html.
app.engine(".html", renderFileToString);

// Optional since opine defaults to CWD/views
app.set("views", join(__dirname, "views"));

// Path to our public directory
app.use(serveStatic(join(__dirname, "public")));

// Without this you would need to
// supply the extension to res.render()
// ex: res.render('main.html').
app.set("view engine", "html");


/**
 * Serve our client JS bundle.
 */
app.get("/scripts/client.js", async (req, res) => {
  const js = files["deno:///bundle.js"];
  res.type("application/javascript").send(js);
});

/**
 * Main route setup
 */
app.get("/", (req, res) => {
  const app = <App isServer={true} />;
  const content = (ReactDOMServer as any).renderToString(app);
  const scripts = `<script type="module" src="/scripts/client.js"></script>`;

  res.set("cache-control", "no-store").render("main", {
    content,
    scripts,
    title: "fridaypoetry.org",
  });
});

app.listen(3000);
console.log("running on port 3000");
