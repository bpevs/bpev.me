import { Note } from './notes.ts'

export default function notesToRSS(notes: Note[]): string {
  return `<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
<channel>
    <title>bpev.me</title>
    <link>https://bpev.me</link>
    <description>I write words. Usually about music or code.</description>
    <atom:link href="https://bpev.me/rss/" rel="self"/>
    <language>en-us</language>
    <lastBuildDate>${new Date()}</lastBuildDate>
    ${
    notes.map((note) => `
<item>
  <title>${note.title}</title>
  <link>https://bpev.me/notes/${note.slug}</link>
  <guid>https://bpev.me/notes/${note.slug}</guid>
  <pubDate>${note.published}</pubDate>
  <description>${
      (note.content?.text || '')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/&/g, '&amp;')
    }</description>
</item>
`).join('')
  }
  </channel>
  <style id="autoconsent-prehide"/>
</rss>`
}
