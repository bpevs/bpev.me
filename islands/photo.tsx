import { useCallback } from 'preact/hooks'
import { useSignal } from '@preact/signals'

import type { Note } from '@/utilities/notes.ts'
import { URL_STATIC } from '@/constants_client.ts'
import { SIZE, Size } from '@/utilities/image.ts'

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
  const webpExtension = useSignal('WEBP')

  const [name, ext] = src.split('.')
  const originalPath = 'notes/' + note.slug + '/' + name + '.' +
    ext.toUpperCase()
  const webpPath = 'notes/' + note.slug + '/' + name + '.' + webpExtension.value

  return (
    <a
      href={URLS.NORMAL + webpPath}
      style={{
        textAlign: 'center',
        display: 'block',
        width: '100%',
      }}
    >
      <picture>
        <source
          srcset={URLS[normalizedSize] + webpPath}
          media='(min-width: 900px)'
          type='image/webp'
        />
        <source srcset={URLS.FAST + webpPath} type='image/webp' />
        <source
          srcset={URLS[normalizedSize] + originalPath}
          media='(min-width: 900px)'
          type={`image/${ext}`}
        />
        <source srcset={URLS.FAST + originalPath} type={`image/${ext}`} />
        <img
          style={{ maxHeight: '600px' }}
          type={`image/${ext}`}
          src={URLS.ORIGINAL + originalPath}
          onError={useCallback((e: Event) => {
            console.error((e.target as HTMLImageElement).src)
            webpExtension.value = ext.toUpperCase()
          }, [webpExtension, ext])}
        />
      </picture>
    </a>
  )
}
