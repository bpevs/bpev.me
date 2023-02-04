export interface Video {
  title: string
  description: string
  lengthSeconds: number
  videoId: string
  published: number
}

export interface Channel {
  author: string
  latestVideos: Video[]
  authorUrl: string
  description: string
  authorThumbnails: Array<{ url: string }>
}

export interface Episode {
  episodeTitle: string
  episodeDescription: string
  mp3: { url: string; duration: number }
  publishDate: number
  videoId: string
}

export interface Podcast {
  episodes: Episode[]
  podcastTitle: string
  podcastUrl: string
  podcastImage: string
  podcastAuthor: string
  podcastDescription: string
}
