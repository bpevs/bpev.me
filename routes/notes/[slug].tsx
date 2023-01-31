import { Handlers, PageProps } from "$fresh/server.ts";
import Markup from "@/components/markup/index.ts";
import { getNote, Note } from "@/utilities/notes.ts";

export const handler: Handlers<Note> = {
  async GET(_req, ctx) {
    const note = await getNote(ctx.params.slug);
    if (!note) return ctx.renderNotFound();
    return ctx.render(note);
  },
};

export default function NotePage(props: PageProps<Note>) {
  return (
    <body
      data-color-mode="auto"
      data-light-theme="light"
      data-dark-theme="dark"
    >
      <Markup
        class="markdown-body"
        markup={props.data.content}
        type="html"
      />
    </body>
  );
}
