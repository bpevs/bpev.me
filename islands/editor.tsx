import { useCallback, useEffect, useRef } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { Note } from "@/utilities/notes.ts";

export default function Editor({ note }: { note?: Note }) {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const { content, title, published } = note || {};

  useEffect(() => {
    async function loadEasyMDE() {
      if (IS_BROWSER && textRef?.current) {
        const EasyMDE = (await import(
          "https://cdn.jsdelivr.net/npm/easymde/dist/easymde.min.js"
        )).default;
        const easyMDE = new EasyMDE({
          element: textRef.current,
          spellChecker: false,
        });
        easyMDE.value(content);
      }
    }
    loadEasyMDE();
  }, [textRef]);

  if (!IS_BROWSER) return <div />;

  return (
    <div className="editor">
      <form
        method="post"
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: 800,
          margin: "0 auto 0 auto",
          padding: "50px",
        }}
      >
        <h1>Create New Post</h1>
        <label for="title">title</label>
        <input type="title" name="title" value={title} />
        <label for="published">published</label>
        <input
          type="published"
          name="published"
          value={(published || "").toString()}
        />
        <label for="content">content</label>
        <textarea ref={textRef} name="content" rows={20} cols={60} />
        <button type="submit" style={{ width: "5em" }}>Submit</button>
      </form>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/easymde/dist/easymde.min.css"
      />
    </div>
  );
}
