import { CSS, render } from "$gfm";
import { asset, Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import Markup from "../../components/markup/index.ts";
import { getNote, Note } from "../../utilities/notes.ts";

import "https://esm.sh/prismjs@1.29.0/components/prism-jsx?no-check&pin=v57";
import "https://esm.sh/prismjs@1.29.0/components/prism-typescript?no-check&pin=v57";
import "https://esm.sh/prismjs@1.29.0/components/prism-tsx?no-check&pin=v57";
import "https://esm.sh/prismjs@1.29.0/components/prism-bash?no-check&pin=v57";
import "https://esm.sh/prismjs@1.29.0/components/prism-powershell?no-check&pin=v57";
import "https://esm.sh/prismjs@1.29.0/components/prism-json?no-check&pin=v57";
import "https://esm.sh/prismjs@1.29.0/components/prism-diff?no-check&pin=v57";

export const handler: Handlers<Note> = {
  async GET(_req, ctx) {
    const note = await getNote(ctx.params.slug);
    if (!note) return ctx.renderNotFound();
    return ctx.render(note);
  },
};

export default function NotePage(props: PageProps<Note>) {
  return (
    <>
      <Head>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <link rel="stylesheet" href={asset("/index.css")} />
      </Head>
      <body
        data-color-mode="auto"
        data-light-theme="light"
        data-dark-theme="dark"
      >
        <Markup
          class="markdown-body"
          markup={render(props.data.content, { allowIframes: true })}
          type="html"
        />
      </body>
    </>
  );
}
