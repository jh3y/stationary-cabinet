import gsap from 'https://cdn.skypack.dev/gsap'
import Draggable from 'https://cdn.skypack.dev/gsap/Draggable'

gsap.registerPlugin(Draggable)

const BENDY =
  'M128 90C128 90 112 90 100 90C60.2336 90 25.9124 131.811 37 170C47.2288 205.232 100 202 122 210C144 218 150 230.932 150 250C150 269.068 141 285 122 290C103 295 47.2288 294.768 37 330C25.9124 368.189 60.2336 410 100 410C106 410 128 410 128 410'

const DIALOG = document.querySelector('.dialog')
const HEADER = DIALOG.querySelector('.dialog__header')

const MORPH = gsap.timeline({ paused: true }).to('.snek__body', {
  attr: {
    d: BENDY,
  },
})

const ROTATION = 10
gsap.set('.snek__tongue', { transformOrigin: '0 50%' })
gsap.set('.snek__eye--white', { transformOrigin: '50% 50%', scale: 0 })
const TONGUE_WAG = gsap.timeline().fromTo(
  '.snek__tongue',
  {
    rotate: -ROTATION,
  },
  {
    rotate: ROTATION,
    yoyo: true,
    repeat: -1,
    duration: 0.05,
  }
)

const PROGRESS_MAPPER = gsap.utils.mapRange(50, 20, 0, 1)

let grow

const resizeObserver = new ResizeObserver(entries => {
  const { width } = entries[0].contentRect
  // Equate the width to vmin
  const VMIN = Math.floor(Math.min(window.innerHeight, window.innerWidth) / 100)
  const LENGTH_IN_VMIN = gsap.utils.clamp(20, 50, Math.floor(width) / VMIN)
  const PROGRESS = PROGRESS_MAPPER(LENGTH_IN_VMIN)
  MORPH.progress(PROGRESS)
  // Upon entry make the snake eyes shocked and timeout the return
  
  if (!grow) {
    grow = gsap.to('.snek__eye--white', {
      onStart: () => TONGUE_WAG.pause(),
      onComplete: () => {
        grow = undefined
        gsap.to('.snek__eye--white', {
          scale: 0,
          duration: 0.25,
          onStart: () => TONGUE_WAG.play()
        })
      },
      duration: 0.25,
      scale: 1.1
    })
  }
})

resizeObserver.observe(DIALOG)

Draggable.create(DIALOG, {
  trigger: HEADER,
})
