import { useEffect } from 'preact/hooks'
import { useComputed, useSignal } from '@preact/signals'
import { fetchPlaylist } from '@/utilities/playlist.ts'

export default function Playlist({ src }: { src: string }) {
  const tracks = useSignal([])
  const count = useSignal(0)
  useEffect(() => {
    if (src) fetchPlaylist(src).then((resp) => tracks.value = resp)
  }, [src])

  console.log('tracks', tracks.value)
  return (
    <div>
    </div>
  )
}
