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
    <main class="max-w-screen-md px-4 pt-16 mx-auto">
      <h1 class="text-5xl font-bold">Notes</h1>
      <div class="mt-8">
        {notes.map((note) => <NoteCard note={note} />)}
      </div>
    </main>
  );
}

function NoteCard(props: { note: Note }) {
  const { note } = props;
  return (
    <div class="py-8 border(t gray-200)">
      <a class="sm:col-span-2" href={`/notes/${note.slug}`}>
        <h3 class="text(3xl gray-900) font-bold">
          {note.title}
        </h3>
        <time class="text-gray-500">
          {new Date(note.published).toLocaleDateString("en-us", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <div class="mt-4 text-gray-900">
          {note.snippet}
        </div>
      </a>
    </div>
  );
}
