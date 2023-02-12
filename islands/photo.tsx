import { useCallback } from 'preact/hooks'
import { useSignal } from '@preact/signals'

import type { Note } from '@/utilities/notes.ts'
import config from '@/config.ts'
import { SIZE, Size } from '@/utilities/image.ts'

interface Props {
  src: string
  loading: 'lazy' | 'eager'
  note: Note
}

export default function Image({ src, loading = 'lazy', note }: Props) {
  const { FAST, NORMAL, DETAILED } = SIZE
  const root: { [type: string]: string } = {
    [FAST]: `${config.URL_STATIC}cache/fast/`,
    [NORMAL]: `${config.URL_STATIC}cache/normal/`,
    [DETAILED]: `${config.URL_STATIC}cache/detailed/`,
    ORIGINAL: `${config.URL_STATIC}`,
  }
  const imagePath = `notes/${note.slug}/`

  const [name, ext] = src.split('.')
  const upgradedExt = useSignal('WEBP')
  const isLoaded = useSignal(false)

  const originalName = `${name}.${ext.toUpperCase()}`
  const upgradedName = `${name}.${upgradedExt.value}`

  const imageMeta = note.images?.[imagePath + originalName]
  const normalSize = imageMeta?.NORMAL
  const fastSize = imageMeta?.FAST
  const [r, g, b, a] = normalSize?.averageColor || []
  const averageColor = `rgba(${r}, ${g}, ${b}, ${a})`

  return (
    <a
      href={root[NORMAL] + imagePath + upgradedName}
      style={{
        textAlign: 'center',
        display: 'block',
      }}
    >
      <picture>
        <source
          media='(min-width: 900px)'
          srcset={root[NORMAL] + imagePath + upgradedName}
          type='image/webp'
          height={normalSize?.height}
          width={normalSize?.width}
        />
        <source
          media='(min-width: 900px)'
          srcset={root[NORMAL] + imagePath + originalName}
          type={`image/${ext}`}
          height={normalSize?.height}
          width={normalSize?.width}
        />
        <source
          srcset={root[FAST] + imagePath + upgradedName}
          type='image/webp'
          height={fastSize?.height}
          width={fastSize?.width}
        />
        <source
          srcset={root[FAST] + imagePath + originalName}
          type={`image/${ext}`}
          height={fastSize?.height}
          width={fastSize?.width}
        />
        <img
          style={{
            color: averageColor,
            maxHeight: '600px',
            objectFit: 'contain',
            width: 'auto',
            height: 'auto',
            opacity: isLoaded.value ? 1 : 0,
            transition: 'opacity 500ms ease-in 0ms',
            textAlign: 'center',
          }}
          src={root[NORMAL] + imagePath + originalName}
          height={normalSize?.height}
          width={normalSize?.width}
          loading={loading}
          onLoad={useCallback(() => isLoaded.value = true, [])}
          onError={useCallback((e: Event) => {
            console.error((e.target as HTMLImageElement).src)
            upgradedExt.value = ext.toUpperCase()
          }, [upgradedExt, ext])}
        >
        </img>
      </picture>
    </a>
  )
}
