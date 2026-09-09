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

const particleCount = 2000
const spread = 10

// Position of every particle
const positions = new Float32Array(
  particleCount * 3
)

// Velocity of every particle
const velocities = new Float32Array(
  particleCount * 3
)

for (let i = 0; i < particleCount; i++) {

  const i3 = i * 3

  // ------------------------
  // Starting position
  // ------------------------

  positions[i3] =
    (Math.random() - 0.5) * spread

  positions[i3 + 1] =
    (Math.random() - 0.5) * spread

  positions[i3 + 2] =
    (Math.random() - 0.5) * spread


  // ------------------------
  // Starting velocity
  // ------------------------

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
// MOUSE
// ========================

// Mouse position in normalized coordinates.
// Range:
// x = -1 to +1
// y = -1 to +1

const mouse = {
  x: 0,
  y: 0
}

window.addEventListener('mousemove', (event) => {

  mouse.x =
    (event.clientX / window.innerWidth) * 2 - 1

  mouse.y =
    -(event.clientY / window.innerHeight) * 2 + 1
})

function resetParticles() {
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3

    // Reset position
    positions[i3] =
      (Math.random() - 0.5) * spread

    positions[i3 + 1] =
      (Math.random() - 0.5) * spread

    positions[i3 + 2] =
      (Math.random() - 0.5) * spread

    // Reset velocity
    velocities[i3] =
      (Math.random() - 0.5) * 0.01

    velocities[i3 + 1] =
      (Math.random() - 0.5) * 0.01

    velocities[i3 + 2] =
      (Math.random() - 0.5) * 0.01
  }

  // Tell Three.js the positions changed
  geometry.attributes.position.needsUpdate = true
}
document
  .getElementById('reset')
  .addEventListener('click', resetParticles)
// ========================
// ANIMATION
// ========================

function animate() {

  requestAnimationFrame(animate)

  const positionArray =
    geometry.attributes.position.array


  // --------------------------------
  // Move every particle
  // --------------------------------

  for (let i = 0; i < particleCount; i++) {

    const i3 = i * 3


    // ==================================
    // 1. Find direction toward the mouse
    // ==================================

    const dx =
      mouse.x * spread / 2 -
      positionArray[i3]

    const dy =
      mouse.y * spread / 2 -
      positionArray[i3 + 1]


    // ==================================
    // 2. Find distance from mouse
    // ==================================

    const distance =
      Math.sqrt(
        dx * dx +
        dy * dy
      )


    // ==================================
    // 3. Calculate attraction force
    // ==================================

    const force =
      0.0005 /
      (distance * distance + 0.1)


    // ==================================
    // 4. Apply force to velocity
    // ==================================

    velocities[i3] +=
      dx * force

    velocities[i3 + 1] +=
      dy * force


    // ==================================
    // 5. Move particle
    // ==================================

    positionArray[i3] +=
      velocities[i3]

    positionArray[i3 + 1] +=
      velocities[i3 + 1]

    positionArray[i3 + 2] +=
      velocities[i3 + 2]


    // ==================================
    // 6. Add some friction
    // ==================================

    velocities[i3] *= 0.99
    velocities[i3 + 1] *= 0.99
    velocities[i3 + 2] *= 0.99


    // ==================================
    // 7. Wrap particles around the box
    // ==================================

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


  // Tell Three.js that the positions changed
  geometry.attributes.position.needsUpdate = true


  // Update camera controls
  controls.update()


  // Draw the scene
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