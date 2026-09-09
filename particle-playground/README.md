# 🌌 Cosmic Singularity

**A particle experiment that slowly turned into a galaxy.**
Live demo: https://cosmic-singularity.vercel.app/

Cosmic Singularity is an interactive 3D particle experiment built with **JavaScript, Three.js and WebGL**.

It wasn't designed as a galaxy from the beginning.

The project started with a simple question:

**What happens if I give individual particles rules for how they move?**

That question turned into ten iterations of experimenting with motion, forces, vectors, procedural generation, interaction and visual effects — eventually resulting in a galaxy that can be explored and gently disturbed with the mouse.

---

## ✦ The Idea

Instead of jumping straight into a finished scene, the galaxy was built layer by layer.

Each version introduced one new idea.

A static collection of points became moving particles.

Moving particles became a physical system.

The physical system became a vortex.

The vortex became a procedural galaxy.

And eventually, the galaxy became something you could interact with.

The earlier versions are intentionally preserved in the repository because the evolution is part of the project.

---

# 🧪 The 10 Experiments

### V1 — Particle Cloud

The starting point.

A basic Three.js scene containing a collection of particles positioned randomly in 3D space.

This version introduced the fundamental pieces:

* Scene
* Camera
* Renderer
* `BufferGeometry`
* `BufferAttribute`
* `THREE.Points`
* `PointsMaterial`

The goal was simply to understand how thousands of points can exist inside a WebGL scene.

---

### V2 — Motion

The particles stopped being static.

Each particle was given its own movement, and their positions were updated every frame.

This introduced the basic structure behind particle animation:

**position → update → render → repeat**

It also introduced an important Three.js detail:

`position.needsUpdate = true`

Without telling Three.js that the buffer changed, the GPU would continue rendering the old positions.

---

### V3 — Gravity

The next question was:

**Can the particles react to something?**

The mouse became the source of a force.

For every particle, the distance between the particle and the mouse was calculated and used to influence its velocity.

This introduced:

* Distance calculations
* Direction vectors
* Force
* Velocity
* Friction
* Mouse coordinates

The particles were no longer just moving.

They were responding to something.

---

### V4 — Vortex

Gravity alone wasn't enough.

A new force was added perpendicular to the direction of attraction.

Instead of simply moving toward the mouse, particles started moving **around** it.

That small mathematical change transformed attraction into rotation.

This was the first step toward creating something that looked like a system rather than a collection of independent particles.

---

### V5 — 3D Vortex

The vortex moved into three dimensions.

Using radius, angle and height, particles were positioned using trigonometric functions:

* `sin()`
* `cos()`
* radius
* angle

The experiment became a small exploration of polar coordinates and circular motion in 3D space.

---

### V6 — Galaxy

The vortex became a galaxy.

Instead of placing particles randomly, their positions were generated using a procedural spiral.

Multiple spiral arms were created by offsetting their starting angles.

The basic idea was:

**radius + angle + controlled randomness → spiral structure**

At this point, the project stopped being just a particle experiment and started looking like an actual astronomical object.

---

### V7 — Visual Refinement

The structure was there.

Now it needed atmosphere.

This version introduced:

* Distance-based coloring
* Blue / violet outer regions
* Warm central particles
* Additive blending
* Higher particle density
* A glowing central region
* Particle size variation

The goal wasn't to make the mathematics more complicated.

It was to make the same mathematics **look better**.

---

### V8 — Interaction

The galaxy became interactive.

Instead of applying chaotic forces to individual particles, the interaction gradually evolved into a softer idea:

**the mouse creates a local field around itself.**

Particles near the cursor are temporarily displaced while their original galaxy positions remain intact.

This was an important design change.

The interaction shouldn't destroy the galaxy.

It should feel like disturbing something that naturally wants to return to its original form.

---

### V9 — Atmosphere

The galaxy needed depth.

Instead of one particle system, multiple layers were introduced:

**Galaxy**

The main spiral structure.

**Dust**

A much quieter particle layer surrounding the galaxy.

**Stars**

A distant background particle field.

**Core**

Several transparent glowing objects creating the impression of a bright center.

The result was less like a mathematical visualization and more like a small cosmic scene.

---

# 🌌 V10 — Cosmic Singularity

The final version brings the experiments together.

The most important decision in V10 was actually **what not to do**.

Earlier interaction systems used particle velocity and force.

That looked interesting mathematically, but it could also destroy the carefully generated galaxy.

So V10 uses a different approach.

### The galaxy has a permanent base state.

Every particle has an original position.

When the mouse moves over the galaxy, the program calculates a temporary deformation from that original position.

The particle isn't permanently thrown somewhere else.

Instead:

**Base galaxy → temporary distortion → return to base**

This keeps the spiral structure intact while still making the galaxy feel alive.

---

## 🌀 How the Interaction Works

The cursor creates a circular influence field.

For every particle:

1. Calculate the distance between the particle and the cursor.
2. Ignore particles outside the interaction radius.
3. Calculate how strongly the cursor should affect the particle.
4. Apply a smooth falloff.
5. Add a small radial deformation.
6. Add a perpendicular component to create the swirl.
7. Add a very small Z-axis displacement for depth.
8. Recalculate the particle from its original position on the next frame.

The falloff uses a smooth interpolation rather than a sudden cutoff.

That makes the interaction feel more like a **soft field** than an invisible circular boundary.

The result is deliberately subtle.

The goal isn't:

**“MOVE THE PARTICLES!”**

It's:

**“Something just passed through the galaxy.”**

---

# 🎮 Controls

| Input             | Behaviour                   |
| ----------------- | --------------------------- |
| Move the mouse    | Create a soft cosmic ripple |
| Left-click + drag | Rotate the camera           |
| Scroll            | Zoom                        |
| Reset             | Restore the galaxy          |

The camera and particle interaction are intentionally separate systems.

OrbitControls handles exploration of the 3D scene, while the mouse field handles the particle deformation.

---

# 🧠 The Mathematics Behind the Galaxy

The galaxy isn't based on a pre-made model.

Its shape is generated mathematically.

For each particle, a radius is selected and an angle is calculated from the particle's spiral arm and distance from the center.

Conceptually:

**angle = arm angle + radius × spiral strength**

The particle is then converted from polar coordinates into Cartesian coordinates:

**x = cos(angle) × radius**

**z = sin(angle) × radius**

A small amount of Gaussian randomness is added to prevent the arms from looking perfectly artificial.

The vertical position is also randomized slightly to give the galaxy thickness.

So thousands of particles can be generated from a relatively small set of rules.

That's the part I found most interesting:

**the galaxy isn't stored — it's generated.**

---

# 🧩 Architecture

The project intentionally keeps every experiment separate.

```text
particle-playground/
│
├── src/
│   │
│   ├── versions/
│   │   ├── v1-cloud.js
│   │   ├── v2-motion.js
│   │   ├── v3-gravity.js
│   │   ├── v4-vortex.js
│   │   ├── v5-vortex3d.js
│   │   ├── v6-galaxy.js
│   │   ├── v7-galaxy2.js
│   │   ├── v8-galaxy3.js
│   │   ├── v9-galaxy3.js
│   │   └── v10.js
│   │
│   ├── main.js
│   └── style.css
│
├── public/
├── index.html
├── package.json
├── package-lock.json
└── .gitignore
```

`main.js` acts as the entry point and loads the version currently being explored.

This makes it possible to switch between experiments without deleting the previous work.

---

# ⚙️ Performance

The final scene contains tens of thousands of particles.

Rather than creating thousands of individual Three.js mesh objects, the project uses **buffer-based particle geometry**.

The particles are stored in typed arrays and rendered using `THREE.Points`.

This keeps the scene considerably lighter than creating a separate mesh for every particle.

The renderer also limits pixel ratio on high-density displays to avoid unnecessary GPU load.

The final version contains approximately:

* **24,000** galaxy particles
* **6,000** dust particles
* **4,000** background stars

for roughly **34,000 particles** across the scene.

---

# 🛠️ Built With

**JavaScript**
Core programming and animation logic.

**Three.js**
3D scene management, particle rendering, camera controls and geometry.

**WebGL**
GPU-powered rendering through Three.js.

**Vite**
Development server and build tooling.

**HTML + CSS**
Application structure and interface.

---

# 🚀 Running Locally

Clone the repository:

```
git clone https://github.com/YOUR-USERNAME/cosmic-singularity.git
```

Enter the project:

```
cd cosmic-singularity
```

Install dependencies:

```
npm install
```

Start the development server:

```
npm run dev
```

Vite will provide the local development URL in the terminal.

---

# 📸 The Final Result

**Live Demo:** https://cosmic-singularity.vercel.app/

A screenshot / GIF of V10 will be placed here once the project is deployed.

---

# 🔭 What I'd Explore Next

V10 is the end of this particular experiment, but there are several directions that could take the idea much further.

### GPU Particles

Move particle calculations from JavaScript to the GPU so much larger particle systems can be simulated.

### GLSL Shaders

Replace the standard `PointsMaterial` with custom shaders for more control over particle shape, glow and movement.

### Bloom

Add proper post-processing so bright areas of the galaxy can produce realistic light bloom.

### Black Hole

Replace the galactic core with a black hole and experiment with gravitational lensing.

### Audio Reactivity

Use music or microphone input to influence particle density, movement and color.

### Procedural Nebulae

Generate a second volumetric-looking layer around the galaxy using noise functions.

---

# ✦ Why Keep V1–V10?

The final galaxy is the interesting part visually.

But the progression is the interesting part technically.

Every version answers a slightly different question:

**How do I render particles?**

↓

**How do I move them?**

↓

**How do I make them respond to forces?**

↓

**How do I make them rotate?**

↓

**How do I generate structure?**

↓

**How do I make that structure look alive?**

↓

**How do I let someone interact with it without destroying it?**

V10 is simply where those experiments ended up.

---

## 🌌 Final Note

This started as an experiment with moving dots.

It ended with a galaxy.

**Built with Three.js, mathematics, and a slightly unreasonable number of particles.**
