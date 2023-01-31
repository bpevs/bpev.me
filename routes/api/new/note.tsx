import { Handlers } from "$fresh/server.ts";
import { postNote } from "@/utilities/notes.ts";

export const handler: Handlers<> = {
  async POST(_req, ctx) {
    await postNote();
  },
};
