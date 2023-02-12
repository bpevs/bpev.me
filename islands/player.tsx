import { useCallback, useEffect, useRef } from 'preact/hooks'
import { useComputed, useSignal } from '@preact/signals'
import { fetchPlaylist, Track } from '@/utilities/playlist.ts'
import { Only } from '$civility/components/mod.ts'

interface Artist {
  name: string
}

interface Props {
  artist: string
  title: string
  albumArt: string
  tracks: Track[] | string
}

export default function Player(p: Props) {
  const audioPlayer = useRef()
  const progressBar = useRef()

  const tracks = useSignal<Track[]>(Array.isArray(p.tracks) ? p.tracks : [])
  const isPlaying = useSignal(false)
  const currTrackNum = useSignal<number>(0)
  const currTrack = useComputed<Track>(() => tracks.value[currTrackNum.value])
  const currTime = useSignal<number>(0) // time used by audio player
  const currDisplayTime = useSignal<number>(0) // time displayed on progress
  const isSelectingTime = useSignal(false)

  useEffect(() => {
    updateProgressBg()
  }, [currDisplayTime.value, currTrack.value])

  useEffect(() => {
    if (!audioPlayer?.current) return
    else audioPlayer.current.load()
  }, [audioPlayer, currTrack])

  const togglePlayback = useCallback((val) => {
    if (!audioPlayer?.current) return
    isPlaying.value = !isPlaying.value
    if (isPlaying.value) audioPlayer.current.play()
    else audioPlayer.current.pause()
    updateProgressBg()
  }, [audioPlayer, isPlaying.value])

  const updateProgressBg = useCallback(() => {
    const bar = progressBar?.current
    const value = Number(bar?.value || 0)
    const min = Number(bar?.min || 0)
    const max = Number(bar?.max || 100)
    bar.style.backgroundSize = (value - min) * 100 / (max - min) + '% 100%'
  }, [ progressBar ])

  const onChangeTime = useCallback((e) => {
    if (!isSelectingTime.value) {
      audioPlayer.current.currentTime = e.target.value
      currTime.value = Number(e.target.value)
      currDisplayTime.value = Number(e.target.value)
    }
  }, [audioPlayer])

  const onTimeUpdate = useCallback((e) => {
    if (!isSelectingTime.value) {
      currDisplayTime.value = Number(audioPlayer.current.currentTime)
    }
  }, [audioPlayer]);

  useEffect(() => {
    if (typeof p.tracks === 'string') {
      fetchPlaylist(p.tracks)
        .then((resp: Track[]) => tracks.value = resp)
    }
  }, [p.tracks])

  return (
    <div style={{
        backgroundColor: "rgba(128, 128, 128, 0.3)",
        borderRadius: "5px"
      }}>
      <div class='player' style={{
        backgroundColor: "rgba(128, 128, 128, 0.1)",
        padding: "20px"
      }}>
        <Only if={p.albumArt}>
          <img class='album-art' src={p.albumArt} />
        </Only>
        <Only if={p.title}>
          <h2>{p.title}</h2>
        </Only>
        <Only if={p.artist}>
          <h4>{p.artist}</h4>
        </Only>
        <input
          style={{ backgroundColor: "rgba(40, 40, 40, 0.6)", width: "100%" }}
          class='progress'
          type='range'
          value={currDisplayTime.value}
          max={currTrack.value?.length}
          ref={progressBar}
          onChange={onChangeTime}
          onInput={updateProgressBg}
          onMouseDown={() => isSelectingTime.value = true}
          onMouseUp={(e) => {
            isSelectingTime.value = false
            onChangeTime(e)
          }}
        >
        </input>
        <audio
          src={currTrack.value?.file}
          ref={audioPlayer}
          preload="metadata"
          currentTime={currTime.value}
          duration={currTrack.value?.length}
          onEnded={useCallback(() => isPlaying.value = false)}
          onTimeUpdate={onTimeUpdate}
        ></audio>
        <DisplayTime t={currDisplayTime.value} style={{ float: "left" }}/>
        <DisplayTime t={currTrack.value?.length || 0} style={{ float: "right" }}/>
        <div style={{ textAlign: "center", margin: "auto" }}>
          <button
            class='back'
            onClick={() => currTrackNum.value = Math.max(currTrackNum.value - 1, 0) }>
            ⏮
          </button>
          <button
            class='toggle-play'
            style={{ fontSize: "2.5em", verticalAlign: "middle", padding: "0 5px 0 5px" }}
            onClick={togglePlayback}>
            {isPlaying.value ? '⏸' : '▶️'}
          </button>
          <button
            class='forward'
            onClick={() => currTrackNum.value = Math.min(currTrackNum.value + 1, tracks.value.length - 1) }>
            ⏭
          </button>
        </div>
      </div>
      <Only if={tracks.value.length > 1}>
        <div class='tracks'>
          {tracks.value.map((track: Track, index: number) => {
            const isHovered = useSignal(false)
            const isSelected = useComputed(() => currTrackNum.value === index)
            const trackNum = useComputed(() => {
              if (isSelected.value) return isPlaying.value ? '⚛︎' : '▶︎'
              if (isHovered.value) return '▶︎'
              else return index + 1
            })
            return (
              <div
                class={isSelected.value ? 'track selected' : 'track'}
                onClick={() => currTrackNum.value = index}
                onMouseEnter={() => isHovered.value = true}
                onMouseLeave={() => isHovered.value = false}
              >
                <div class='track-number' style={{
                  fontSize: "0.7em",
                  opacity: 0.8,
                  width: "2em"
                }}>{trackNum.value}</div>
                <div class='track-title' style={{
                  marginLeft: "10px",
                  color: "white",
                  flexGrow: 1
                }}>{track.title}</div>
                <div class='track-length' style={{
                  marginRight: "10px",
                  fontSize: "0.8em",
                  opacity: 0.8,
                }}><DisplayTime t={track.length} /></div>
                <noscript>
                  <audio controls preload='metadata' src={track.file}></audio>
                </noscript>
              </div>
            )
          })}
        </div>
      </Only>
    </div>
  )
}

function DisplayTime({ t, style }: { t: number }) {
  const minutes = Math.round(t / 60)
  const seconds = String(Math.round(t % 60)).padStart(2, '0')
  return <span style={style}>{minutes}:{seconds}</span>
}

