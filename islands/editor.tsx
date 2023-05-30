import { useCallback, useEffect, useRef } from 'preact/hooks'
import { useSignal } from '@preact/signals'
import { Note, postNote } from '@/utilities/notes.ts'

const defaultNote = Object.freeze({
  title: '',
  slug: '',
  content: { commonmark: '' },
})

export default function Editor(props: { note?: Note }) {
  const note = useSignal<Note>(props.note || { ...defaultNote })

  const onSubmit = useCallback(async (e: Event) => {
    e.preventDefault()
    const nextNote = { ...note.value, content, updated: new Date() }
    await fetch(`/api/notes/${slug}`, {
      method: 'POST',
      body: JSON.stringify(nextNote),
    })
    location.replace(location.href.replace('/edit', '/'))
  }, [note])

  const onChangeMeta = useCallback((e: Event) => {
    const { name, value } = e.target as HTMLInputElement
    if (name === 'published') {
      note.value.published = value ? new Date(value) : null
    } else if (name === 'title') note.value.title = value
    else if (name === 'slug') note.value.slug = value
    else if (name === 'content') note.value.content.commonmark = value
  }, [note])

  const { content, title, slug } = note.value
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
        <textarea
          name='content'
          value={content.commonmark}
          onChange={onChangeMeta}
          rows={20}
          cols={60}
        />
        <button type='submit'>
          Submit
        </button>
      </form>
    </div>
  )
}
