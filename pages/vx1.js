import React from "react"
import Particles from "react-particles-js"


const VX1Page = () => {
  return <div className="vx1">
    <Particles className="particles" params={{
      particles: {
        line_linked: {
          color: "#ffffff",
          distance: 0,
          enable_auto: false,
          opacity: 0.4,
          width: 1,
        },
        move: {
          "attract.enable": false,
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
    }}/>
    <img src="/static/cover.png" />
  </div>
}


export default VX1Page
