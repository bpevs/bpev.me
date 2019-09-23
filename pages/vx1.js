import { debounce } from "@civility/utilities"
import React, { useCallback, useEffect, useRef, useState } from "react"
import Particles from "react-particles-js"

const addFrequencies = (total, val = 0) => total + val

const VX1Page = () => {
  const [ size, setSize ] = useState(200)
  const [ rippleActive, setRippleActive ] = useState(false)
  const [ isRunning, setRunning ] = useState(false)
  const [ frequencyData, setFrequencyData ] = useState(null)
  const [ analyser, setAnalyser ] = useState(null)
  const audioEl = useRef(null)

  const endRipple = useCallback(debounce(() => {
    if (isRunning) setRippleActive(false)
  }, 800, true), [ isRunning ])

  const startRipple = useCallback(debounce(() => {
    if (isRunning) {
      setRippleActive(true)
      setTimeout(endRipple, 1000)
    }
  }, 100, true), [ isRunning ])

  const renderFrame = () => {
    if (!isRunning) return

    requestAnimationFrame(renderFrame)
    analyser.getByteFrequencyData(frequencyData)

    const nextSize = Math.round(
      frequencyData
        .slice(0, 7)
        .reduce(addFrequencies, 0) / 8,
    )

    setSize(nextSize)

    if (nextSize > 200) {
      startRipple()
    }
  }

  useEffect(() => {
    const audioContext = new AudioContext()
    const analyser = audioContext.createAnalyser()
    const audioSrc = audioContext.createMediaElementSource(audioEl.current)

    setAnalyser(analyser)
    setFrequencyData(new Uint8Array(analyser.frequencyBinCount))
    audioSrc.connect(analyser).connect(audioContext.destination)

    return () => {
      setRunning(false)
      if (audioContext) audioContext.close()
    }
  }, [])

  useEffect(() => {
    if (isRunning) {
      renderFrame()
    }
  }, [ isRunning ])

  const rippleStyles = {
    borderRadius: "1000px",
    height: 0,
    left: "50%",
    opacity: 0.5,
    position: "fixed",
    top: "50%",
    transform: "translate(-50%, -50%)",
    transition: "all 0s",
    width: 0,
    ...(!rippleActive ? {} : {
      height: 500,
      opacity: 0,
      transition: "all 1s",
      width: 500,
    }),
  }

  return <div className="vx1">
    <Particles className="particles" params={{
      particles: {
        line_linked: {
          color: "#ffffff",
          distance: 0,
          opacity: 0.4,
          width: 1,
        },
        move: {
          attract: { enable: false },
          direction: "bottom",
          enable: true,
          out_mode: "out",
          random: true,
          speed: 0.3,
          straight: false,
        },
        number: {
          value: 160,
        },
        opacity: {
          random: true,
          value: 0.5,
        },
        size: {
          random: true,
          value: 2,
        },
      },
    }} />
    <audio
      controls
      ref={audioEl}
      onEnded={() => setRunning(false)}
      onPlay={() => setRunning(true)}
      style={{
        left: "50%",
        position: "fixed",
        top: "90%",
        transform: "translateX(-50%)",
      }}
    >
      <source src="https://static.bpev.me/music/vx1/The+Problem.mp3" />
    </audio>
    <img src="/static/bp.svg" style={{
      height: size,
      left: "50%",
      position: "fixed",
      top: "50%",
      transform: "translate(-50%,-50%)",
      width: size,
    }} />
    <img src="/static/bp.svg" style={rippleStyles} />
  </div>
}

export default VX1Page
