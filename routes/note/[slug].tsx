import { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import Markup from "@/components/markup/index.ts";
import Only from "@/components/only.tsx";
import Page from "@/components/page.tsx";
import { getNote, Note } from "@/utilities/notes.ts";

interface Props {
  note: Note;
  isAuthorized: boolean;
}

export const handler: Handlers<Props> = {
  async GET(req, ctx) {
    const note = await getNote(ctx.params.slug);
    if (!note) return ctx.renderNotFound();
    const isAuthorized = getCookies(req.headers).auth === "bar";
    return ctx.render!({ note, isAuthorized });
  },
};

export default function NotePage(props: PageProps<Props>) {
  const { isAuthorized, note } = props.data;
  return (
    <Page
      isAuthorized={isAuthorized}
      navItems={
        <Only if={isAuthorized}>
          <li>
            <a href={`${note.slug}/edit`}>Edit Note</a>
          </li>
        </Only>
      }
    >
      <main style={{ paddingTop: "20px", paddingBottom: "20px" }}>
        <Markup
          class="markdown-body"
          markup={note.content}
          type="html"
        />
      </main>
    </Page>
  );
}
