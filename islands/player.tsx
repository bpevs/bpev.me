import { useCallback, useEffect, useRef } from 'preact/hooks'
import { batch, Signal, useComputed, useSignal } from '@preact/signals'
import { Only } from '$civility/components/mod.ts'
import { asset } from '$fresh/runtime.ts'
import { fetchPlaylist, Track } from '@/utilities/playlist.ts'
import {
  Download,
  Loader,
  PauseIcon,
  PlayIcon,
  SkipBackButton,
  SkipForwardButton,
} from '@/components/icons.tsx'
import Time from '@/components/display_time.tsx'

interface Artist {
  name: string
}

interface Props {
  artist: string
  title: string
  albumArt: string
  tracks: Track[] | string
}

function useAudioPlayer(tracks: Signal<Track[]>) {
  const audioElement = useRef<HTMLAudioElement>(null)
  const progressBar = useRef<HTMLInputElement>(null)

  const isPlaying = useSignal<boolean>(false)
  const isSeeking = useSignal<boolean>(false)

  const currTrackNum = useSignal<number>(0)
  const currTime = useSignal<number>(0) // time used by audio player
  const currDisplayTime = useSignal<number>(0) // time displayed on progress
  const currTrack = useComputed<Track>(() => tracks.value[currTrackNum.value])
  const currDuration = useComputed(() => currTrack.value?.length)

  const play = useCallback(() => {
    if (!audioElement?.current) return
    isPlaying.value = true
    audioElement.current?.play()
  }, [audioElement, isPlaying.value])

  const skip = useCallback((value: number) => {
    batch(() => {
      currTrackNum.value = value
      currTime.value = 0
      currDisplayTime.value = 0
      isPlaying.value = false
      audioElement.current?.load()
    })
  }, [currTrackNum])

  const updateProgress = useCallback(() => {
    const bar = progressBar?.current
    const value = Number(bar?.value || 0)
    const min = Number(bar?.min || 0)
    const max = Number(bar?.max || 100)
    if (bar?.style?.backgroundSize != null) {
      bar.style.backgroundSize = (value - min) * 100 / (max - min) + '% 100%'
    }
  }, [progressBar])

  useEffect(() => {
    if (audioElement?.current) audioElement.current?.load()
  }, [audioElement, currTrack])

  useEffect(updateProgress, [currDisplayTime.value, currTrack.value])

  return {
    ref: { audioElement, progressBar },
    state: {
      isPlaying,
      isSeeking,
      currTrackNum,
      currTrack,
      currTime,
      currDisplayTime,
      currDuration,
    },
    action: {
      updateProgress,
      skip,
      skipBack: useCallback(() => {
        skip(Math.max(currTrackNum.value - 1, 0))
      }, [currTrackNum.value]),
      skipForward: useCallback(() => {
        skip(Math.min(currTrackNum.value + 1, tracks.value.length - 1))
      }, [currTrackNum.value, tracks.value.length]),
      togglePlayback: useCallback(() => {
        if (!audioElement?.current) return
        isPlaying.value = !isPlaying.value
        if (isPlaying.value) audioElement.current?.play()
        else audioElement.current?.pause()
        updateProgress()
      }, [audioElement, isPlaying.value]),
      pause: useCallback(() => {
        if (!audioElement?.current) return
        isPlaying.value = false
        audioElement.current?.pause()
      }, [audioElement, isPlaying.value]),
      play,
    },
    listener: {
      onChangeTime: useCallback((e: Event) => {
        if (!isSeeking.value && audioElement.current?.currentTime) {
          const value = (e.target as HTMLInputElement).value
          audioElement.current.currentTime = Number(value)
          currTime.value = Number(value)
          currDisplayTime.value = Number(value)
        }
      }, [audioElement]),
      onTimeUpdate: useCallback(() => {
        if (!isSeeking.value) {
          currDisplayTime.value = Number(audioElement.current?.currentTime)
        }
      }, [audioElement]),
    },
  }
}

export default function Player(p: Props) {
  const isLoading = useSignal<boolean>(true)
  const tracks = useSignal<Track[]>(Array.isArray(p.tracks) ? p.tracks : [])
  const { action, state, listener, ref } = useAudioPlayer(tracks)

  useEffect(() => {
    if (typeof p.tracks === 'string') {
      fetchPlaylist(p.tracks)
        .then((resp: Track[]) => {
          tracks.value = resp
        })
    }
  }, [p.tracks])

  return (
    <div class='player'>
      <div class='player-header'>
        <Only if={Boolean(p.albumArt)}>
          <img class='album-art' src={p.albumArt} />
        </Only>
        <Only if={Boolean(p.title)}>
          <h2>{p.title}</h2>
        </Only>
        <Only if={Boolean(p.artist)}>
          <h4>{p.artist}</h4>
        </Only>
        <Only if={Boolean(state.currTrack.value?.title)}>
          <h4>{state.currTrack.value?.title}</h4>
        </Only>
        <input
          style={{ backgroundColor: 'rgba(40, 40, 40, 0.6)', width: '100%' }}
          class='progress'
          type='range'
          value={state.currDisplayTime.value}
          max={state.currDuration.value}
          ref={ref.progressBar}
          onChange={listener.onChangeTime}
          onInput={action.updateProgress}
          onMouseDown={() => state.isSeeking.value = true}
          onMouseUp={(e) => {
            state.isSeeking.value = false
            listener.onChangeTime(e)
          }}
        >
        </input>
        <audio
          src={state.currTrack.value?.file}
          ref={ref.audioElement}
          preload='metadata'
          onEnded={action.pause}
          onTimeUpdate={listener.onTimeUpdate}
          // @ts-ignore ts doesn't recognize
          currentTime={state.currTime.value}
          // @ts-ignore ts doesn't recognize
          duration={state.currDuration.value}
          onLoadStart={useCallback(() => isLoading.value = true, [])}
          onProgress={useCallback(() => isLoading.value = false, [])}
        >
        </audio>
        <Time t={state.currDisplayTime.value || 0} style={{ float: 'left' }} />
        <Time t={state.currDuration.value || 0} style={{ float: 'right' }} />
        <div style={{ textAlign: 'center', margin: 'auto', paddingTop: '5px' }}>
          <SkipBackButton onClick={action.skipBack} />
          <Only if={!isLoading.value}>
            <button class='toggle-play' onClick={action.togglePlayback}>
              {state.isPlaying.value ? <PauseIcon /> : <PlayIcon />}
            </button>
          </Only>
          <Only if={isLoading.value}>
            <Loader />
          </Only>
          <SkipForwardButton onClick={action.skipForward} />
        </div>
      </div>
      <Only if={tracks.value.length > 1}>
        <div class='tracks'>
          {tracks.value.map((track: Track, index: number) => {
            const isHovered = useSignal(false)
            const trackNum = useComputed(() => {
              if (state.currTrackNum.value === index) {
                return state.isPlaying.value ? <PauseIcon /> : <PlayIcon />
              } else if (isHovered.value) return <PlayIcon />
              else return index + 1
            })

            return (
              <div
                class={state.currTrackNum.value === index
                  ? 'track selected'
                  : 'track'}
                onClick={useCallback(() => action.skip(index), [index])}
                onMouseEnter={useCallback(() => isHovered.value = true, [])}
                onMouseLeave={useCallback(() => isHovered.value = false, [])}
              >
                <div class='track-number'>{trackNum.value}</div>
                <div class='track-title'>{track.title}</div>
                <div class='track-length'>
                  <Time t={track.length || 0} />
                </div>
                <a class='track-download' href={track.file}>
                  <Download />
                </a>
              </div>
            )
          })}
        </div>
      </Only>
    </div>
  )
}
