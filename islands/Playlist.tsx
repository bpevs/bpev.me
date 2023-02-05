import { useEffect } from 'preact/hooks'
import { useComputed, useSignal } from '@preact/signals'
import { fetchPlaylist, Track } from '@/utilities/playlist.ts'

export default function Playlist({ src }: { src?: string }) {
  const tracks = useSignal<Track[]>([])
  const currIndex = useSignal<number>(0)
  const currTrack = useComputed<Track>(() =>
    tracks.value?.[currIndex.value] || null
  )

  const switchTrack = (index: number) => currIndex.value = index

  useEffect(() => {
    if (src) fetchPlaylist(src).then((resp: Track[]) => tracks.value = resp)
  }, [src])

  return (
    <>
      <div class='controls'>
        <strong>{currTrack.value?.title}</strong>
        <span>{currTrack.value?.length}</span>
        <audio class='player' controls src={currTrack.value?.file}>
          <source class='source' />
        </audio>
        <div class='skip'>
          <span class='back' onClick={() => switchTrack(currIndex.value - 1)}>
            ⏮
          </span>
          <span
            class='forward'
            onClick={() => switchTrack(currIndex.value + 1)}
          >
            ⏭
          </span>
        </div>
      </div>
    </>
  )
}
