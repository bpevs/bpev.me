import { CSS, render } from "$gfm";
import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { getNote, Note } from "../../utilities/notes.ts";

export const handler: Handlers<Note> = {
  async GET(_req, ctx) {
    const note = await getNote(ctx.params.slug);
    if (note === null) return ctx.renderNotFound();
    return ctx.render(note);
  },
};

export default function NotePage(props: PageProps<Note>) {
  const note = props.data;
  return (
    <>
      <Head>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </Head>
      <div
        class="mt-8 markdown-body"
        dangerouslySetInnerHTML={{ __html: render(note.content) }}
      />
    </>
  );
}
