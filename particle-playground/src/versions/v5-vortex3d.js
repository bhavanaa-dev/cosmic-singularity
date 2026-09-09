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

camera.position.set(0, 2, 12)

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

renderer.setClearColor(0x050505)

document.body.appendChild(renderer.domElement)

// ========================
// PARTICLES
// ========================

const particleCount = 5000

const positions = new Float32Array(
  particleCount * 3
)

// Each particle gets:
// radius
// angle
// height
// orbital speed

const radii = new Float32Array(
  particleCount
)

const angles = new Float32Array(
  particleCount
)

const heights = new Float32Array(
  particleCount
)

const speeds = new Float32Array(
  particleCount
)

for (let i = 0; i < particleCount; i++) {

  // Distance from center
  radii[i] =
    Math.random() * 5 + 0.5

  // Starting angle
  angles[i] =
    Math.random() * Math.PI * 2

  // Vertical position
  heights[i] =
    (Math.random() - 0.5) * 5

  // Particles closer to the center
  // rotate faster
  speeds[i] =
    0.01 / radii[i]
}

// ========================
// INITIAL POSITIONS
// ========================

for (let i = 0; i < particleCount; i++) {

  const angle = angles[i]
  const radius = radii[i]

  const i3 = i * 3

  positions[i3] =
    Math.cos(angle) * radius

  positions[i3 + 1] =
    heights[i]

  positions[i3 + 2] =
    Math.sin(angle) * radius
}

// ========================
// GEOMETRY
// ========================

const geometry = new THREE.BufferGeometry()

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

const material = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.045,
  sizeAttenuation: true
})

// ========================
// PARTICLES
// ========================

const particles = new THREE.Points(
  geometry,
  material
)

scene.add(particles)

// ========================
// CONTROLS
// ========================

const controls = new OrbitControls(
  camera,
  renderer.domElement
)

controls.enableDamping = true
controls.dampingFactor = 0.05

// ========================
// RESET
// ========================

function resetParticles() {

  for (let i = 0; i < particleCount; i++) {

    radii[i] =
      Math.random() * 5 + 0.5

    angles[i] =
      Math.random() * Math.PI * 2

    heights[i] =
      (Math.random() - 0.5) * 5

    speeds[i] =
      0.01 / radii[i]
  }

  updatePositions()
}

// ========================
// UPDATE POSITIONS
// ========================

function updatePositions() {

  const positionArray =
    geometry.attributes.position.array

  for (let i = 0; i < particleCount; i++) {

    const i3 = i * 3

    const angle = angles[i]
    const radius = radii[i]

    positionArray[i3] =
      Math.cos(angle) * radius

    positionArray[i3 + 1] =
      heights[i]

    positionArray[i3 + 2] =
      Math.sin(angle) * radius
  }

  geometry.attributes.position.needsUpdate = true
}

document
  .getElementById('reset')
  .addEventListener(
    'click',
    resetParticles
  )

// ========================
// ANIMATION
// ========================

function animate() {

  requestAnimationFrame(animate)

  // Rotate every particle around
  // the central Y axis.

  for (let i = 0; i < particleCount; i++) {

    angles[i] += speeds[i]
  }

  updatePositions()

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

window.addEventListener('resize', () => {

  camera.aspect =
    window.innerWidth /
    window.innerHeight

  camera.updateProjectionMatrix()

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  )
})