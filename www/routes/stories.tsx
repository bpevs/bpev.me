import { Handlers, PageProps } from "$fresh/server.ts";
import { getNotes, Note } from "../utilities/notes.ts";

export const handler: Handlers<Note[]> = {
  async GET(_req, ctx) {
    const notes = await getNotes();
    return ctx.render(notes);
  },
};

export default function NotesIndexPage(props: PageProps<Note[]>) {
  const notes = props.data;
  return (
    <body
      data-color-mode="auto"
      data-light-theme="light"
      data-dark-theme="dark"
    >
      <main>
        <h1>Notes</h1>
        <ul class="notes-list">
          {notes.map((note) => <Card note={note} />)}
        </ul>
      </main>
    </body>
  );
}

function Card({ story }: { story: Story }) {
  return (
    <li>
    </li>
  );
}
