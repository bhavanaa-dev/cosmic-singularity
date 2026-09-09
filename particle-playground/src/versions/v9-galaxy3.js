import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// ============================================
// SCENE
// ============================================

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
)

camera.position.set(0, 3.5, 11)

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false,
})

renderer.setSize(
  window.innerWidth,
  window.innerHeight
)

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
)

renderer.setClearColor(0x010108)

document.body.appendChild(renderer.domElement)


// ============================================
// CAMERA CONTROLS
// ============================================

const controls = new OrbitControls(
  camera,
  renderer.domElement
)

controls.enableDamping = true
controls.dampingFactor = 0.035

controls.enablePan = false

controls.minDistance = 7
controls.maxDistance = 18


// ============================================
// GALAXY
// ============================================

const particleCount = 22000

const galaxyRadius = 7

const armCount = 4

const spiralStrength = 1.8


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


// ============================================
// ORIGINAL POSITIONS
// ============================================

const originalPositions =
  new Float32Array(
    particleCount * 3
  )


// ============================================
// PARTICLE DATA
// ============================================

const particleSizes =
  new Float32Array(
    particleCount
  )

const particlePhase =
  new Float32Array(
    particleCount
  )


// ============================================
// RANDOM GAUSSIAN
// ============================================

function randomGaussian() {

  let u = 0
  let v = 0

  while (u === 0)
    u = Math.random()

  while (v === 0)
    v = Math.random()

  return Math.sqrt(
    -2 * Math.log(u)
  ) *
    Math.cos(
      2 * Math.PI * v
    )
}


// ============================================
// CREATE GALAXY
// ============================================

for (
  let i = 0;
  i < particleCount;
  i++
) {

  const i3 = i * 3


  // ------------------------------------------
  // DISTANCE FROM CENTER
  // ------------------------------------------

  const radius =
    Math.pow(
      Math.random(),
      0.62
    ) *
    galaxyRadius


  // ------------------------------------------
  // SPIRAL ARM
  // ------------------------------------------

  const arm =
    i % armCount

  const armAngle =
    (arm / armCount) *
    Math.PI *
    2


  // ------------------------------------------
  // SPIRAL
  // ------------------------------------------

  const spiralAngle =
    armAngle +
    radius *
    spiralStrength


  // ------------------------------------------
  // NATURAL IMPERFECTION
  // ------------------------------------------

  const spread =
    0.08 +
    radius *
    0.045

  const angle =
    spiralAngle +
    randomGaussian() *
    spread


  // ------------------------------------------
  // POSITION
  // ------------------------------------------

  const x =
    Math.cos(angle) *
    radius

  const z =
    Math.sin(angle) *
    radius

  const y =
    randomGaussian() *
    (
      0.05 +
      radius * 0.018
    )


  positions[i3] = x
  positions[i3 + 1] = y
  positions[i3 + 2] = z


  originalPositions[i3] = x
  originalPositions[i3 + 1] = y
  originalPositions[i3 + 2] = z


  // ------------------------------------------
  // PARTICLE SIZE
  // ------------------------------------------

  const centerFactor =
    1 -
    radius / galaxyRadius

  particleSizes[i] =
    0.018 +
    Math.random() *
    0.025 +
    centerFactor *
    0.025


  particlePhase[i] =
    Math.random() *
    Math.PI *
    2


  // ------------------------------------------
  // COLOR
  // ------------------------------------------

  const color =
    new THREE.Color()

  const distance =
    radius / galaxyRadius


  if (distance < 0.16) {

    // Bright warm center

    color.setHSL(
      0.10,
      0.95,
      0.92
    )

  } else {

    // Blue → violet

    const hue =
      0.60 +
      distance * 0.13

    const saturation =
      0.72 +
      Math.random() * 0.18

    const lightness =
      0.48 +
      Math.random() * 0.28

    color.setHSL(
      hue,
      saturation,
      lightness
    )
  }


  colors[i3] = color.r
  colors[i3 + 1] = color.g
  colors[i3 + 2] = color.b
}


// ============================================
// GEOMETRY ATTRIBUTES
// ============================================

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


// ============================================
// GALAXY MATERIAL
// ============================================

const material =
  new THREE.PointsMaterial({

    size: 0.035,

    vertexColors: true,

    transparent: true,

    opacity: 0.82,

    blending:
      THREE.AdditiveBlending,

    depthWrite: false,

    sizeAttenuation: true,

  })


const galaxy =
  new THREE.Points(
    geometry,
    material
  )

scene.add(galaxy)


// ============================================
// SECONDARY DUST LAYER
// ============================================

const dustCount = 5000

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
    1.15

  const angle =
    Math.random() *
    Math.PI *
    2

  dustPositions[i3] =
    Math.cos(angle) *
    radius

  dustPositions[i3 + 1] =
    randomGaussian() *
    0.12

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

    size: 0.018,

    color: 0x8c9cff,

    transparent: true,

    opacity: 0.22,

    blending:
      THREE.AdditiveBlending,

    depthWrite: false,

  })

const dust =
  new THREE.Points(
    dustGeometry,
    dustMaterial
  )

scene.add(dust)


// ============================================
// GLOWING CORE
// ============================================

const coreGeometry =
  new THREE.SphereGeometry(
    0.7,
    32,
    32
  )

const coreMaterial =
  new THREE.MeshBasicMaterial({

    color: 0xffc982,

    transparent: true,

    opacity: 0.16,

    blending:
      THREE.AdditiveBlending,

    depthWrite: false,

  })

const core =
  new THREE.Mesh(
    coreGeometry,
    coreMaterial
  )

scene.add(core)


// ============================================
// INNER CORE
// ============================================

const innerCoreGeometry =
  new THREE.SphereGeometry(
    0.28,
    32,
    32
  )

const innerCoreMaterial =
  new THREE.MeshBasicMaterial({

    color: 0xffead0,

    transparent: true,

    opacity: 0.75,

    blending:
      THREE.AdditiveBlending,

    depthWrite: false,

  })

const innerCore =
  new THREE.Mesh(
    innerCoreGeometry,
    innerCoreMaterial
  )

scene.add(innerCore)


// ============================================
// OUTER GLOW
// ============================================

const glowGeometry =
  new THREE.SphereGeometry(
    1.25,
    32,
    32
  )

const glowMaterial =
  new THREE.MeshBasicMaterial({

    color: 0xffa95c,

    transparent: true,

    opacity: 0.035,

    blending:
      THREE.AdditiveBlending,

    depthWrite: false,

  })

const glow =
  new THREE.Mesh(
    glowGeometry,
    glowMaterial
  )

scene.add(glow)


// ============================================
// MOUSE
// ============================================

const mouse =
  new THREE.Vector2()

const targetMouse =
  new THREE.Vector2()

window.addEventListener(
  'mousemove',
  (event) => {

    targetMouse.x =
      (event.clientX /
        window.innerWidth) *
        2 -
      1

    targetMouse.y =
      -(
        event.clientY /
        window.innerHeight
      ) *
        2 +
      1
  }
)


// ============================================
// INTERACTION
// ============================================

const interactionRadius = 2.6

const gravityStrength = 0.014

const returnStrength = 0.003

const friction = 0.94


const velocityX =
  new Float32Array(
    particleCount
  )

const velocityY =
  new Float32Array(
    particleCount
  )

const velocityZ =
  new Float32Array(
    particleCount
  )


// ============================================
// ANIMATION
// ============================================

const clock =
  new THREE.Clock()

function animate() {

  requestAnimationFrame(
    animate
  )

  const time =
    clock.getElapsedTime()


  // ==========================================
  // SMOOTH MOUSE
  // ==========================================

  mouse.lerp(
    targetMouse,
    0.045
  )


  // ==========================================
  // GALAXY ROTATION
  // ==========================================

  galaxy.rotation.y =
    time * 0.018

  dust.rotation.y =
    time * 0.008


  // ==========================================
  // MOUSE POSITION
  // ==========================================

  const mouseX =
    mouse.x *
    galaxyRadius

  const mouseY =
    mouse.y *
    galaxyRadius


  // ==========================================
  // PARTICLE MOTION
  // ==========================================

  for (
    let i = 0;
    i < particleCount;
    i++
  ) {

    const i3 = i * 3


    let x =
      positions[i3]

    let y =
      positions[i3 + 1]

    let z =
      positions[i3 + 2]


    // ----------------------------------------
    // HOME POSITION
    // ----------------------------------------

    const homeX =
      originalPositions[i3]

    const homeY =
      originalPositions[i3 + 1]

    const homeZ =
      originalPositions[i3 + 2]


    // ----------------------------------------
    // SPRING BACK
    // ----------------------------------------

    velocityX[i] +=
      (homeX - x) *
      returnStrength

    velocityY[i] +=
      (homeY - y) *
      returnStrength

    velocityZ[i] +=
      (homeZ - z) *
      returnStrength


    // ----------------------------------------
    // MOUSE GRAVITY
    // ----------------------------------------

    const dx =
      mouseX - x

    const dy =
      mouseY - y

    const distance =
      Math.sqrt(
        dx * dx +
        dy * dy
      )


    if (
      distance <
      interactionRadius
    ) {

      const influence =
        1 -
        distance /
        interactionRadius

      const strength =
        influence *
        influence *
        gravityStrength

      velocityX[i] +=
        dx * strength

      velocityY[i] +=
        dy * strength
    }


    // ----------------------------------------
    // FRICTION
    // ----------------------------------------

    velocityX[i] *= friction
    velocityY[i] *= friction
    velocityZ[i] *= friction


    // ----------------------------------------
    // POSITION
    // ----------------------------------------

    positions[i3] +=
      velocityX[i]

    positions[i3 + 1] +=
      velocityY[i]

    positions[i3 + 2] +=
      velocityZ[i]
  }


  geometry.attributes.position.needsUpdate =
    true


  // ==========================================
  // PARTICLE TWINKLE
  // ==========================================

  const twinkle =
    0.035 +
    Math.sin(time * 1.5) *
    0.003

  material.size =
    twinkle


  // ==========================================
  // CORE BREATHING
  // ==========================================

  const pulse =
    1 +
    Math.sin(time * 1.2) *
    0.035

  core.scale.setScalar(
    pulse
  )

  innerCore.scale.setScalar(
    1 +
    Math.sin(time * 2) *
    0.05
  )

  glow.scale.setScalar(
    1 +
    Math.sin(time * 0.8) *
    0.08
  )


  // ==========================================
  // RENDER
  // ==========================================

  controls.update()

  renderer.render(
    scene,
    camera
  )
}

animate()


// ============================================
// RESIZE
// ============================================

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


// ============================================
// RESET
// ============================================

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

        const i3 = i * 3

        positions[i3] =
          originalPositions[i3]

        positions[i3 + 1] =
          originalPositions[i3 + 1]

        positions[i3 + 2] =
          originalPositions[i3 + 2]

        velocityX[i] = 0
        velocityY[i] = 0
        velocityZ[i] = 0
      }

      geometry.attributes.position.needsUpdate =
        true
    }
  )
}