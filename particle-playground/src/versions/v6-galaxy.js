import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// ========================
// SCENE
// ========================

const scene = new THREE.Scene()

// ========================
// CAMERA
// ========================

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

camera.position.set(0, 4, 14)

// ========================
// RENDERER
// ========================

const renderer = new THREE.WebGLRenderer({
  antialias: true
})

renderer.setSize(
  window.innerWidth,
  window.innerHeight
)

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
)

renderer.setClearColor(0x020204)

document.body.appendChild(renderer.domElement)

// ========================
// GALAXY SETTINGS
// ========================

const particleCount = 10000

const galaxyRadius = 6

const armCount = 4

const spiralStrength = 1.5

// ========================
// PARTICLE DATA
// ========================

const positions = new Float32Array(
  particleCount * 3
)

const velocities = new Float32Array(
  particleCount * 3
)

const radii = new Float32Array(
  particleCount
)

const angles = new Float32Array(
  particleCount
)

const speeds = new Float32Array(
  particleCount
)


// ========================
// CREATE GALAXY
// ========================

for (let i = 0; i < particleCount; i++) {

  const i3 = i * 3

  // ------------------------
  // Distance from center
  // ------------------------

  const radius =
    Math.pow(Math.random(), 1.8) *
    galaxyRadius

  radii[i] = radius


  // ------------------------
  // Which spiral arm?
  // ------------------------

  const arm =
    i % armCount

  const armAngle =
    (arm / armCount) *
    Math.PI * 2


  // ------------------------
  // Spiral angle
  // ------------------------

  const spiralAngle =
    armAngle +
    radius * spiralStrength


  // ------------------------
  // Randomness
  // ------------------------

  const randomX =
    (Math.random() - 0.5) *
    0.35

  const randomY =
    (Math.random() - 0.5) *
    0.35

  const randomZ =
    (Math.random() - 0.5) *
    0.35


  // ------------------------
  // Position
  // ------------------------

  positions[i3] =
    Math.cos(spiralAngle) *
    radius +
    randomX

  positions[i3 + 1] =
    randomY *
    (1 - radius / galaxyRadius)

  positions[i3 + 2] =
    Math.sin(spiralAngle) *
    radius +
    randomZ


  // ------------------------
  // Orbital speed
  // ------------------------

  speeds[i] =
    0.004 /
    (radius + 0.5)
}


// ========================
// GEOMETRY
// ========================

const geometry =
  new THREE.BufferGeometry()

geometry.setAttribute(
  'position',
  new THREE.BufferAttribute(
    positions,
    3
  )
)


// ========================
// MATERIAL
// ========================

const material =
  new THREE.PointsMaterial({

    color: 0xffffff,

    size: 0.035,

    sizeAttenuation: true
  })


// ========================
// GALAXY
// ========================

const galaxy =
  new THREE.Points(
    geometry,
    material
  )

scene.add(galaxy)


// ========================
// CONTROLS
// ========================

const controls =
  new OrbitControls(
    camera,
    renderer.domElement
  )

controls.enableDamping = true

controls.dampingFactor = 0.05


// ========================
// RESET
// ========================

function resetGalaxy() {

  for (let i = 0; i < particleCount; i++) {

    const i3 = i * 3

    const radius =
      Math.pow(Math.random(), 1.8) *
      galaxyRadius

    radii[i] = radius

    const arm =
      i % armCount

    const armAngle =
      (arm / armCount) *
      Math.PI * 2

    const spiralAngle =
      armAngle +
      radius * spiralStrength

    const randomX =
      (Math.random() - 0.5) *
      0.35

    const randomY =
      (Math.random() - 0.5) *
      0.35

    const randomZ =
      (Math.random() - 0.5) *
      0.35

    positions[i3] =
      Math.cos(spiralAngle) *
      radius +
      randomX

    positions[i3 + 1] =
      randomY *
      (1 - radius / galaxyRadius)

    positions[i3 + 2] =
      Math.sin(spiralAngle) *
      radius +
      randomZ

    speeds[i] =
      0.004 /
      (radius + 0.5)
  }

  geometry.attributes.position.needsUpdate = true
}


document
  .getElementById('reset')
  .addEventListener(
    'click',
    resetGalaxy
  )


// ========================
// ANIMATION
// ========================

function animate() {

  requestAnimationFrame(
    animate
  )

  const positionArray =
    geometry.attributes.position.array


  for (let i = 0; i < particleCount; i++) {

    const i3 = i * 3

    // ------------------------
    // Rotate particle
    // ------------------------

    const x =
      positionArray[i3]

    const z =
      positionArray[i3 + 2]


    // Find current angle
    let angle =
      Math.atan2(z, x)


    // Find current radius
    const radius =
      Math.sqrt(
        x * x +
        z * z
      )


    // Increase angle
    angle += speeds[i]


    // New position
    positionArray[i3] =
      Math.cos(angle) *
      radius

    positionArray[i3 + 2] =
      Math.sin(angle) *
      radius
  }


  geometry.attributes.position.needsUpdate = true


  controls.update()

  renderer.render(
    scene,
    camera
  )
}

animate()


// ========================
// RESIZE
// ========================

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