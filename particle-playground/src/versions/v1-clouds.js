import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// --- Scene ---
// The Scene is the container that holds every 3D object we want to draw.
const scene = new THREE.Scene()

// --- Camera ---
// PerspectiveCamera mimics how a real camera works (things farther away look smaller).
// Arguments: field of view (degrees), aspect ratio, near clip, far clip.
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
)
camera.position.z = 8

// --- Renderer ---
// WebGLRenderer draws the scene from the camera's point of view onto a <canvas>.
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x050505)
document.body.appendChild(renderer.domElement)

// --- Particle positions ---
// BufferGeometry stores vertex data in typed arrays (fast for lots of points).
const particleCount = 1000
const positions = new Float32Array(particleCount * 3) // x, y, z for each particle
const spread = 10 // size of the cube volume we scatter particles in

for (let i = 0; i < particleCount; i++) {
  const i3 = i * 3
  // Random values from -spread/2 to +spread/2 on each axis
  positions[i3] = (Math.random() - 0.5) * spread
  positions[i3 + 1] = (Math.random() - 0.5) * spread
  positions[i3 + 2] = (Math.random() - 0.5) * spread
}

const geometry = new THREE.BufferGeometry()
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const material = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.05,
  sizeAttenuation: true, // points look smaller when farther from the camera
})

// THREE.Points renders each vertex as a small square/dot instead of triangles.
const particles = new THREE.Points(geometry, material)
scene.add(particles)

// --- Controls ---
// OrbitControls lets you drag to rotate, scroll to zoom, and right-drag to pan.
const controls = new OrbitControls(camera, renderer.domElement)

// --- Animation loop ---
// requestAnimationFrame calls this function before every screen refresh (~60fps).
function animate() {
  requestAnimationFrame(animate)

  // Slow spin so the cloud feels alive even when you are not dragging.
  particles.rotation.y += 0.001

  controls.update()
  renderer.render(scene, camera)
}

animate()

// Keep the canvas and camera in sync when the browser window changes size.
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
