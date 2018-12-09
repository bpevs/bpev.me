Media
=====

The media component can be any number of things, but will primarily be focused on one of these items:
  - [`<Image />`](../MediaImage)
  - [`<Video />`](../MediaVideo)
  - [`<Audio />`](../MediaAudio)

This component is expected to be used in conjunction with Marksy. Use the previously listed components separately if building something outside of that context. This component simply decides which of these to use, and passes props to it.

The reasoning behind using this is that we can use Markdown's standard `![]()` syntax to easily reference a number of different types of content without needing to reach for html syntax. The difference here is that the url passed to the component via markdown is NOT the actual url sent for the content. We will be parsing the url of the requested content locally, and making relevant calls from the Media component.

We are expecting the url to look something like this:

 - __Base Path__: This is the request for static content
 - __File Extension__: Determine content-type
 - __Query Params__: Determine content settings

__Currently we do NOT have a spec for url expectations, but we will have one. This readme is currently just for the concept.__

For embedded items, we will need to make sure our query params don't overlap with theirs

Example URLs
------------------
### Images
- __standard responsive__: https://cdn.bpev.md/photos/my-image.png
- __bleed out of the article__: https://cdn.bpev.md/photos/my-image.png?responsive=fullbleed
- __no progressive version available__: https://cdn.bpev.md/photos/my-image.png?no-progressive=true

### Videos (youtube, vimeo embeds)
- __standard video__: https://cdn.bpev.md/photos/my-video.mp4
- __embed video__: https://www.youtube.com/watch?v=video-id
- __styled video__: https://www.youtube.com/watch?v=video-id&responsive=fullbleed

### Audio (soundcloud, spotify, bandcamp embeds)
- __standard audio__: https://cdn.bpev.md/photos/my-audio.mp3
- __embedded audio__: https://w.soundcloud.com/player/url=some-url


MediaList
========

For lists that are entirely made of [`<Media />`](../Media) components, we should make an album or playlist, depending on the type of content.

This component is expected to be used in conjunction with our Media component, and should be able to be used with that, OR with its more specialize counterparts, [`<Image />`](../MediaImage), [`<Video />`](../MediaImage), or [`<Audio />`](../MediaAudio).
