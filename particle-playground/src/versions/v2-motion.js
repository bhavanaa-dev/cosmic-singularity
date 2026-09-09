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

camera.position.z = 8

// ========================
// RENDERER
// ========================

const renderer = new THREE.WebGLRenderer({
  antialias: true
})

renderer.setSize(window.innerWidth, window.innerHeight)

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
)

renderer.setClearColor(0x050505)

document.body.appendChild(renderer.domElement)

// ========================
// PARTICLES
// ========================

const particleCount = 2000
const spread = 10

const positions = new Float32Array(
  particleCount * 3
)

// Every particle gets its own velocity
const velocities = new Float32Array(
  particleCount * 3
)

for (let i = 0; i < particleCount; i++) {

  const i3 = i * 3

  // Starting position
  positions[i3] =
    (Math.random() - 0.5) * spread

  positions[i3 + 1] =
    (Math.random() - 0.5) * spread

  positions[i3 + 2] =
    (Math.random() - 0.5) * spread

  // Starting velocity
  velocities[i3] =
    (Math.random() - 0.5) * 0.01

  velocities[i3 + 1] =
    (Math.random() - 0.5) * 0.01

  velocities[i3 + 2] =
    (Math.random() - 0.5) * 0.01
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
  size: 0.04,
  sizeAttenuation: true
})

// ========================
// PARTICLE SYSTEM
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
// ANIMATION
// ========================

function animate() {

  requestAnimationFrame(animate)

  const positionArray =
    geometry.attributes.position.array

  // Move every particle individually
  for (let i = 0; i < particleCount; i++) {

    const i3 = i * 3

    positionArray[i3] +=
      velocities[i3]

    positionArray[i3 + 1] +=
      velocities[i3 + 1]

    positionArray[i3 + 2] +=
      velocities[i3 + 2]

    // Wrap particles around the edges

    if (positionArray[i3] > spread / 2)
      positionArray[i3] = -spread / 2

    if (positionArray[i3] < -spread / 2)
      positionArray[i3] = spread / 2


    if (positionArray[i3 + 1] > spread / 2)
      positionArray[i3 + 1] = -spread / 2

    if (positionArray[i3 + 1] < -spread / 2)
      positionArray[i3 + 1] = spread / 2


    if (positionArray[i3 + 2] > spread / 2)
      positionArray[i3 + 2] = -spread / 2

    if (positionArray[i3 + 2] < -spread / 2)
      positionArray[i3 + 2] = spread / 2
  }

  // Tell Three.js that particle positions changed
  geometry.attributes.position.needsUpdate = true

  controls.update()

  renderer.render(scene, camera)
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