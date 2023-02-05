import { useCallback, useEffect, useRef } from 'preact/hooks'
import { useSignal } from '@preact/signals'
import { IS_BROWSER } from '$fresh/runtime.ts'
import * as TinyMDE from 'tiny-markdown-editor'
import { Note, postNote } from '@/utilities/notes.ts'

const defaultNote = Object.freeze({
  title: '',
  slug: '',
  content: { commonmark: '' },
})

export default function Editor(props: { note?: Note }) {
  const textRef = useRef<HTMLTextAreaElement>(null)
  const tinyMDE = useRef<typeof TinyMDE.Editor>(null)
  const note = useSignal<Note>(props.note || { ...defaultNote })

  useEffect(() => {
    if (IS_BROWSER && textRef?.current) {
      tinyMDE.current = new TinyMDE.Editor({ element: textRef.current })
      tinyMDE.current.setContent(props?.note?.content?.commonmark || '')
    }
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
    if (name === 'published') {
      note.value.published = value ? new Date(value) : null
    } else if (name === 'title') note.value.title = value
    else if (name === 'slug') note.value.slug = value
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
        <button type='submit'>
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
