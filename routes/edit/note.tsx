import { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { postNote } from "@/utilities/notes.ts";
import Only from "@/components/only.tsx";
import Login from "@/components/login.tsx";
import Editor from "@/islands/editor.tsx";

export default function NewNote({ data }: PageProps<Data>) {
  return (
    <body
      data-color-mode="auto"
      data-light-theme="light"
      data-dark-theme="dark"
    >
      <Editor />
    </body>
  );
}
