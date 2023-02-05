export interface Track {
  file: string
  title: string
  length?: number
}

interface IncompleteTrack {
  file?: string
  title?: string
  length?: number
}

// Parser adapted from https://github.com/nickdesaulniers/javascript-playlist-parser/blob/master/src/pls.coffee
export async function fetchPlaylist(sourceUrl: string): Promise<Track[]> {
  const tracks: IncompleteTrack[] = []
  const response = await fetch(sourceUrl)
  const playlistText = await response.text()

  playlistText.trim().split('\n')
    .forEach((line: string): void => {
      const match = line.match(matcher) ?? []
      if (match.length !== 4) return
      const [_, key, index, value] = match
      const normalizedKey = (key || '').toLowerCase()
      const normalizedIndex = Number(index)
      if (!normalizedKey || !(normalizedIndex >= 0)) return

      if (!tracks[normalizedIndex]) tracks[normalizedIndex] = {}
      if (normalizedKey === 'file') tracks[normalizedIndex].file = value
      if (normalizedKey === 'title') tracks[normalizedIndex].title = value
      if (normalizedKey === 'length') {
        tracks[normalizedIndex].length = Number(value)
      }
    })

  return tracks.filter((track) => track && Object.keys(track)) as Track[]
}

const matcher = /(file|title|length)(\d+)=(.+)\r?/i
