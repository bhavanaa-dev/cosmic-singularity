import './style.css'

const versions = {
  1: {
    file: './versions/v1-clouds.js',
    title: 'The Beginning',
    description: 'Just particles. No rules. No ambition. Yet.'
  },
  2: {
    file: './versions/v2-motion.js',
    title: 'Things Start Moving',
    description: 'The particles discovered velocity. Chaos followed.'
  },
  3: {
    file: './versions/v3-gravity.js',
    title: 'Gravity Has Entered the Chat',
    description: 'Give particles a target and watch them fall in love.'
  },
  4: {
    file: './versions/v4-vortex.js',
    title: 'Enter the Vortex',
    description: 'Straight lines are boring. Let’s make everything spin.'
  },
  5: {
    file: './versions/v5-vortex3d.js',
    title: 'Into the Third Dimension',
    description: 'The vortex escaped the screen and went 3D.'
  },
  6: {
    file: './versions/v6-galaxy.js',
    title: 'And Then Came the Galaxy',
    description: 'A few equations. Ten thousand particles. One questionable idea.'
  },
  7: {
    file: './versions/v7-galaxy2.js',
    title: 'Make It Pretty',
    description: 'Because physics is cool, but glowing particles are cooler.'
  },
  8: {
    file: './versions/v8-galaxy3.js',
    title: 'Touch the Galaxy',
    description: 'The galaxy finally noticed you were there.'
  },
  9: {
    file: './versions/v9-galaxy3.js',
    title: 'Deeper Into Space',
    description: 'More stars. More dust. More drama.'
  },
  10: {
    file: './versions/v10.js',
    title: 'Cosmic Singularity',
    description:
      'Twenty-four thousand particles pretending they understand the universe.'
  }
}

const versionModules = import.meta.glob('./versions/*.js')

const params = new URLSearchParams(window.location.search)
const requestedVersion = Number(params.get('version'))

const landing = document.getElementById('landing')
const experience = document.getElementById('experience')

/* ------------------------------------------------ */
/* LANDING PAGE                                     */
/* ------------------------------------------------ */

if (!versions[requestedVersion]) {
  startLanding()

  document.getElementById('dive-in').addEventListener('click', () => {
    window.location.href = '?version=10'
  })
}

/* ------------------------------------------------ */
/* EXPERIENCE PAGE                                  */
/* ------------------------------------------------ */

if (versions[requestedVersion]) {
  landing.classList.add('hidden')
  experience.classList.remove('hidden')

  const currentVersion = requestedVersion
  const version = versions[currentVersion]

  const versionSelect = document.getElementById('version-select')
  const versionDescription = document.getElementById('version-description')

  versionSelect.value = currentVersion
  versionDescription.textContent = version.description

  versionSelect.addEventListener('change', (event) => {
    window.location.href = `?version=${event.target.value}`
  })

  const loadVersion = versionModules[version.file]

  if (loadVersion) {
    loadVersion()
  } else {
    console.error(`Version module not found: ${version.file}`)
  }
}

/* ------------------------------------------------ */
/* LANDING PARTICLE FIELD                           */
/* ------------------------------------------------ */

function startLanding() {
  const canvas = document.getElementById('landing-canvas')
  const ctx = canvas.getContext('2d')

  let width
  let height
  let centerX
  let centerY

  const particles = []

  function resize() {
    const ratio = Math.min(window.devicePixelRatio, 2)

    width = window.innerWidth
    height = window.innerHeight

    canvas.width = width * ratio
    canvas.height = height * ratio

    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)

    centerX = width / 2
    centerY = height / 2
  }

  function createParticles() {
    particles.length = 0

    const count = Math.min(2200, Math.floor((width * height) / 700))

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 40 + Math.random() * Math.max(width, height) * 0.65

      particles.push({
        angle,
        radius,
        speed: 0.0008 + Math.random() * 0.002,
        size: Math.random() * 1.4 + 0.2,
        brightness: Math.random(),
        offset: Math.random() * Math.PI * 2
      })
    }
  }

  function draw() {
    ctx.fillStyle = 'rgba(2, 3, 4, 0.18)'
    ctx.fillRect(0, 0, width, height)

    for (const particle of particles) {
      particle.angle += particle.speed

      /*
       * The closer particles get to the center,
       * the faster they orbit.
       */
      const distanceRatio = particle.radius / Math.max(width, height)

      const angle =
        particle.angle +
        Math.sin(particle.radius * 0.008) * 0.8

      const x =
        centerX +
        Math.cos(angle) * particle.radius

      const y =
        centerY +
        Math.sin(angle) *
          particle.radius *
          0.55

      const depth =
        0.35 +
        0.65 *
          Math.abs(
            Math.sin(
              particle.offset + particle.angle
            )
          )

      const alpha =
        (0.12 + depth * 0.7) *
        Math.max(0.2, 1 - distanceRatio * 0.7)

      ctx.beginPath()

      ctx.arc(
        x,
        y,
        particle.size * depth,
        0,
        Math.PI * 2
      )

      ctx.fillStyle = `rgba(
        ${185 + depth * 50},
        ${205 + depth * 40},
        ${200 + depth * 45},
        ${alpha}
      )`

      ctx.fill()
    }

    /*
     * Dark central void.
     */
    const glow = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      Math.min(width, height) * 0.22
    )

    glow.addColorStop(0, 'rgba(0, 0, 0, 1)')
    glow.addColorStop(0.45, 'rgba(0, 0, 0, 0.92)')
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)')

    ctx.fillStyle = glow

    ctx.beginPath()
    ctx.arc(
      centerX,
      centerY,
      Math.min(width, height) * 0.22,
      0,
      Math.PI * 2
    )
    ctx.fill()

    requestAnimationFrame(draw)
  }

  resize()
  createParticles()
  draw()

  window.addEventListener('resize', () => {
    resize()
    createParticles()
  })
}