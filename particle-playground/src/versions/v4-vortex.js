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

const particleCount = 3000
const spread = 10

const positions = new Float32Array(
  particleCount * 3
)

const velocities = new Float32Array(
  particleCount * 3
)

for (let i = 0; i < particleCount; i++) {

  const i3 = i * 3

  positions[i3] =
    (Math.random() - 0.5) * spread

  positions[i3 + 1] =
    (Math.random() - 0.5) * spread

  positions[i3 + 2] =
    (Math.random() - 0.5) * spread

  velocities[i3] = 0
  velocities[i3 + 1] = 0
  velocities[i3 + 2] = 0
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
// MOUSE
// ========================

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

// ========================
// RESET
// ========================

function resetParticles() {

  for (let i = 0; i < particleCount; i++) {

    const i3 = i * 3

    positions[i3] =
      (Math.random() - 0.5) * spread

    positions[i3 + 1] =
      (Math.random() - 0.5) * spread

    positions[i3 + 2] =
      (Math.random() - 0.5) * spread

    velocities[i3] = 0
    velocities[i3 + 1] = 0
    velocities[i3 + 2] = 0
  }

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

  for (let i = 0; i < particleCount; i++) {

    const i3 = i * 3

    // --------------------------------
    // Direction toward the mouse
    // --------------------------------

    const dx =
      mouse.x * spread / 2 -
      positionArray[i3]

    const dy =
      mouse.y * spread / 2 -
      positionArray[i3 + 1]

    const distanceSquared =
      dx * dx + dy * dy + 0.1

    // --------------------------------
    // Attraction
    // --------------------------------

    const attraction =
      0.00035 / distanceSquared

    velocities[i3] +=
      dx * attraction

    velocities[i3 + 1] +=
      dy * attraction

    // --------------------------------
    // VORTEX FORCE 🌀
    // --------------------------------

    // Perpendicular to (dx, dy)
    const vortexX = -dy
    const vortexY = dx

    const vortexStrength =
      0.00012 / distanceSquared

    velocities[i3] +=
      vortexX * vortexStrength

    velocities[i3 + 1] +=
      vortexY * vortexStrength

    // --------------------------------
    // Move particle
    // --------------------------------

    positionArray[i3] +=
      velocities[i3]

    positionArray[i3 + 1] +=
      velocities[i3 + 1]

    positionArray[i3 + 2] +=
      velocities[i3 + 2]

    // --------------------------------
    // Friction
    // --------------------------------

    velocities[i3] *= 0.985
    velocities[i3 + 1] *= 0.985
    velocities[i3 + 2] *= 0.985
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