// https://deno.com/blog/setup-auth-with-fresh
import { Handlers } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import { compare } from "bcrypt";
import { AUTH_KEY, isProd } from "@/constants.ts";
import { createSessionId } from "@/utilities/session.ts";

export const handler: Handlers = {
  async POST(req) {
    const url = new URL(req.url);
    const password = (await req.formData()).get("password") || "";
    if (
      typeof password === "string" &&
      await compare(password, AUTH_KEY || "")
    ) {
      const headers = new Headers();
      setCookie(headers, {
        name: "auth",
        value: createSessionId(),
        maxAge: 120000,
        sameSite: "Strict", // this is important to prevent CSRF attacks
        domain: url.hostname,
        path: "/",
        secure: isProd,
      });

      headers.set("location", "/dashboard");

      return new Response(null, {
        status: 303, // "See Other"
        headers,
      });
    } else {
      return new Response(null, {
        status: 403,
      });
    }
  },
};
