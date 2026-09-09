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
  60,
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

document.body.appendChild(
  renderer.domElement
)

// ========================
// GALAXY SETTINGS
// ========================

const particleCount = 15000

const galaxyRadius = 7

const armCount = 4

const spiralStrength = 1.7

// ========================
// PARTICLE DATA
// ========================

const positions =
  new Float32Array(
    particleCount * 3
  )

const colors =
  new Float32Array(
    particleCount * 3
  )

const sizes =
  new Float32Array(
    particleCount
  )

const angles =
  new Float32Array(
    particleCount
  )

const radii =
  new Float32Array(
    particleCount
  )

const speeds =
  new Float32Array(
    particleCount
  )


// ========================
// COLORS
// ========================

const innerColor =
  new THREE.Color('#fff4dc')

const middleColor =
  new THREE.Color('#d9d7ff')

const outerColor =
  new THREE.Color('#6f7cff')


// ========================
// CREATE GALAXY
// ========================

for (
  let i = 0;
  i < particleCount;
  i++
) {

  const i3 = i * 3

  // ------------------------
  // Radius
  // ------------------------

  const radius =
    Math.pow(
      Math.random(),
      1.7
    ) * galaxyRadius

  radii[i] = radius


  // ------------------------
  // Spiral arm
  // ------------------------

  const arm =
    i % armCount

  const armAngle =
    (arm / armCount) *
    Math.PI * 2


  // ------------------------
  // Spiral shape
  // ------------------------

  const spiralAngle =
    armAngle +
    radius * spiralStrength


  // ------------------------
  // Randomness
  // ------------------------

  const spread =
    0.18 +
    radius * 0.025

  const randomAngle =
    Math.random() *
    Math.PI * 2

  const randomRadius =
    Math.random() * spread


  const offsetX =
    Math.cos(randomAngle) *
    randomRadius

  const offsetZ =
    Math.sin(randomAngle) *
    randomRadius


  // ------------------------
  // Position
  // ------------------------

  positions[i3] =
    Math.cos(spiralAngle) *
    radius +
    offsetX

  positions[i3 + 1] =
    (Math.random() - 0.5) *
    0.35 *
    (1 - radius / galaxyRadius)

  positions[i3 + 2] =
    Math.sin(spiralAngle) *
    radius +
    offsetZ


  // ------------------------
  // Rotation speed
  // ------------------------

  speeds[i] =
    0.0035 /
    (radius + 0.5)


  // ------------------------
  // Particle size
  // ------------------------

  sizes[i] =
    Math.random() *
    0.8 +
    0.25


  // ------------------------
  // Color
  // ------------------------

  const normalizedRadius =
    radius / galaxyRadius

  let color

  if (normalizedRadius < 0.3) {

    color =
      innerColor.clone().lerp(
        middleColor,
        normalizedRadius / 0.3
      )

  } else {

    color =
      middleColor.clone().lerp(
        outerColor,
        (normalizedRadius - 0.3) / 0.7
      )
  }


  colors[i3] =
    color.r

  colors[i3 + 1] =
    color.g

  colors[i3 + 2] =
    color.b
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

geometry.setAttribute(
  'color',
  new THREE.BufferAttribute(
    colors,
    3
  )
)


// ========================
// MATERIAL
// ========================

const material =
  new THREE.PointsMaterial({

    size: 0.045,

    sizeAttenuation: true,

    vertexColors: true,

    transparent: true,

    opacity: 0.9,

    blending:
      THREE.AdditiveBlending,

    depthWrite: false
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
// GLOWING CORE
// ========================

const coreGeometry =
  new THREE.SphereGeometry(
    0.35,
    32,
    32
  )

const coreMaterial =
  new THREE.MeshBasicMaterial({
    color: 0xfff4dc
  })

const core =
  new THREE.Mesh(
    coreGeometry,
    coreMaterial
  )

scene.add(core)


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

controls.minDistance = 5

controls.maxDistance = 25


// ========================
// RESET
// ========================

function resetGalaxy() {

  for (
    let i = 0;
    i < particleCount;
    i++
  ) {

    const i3 = i * 3

    const radius =
      Math.pow(
        Math.random(),
        1.7
      ) * galaxyRadius

    radii[i] = radius

    const arm =
      i % armCount

    const armAngle =
      (arm / armCount) *
      Math.PI * 2

    const spiralAngle =
      armAngle +
      radius * spiralStrength

    const spread =
      0.18 +
      radius * 0.025

    const randomAngle =
      Math.random() *
      Math.PI * 2

    const randomRadius =
      Math.random() * spread

    positions[i3] =
      Math.cos(spiralAngle) *
      radius +
      Math.cos(randomAngle) *
      randomRadius

    positions[i3 + 1] =
      (Math.random() - 0.5) *
      0.35 *
      (1 - radius / galaxyRadius)

    positions[i3 + 2] =
      Math.sin(spiralAngle) *
      radius +
      Math.sin(randomAngle) *
      randomRadius

    speeds[i] =
      0.0035 /
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


  for (
    let i = 0;
    i < particleCount;
    i++
  ) {

    const i3 = i * 3

    const x =
      positionArray[i3]

    const z =
      positionArray[i3 + 2]

    const radius =
      Math.sqrt(
        x * x +
        z * z
      )

    let angle =
      Math.atan2(z, x)

    angle += speeds[i]


    positionArray[i3] =
      Math.cos(angle) *
      radius

    positionArray[i3 + 2] =
      Math.sin(angle) *
      radius
  }


  geometry.attributes.position.needsUpdate = true


  // Slowly rotate the entire galaxy
  galaxy.rotation.y += 0.0004

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