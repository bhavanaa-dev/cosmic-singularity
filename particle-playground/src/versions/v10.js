import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// ============================================================
// V10 — COSMIC SINGULARITY
// ============================================================


// ============================================================
// SCENE
// ============================================================

const scene = new THREE.Scene()

scene.background = new THREE.Color(0x010108)


// ============================================================
// CAMERA
// ============================================================

const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  100
)

camera.position.set(
  0,
  3.8,
  11.5
)


// ============================================================
// RENDERER
// ============================================================

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'high-performance'
})

renderer.setSize(
  window.innerWidth,
  window.innerHeight
)

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
)

renderer.setClearColor(0x010108)

document.body.appendChild(
  renderer.domElement
)


// ============================================================
// ORBIT CONTROLS
// ============================================================

const controls = new OrbitControls(
  camera,
  renderer.domElement
)

controls.enableDamping = true
controls.dampingFactor = 0.04

controls.enablePan = false

controls.enableZoom = true

controls.minDistance = 5
controls.maxDistance = 20

// Full vertical rotation
controls.minPolarAngle = 0.15
controls.maxPolarAngle = Math.PI - 0.15

controls.target.set(
  0,
  0,
  0
)


// ============================================================
// GALAXY SETTINGS
// ============================================================

const particleCount = 24000

const galaxyRadius = 7

const armCount = 4

const spiralStrength = 1.8


// ============================================================
// GALAXY GEOMETRY
// ============================================================

const geometry =
  new THREE.BufferGeometry()

const positions =
  new Float32Array(
    particleCount * 3
  )

const colors =
  new Float32Array(
    particleCount * 3
  )


// ============================================================
// BASE POSITIONS
// ============================================================

const basePositions =
  new Float32Array(
    particleCount * 3
  )


// ============================================================
// PARTICLE PHASE
// ============================================================

const particlePhase =
  new Float32Array(
    particleCount
  )


// ============================================================
// RANDOM GAUSSIAN
// ============================================================

function randomGaussian() {

  let u = 0
  let v = 0

  while (u === 0) {
    u = Math.random()
  }

  while (v === 0) {
    v = Math.random()
  }

  return (
    Math.sqrt(
      -2 * Math.log(u)
    ) *
    Math.cos(
      2 * Math.PI * v
    )
  )
}


// ============================================================
// CREATE GALAXY
// ============================================================

for (
  let i = 0;
  i < particleCount;
  i++
) {

  const i3 = i * 3


  // ----------------------------------------------------------
  // RADIUS
  // ----------------------------------------------------------

  const radius =
    Math.pow(
      Math.random(),
      0.62
    ) *
    galaxyRadius


  // ----------------------------------------------------------
  // SPIRAL ARM
  // ----------------------------------------------------------

  const arm =
    i % armCount


  const armAngle =
    (
      arm /
      armCount
    ) *
    Math.PI *
    2


  // ----------------------------------------------------------
  // SPIRAL
  // ----------------------------------------------------------

  const spiralAngle =
    armAngle +
    radius *
    spiralStrength


  // ----------------------------------------------------------
  // NATURAL SPREAD
  // ----------------------------------------------------------

  const spread =
    0.075 +
    radius *
    0.04


  const angle =
    spiralAngle +
    randomGaussian() *
    spread


  // ----------------------------------------------------------
  // POSITION
  // ----------------------------------------------------------

  const x =
    Math.cos(angle) *
    radius

  const z =
    Math.sin(angle) *
    radius

  const y =
    randomGaussian() *
    (
      0.045 +
      radius *
      0.018
    )


  positions[i3] =
    x

  positions[i3 + 1] =
    y

  positions[i3 + 2] =
    z


  basePositions[i3] =
    x

  basePositions[i3 + 1] =
    y

  basePositions[i3 + 2] =
    z


  // ----------------------------------------------------------
  // PARTICLE PHASE
  // ----------------------------------------------------------

  particlePhase[i] =
    Math.random() *
    Math.PI *
    2


  // ----------------------------------------------------------
  // COLOR
  // ----------------------------------------------------------

  const color =
    new THREE.Color()

  const normalizedRadius =
    radius /
    galaxyRadius


  if (
    normalizedRadius < 0.15
  ) {

    // Warm glowing center

    color.setHSL(
      0.09,
      0.95,
      0.92
    )

  } else {

    // Blue → violet

    const hue =
      0.60 +
      normalizedRadius *
      0.13


    color.setHSL(
      hue,
      0.72 +
        Math.random() *
        0.18,
      0.5 +
        Math.random() *
        0.28
    )
  }


  colors[i3] =
    color.r

  colors[i3 + 1] =
    color.g

  colors[i3 + 2] =
    color.b
}


// ============================================================
// GEOMETRY ATTRIBUTES
// ============================================================

geometry.setAttribute(
  'position',
  new THREE.BufferAttribute(
    positions,
    3
  )
)

geometry.setAttribute(
  'color',
  new THREE.BufferAttribute(
    colors,
    3
  )
)


// ============================================================
// MAIN GALAXY PARTICLES
// ============================================================

const material =
  new THREE.PointsMaterial({

    size: 0.034,

    vertexColors: true,

    transparent: true,

    opacity: 0.86,

    blending:
      THREE.AdditiveBlending,

    depthWrite: false,

    sizeAttenuation: true

  })


const galaxy =
  new THREE.Points(
    geometry,
    material
  )

scene.add(galaxy)


// ============================================================
// SECONDARY DUST
// ============================================================

const dustCount = 6000

const dustGeometry =
  new THREE.BufferGeometry()

const dustPositions =
  new Float32Array(
    dustCount * 3
  )


for (
  let i = 0;
  i < dustCount;
  i++
) {

  const i3 = i * 3

  const radius =
    Math.random() *
    galaxyRadius *
    1.12


  const angle =
    Math.random() *
    Math.PI *
    2


  dustPositions[i3] =
    Math.cos(angle) *
    radius


  dustPositions[i3 + 1] =
    randomGaussian() *
    0.11


  dustPositions[i3 + 2] =
    Math.sin(angle) *
    radius
}


dustGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(
    dustPositions,
    3
  )
)


const dustMaterial =
  new THREE.PointsMaterial({

    color: 0x899aff,

    size: 0.018,

    transparent: true,

    opacity: 0.17,

    blending:
      THREE.AdditiveBlending,

    depthWrite: false

  })


const dust =
  new THREE.Points(
    dustGeometry,
    dustMaterial
  )

scene.add(dust)


// ============================================================
// BACKGROUND STARS
// ============================================================

const starCount = 4000

const starGeometry =
  new THREE.BufferGeometry()

const starPositions =
  new Float32Array(
    starCount * 3
  )


for (
  let i = 0;
  i < starCount;
  i++
) {

  const i3 = i * 3

  const radius =
    16 +
    Math.random() *
    25


  const theta =
    Math.random() *
    Math.PI *
    2


  const phi =
    Math.acos(
      2 * Math.random() - 1
    )


  starPositions[i3] =
    radius *
    Math.sin(phi) *
    Math.cos(theta)


  starPositions[i3 + 1] =
    radius *
    Math.cos(phi)


  starPositions[i3 + 2] =
    radius *
    Math.sin(phi) *
    Math.sin(theta)
}


starGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(
    starPositions,
    3
  )
)


const starMaterial =
  new THREE.PointsMaterial({

    color: 0xbac7ff,

    size: 0.024,

    transparent: true,

    opacity: 0.5,

    blending:
      THREE.AdditiveBlending,

    depthWrite: false

  })


const stars =
  new THREE.Points(
    starGeometry,
    starMaterial
  )

scene.add(stars)


// ============================================================
// GLOWING CORE
// ============================================================

const core =
  new THREE.Mesh(

    new THREE.SphereGeometry(
      0.62,
      32,
      32
    ),

    new THREE.MeshBasicMaterial({

      color: 0xffc47d,

      transparent: true,

      opacity: 0.18,

      blending:
        THREE.AdditiveBlending,

      depthWrite: false

    })
  )

scene.add(core)


// ============================================================
// INNER CORE
// ============================================================

const innerCore =
  new THREE.Mesh(

    new THREE.SphereGeometry(
      0.24,
      32,
      32
    ),

    new THREE.MeshBasicMaterial({

      color: 0xffeee0,

      transparent: true,

      opacity: 0.78,

      blending:
        THREE.AdditiveBlending,

      depthWrite: false

    })
  )

scene.add(innerCore)


// ============================================================
// OUTER GLOW
// ============================================================

const outerGlow =
  new THREE.Mesh(

    new THREE.SphereGeometry(
      1.25,
      32,
      32
    ),

    new THREE.MeshBasicMaterial({

      color: 0xff9c52,

      transparent: true,

      opacity: 0.035,

      blending:
        THREE.AdditiveBlending,

      depthWrite: false

    })
  )

scene.add(outerGlow)


// ============================================================
// MOUSE
// ============================================================

const mouse =
  new THREE.Vector2(
    999,
    999
  )

const smoothMouse =
  new THREE.Vector2(
    999,
    999
  )


// ============================================================
// MOUSE MOVEMENT
// ============================================================

window.addEventListener(
  'pointermove',
  (event) => {

    mouse.x =
      (
        event.clientX /
        window.innerWidth
      ) *
        2 -
      1


    mouse.y =
      -(
        event.clientY /
        window.innerHeight
      ) *
        2 +
      1
  }
)


// ============================================================
// MOUSE LEAVES SCREEN
// ============================================================

window.addEventListener(
  'pointerleave',
  () => {

    mouse.set(
      999,
      999
    )
  }
)


// ============================================================
// INTERACTION
// ============================================================

// Small influence area
const rippleRadius = 2.7

// Gentle bending
const rippleStrength = 0.20

// Soft swirling
const swirlStrength = 0.09


// ============================================================
// CLOCK
// ============================================================

const clock =
  new THREE.Clock()


// ============================================================
// ANIMATION
// ============================================================

function animate() {

  requestAnimationFrame(
    animate
  )


  const time =
    clock.getElapsedTime()


  // ========================================================
  // SMOOTH MOUSE
  // ========================================================

  smoothMouse.lerp(
    mouse,
    0.055
  )


  // ========================================================
  // GALAXY ROTATION
  // ========================================================

  galaxy.rotation.y =
    time * 0.015


  dust.rotation.y =
    time * 0.007


  stars.rotation.y =
    time * 0.001


  // ========================================================
  // MOUSE POSITION
  // ========================================================

  const mouseX =
    smoothMouse.x *
    galaxyRadius

  const mouseY =
    smoothMouse.y *
    galaxyRadius


  // ========================================================
  // PARTICLE RIPPLE
  // ========================================================

  for (
    let i = 0;
    i < particleCount;
    i++
  ) {

    const i3 =
      i * 3


    // ------------------------------------------------------
    // ORIGINAL POSITION
    // ------------------------------------------------------

    const baseX =
      basePositions[i3]

    const baseY =
      basePositions[i3 + 1]

    const baseZ =
      basePositions[i3 + 2]


    // ------------------------------------------------------
    // DISTANCE TO MOUSE
    // ------------------------------------------------------

    const dx =
      mouseX -
      baseX

    const dy =
      mouseY -
      baseY


    const distance =
      Math.sqrt(
        dx * dx +
        dy * dy
      )


    // ------------------------------------------------------
    // START FROM PERFECT GALAXY
    // ------------------------------------------------------

    let x =
      baseX

    let y =
      baseY

    let z =
      baseZ


    // ------------------------------------------------------
    // SOFT FIELD
    // ------------------------------------------------------

    if (
      distance <
      rippleRadius
    ) {

      const normalized =
        1 -
        distance /
        rippleRadius


      // Smoothstep
      const influence =
        normalized *
        normalized *
        (
          3 -
          2 * normalized
        )


      // ----------------------------------------------------
      // RADIAL BEND
      // ----------------------------------------------------

      x +=
        dx *
        influence *
        rippleStrength


      y +=
        dy *
        influence *
        rippleStrength


      // ----------------------------------------------------
      // SWIRL
      // ----------------------------------------------------

      x +=
        -dy *
        influence *
        swirlStrength


      y +=
        dx *
        influence *
        swirlStrength


      // ----------------------------------------------------
      // SUBTLE 3D WAVE
      // ----------------------------------------------------

      z +=
        Math.sin(
          distance * 3 -
          time * 2
        ) *
        influence *
        0.07
    }


    // ------------------------------------------------------
    // TINY NATURAL MOTION
    // ------------------------------------------------------

    y +=
      Math.sin(
        time * 0.7 +
        particlePhase[i]
      ) *
      0.006


    // ------------------------------------------------------
    // UPDATE
    // ------------------------------------------------------

    positions[i3] =
      x

    positions[i3 + 1] =
      y

    positions[i3 + 2] =
      z
  }


  // ========================================================
  // UPDATE GPU BUFFER
  // ========================================================

  geometry.attributes
    .position
    .needsUpdate = true


  // ========================================================
  // CORE BREATHING
  // ========================================================

  const pulse =
    1 +
    Math.sin(
      time * 1.1
    ) *
    0.035


  core.scale.setScalar(
    pulse
  )


  innerCore.scale.setScalar(
    1 +
    Math.sin(
      time * 1.8
    ) *
    0.045
  )


  outerGlow.scale.setScalar(
    1 +
    Math.sin(
      time * 0.7
    ) *
    0.08
  )


  // ========================================================
  // CORE ROTATION
  // ========================================================

  core.rotation.y =
    time * 0.1


  outerGlow.rotation.y =
    -time * 0.04


  // ========================================================
  // ORBIT CONTROLS
  // ========================================================

  controls.update()


  // ========================================================
  // RENDER
  // ========================================================

  renderer.render(
    scene,
    camera
  )
}

animate()


// ============================================================
// RESIZE
// ============================================================

window.addEventListener(
  'resize',
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight

    camera.updateProjectionMatrix()

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    )
  }
)


// ============================================================
// RESET
// ============================================================

const resetButton =
  document.getElementById(
    'reset'
  )


if (resetButton) {

  resetButton.addEventListener(
    'click',
    () => {

      for (
        let i = 0;
        i < particleCount;
        i++
      ) {

        const i3 =
          i * 3


        positions[i3] =
          basePositions[i3]

        positions[i3 + 1] =
          basePositions[i3 + 1]

        positions[i3 + 2] =
          basePositions[i3 + 2]
      }


      geometry.attributes
        .position
        .needsUpdate = true
    }
  )
}