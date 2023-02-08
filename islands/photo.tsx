import { parse } from '$std/path/mod.ts'
import { URL_STATIC } from '@/constants.ts'
import { SIZE, Size } from '@/utilities/image.ts'
import { Note } from '@/utilities/notes.ts'

interface Props {
  src: string
  size: string
  note: Note
}

export default function Image({ src, size = 'normal', note }: Props) {
  const { FAST, NORMAL, DETAILED } = SIZE
  const URLS: { [type: string]: string } = {
    [FAST]: `${URL_STATIC}cache/fast/`,
    [NORMAL]: `${URL_STATIC}cache/normal/`,
    [DETAILED]: `${URL_STATIC}cache/detailed/`,
    ORIGINAL: `${URL_STATIC}`,
  }
  const normalizedSize = size.toUpperCase() || NORMAL

  const { ext, name } = parse(src)
  const originalPath = 'notes/' + note.slug + '/' + name + ext.toUpperCase()
  const webpPath = 'notes/' + note.slug + '/' + name + '.WEBP'

  return (
    <picture>
      <source srcset={URLS[normalizedSize] + webpPath} />
      <img
        srcset={URLS[normalizedSize] + originalPath}
        src={URLS.ORIGINAL + originalPath}
      />
    </picture>
  )
}
