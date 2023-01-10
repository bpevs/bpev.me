import "https://deno.land/x/dotenv/load.ts";
import { serve } from "https://deno.land/std@0.137.0/http/server.ts";
import type { Channel, Episode, Podcast, Video } from "./types.ts";

const env = Deno.env.get;
const NUM_LATEST_VIDEOS: number = Number(env("NUM_LATEST_VIDEOS")) || 10;
const INVIDIOUS: string = env("INVIDIOUS_INSTANCE") || "";
const INVIDIOUS_VIDEO: string = env("INVIDIOUS_VIDEO_INSTANCE") || "";
const EXPIRE_CHANNEL_CACHE_MS: number =
  Number(env("EXPIRE_CHANNEL_CACHE_MS")) || 1000 * 60 * 10;

const channelCache: { [url: string]: Channel } = {};
const videoCache: { [url: string]: Video } = {};

serve(async function handler(req: Request): Promise<Response> {
  const [type, channelId] = (new URL(req.url)).pathname.split("/").slice(1, 3);

  if (type === "channel" && channelId) {
    const podcast = parseInvidious(await fetchChannel(channelId));
    podcast.podcastUrl = req.url;
    return new Response(createPodcastXML(podcast), {
      status: 200,
      headers: { "content-type": "application/rss+xml; charset=utf-8" },
    });
  }

  return new Response("No ChannelId Given", { status: 404 });
});

/**
 * Fetch Channel Data from Invidious, then request data for individual videos,
 * since `channel.latestVideos` does not include description data.
 * Cache channels for a short time to avoid taxing Invidious instance.
 * Cache videos indefinitely for the same reason.
 */
async function fetchChannel(channelId: string): Promise<Channel> {
  const BASE_URL = `https://${INVIDIOUS}/api/v1`;
  const FIELDS = "author,latestVideos,authorUrl,description,authorThumbnails";
  const url = `${BASE_URL}/channels/${channelId}?fields=${FIELDS}`;
  if (channelCache[url]) return channelCache[url];

  console.log(`Fetching channel: ${channelId}`);
  console.log(url);

  const channel = await fetch(url).then((resp) => resp.json());
  const latestVideos = (channel.latestVideos || []).slice(0, NUM_LATEST_VIDEOS);
  channel.latestVideos = await Promise.all(
    latestVideos.map(async ({ videoId }: Video): Promise<Video> => {
      const FIELDS = "title,description,lengthSeconds,videoId,published";
      const url = `${BASE_URL}/videos/${videoId}?fields=${FIELDS}`;
      if (!videoCache[url]) {
        console.log(`  Fetching Episode: ${videoId}`);
        videoCache[url] = await fetch(url).then((resp) => resp.json());
      }
      return videoCache[url];
    }),
  );

  channelCache[url] = channel;
  setTimeout(() => {
    delete channelCache[url];
  }, EXPIRE_CHANNEL_CACHE_MS);

  return channel;
}

// Parse Invidious response into "podcast-like" data format.
function parseInvidious(
  { author, latestVideos, authorUrl, description, authorThumbnails }: Channel,
): Podcast {
  const INSTANCE = INVIDIOUS_VIDEO || INVIDIOUS;
  const BASE_VIDEO_URL = `https://${INSTANCE}/latest_version`;

  return {
    podcastTitle: author,
    podcastUrl: authorUrl,
    podcastAuthor: author,
    podcastDescription: description,
    podcastImage: (authorThumbnails || []).reverse()[0]?.url || "",
    episodes: latestVideos.map((video: Video): Episode => ({
      episodeTitle: video.title,
      episodeDescription: video.description,
      mp3: {
        duration: video.lengthSeconds,
        url: `${BASE_VIDEO_URL}?id=${video.videoId}&amp;itag=139`,
      },
      publishDate: video.published,
      videoId: video.videoId,
    })).filter((video:Episode) => {
      return video.mp3.duration > 120;
    }),
  };
}

// Formats an xml rss response, based loosely on itunes spec.
function createPodcastXML({
  episodes = [],
  podcastTitle,
  podcastUrl,
  podcastImage,
  podcastAuthor,
  podcastDescription,
}: Podcast): string {
  const episodeXML = episodes.map(({
    episodeTitle,
    episodeDescription,
    mp3,
    publishDate,
    videoId,
  }: Episode): string => `
<item>
  <title>${episodeTitle}</title>
  <description><![CDATA[${episodeDescription}]]></description>
  <pubDate>${String(new Date(publishDate * 1000))}</pubDate>
  <guid isPermaLink="false">${videoId}</guid>
  <enclosure url="${mp3.url}" length="${mp3.duration}" type="audio/mpeg" />
</item>`).join("\n");

  return `\
<?xml version="1.0" encoding="UTF-8"?>
<rss
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:googleplay="http://www.google.com/schemas/play-podcasts/1.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:media="http://www.rssboard.org/media-rss"
  version="2.0"
>
  <channel>
    <title>${podcastTitle}</title>
    <link>${podcastUrl}</link>
    <language>en-us</language>
    <atom:link href="${podcastUrl}" rel="self" type="application/rss+xml" />
    <copyright>${podcastAuthor}</copyright>
    <itunes:author>${podcastAuthor}</itunes:author>
    <itunes:summary>${podcastDescription}</itunes:summary>
    <itunes:category text="Invidious" />
    <description><![CDATA[${podcastDescription}]]></description>
    <itunes:owner>
      <itunes:name>${podcastAuthor}</itunes:name>
    </itunes:owner>
    <itunes:type>episodic</itunes:type>
    <itunes:image href="${podcastImage}" />
    <itunes:explicit>false</itunes:explicit>
    ${episodeXML}
  </channel>
</rss>
`;
}
