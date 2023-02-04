const matcher = /(file|title|length)(\d+)=(.+)\r?/i

interface Track {
  file: string
  title: string
  length: number
}

// Parser adapted from https://github.com/nickdesaulniers/javascript-playlist-parser/blob/master/src/pls.coffee
export async function fetchPlaylist(sourceUrl: string): Promise<Track[]> {
  const tracks = []
  const response = await fetch(sourceUrl, {
    mode: 'cors',
    headers: new Headers({
      'Access-Control-Allow-Origin': 'https://static.bpev.me',
    }),
  })
consile.log(response)
  const playlistText = await response.text()
  playlistText.trim().split('\n').forEach((line) => {
    const match = line.match(matcher)
    if (match?.length !== 4) return
    const [_, key, index, value] = match
    if (!tracks[index]) tracks[index] = {}
    const track = tracks[index]
    const normalizedKey = key.toLowerCase()
    if (normalizedKey === 'file') track[normalizedKey] = value
    else if (normalizedKey === 'length') track[normalizedKey] = Number(value)
    else if (normalizedKey === 'title') track[normalizedKey] = value
  })
  return tracks.filter((track) => Object.keys(track))
}
