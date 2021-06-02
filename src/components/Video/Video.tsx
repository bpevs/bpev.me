import { React } from '../../deps.ts'
import { Vimeo } from "./Vimeo.tsx"
import { Youtube } from "./Youtube.tsx"

const videoFile = /\.(webm|mp4|ogg|ogv)$/
const isVimeo = /vimeo/
// const isYoutube = /youtube\.com\/watch/

export type VideoProps = React.VideoHTMLAttributes<any> & {
  context: any,
}

export function Video({ src = "", ...props }: VideoProps) {
  const videoType = getVideoType(src)

  switch (videoType) {
    case "VIMEO": return <Vimeo {...props} src={src} />
    case "YOUTUBE": return <Youtube {...props} src={src} />
    case "FILE":
    default:
      return <video
        className="center col-12"
        controls
        src={src}
        width="640"
        height="427"
        {...props}
      >
        <source src={src} />
        Your browser does not support this video.
      </video>
  }
}

export function getVideoType(src: string): string | null {
  if  (isVimeo.test(src)) return "VIMEO"
  // if (isYoutube.test(src)) return "YOUTUBE"
  if (videoFile.test(src)) return "FILE"
  return null
}

export function isVideo(src: string): boolean {
  return Boolean(getVideoType(src))
}
