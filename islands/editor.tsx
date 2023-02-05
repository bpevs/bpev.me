import { useCallback, useEffect, useRef } from 'preact/hooks'
import { useSignal } from '@preact/signals'
import { IS_BROWSER } from '$fresh/runtime.ts'
import { Note, postNote } from '@/utilities/notes.ts'

const defaultNote = Object.freeze({
  title: '',
  slug: '',
  content: '',
})

export default function Editor(props: { note?: Note }) {
  const textRef = useRef<HTMLTextAreaElement>(null)
  const tinyMDE = useRef<any>(null)
  const note = useSignal<Note>(props.note || { ...defaultNote })

  useEffect(() => {
    async function loadEasyMDE() {
      if (IS_BROWSER && textRef?.current) {
        // https://github.com/jefago/tiny-markdown-editor
        const TinyMDE = (await import(
          'https://unpkg.com/tiny-markdown-editor@0.1.5/dist/tiny-mde.min.js'
        )).default
        tinyMDE.current = new TinyMDE.Editor({ element: textRef.current })
        tinyMDE.current.setContent(props?.note?.content?.commonmark || '')
      }
    }
    loadEasyMDE()
  }, [textRef])

  const onSubmit = useCallback(async (e: Event) => {
    e.preventDefault()
    const content = { commonmark: tinyMDE?.current?.getContent!() || '' }
    const nextNote = { ...note.value, content, updated: new Date() }
    await fetch(`/api/note/${slug}`, {
      method: 'POST',
      body: JSON.stringify(nextNote),
    })
    location.replace(location.href.replace('/edit', '/'))
  }, [note, tinyMDE])

  const onChangeMeta = useCallback((e: Event) => {
    const { name, value } = e.target as HTMLInputElement
    if (name === 'published') note.value[name] = value ? new Date(value) : null
    else note.value[name] = value
  }, [note])

  if (!IS_BROWSER) return <div />

  const { title, slug } = note.value
  const published = (note.value.published || '').toString()

  return (
    <div className='editor'>
      <form
        onSubmit={onSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 800,
          margin: '0 auto 0 auto',
          padding: '50px',
        }}
      >
        <h1>Create New Post</h1>
        <label for='title'>title</label>
        <input name='title' value={title} onChange={onChangeMeta} />
        <label for='published'>published</label>
        <input name='published' value={published} onChange={onChangeMeta} />
        <label for='slug'>slug</label>
        <input name='slug' value={slug} onChange={onChangeMeta} />
        <label for='content'>content</label>
        <textarea ref={textRef} name='content' rows={20} cols={60} />
        <button type='submit' style={{ width: '5em', padding: '10px' }}>
          Submit
        </button>
      </form>
      <link
        rel='stylesheet'
        href='https://unpkg.com/tiny-markdown-editor@0.1.5/dist/tiny-mde.min.css'
      />
    </div>
  )
}
