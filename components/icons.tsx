export function PauseIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      stroke-width='2'
      stroke-linecap='round'
      stroke-linejoin='round'
      class='feather feather-pause'
    >
      <rect x='6' y='4' width='4' height='16'></rect>
      <rect x='14' y='4' width='4' height='16'></rect>
    </svg>
  )
}

export function PlayIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      stroke-width='2'
      stroke-linecap='round'
      stroke-linejoin='round'
      class='feather feather-pause'
    >
      <polygon points='5 3 19 12 5 21 5 3'></polygon>
    </svg>
  )
}

export function SkipBackButton({ onClick }: { onClick: (e: Event) => void }) {
  return (
    <button class='back' onClick={onClick}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
        class='feather feather-skip-back'
      >
        <polygon points='19 20 9 12 19 4 19 20'></polygon>
        <line x1='5' y1='19' x2='5' y2='5'></line>
      </svg>
    </button>
  )
}

export function SkipForwardButton(
  { onClick }: { onClick: (e: Event) => void },
) {
  return (
    <button class='forward' onClick={onClick}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
        class='feather feather-skip-forward'
      >
        <polygon points='5 4 15 12 5 20 5 4'></polygon>
        <line x1='19' y1='5' x2='19' y2='19'></line>
      </svg>
    </button>
  )
}
