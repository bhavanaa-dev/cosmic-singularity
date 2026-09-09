import './style.css'


/* ================================================= */
/* COSMIC AUDIO                                      */
/* ================================================= */

let audioContext = null
let masterGain = null

let backgroundMusic = null
let musicStarted = false
let muted = false


/* ================================================= */
/* INITIALIZE AUDIO                                  */
/* ================================================= */

function initAudio() {

  if (!audioContext) {

    audioContext = new AudioContext()

    masterGain =
      audioContext.createGain()

    masterGain.gain.value =
      muted ? 0 : 0.55

    masterGain.connect(
      audioContext.destination
    )
  }

  if (
    audioContext.state === 'suspended'
  ) {

    audioContext.resume()

  }

}


/* ================================================= */
/* UI SOUND                                          */
/* ================================================= */

function playUISound(
  frequency,
  duration,
  volume
) {

  if (
    !audioContext ||
    muted
  ) return


  const now =
    audioContext.currentTime


  const oscillator =
    audioContext.createOscillator()

  const gain =
    audioContext.createGain()


  oscillator.type =
    'sine'


  oscillator.frequency.setValueAtTime(
    frequency,
    now
  )


  gain.gain.setValueAtTime(
    0.001,
    now
  )


  gain.gain.exponentialRampToValueAtTime(
    volume,
    now + 0.025
  )


  gain.gain.exponentialRampToValueAtTime(
    0.001,
    now + duration
  )


  oscillator.connect(gain)

  gain.connect(masterGain)


  oscillator.start(now)

  oscillator.stop(
    now + duration
  )

}


/* ================================================= */
/* DIVE SOUND                                        */
/* ================================================= */

function playDiveSound() {

  if (
    !audioContext ||
    muted
  ) return


  /* Same sound style as version switching */

  playUISound(
    520,
    0.12,
    0.11
  )


  setTimeout(() => {

    playUISound(
      760,
      0.14,
      0.08
    )

  }, 70)

}


/* ================================================= */
/* BACKGROUND MUSIC                                  */
/* ================================================= */

function createBackgroundMusic() {

  if (backgroundMusic) {
    return
  }


  backgroundMusic =
    new Audio(
      '/music/rexlambo-space.mp3'
    )


  backgroundMusic.loop =
    true

  backgroundMusic.preload =
    'auto'

  backgroundMusic.volume =
    0


  backgroundMusic.addEventListener(
    'error',
    () => {

      console.error(
        '❌ Cosmic music could not be loaded.',
        backgroundMusic.error
      )

    }
  )

}


function startBackgroundMusic() {

  if (!backgroundMusic) {
    createBackgroundMusic()
  }


  if (musicStarted) {

    if (
      backgroundMusic.paused
    ) {

      backgroundMusic.play()
        .catch(error => {

          console.error(
            'Music playback blocked:',
            error
          )

        })

    }

    return

  }


  musicStarted =
    true


  backgroundMusic.volume =
    0.05


  const playPromise =
    backgroundMusic.play()


  if (playPromise) {

    playPromise
      .then(() => {

        console.log(
          '🎵 Cosmic music started'
        )

        fadeMusicIn()

      })
      .catch(error => {

        console.error(
          '❌ Music playback blocked:',
          error
        )

        musicStarted =
          false

      })

  }

}


/* ================================================= */
/* MUSIC FADE IN                                     */
/* ================================================= */

function fadeMusicIn() {

  if (!backgroundMusic) return


  let volume =
    backgroundMusic.volume


  const fade =
    setInterval(() => {

      if (!backgroundMusic) {

        clearInterval(fade)

        return

      }


      if (muted) {

        backgroundMusic.volume =
          0

        return

      }


      volume +=
        0.025


      backgroundMusic.volume =
        Math.min(
          volume,
          0.85
        )


      if (
        volume >= 0.85
      ) {

        clearInterval(fade)

      }

    }, 100)

}


/* ================================================= */
/* VERSION DATA                                      */
/* ================================================= */

const versions = {

  1: {
    file: './versions/v1-clouds.js',
    title: 'The Beginning',
    description:
      'Just particles. No rules. No ambition. Yet.'
  },

  2: {
    file: './versions/v2-motion.js',
    title: 'Things Start Moving',
    description:
      'The particles discovered velocity. Chaos followed.'
  },

  3: {
    file: './versions/v3-gravity.js',
    title: 'Gravity Has Entered the Chat',
    description:
      'Give particles a target and watch them fall in love.'
  },

  4: {
    file: './versions/v4-vortex.js',
    title: 'Enter the Vortex',
    description:
      'Straight lines are boring. Let’s make everything spin.'
  },

  5: {
    file: './versions/v5-vortex3d.js',
    title: 'Into the Third Dimension',
    description:
      'The vortex escaped the screen and went 3D.'
  },

  6: {
    file: './versions/v6-galaxy.js',
    title: 'And Then Came the Galaxy',
    description:
      'A few equations. Ten thousand particles. One questionable idea.'
  },

  7: {
    file: './versions/v7-galaxy2.js',
    title: 'Make It Pretty',
    description:
      'Because physics is cool, but glowing particles are cooler.'
  },

  8: {
    file: './versions/v8-galaxy3.js',
    title: 'Touch the Galaxy',
    description:
      'The galaxy finally noticed you were there.'
  },

  9: {
    file: './versions/v9-galaxy3.js',
    title: 'Deeper Into Space',
    description:
      'More stars. More dust. More drama.'
  },

  10: {
    file: './versions/v10.js',
    title: 'Cosmic Singularity',
    description:
      'Twenty-four thousand particles pretending they understand the universe.'
  }

}


/* ================================================= */
/* VERSION MODULES                                   */
/* ================================================= */

const versionModules =
  import.meta.glob(
    './versions/*.js'
  )


/* ================================================= */
/* ELEMENTS                                          */
/* ================================================= */

const landing =
  document.getElementById(
    'landing'
  )

const experience =
  document.getElementById(
    'experience'
  )

const diveButton =
  document.getElementById(
    'dive-in'
  )

const versionSelect =
  document.getElementById(
    'version-select'
  )

const versionDescription =
  document.getElementById(
    'version-description'
  )

const resetButton =
  document.getElementById(
    'reset'
  )

const soundToggle =
  document.getElementById(
    'sound-toggle'
  )


/* ================================================= */
/* URL / CURRENT VERSION                             */
/* ================================================= */

const params =
  new URLSearchParams(
    window.location.search
  )


let currentVersion =
  Number(
    params.get('version')
  )


const hasVersion =
  versions[currentVersion] !== undefined

const isCanvasOnly =
  params.get('canvasOnly') === '1' ||
  window.self !== window.top

let activeFrame = null
let currentPendingFrame = null

let landingAnimId = null

function stopLanding() {
  if (landingAnimId) {
    cancelAnimationFrame(landingAnimId)
    landingAnimId = null
  }
}

function setFrameVersion(versionNumber) {
  const container =
    document.getElementById('viewport-container')

  if (!container) return

  const targetUrl = `?canvasOnly=1&version=${versionNumber}`

  const newFrame =
    document.createElement('iframe')

  newFrame.className =
    'version-frame'

  newFrame.title =
    'Cosmic Particles'

  newFrame.style.opacity =
    activeFrame ? '0' : '1'

  newFrame.style.transition =
    'opacity 0.25s ease'

  newFrame.src =
    targetUrl

  currentPendingFrame =
    newFrame

  container.appendChild(
    newFrame
  )

  newFrame.onload = () => {
    if (currentPendingFrame !== newFrame) {
      newFrame.remove()
      return
    }

    newFrame.style.opacity = '1'

    const frames =
      container.querySelectorAll('iframe.version-frame')

    frames.forEach(f => {
      if (f !== newFrame) {
        setTimeout(() => {
          f.remove()
        }, 120)
      }
    })

    activeFrame = newFrame
  }
}


/* ================================================= */
/* LOAD VERSION (USED IN CANVAS-ONLY VIEWPORT)       */
/* ================================================= */

function loadVersion(
  versionNumber
) {

  const version =
    versions[versionNumber]

  if (!version) return


  const loader =
    versionModules[version.file]


  if (!loader) {

    console.error(
      `Version module not found: ${version.file}`
    )

    return

  }


  loader()

}


/* ================================================= */
/* SHOW EXPERIENCE                                   */
/* ================================================= */

function showExperience(
  versionNumber
) {

  currentVersion =
    versionNumber

  stopLanding()


  if (landing) {

    landing.classList.add(
      'hidden'
    )

  }


  if (experience) {

    experience.classList.remove(
      'hidden'
    )

  }


  if (versionSelect) {

    versionSelect.value =
      currentVersion

  }


  if (versionDescription && versions[currentVersion]) {

    versionDescription.textContent =
      versions[
        currentVersion
      ].description

  }


  setFrameVersion(
    currentVersion
  )

}


/* ================================================= */
/* MODE HANDLING                                     */
/* ================================================= */

if (isCanvasOnly) {

  /*
   * Inside the viewport iframe:
   * Only run the selected particle simulation.
   * No audio, no landing, no header event listeners.
   */

  document.body.classList.add('canvas-only')

  const targetVersion =
    hasVersion ? currentVersion : 10

  loadVersion(targetVersion)

} else {

  /*
   * Top-level host page:
   * Controls audio, landing transition, header UI, and viewport frame.
   */

  createBackgroundMusic()


  /* --------------------------------------------- */
  /* DIVE IN                                       */
  /* --------------------------------------------- */

  if (diveButton) {

    diveButton.addEventListener(
      'click',
      async () => {

        initAudio()

        await audioContext.resume()

        playDiveSound()

        startBackgroundMusic()

        setTimeout(() => {

          showExperience(10)

          window.history.replaceState(
            {},
            '',
            '?version=10'
          )

        }, 650)

      }
    )

  }


  /* --------------------------------------------- */
  /* VERSION SELECTOR                              */
  /* --------------------------------------------- */

  if (versionSelect) {

    versionSelect.addEventListener(
      'change',
      event => {

        initAudio()

        playUISound(
          520,
          0.12,
          0.11
        )

        setTimeout(() => {

          playUISound(
            760,
            0.14,
            0.08
          )

        }, 70)

        const selectedVersion =
          Number(
            event.target.value
          )

        currentVersion =
          selectedVersion

        if (versionDescription && versions[selectedVersion]) {

          versionDescription.textContent =
            versions[
              selectedVersion
            ].description

        }

        window.history.replaceState(
          {},
          '',
          `?version=${selectedVersion}`
        )

        setFrameVersion(
          selectedVersion
        )

      }
    )

  }


  /* --------------------------------------------- */
  /* RESET                                         */
  /* --------------------------------------------- */

  if (resetButton) {

    resetButton.addEventListener(
      'click',
      () => {

        initAudio()

        playUISound(
          520,
          0.12,
          0.08
        )

        try {

          const iframeReset =
            activeFrame?.contentDocument?.getElementById('reset')

          if (iframeReset) {

            iframeReset.click()

          }

        } catch (e) {

          console.error('Reset error:', e)

        }

      }
    )

  }


  /* --------------------------------------------- */
  /* SOUND TOGGLE                                  */
  /* --------------------------------------------- */

  if (soundToggle) {

    soundToggle.addEventListener(
      'click',
      async () => {

        initAudio()

        await audioContext.resume()

        if (
          !musicStarted
        ) {

          startBackgroundMusic()

        }

        muted =
          !muted

        if (muted) {

          if (backgroundMusic) {

            backgroundMusic.volume =
              0

          }

          if (masterGain) {

            masterGain.gain.value =
              0

          }

          soundToggle.textContent =
            'SOUND OFF'

        } else {

          if (masterGain) {

            masterGain.gain.value =
              0.55

          }

          if (backgroundMusic) {

            backgroundMusic.volume =
              0.85

          }

          soundToggle.textContent =
            'SOUND ON'

        }

      }
    )

  }


  /* --------------------------------------------- */
  /* BROWSER BACK / FORWARD                        */
  /* --------------------------------------------- */

  window.addEventListener(
    'popstate',
    () => {

      const popParams =
        new URLSearchParams(
          window.location.search
        )

      const v =
        Number(
          popParams.get('version')
        )

      if (versions[v]) {

        currentVersion =
          v

        if (versionSelect) {

          versionSelect.value =
            v

        }

        if (versionDescription) {

          versionDescription.textContent =
            versions[v].description

        }

        setFrameVersion(v)

      }

    }
  )


  /* --------------------------------------------- */
  /* INITIAL VIEW                                  */
  /* --------------------------------------------- */

  if (hasVersion) {

    showExperience(
      currentVersion
    )

  } else {

    startLanding()

  }

}


/* ================================================= */
/* LANDING PARTICLES                                 */
/* ================================================= */

function startLanding() {

  const canvas =
    document.getElementById(
      'landing-canvas'
    )

  if (!canvas) return


  const ctx =
    canvas.getContext(
      '2d'
    )


  let width
  let height

  let centerX
  let centerY


  const particles = []


  /* --------------------------------------------- */
  /* RESIZE                                        */
  /* --------------------------------------------- */

  function resize() {

    const ratio =
      Math.min(
        window.devicePixelRatio,
        2
      )


    width =
      window.innerWidth

    height =
      window.innerHeight


    canvas.width =
      width * ratio

    canvas.height =
      height * ratio


    canvas.style.width =
      `${width}px`

    canvas.style.height =
      `${height}px`


    ctx.setTransform(
      ratio,
      0,
      0,
      ratio,
      0,
      0
    )


    centerX =
      width / 2

    centerY =
      height / 2

  }


  /* --------------------------------------------- */
  /* CREATE PARTICLES                              */
  /* --------------------------------------------- */

  function createParticles() {

    particles.length =
      0


    const count =
      Math.min(
        2200,
        Math.floor(
          (width * height) / 700
        )
      )


    for (
      let i = 0;
      i < count;
      i++
    ) {

      const angle =
        Math.random() *
        Math.PI *
        2


      const radius =
        40 +
        Math.random() *
        Math.max(
          width,
          height
        ) *
        0.65


      particles.push({

        angle,

        radius,

        speed:
          0.0008 +
          Math.random() *
          0.002,

        size:
          Math.random() *
          1.4 +
          0.2,

        offset:
          Math.random() *
          Math.PI *
          2

      })

    }

  }


  /* --------------------------------------------- */
  /* DRAW                                          */
  /* --------------------------------------------- */

  function draw() {

    ctx.fillStyle =
      'rgba(2, 3, 4, 0.18)'


    ctx.fillRect(
      0,
      0,
      width,
      height
    )


    for (
      const particle of particles
    ) {

      particle.angle +=
        particle.speed


      const distanceRatio =
        particle.radius /
        Math.max(
          width,
          height
        )


      const angle =
        particle.angle +
        Math.sin(
          particle.radius *
          0.008
        ) *
        0.8


      const x =
        centerX +
        Math.cos(angle) *
        particle.radius


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
            particle.offset +
            particle.angle
          )
        )


      const alpha =
        (
          0.12 +
          depth * 0.7
        ) *
        Math.max(
          0.2,
          1 -
          distanceRatio * 0.7
        )


      ctx.beginPath()


      ctx.arc(
        x,
        y,
        particle.size * depth,
        0,
        Math.PI * 2
      )


      ctx.fillStyle =
        `rgba(
          ${185 + depth * 50},
          ${205 + depth * 40},
          ${200 + depth * 45},
          ${alpha}
        )`


      ctx.fill()

    }


    /* ----------------------------------------- */
    /* CENTRAL VOID                              */
    /* ----------------------------------------- */

    const glow =
      ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        Math.min(
          width,
          height
        ) * 0.22
      )


    glow.addColorStop(
      0,
      'rgba(0, 0, 0, 1)'
    )

    glow.addColorStop(
      0.45,
      'rgba(0, 0, 0, 0.92)'
    )

    glow.addColorStop(
      1,
      'rgba(0, 0, 0, 0)'
    )


    ctx.fillStyle =
      glow


    ctx.beginPath()


    ctx.arc(
      centerX,
      centerY,
      Math.min(
        width,
        height
      ) * 0.22,
      0,
      Math.PI * 2
    )


    ctx.fill()


    landingAnimId =
      requestAnimationFrame(
        draw
      )

  }


  resize()

  createParticles()

  draw()


  window.addEventListener(
    'resize',
    () => {

      resize()

      createParticles()

    }
  )

}