import { Handlers, PageProps } from "$fresh/server.ts";

import { getNotes, Note } from "@/utilities/notes.ts";

export const handler: Handlers<Note[]> = {
  async GET(req, ctx) {
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
          {notes.map((note) => <NoteCard note={note} />)}
        </ul>
      </main>
    </body>
  );
}

function NoteCard({ note }: { note: Note }) {
  return (
    <li>
      <a href={`/notes/${note.slug}`}>
        <span>{note.title} –</span>
        <time>
          {new Date(note.published).toLocaleDateString("en-us", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </a>
    </li>
  );
}
