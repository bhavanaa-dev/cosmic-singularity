import './style.css'

const versions = {
  1: {
    file: './versions/v1-clouds.js',
    title: 'The Beginning',
    description: 'Just particles. No rules. No ambition. Yet.'
  },
  2: {
    file: './versions/v2-motion.js',
    title: 'Things Start Moving',
    description: 'The particles discovered velocity. Chaos followed.'
  },
  3: {
    file: './versions/v3-gravity.js',
    title: 'Gravity Has Entered the Chat',
    description: 'Give particles a target and watch them fall in love.'
  },
  4: {
    file: './versions/v4-vortex.js',
    title: 'Enter the Vortex',
    description: 'Straight lines are boring. Let’s make everything spin.'
  },
  5: {
    file: './versions/v5-vortex3d.js',
    title: 'Into the Third Dimension',
    description: 'The vortex escaped the screen and went 3D.'
  },
  6: {
    file: './versions/v6-galaxy.js',
    title: 'And Then Came the Galaxy',
    description: 'A few equations. Ten thousand particles. One questionable idea.'
  },
  7: {
    file: './versions/v7-galaxy2.js',
    title: 'Make It Pretty',
    description: 'Because physics is cool, but glowing particles are cooler.'
  },
  8: {
    file: './versions/v8-galaxy3.js',
    title: 'Touch the Galaxy',
    description: 'The galaxy finally noticed you were there.'
  },
  9: {
    file: './versions/v9-galaxy3.js',
    title: 'Deeper Into Space',
    description: 'More stars. More dust. More drama.'
  },
  10: {
    file: './versions/v10.js',
    title: 'Cosmic Singularity',
    description: 'Twenty-four thousand particles pretending they understand the universe.'
  }
}

// Tell Vite about every possible version module
const versionModules = import.meta.glob('./versions/*.js')

// Read version from URL
const params = new URLSearchParams(window.location.search)
const requestedVersion = Number(params.get('version')) || 10

const currentVersion = versions[requestedVersion]
  ? requestedVersion
  : 10

const version = versions[currentVersion]

// UI
const versionSelect = document.getElementById('version-select')
const versionDescription = document.getElementById('version-description')

versionSelect.value = currentVersion
versionDescription.textContent = version.description

// Switch versions
versionSelect.addEventListener('change', (event) => {
  const selectedVersion = event.target.value

  window.location.href = `?version=${selectedVersion}`
})

// Load selected version
const loadVersion = versionModules[version.file]

if (loadVersion) {
  loadVersion()
} else {
  console.error(`Version module not found: ${version.file}`)
}