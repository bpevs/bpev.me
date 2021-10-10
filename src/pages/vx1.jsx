import { ReactParticles, React } from "../deps.ts";
import debounce from "../utilities/debounce.ts";

const { Particles } = ReactParticles

export default function() {
  return (
    <div className="vx1">
      <div id="particles-js"></div>
      <img
        className="vx1-logo"
        src="/static/vx1/foreground.svg"
        style={{
          left: "50%",
          position: "fixed",
          top: "50%",
          transform: "translate(-50%,-50%)",
          pointerEvents: "none"
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "2%",
          width: "100%",
          height: 60,
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center'
        }}
      >
        <a href="spotify.com">
          <img
            src="/static/vx1/icons/spotify_green.png"
            style={{
              width: 60,
              height: 60,
              margin: 20,
            }}
          />
        </a>
        <a href="youtube.com">
          <img
            src="/static/vx1/icons/youtube.png"
            style={{
              height: 50,
              margin: 20,
              paddingTop: 5,
            }}
          />
        </a>
        <a href="https://music.apple.com/us/album/vx1/1588620712">
          <img
            src="/static/vx1/icons/apple.svg"
            style={{
              height: 60,
              width: 60,
              margin: 20,
            }}
          />
        </a>
      </div>
      <script async defer src="/static/vx1/particles.js"></script>
    </div>
  )
}
