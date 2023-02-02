import { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import Markup from "@/components/markup/index.ts";
import Only from "@/components/only.tsx";
import { getNote, Note } from "@/utilities/notes.ts";

export const handler: Handlers<Note> = {
  async GET(req, ctx) {
    const note = await getNote(ctx.params.slug);
    const isAllowed = getCookies(req.headers).auth === "bar";
    if (!note) return ctx.renderNotFound();
    return ctx.render!({ isAllowed, note });
  },
};

export default function NotePage(props: PageProps<Note>) {
  return (
    <body
      data-color-mode="auto"
      data-light-theme="light"
      data-dark-theme="dark"
    >
      <Only if={props.data.isAllowed}>
        <a href={`${props.data.note.slug}/edit`}>Edit</a>
      </Only>
      <Markup
        class="markdown-body"
        markup={props.data.note.content}
        type="html"
      />
    </body>
  );
}
