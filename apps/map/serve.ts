import "https://deno.land/x/dotenv@v3.2.0/load.ts";
import { Application, Router, send } from "https://deno.land/x/oak@v10.6.0/mod.ts";

const API_KEY = Deno.env.get("MAP_API_KEY");
const BASE_URL = "https://api.maptiler.com";
const MAP_STYLE = `${BASE_URL}/maps/basic/style.json?key=${API_KEY}`;

const api = new Router()
  .get("/api/map-style", async (ctx) => {
    const map = await (await fetch(MAP_STYLE)).json();
    ctx.response.type = "application/json";
    ctx.response.body = JSON.stringify(map);
  })
  .get("/api/search/:query", async (ctx) => {
    const URL = `${BASE_URL}/geocoding/${ctx.params.query}.json?key=${API_KEY}`;
    const resp = await (await fetch(URL)).json();
    ctx.response.type = "application/json";
    ctx.response.body = JSON.stringify(resp);
  });

console.log("listening on http://localhost:8080");

await new Application()
  .use(api.routes())
  .use(async (ctx, next) => {
  try {
    await ctx.send({
        root: `${Deno.cwd()}/apps/map/static`,
        index: "index.html",
      });
    } catch {
      ctx.response.status = 404;
      ctx.response.body = "404 File not found";
    }
  })
  .use(api.allowedMethods())
  .listen({ port: 8080 });
