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

export default function Image({ src, loading = 'eager', note }: Props) {
  const { FAST, NORMAL, DETAILED } = SIZE
  const root: { [type: string]: string } = {
    [FAST]: `${config.URL_STATIC}cache/fast/`,
    [NORMAL]: `${config.URL_STATIC}cache/normal/`,
    [DETAILED]: `${config.URL_STATIC}cache/detailed/`,
    ORIGINAL: `${config.URL_STATIC}`,
  }
  const imagePath = note.slug == 'pages/projects/'
    ? note.slug
    : `notes/${note.slug}/`

  const [name, ext] = src.split('.')
  const upgradedExt = useSignal('WEBP')

  const originalName = `${name}.${ext.toUpperCase()}`
  const upgradedName = `${name}.${upgradedExt.value}`
  const imageMeta = note.images?.[imagePath + originalName]
  const normalSize = imageMeta?.NORMAL
  const fastSize = imageMeta?.FAST
  const [r, g, b, a] = normalSize?.averageColor || [0, 0, 0, 0.5]
  const averageColor = `rgba(${r}, ${g}, ${b}, ${a})`

  const isPortrait = normalSize?.height > normalSize?.width

  return (
    <a
      href={root[NORMAL] + imagePath + upgradedName}
      style={{
        textAlign: 'center',
        display: 'block',
      }}
    >
      <picture
        style={{ maxHeight: '600px' }}
        height={normalSize?.height}
        width={normalSize?.width}
      >
        <source
          srcset={root[NORMAL] + imagePath + upgradedName}
          type='image/webp'
          media='(min-width:650px)'
          height={normalSize?.height}
          width={normalSize?.width}
        />
        <source
          srcset={root[NORMAL] + imagePath + originalName}
          type={`image/${ext}`}
          media='(min-width:650px)'
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
            backgroundColor: averageColor,
            maxHeight: '600px',
            objectFit: 'contain',
            textAlign: 'center',
            width: isPortrait ? 'auto' : normalSize?.width,
            height: isPortrait ? normalSize?.height : 'auto',
          }}
          src={root[NORMAL] + imagePath + upgradedName}
          height={normalSize?.height}
          width={normalSize?.width}
          loading={loading}
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
