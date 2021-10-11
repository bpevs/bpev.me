import { ReactParticles, React } from "../deps.ts";
import debounce from "../utilities/debounce.ts";

const { Particles } = ReactParticles

const foregroundStyles = {
  left: "50%",
  position: "fixed",
  top: "50%",
  transform: "translate(-50%,-50%)",
  height: "50%",
  zIndex: 10,
  display: 'flex',
  minHeight: 500,
  justifyContent: 'center',
  alignContent: 'center',
  flexDirection: 'column',
};

const logoStyles = {
  pointerEvents: "none",
  height: "80%",
  display: 'flex',
}

const iconContainerStyles = {
  width: "100%",
  height: "10%",
  display: 'flex',
  justifyContent: 'center',
  alignContent: 'start'
};

const iconStyles = {
  height: 40,
  margin: 10,
};

const iconRoot = '/static/vx1/icons';

function Icon({ pic, href }) {
  return (
    <a href={href}>
      <img src={`/static/vx1/icons/${pic}`} style={iconStyles} />
    </a>
  )
}

export default function() {
  return (
    <div className="vx1">
      <div id="particles-js"></div>
      <div className="foreground" style={foregroundStyles}>
        <img
          className="vx1-logo"
          src="/static/vx1/foreground.svg"
          style={logoStyles}
        />
        <iframe
          style={{ border: 0, width: '100%', margin: 10 }}
          src="https://bandcamp.com/EmbeddedPlayer/album=159817452/size=large/bgcol=333333/linkcol=0f91ff/tracklist=false/artwork=none/transparent=true/"
          seamless>
          <a href="https://ivebencrazy.bandcamp.com/album/vx1">VX1 by Ben Pevsner</a>
        </iframe>
        <div style={iconContainerStyles}>
          <Icon
            href="https://open.spotify.com/album/1JJC0Q5UIoChlJIMxLEeRs?si=iEtjZB3KQj61xvyesAy5eA&dl_branch=1"
            pic="spotify_green.png"
          />
          <Icon
            href="https://music.apple.com/us/album/vx1/1588620712"
            pic="apple.svg"
          />
          <Icon
            href="https://music.youtube.com/playlist?list=OLAK5uy_mm18Al7x1C2WzoF_4LWp60hJ5tvWapIJ8"
            pic="youtube.png"
          />
          <Icon
            href="https://soundcloud.com/benpevsner/sets/vx1"
            pic="soundcloud.png"
          />
        </div>
      </div>

      <script async defer src="/static/vx1/particles.js"></script>
    </div>
  )
}
