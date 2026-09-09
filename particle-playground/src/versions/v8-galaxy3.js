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

camera.position.set(0, 4, 12)

const renderer = new THREE.WebGLRenderer({
  antialias: true,
})

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x020208)

document.body.appendChild(renderer.domElement)


// ============================================
// CONTROLS
// ============================================

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true
controls.dampingFactor = 0.04

controls.minDistance = 7
controls.maxDistance = 20

controls.enablePan = false


// ============================================
// GALAXY SETTINGS
// ============================================

const particleCount = 18000

const galaxyRadius = 7
const armCount = 4

const spiralStrength = 1.8

const particles = new THREE.BufferGeometry()

const positions = new Float32Array(particleCount * 3)
const colors = new Float32Array(particleCount * 3)


// ============================================
// ORIGINAL POSITIONS
// ============================================

const originalPositions = new Float32Array(
  particleCount * 3
)


// ============================================
// PARTICLE VELOCITY
// ============================================

const velocityX = new Float32Array(particleCount)
const velocityY = new Float32Array(particleCount)
const velocityZ = new Float32Array(particleCount)


// ============================================
// RANDOM HELPERS
// ============================================

function randomGaussian() {
  let u = 0
  let v = 0

  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()

  return Math.sqrt(-2 * Math.log(u)) *
    Math.cos(2 * Math.PI * v)
}


// ============================================
// CREATE GALAXY
// ============================================

for (let i = 0; i < particleCount; i++) {

  const i3 = i * 3

  // Distance from center
  const radius =
    Math.pow(Math.random(), 0.65) * galaxyRadius

  // Which spiral arm?
  const arm =
    i % armCount

  const armAngle =
    (arm / armCount) * Math.PI * 2

  // Spiral shape
  const spiralAngle =
    armAngle +
    radius * spiralStrength

  // Natural randomness
  const randomOffset =
    randomGaussian() *
    (0.12 + radius * 0.035)

  const angle =
    spiralAngle + randomOffset

  // Slight vertical thickness
  const height =
    randomGaussian() *
    (0.08 + radius * 0.025)

  const x =
    Math.cos(angle) * radius

  const z =
    Math.sin(angle) * radius

  const y = height

  positions[i3] = x
  positions[i3 + 1] = y
  positions[i3 + 2] = z

  originalPositions[i3] = x
  originalPositions[i3 + 1] = y
  originalPositions[i3 + 2] = z


  // ==========================================
  // COLORS
  // ==========================================

  const color = new THREE.Color()

  const distance =
    radius / galaxyRadius

  if (distance < 0.25) {

    // Warm center
    color.setHSL(
      0.08,
      0.9,
      0.85
    )

  } else {

    // Blue / purple outer galaxy
    color.setHSL(
      0.62 + distance * 0.12,
      0.75,
      0.55 + Math.random() * 0.25
    )
  }

  colors[i3] = color.r
  colors[i3 + 1] = color.g
  colors[i3 + 2] = color.b
}


// ============================================
// GEOMETRY
// ============================================

particles.setAttribute(
  'position',
  new THREE.BufferAttribute(positions, 3)
)

particles.setAttribute(
  'color',
  new THREE.BufferAttribute(colors, 3)
)


// ============================================
// PARTICLE MATERIAL
// ============================================

const material = new THREE.PointsMaterial({

  size: 0.035,

  vertexColors: true,

  transparent: true,

  opacity: 0.85,

  blending: THREE.AdditiveBlending,

  depthWrite: false,

})


// ============================================
// GALAXY
// ============================================

const galaxy =
  new THREE.Points(
    particles,
    material
  )

scene.add(galaxy)


// ============================================
// GLOWING CORE
// ============================================

const coreGeometry =
  new THREE.SphereGeometry(
    0.65,
    32,
    32
  )

const coreMaterial =
  new THREE.MeshBasicMaterial({

    color: 0xffd6a3,

    transparent: true,

    opacity: 0.18,

    blending: THREE.AdditiveBlending,

  })

const core =
  new THREE.Mesh(
    coreGeometry,
    coreMaterial
  )

scene.add(core)


// Inner core

const innerCoreGeometry =
  new THREE.SphereGeometry(
    0.25,
    32,
    32
  )

const innerCoreMaterial =
  new THREE.MeshBasicMaterial({

    color: 0xffe9c7,

    transparent: true,

    opacity: 0.7,

    blending: THREE.AdditiveBlending,

  })

const innerCore =
  new THREE.Mesh(
    innerCoreGeometry,
    innerCoreMaterial
  )

scene.add(innerCore)


// ============================================
// MOUSE
// ============================================

const mouse = new THREE.Vector2()

const targetMouse = new THREE.Vector2()

window.addEventListener(
  'mousemove',
  (event) => {

    targetMouse.x =
      (event.clientX / window.innerWidth) * 2 - 1

    targetMouse.y =
      -(event.clientY / window.innerHeight) * 2 + 1
  }
)


// ============================================
// INTERACTION SETTINGS
// ============================================

// How far the mouse influences particles
const interactionRadius = 2.8

// Gentle gravitational pull
const gravityStrength = 0.018

// How quickly particles return
const returnStrength = 0.004

// Particle inertia
const friction = 0.92


// ============================================
// ANIMATION
// ============================================

const clock = new THREE.Clock()

function animate() {

  requestAnimationFrame(animate)

  const time =
    clock.getElapsedTime()


  // ==========================================
  // SMOOTH MOUSE
  // ==========================================

  mouse.lerp(
    targetMouse,
    0.06
  )


  // ==========================================
  // GALAXY ROTATION
  // ==========================================

  galaxy.rotation.y =
    time * 0.025

  core.rotation.y =
    time * 0.01


  // ==========================================
  // MOUSE POSITION
  // ==========================================

  const mouseX =
    mouse.x * galaxyRadius

  const mouseY =
    mouse.y * galaxyRadius


  // ==========================================
  // PARTICLE PHYSICS
  // ==========================================

  for (let i = 0; i < particleCount; i++) {

    const i3 = i * 3

    let x =
      positions[i3]

    let y =
      positions[i3 + 1]

    let z =
      positions[i3 + 2]


    // ----------------------------------------
    // RETURN TO ORIGINAL GALAXY
    // ----------------------------------------

    const homeX =
      originalPositions[i3]

    const homeY =
      originalPositions[i3 + 1]

    const homeZ =
      originalPositions[i3 + 2]


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
    // DISTANCE FROM MOUSE
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


    // ----------------------------------------
    // SOFT MOUSE GRAVITY
    // ----------------------------------------

    if (
      distance < interactionRadius &&
      distance > 0.05
    ) {

      // Smooth falloff
      const influence =
        1 -
        distance /
        interactionRadius

      const strength =
        influence *
        influence *
        gravityStrength


      velocityX[i] +=
        dx *
        strength

      velocityY[i] +=
        dy *
        strength

      // Tiny vertical influence
      velocityZ[i] +=
        Math.sin(time + i) *
        strength *
        0.15
    }


    // ----------------------------------------
    // FRICTION
    // ----------------------------------------

    velocityX[i] *= friction
    velocityY[i] *= friction
    velocityZ[i] *= friction


    // ----------------------------------------
    // UPDATE POSITION
    // ----------------------------------------

    positions[i3] +=
      velocityX[i]

    positions[i3 + 1] +=
      velocityY[i]

    positions[i3 + 2] +=
      velocityZ[i]
  }


  // Tell Three.js positions changed
  particles.attributes.position.needsUpdate = true


  // ==========================================
  // CORE BREATHING
  // ==========================================

  const pulse =
    1 +
    Math.sin(time * 1.5) *
    0.04

  core.scale.setScalar(
    pulse
  )

  innerCore.scale.setScalar(
    1 +
    Math.sin(time * 2) *
    0.06
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
  document.getElementById('reset')

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

      particles.attributes.position.needsUpdate = true
    }
  )
}