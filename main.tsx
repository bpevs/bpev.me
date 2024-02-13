/** @jsx jsx **/
import { Hono } from 'hono'
import { cache, jsx, logger, poweredBy, serveStatic } from 'hono/middleware.ts'
import { html, raw } from 'hono/helper.ts'
import { getNote, getNotes, parseNote } from './utilities/notes.ts'
import notesToRSS from './utilities/notes_to_rss.ts'
import Html from './utilities/html.tsx'

const app = new Hono()

app.use('*', logger(), poweredBy())
app.get('/rss', async (c) => c.text(notesToRSS(await getNotes())))
// app.get(
//   '*',
//   cache({
//     cacheName: 'everything',
//     cacheControl: 'max-age=3600',
//     wait: true,
//   }),
// )
app.get('/', (c) => c.redirect('/notes'))
app.get('/notes', async (c) =>
  c.html(
    <Html>
      <main>
        <p class='intro'>
          Hi I'm Ben! 👋 Welcome to my blog! <br /> Also feel free to check{' '}
          <a href='/projects'>stuff I've made</a>
        </p>
        <ul class='notes-list'>
          {(await getNotes()).map((note) => (
            <li>
              <a href={`/notes/${note.slug}`}>
                <strong>{note.title} –{' '}</strong>
                <time style={{ opacity: 0.8, fontSize: '0.8em' }}>
                  {new Date(note.published || '').toLocaleDateString('en-us', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </a>
            </li>
          ))}
        </ul>
      </main>
    </Html>,
  ))

app.get('/notes/:slug', async (c) => {
  const [id, ext] = c.req.param('slug').split('.')
  const note = await getNote(id)

  if (!note) return c.text('404!', 404)
  if (/^txt$/.test(ext)) return c.text(note?.content?.text || '404')
  if (/^md$/.test(ext)) return c.text(note?.content?.commonmark || '404')
  else {
    const inner = { __html: note.content.html || '404' }
    return c.html(
      <Html>
        <div class='markup'>
          <div dangerouslySetInnerHTML={inner} />
        </div>
      </Html>,
    )
  }
})
app.get('/projects', async (c) => {
  const response = await fetch('https://static.bpev.me/projects.md')
  const note = await parseNote('projects/', await response.text())
  const inner = { __html: (await note?.content?.html) || '404' }
  return c.html(
    <Html>
      <div class='markup'>
        <div dangerouslySetInnerHTML={inner} />
      </div>
    </Html>,
  )
})

app.get('/projects.md', async (c) => {
  const response = await fetch('https://static.bpev.me/projects.md')
  const note = await parseNote('projects/', await response.text())
  return c.text(note?.content?.commonmark || '404')
})
app.get('/projects.txt', async (c) => {
  const response = await fetch('https://static.bpev.me/projects.md')
  const note = await parseNote('projects/', await response.text())
  return c.text(note?.content?.text || '404')
})

app.use('/static/*', serveStatic({ root: './' }))

Deno.serve(app.fetch)
