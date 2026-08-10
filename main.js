import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

/* ================================================================
   ✏️  CONFIG — EDIT THIS! Ekhane tomar info boshao, site auto-update hobe
   ================================================================ */
const CONFIG = {
  name: "Rifat Uddin",
  tagline: "Brand Builder · Fashion Retail & Digital Solutions",
  location: "Dubai, UAE 🇦🇪 · Dhaka, Bangladesh 🇧🇩",
  about: {
    lead: "Hi! I'm Rifat 👋 — an aspiring professional and brand builder working across modern fashion retail and digital solutions.",
    text: "I'm involved in the operations & management of GentWear Pro, a men's casual & traditional clothing brand, and Sohoz Karbar ERP, a business management software. My core focus is turning creative ideas into real businesses and building customer-centric solutions — while staying updated with new technology and e-commerce trends to keep creating value.",
    chips: ["👔 Fashion Retail", "💼 Brand Builder", "📈 E-commerce Trends", "🤝 Customer-Centric", "⚙️ Operations & Mgmt"]
  },
  skills: [
    { name: "Brand Building", level: 92 },
    { name: "Fashion Retail", level: 90 },
    { name: "Customer Experience", level: 90 },
    { name: "Operations & Mgmt", level: 88 },
    { name: "E-commerce", level: 85 },
    { name: "Trend Analysis", level: 82 },
    { name: "ERP Solutions", level: 80 },
    { name: "Digital Marketing", level: 76 }
  ],
  projects: [
    { title: "GentWear Pro 👔", desc: "A local garments brand for men — casual & traditional wear with a modern fashion-retail mindset. I drive operations & management: sourcing, quality, branding and customer experience.", tags: ["Fashion Retail", "Branding", "Operations"], link: "https://www.gentwear.pro.bd" },
    { title: "Sohoz Karbar ERP 💼", desc: "Business software that makes everyday karbar sohoz — simple & organized. I work on operations & management to help businesses run smoother with customer-centric digital tools.", tags: ["Business Software", "ERP", "Management"], link: "https://www.sohozkarbar.pro.bd" }
  ],
  contact: {
    email: "rifat4440@gmail.com",
    phoneUAE: "+971507714886",
    phoneBD: "+8801625914562",
    facebook: "https://www.facebook.com/rifatdxb"
  },
  carColor: 0xc1121f   // 🔴 change to your favourite hex color
};

/* ================================================================
   🎨 Palette
   ================================================================ */
const COL = {
  grassBase: '#7daf5c',
  grassLight: '#8fbf6a',
  grassDark: '#6d9c4d',
  dirt: '#b3956d',
  dirtEdge: '#8a6f4d',
  pad: '#c8ab7d',
  padRing: '#a08a5f',
  horizon: 0x79a952,
  trunk: 0x6d4c35,
  rock: 0x9aa5a8,
  cloud: 0xf5f9ff
};
const LEAF_COLS = [0x3e7d44, 0x4c9350, 0x5aa85c, 0x45864a];
const MT_COLS = [0x8b93b8, 0x7e9bb5, 0x7fa886, 0xb29a80, 0xa4839f];

const ZONES = [
  { id: 'about',    label: 'ABOUT',    color: 0xff7043, pos: new THREE.Vector3(-26, 0, -14), r: 9 },
  { id: 'projects', label: 'PROJECTS', color: 0x29b6f6, pos: new THREE.Vector3( 26, 0, -16), r: 9 },
  { id: 'skills',   label: 'SKILLS',   color: 0xab47bc, pos: new THREE.Vector3(-24, 0,  22), r: 9 },
  { id: 'contact',  label: 'CONTACT',  color: 0xffca28, pos: new THREE.Vector3( 26, 0,  22), r: 9 }
];
const WORLD_R = 52;
const PIN_C = { x: 0, z: -14 };
const START = { x: 0, z: 8 };

/* ================================================================
   🔊 Sound (tiny WebAudio synth — no files needed)
   ================================================================ */
const Sound = {
  ctx: null, muted: false, engineOsc: null, engineGain: null,
  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    const filt = this.ctx.createBiquadFilter();
    filt.type = 'lowpass'; filt.frequency.value = 380;
    this.engineOsc = this.ctx.createOscillator();
    this.engineOsc.type = 'sawtooth';
    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.value = 0;
    this.engineOsc.connect(filt); filt.connect(this.engineGain); this.engineGain.connect(this.ctx.destination);
    this.engineOsc.start();
  },
  setEngine(speed) {
    if (!this.ctx || !this.engineGain) return;
    if (this.muted) { this.engineGain.gain.value = 0; return; }
    const s = Math.min(Math.abs(speed) / 16, 1);
    this.engineOsc.frequency.value = 60 + s * 170;
    this.engineGain.gain.value = 0.012 + s * 0.055;
  },
  blip(fa, fb, dur, type, vol) {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(fa, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(fb, 1), t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(this.ctx.destination);
    o.start(t); o.stop(t + dur);
  },
  ding()  { this.blip(520, 960, 0.28, 'triangle', 0.16); },
  thock() { this.blip(200, 70, 0.12, 'square', 0.10); },
  toggle() { this.muted = !this.muted; return this.muted; }
};

/* ================================================================
   🌍 Renderer / Scene / Camera — realistic setup
   ================================================================ */
const app = document.getElementById('app');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.62;
app.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xc9d9e8, 90, 240);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);

/* ---------- Real sky + sun ---------- */
const sky = new Sky();
sky.scale.setScalar(450000);
scene.add(sky);
const sunVec = new THREE.Vector3().setFromSphericalCoords(1, THREE.MathUtils.degToRad(90 - 34), THREE.MathUtils.degToRad(145));
sky.material.uniforms.turbidity.value = 7;
sky.material.uniforms.rayleigh.value = 2.2;
sky.material.uniforms.mieCoefficient.value = 0.005;
sky.material.uniforms.mieDirectionalG.value = 0.8;
sky.material.uniforms.sunPosition.value.copy(sunVec);

const sun = new THREE.DirectionalLight(0xfff2dd, 2.6);
sun.position.copy(sunVec).multiplyScalar(120);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -60; sun.shadow.camera.right = 60;
sun.shadow.camera.top = 60; sun.shadow.camera.bottom = -60;
sun.shadow.camera.near = 20; sun.shadow.camera.far = 260;
sun.shadow.bias = -0.0004;
sun.shadow.normalBias = 0.35;
scene.add(sun);
scene.add(new THREE.HemisphereLight(0xbfd9ee, 0x6f9553, 0.55));

/* ---------- Environment reflections ---------- */
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.42;

const mat = (c, extra = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.95, metalness: 0, ...extra });
const rnd = (a, b) => a + Math.random() * (b - a);

/* ================================================================
   🗺️ Realistic ground — grass + dirt paths painted on a canvas
   ================================================================ */
function makeGroundTexture() {
  const S = 1024, WORLD = 160;             // plane is 160x160 world units
  const cv = document.createElement('canvas');
  cv.width = cv.height = S;
  const g = cv.getContext('2d');
  const k = S / WORLD;                     // px per world unit
  const P = (wx, wz) => [(wx + 80) * k, (80 - wz) * k];  // world → canvas

  // base grass
  g.fillStyle = COL.grassBase;
  g.fillRect(0, 0, S, S);

  // large soft patches
  for (let i = 0; i < 34; i++) {
    const x = Math.random() * S, y = Math.random() * S, r = rnd(40, 130);
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    const light = Math.random() < 0.5;
    gr.addColorStop(0, light ? 'rgba(143,191,106,.16)' : 'rgba(90,140,70,.14)');
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  // speckle noise
  for (let i = 0; i < 5200; i++) {
    const light = Math.random() < 0.5;
    g.fillStyle = light ? `rgba(163,205,120,${rnd(0.05, 0.2)})` : `rgba(85,130,62,${rnd(0.05, 0.2)})`;
    const r = rnd(0.6, 2.6);
    g.beginPath(); g.arc(Math.random() * S, Math.random() * S, r, 0, 7); g.fill();
  }
  // pebbles
  for (let i = 0; i < 260; i++) {
    g.fillStyle = `rgba(140,140,135,${rnd(0.15, 0.4)})`;
    g.beginPath(); g.arc(Math.random() * S, Math.random() * S, rnd(0.5, 1.4), 0, 7); g.fill();
  }

  // ---- dirt paths from start to each zone + pins ----
  function path(tx, tz) {
    const [x0, y0] = P(START.x, START.z);
    const [x1, y1] = P(tx, tz);
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
    const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1;
    const off = rnd(-1, 1) * L * 0.16;
    const cx = mx - dy / L * off, cy = my + dx / L * off;
    for (const [w, c] of [[5.2 * k, COL.dirtEdge], [3.6 * k, COL.dirt], [1.6 * k, '#c2a378']]) {
      g.strokeStyle = c; g.lineWidth = w; g.lineCap = 'round';
      g.globalAlpha = w === 1.6 * k ? 0.55 : 1;
      g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(cx, cy, x1, y1); g.stroke();
      g.globalAlpha = 1;
    }
  }
  for (const z of ZONES) path(z.pos.x, z.pos.z);
  path(PIN_C.x, PIN_C.z);

  // ---- zone pads ----
  function pad(wx, wz, r) {
    const [x, y] = P(wx, wz);
    g.beginPath(); g.arc(x, y, r * k, 0, 7);
    g.fillStyle = COL.pad; g.fill();
    g.lineWidth = 5; g.strokeStyle = COL.padRing; g.stroke();
    // speckles on pad
    for (let i = 0; i < 130; i++) {
      g.fillStyle = `rgba(120,95,60,${rnd(0.1, 0.3)})`;
      const a = Math.random() * 7, d = Math.random() * r * k * 0.93;
      g.beginPath(); g.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, rnd(0.6, 1.8), 0, 7); g.fill();
    }
  }
  for (const z of ZONES) pad(z.pos.x, z.pos.z, z.r);
  pad(START.x, START.z, 7);
  pad(PIN_C.x, PIN_C.z, 4);

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  return tex;
}

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(160, 160),
  new THREE.MeshStandardMaterial({ map: makeGroundTexture(), roughness: 0.95, metalness: 0 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// horizon filler
const horizon = new THREE.Mesh(new THREE.CircleGeometry(900, 32), mat(COL.horizon));
horizon.rotation.x = -Math.PI / 2;
horizon.position.y = -0.12;
scene.add(horizon);

/* ================================================================
   🌳 Decorations (semi-realistic)
   ================================================================ */
const knockables = [];

function isFree(x, z, margin) {
  if (Math.hypot(x - START.x, z - START.z) < margin + 8) return false;
  if (Math.hypot(x - PIN_C.x, z - PIN_C.z) < margin + 6) return false;
  for (const zn of ZONES) if (Math.hypot(x - zn.pos.x, z - zn.pos.z) < zn.r + margin) return false;
  // keep paths clear-ish
  return true;
}

function makeTree(x, z) {
  const g = new THREE.Group();
  const s = rnd(0.85, 1.4);
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18 * s, 0.3 * s, 1.8 * s, 7), mat(COL.trunk));
  trunk.position.y = 0.9 * s;
  trunk.castShadow = true;
  g.add(trunk);
  const n = 3 + (Math.random() * 2 | 0);
  for (let i = 0; i < n; i++) {
    const r = rnd(0.9, 1.4) * s;
    const blob = new THREE.Mesh(
      new THREE.IcosahedronGeometry(r, 1),
      mat(LEAF_COLS[(Math.random() * LEAF_COLS.length) | 0], { flatShading: false, roughness: 1 })
    );
    blob.position.set(rnd(-0.5, 0.5) * s, (2.2 + i * 0.55) * s * rnd(0.9, 1), rnd(-0.5, 0.5) * s);
    blob.scale.y = 0.82;
    blob.castShadow = true;
    g.add(blob);
  }
  g.position.set(x, 0, z);
  g.rotation.y = rnd(0, Math.PI * 2);
  scene.add(g);
  knockables.push({ obj: g, r: 1.5 * s, prog: 0, state: 'idle', hold: 0, dirX: 0, dirZ: 0 });
}

function makeRock(x, z) {
  const r = new THREE.Mesh(new THREE.IcosahedronGeometry(rnd(0.4, 1.2), 0), mat(COL.rock, { roughness: 0.9 }));
  r.position.set(x, rnd(0.05, 0.2), z);
  r.rotation.set(rnd(0, 3), rnd(0, 3), rnd(0, 3));
  r.castShadow = true; r.receiveShadow = true;
  scene.add(r);
}

function makeFlower(x, z) {
  const colors = [0xe8e3d2, 0xf2d16b, 0xd98ba8, 0xffffff];
  const f = new THREE.Mesh(new THREE.IcosahedronGeometry(0.14, 0), mat(colors[(Math.random() * colors.length) | 0], { roughness: 0.7 }));
  f.position.set(x, 0.14, z);
  scene.add(f);
}

/* bushes */
function makeBush(x, z) {
  const b = new THREE.Mesh(
    new THREE.IcosahedronGeometry(rnd(0.5, 0.9), 1),
    mat(LEAF_COLS[(Math.random() * LEAF_COLS.length) | 0], { roughness: 1 })
  );
  b.position.set(x, 0.35, z);
  b.scale.y = 0.7;
  b.castShadow = true;
  scene.add(b);
}

for (let i = 0; i < 26; i++) {
  const a = rnd(0, Math.PI * 2), d = rnd(11, WORLD_R - 3);
  const x = Math.cos(a) * d, z = Math.sin(a) * d;
  if (isFree(x, z, 3)) makeTree(x, z);
}
for (let i = 0; i < 18; i++) {
  const a = rnd(0, Math.PI * 2), d = rnd(8, WORLD_R - 2);
  const x = Math.cos(a) * d, z = Math.sin(a) * d;
  if (isFree(x, z, 1.6)) makeRock(x, z);
}
for (let i = 0; i < 46; i++) {
  const a = rnd(0, Math.PI * 2), d = rnd(5, WORLD_R - 1);
  const x = Math.cos(a) * d, z = Math.sin(a) * d;
  if (isFree(x, z, 0.6)) (Math.random() < 0.5 ? makeFlower : makeBush)(x, z);
}

/* Mountains ring */
for (let i = 0; i < 16; i++) {
  const a = (i / 16) * Math.PI * 2 + rnd(-0.12, 0.12);
  const d = rnd(WORLD_R + 8, WORLD_R + 24);
  const h = rnd(14, 30), rr = rnd(9, 16);
  const m = new THREE.Mesh(new THREE.ConeGeometry(rr, h, 7), mat(MT_COLS[i % MT_COLS.length], { roughness: 1 }));
  m.position.set(Math.cos(a) * d, h / 2 - 0.5, Math.sin(a) * d);
  scene.add(m);
  if (h > 20) {
    const cap = new THREE.Mesh(new THREE.ConeGeometry(rr * 0.4, h * 0.3, 7), mat(0xf2f6fa, { roughness: 0.85 }));
    cap.position.set(Math.cos(a) * d, h * 0.86 - 0.5, Math.sin(a) * d);
    scene.add(cap);
  }
}

/* Clouds — soft & puffy */
const clouds = [];
const cloudMat = mat(COL.cloud, { roughness: 1, transparent: true, opacity: 0.92 });
for (let i = 0; i < 8; i++) {
  const g = new THREE.Group();
  const n = 4 + (Math.random() * 3 | 0);
  for (let j = 0; j < n; j++) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(rnd(1.4, 2.8), 10, 8), cloudMat);
    s.position.set(j * rnd(1.5, 2.2) - n, rnd(-0.4, 0.5), rnd(-0.9, 0.9));
    s.scale.y = 0.62;
    g.add(s);
  }
  g.position.set(rnd(-80, 80), rnd(18, 30), rnd(-80, 80));
  scene.add(g);
  clouds.push({ g, speed: rnd(0.7, 1.8), baseY: g.position.y, phase: rnd(0, 6) });
}

/* Zone flags */
const flags = [];
for (const z of ZONES) {
  const fx = z.pos.x * 0.7, fz = z.pos.z * 0.7;
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 7, 8), mat(0x8a8f96, { metalness: 0.7, roughness: 0.4 }));
  pole.position.set(fx, 3.5, fz);
  pole.castShadow = true;
  scene.add(pole);
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 10), mat(0xffd54f, { metalness: 0.6, roughness: 0.3 }));
  ball.position.set(fx, 7.1, fz);
  scene.add(ball);
  const fg = new THREE.Group();
  fg.position.set(fx, 6.2, fz);
  const flag = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.05, 0.05), mat(z.color, { roughness: 0.85 }));
  flag.position.x = 1.05;
  flag.castShadow = true;
  fg.add(flag);
  scene.add(fg);
  flags.push({ fg, phase: rnd(0, 6) });
}

/* ================================================================
   🎳 Bowling pins
   ================================================================ */
function makePin(x, z) {
  const g = new THREE.Group();
  const pm = new THREE.MeshPhysicalMaterial({ color: 0xf8f6f0, roughness: 0.28, clearcoat: 0.6, clearcoatRoughness: 0.3 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.34, 0.95, 12), pm);
  body.position.y = 0.48;
  body.castShadow = true;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 10), pm);
  head.position.y = 1.1;
  head.castShadow = true;
  const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.245, 0.25, 0.16, 12), mat(0xd23c3c, { roughness: 0.4 }));
  stripe.position.y = 0.82;
  g.add(body, head, stripe);
  g.position.set(x, 0, z);
  scene.add(g);
  knockables.push({ obj: g, r: 0.7, prog: 0, state: 'idle', hold: 0, dirX: 0, dirZ: 0 });
}
for (let row = 0; row < 3; row++)
  for (let k = 0; k <= row; k++)
    makePin(PIN_C.x + (k - row / 2) * 1.1, PIN_C.z - row * 1.0);

/* ================================================================
   🔤 Big 3D words (letters are knockable!)
   ================================================================ */
new FontLoader().load('./lib/fonts/helvetiker_bold.typeface.json', (font) => {
  for (const z of ZONES) {
    const word = new THREE.Group();
    const spacing = 0.42, size = 2.5;
    let cursor = 0;
    const letterMeshes = [];
    for (const ch of z.label) {
      const geo = new TextGeometry(ch, { font, size, depth: 0.65, curveSegments: 5, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.04, bevelSegments: 2 });
      geo.computeBoundingBox();
      const w = geo.boundingBox.max.x - geo.boundingBox.min.x;
      const col = new THREE.Color(z.color).offsetHSL(0, 0, (Math.random() - 0.5) * 0.06);
      const m = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color: col, roughness: 0.45, clearcoat: 0.5, clearcoatRoughness: 0.4 }));
      m.castShadow = true;
      m.rotation.x = -Math.PI / 2;
      const wrap = new THREE.Group();
      m.position.set(-geo.boundingBox.min.x, 0, 0);
      wrap.add(m);
      wrap.position.set(cursor, 0, 0);
      word.add(wrap);
      letterMeshes.push({ wrap, w });
      cursor += w + spacing;
    }
    const total = cursor - spacing;
    for (const lm of letterMeshes) lm.wrap.position.x -= total / 2;
    word.position.copy(z.pos);
    word.rotation.y = Math.atan2(-z.pos.x, -z.pos.z);
    scene.add(word);
    word.updateMatrixWorld(true);
    for (const lm of letterMeshes) {
      knockables.push({
        obj: lm.wrap, r: 1.0, prog: 0, state: 'idle', hold: 0, dirX: 0, dirZ: 0,
        worldPos: new THREE.Vector3().setFromMatrixPosition(lm.wrap.matrixWorld)
      });
    }
  }
}, undefined, (err) => console.warn('Font failed:', err));

/* ================================================================
   🏎️ THE CAR — realistic Ferrari GLB (+ fallback sporty car)
   ================================================================ */
const car = new THREE.Group();
scene.add(car);
let wheels = []; // {pivot(steer), roll(spin), steerable}

function buildFallbackCar() {
  wheels = [];
  const paint = new THREE.MeshPhysicalMaterial({
    color: CONFIG.carColor, metalness: 0.25, roughness: 0.32,
    clearcoat: 1, clearcoatRoughness: 0.06
  });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x0e141c, metalness: 0.1, roughness: 0.08 });
  const dark = mat(0x1c1e24, { roughness: 0.7 });
  const chrome = mat(0xd8dde2, { metalness: 1, roughness: 0.15 });

  const body = new THREE.Mesh(new RoundedBoxGeometry(1.6, 0.5, 2.6, 4, 0.12), paint);
  body.position.y = 0.55;
  const cabin = new THREE.Mesh(new RoundedBoxGeometry(1.25, 0.42, 1.25, 4, 0.16), glass);
  cabin.position.set(0, 0.98, -0.12);
  const skirt = new THREE.Mesh(new RoundedBoxGeometry(1.66, 0.18, 2.5, 2, 0.06), dark);
  skirt.position.y = 0.32;
  const spoiler = new THREE.Mesh(new RoundedBoxGeometry(1.45, 0.08, 0.32, 2, 0.03), dark);
  spoiler.position.set(0, 0.98, -1.22);
  for (const m of [body, cabin, skirt, spoiler]) { m.castShadow = true; car.add(m); }
  for (const sx of [-0.55, 0.55]) {
    const hl = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), new THREE.MeshStandardMaterial({ color: 0xfff6d8, emissive: 0xffedb0, emissiveIntensity: 0.9 }));
    hl.position.set(sx, 0.58, 1.28);
    car.add(hl);
    const tl = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), new THREE.MeshStandardMaterial({ color: 0x881111, emissive: 0xcc2222, emissiveIntensity: 0.8 }));
    tl.position.set(sx, 0.58, -1.3);
    car.add(tl);
  }
  const tireGeo = new THREE.TorusGeometry(0.26, 0.11, 10, 20);
  const hubGeo = new THREE.CylinderGeometry(0.17, 0.17, 0.14, 12);
  for (const [x, z, steerable] of [[-0.8, 0.92, true], [0.8, 0.92, true], [-0.8, -0.88, false], [0.8, -0.88, false]]) {
    const pivot = new THREE.Group();
    const roll = new THREE.Group();
    const tire = new THREE.Mesh(tireGeo, dark);
    tire.rotation.y = Math.PI / 2;
    tire.castShadow = true;
    const hub = new THREE.Mesh(hubGeo, chrome);
    hub.rotation.z = Math.PI / 2;
    roll.add(tire, hub);
    pivot.add(roll);
    pivot.position.set(x, 0.3, z);
    car.add(pivot);
    wheels.push({ pivot, roll, steerable });
  }
}

new GLTFLoader().load('./lib/models/ferrari.glb', (gltf) => {
  // clear fallback
  while (car.children.length) car.remove(car.children[0]);
  wheels = [];

  const root = gltf.scene;
  const inner = new THREE.Group();
  inner.add(root);
  car.add(inner);

  // --- normalize scale & center ---
  let box = new THREE.Box3().setFromObject(inner);
  const size = box.getSize(new THREE.Vector3());
  const s = 2.7 / Math.max(size.x, size.z);
  inner.scale.setScalar(s);
  box = new THREE.Box3().setFromObject(inner);
  const center = box.getCenter(new THREE.Vector3());
  root.position.sub(new THREE.Vector3(center.x / s, box.min.y / s > 0 ? box.min.y / s : box.min.y / s, center.z / s));
  // recompute & ground precisely
  box = new THREE.Box3().setFromObject(inner);
  root.position.y -= box.min.y / s;
  const c2 = new THREE.Box3().setFromObject(inner).getCenter(new THREE.Vector3());
  root.position.x -= c2.x / s; root.position.z -= c2.z / s;

  // --- auto-orient so headlights ('lights') face +Z ---
  car.updateMatrixWorld(true);
  const lightNode = car.getObjectByName('lights');
  const tailNode = car.getObjectByName('lights_red');
  if (lightNode && tailNode) {
    const lp = lightNode.getWorldPosition(new THREE.Vector3());
    const tp = tailNode.getWorldPosition(new THREE.Vector3());
    inner.rotation.y = -Math.atan2(lp.x - tp.x, lp.z - tp.z);
  }

  // --- material upgrades ---
  root.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = true;
    const m = o.material;
    if (!m) return;
    m.envMapIntensity = 1.0;
    const n = m.name || '';
    if (n === 'Body_Color') {
      const phys = new THREE.MeshPhysicalMaterial({
        color: CONFIG.carColor, metalness: 0.25, roughness: 0.3,
        clearcoat: 1, clearcoatRoughness: 0.05
      });
      o.material = phys;
    } else if (n.includes('Glass')) {
      m.color = new THREE.Color(0x0d1218);
      m.metalness = 0.15; m.roughness = 0.06;
      m.transparent = true; m.opacity = n.includes('Gray') ? 0.85 : 0.95;
      if (n === 'Taillight_Glass') { m.color = new THREE.Color(0x5a0d0d); m.emissive = new THREE.Color(0xcc2222); m.emissiveIntensity = 0.6; }
      if (n === 'Projector_Glass') { m.emissive = new THREE.Color(0xfff3c4); m.emissiveIntensity = 0.7; }
    } else if (n === 'Tires') { m.roughness = 0.92; m.metalness = 0; }
    else if (n === 'metal_chrome') { m.metalness = 1; m.roughness = 0.12; }
    else if (n === 'metal_gray') { m.metalness = 0.9; m.roughness = 0.35; }
    else if (n === 'Turn_Signal_LED') { m.emissive = new THREE.Color(0xffb52e); m.emissiveIntensity = 0.6; }
  });

  // --- wheels: wrap in steer/roll pivots (works regardless of baked rotations) ---
  car.updateMatrixWorld(true);
  const wheelNames = { wheel_fl: true, wheel_fr: true };
  for (const wn of ['wheel_fl', 'wheel_fr', 'wheel_rl', 'wheel_rr']) {
    const node = car.getObjectByName(wn);
    if (!node) continue;
    const wp = node.getWorldPosition(new THREE.Vector3());
    inner.worldToLocal(wp); // car == identity here, but be safe
    const steer = new THREE.Group();
    const roll = new THREE.Group();
    steer.position.copy(wp);
    car.updateMatrixWorld(true);
    car.add(steer);
    steer.add(roll);
    roll.attach(node); // keeps world transform
    wheels.push({ pivot: steer, roll, steerable: !!wheelNames[wn] });
  }
  startBtn.textContent = 'Click or press any key to start 🏁';
  carReady = true;
}, undefined, (err) => {
  console.warn('Ferrari failed to load, using fallback car:', err);
  startBtn.textContent = 'Click or press any key to start 🏁';
  carReady = true;
});

let carReady = false;
const startBtn = document.getElementById('startBtn');
startBtn.textContent = 'Loading world… 🌍';
buildFallbackCar(); // instant placeholder, swapped when GLB arrives

/* Car state */
const carState = {
  pos: new THREE.Vector3(START.x, 0, START.z),
  heading: Math.PI,
  speed: 0,
  steer: 0
};
function resetCar() {
  carState.pos.set(START.x, 0, START.z);
  carState.heading = Math.PI;
  carState.speed = 0;
  Sound.blip(300, 500, 0.15, 'triangle', 0.12);
}

/* ================================================================
   🕹️ Input
   ================================================================ */
const keys = { up: false, down: false, left: false, right: false };
const keyMap = {
  w: 'up', arrowup: 'up', s: 'down', arrowdown: 'down',
  a: 'left', arrowleft: 'left', d: 'right', arrowright: 'right'
};
let started = false;

function startGame() {
  if (started) return;
  started = true;
  Sound.init();
  document.getElementById('intro').classList.add('hide');
}

window.addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase();
  if (keyMap[k]) { keys[keyMap[k]] = true; e.preventDefault(); }
  if (k === 'r') resetCar();
  if (k === 'escape') closePanel();
  startGame();
});
window.addEventListener('keyup', (e) => {
  const k = e.key.toLowerCase();
  if (keyMap[k]) keys[keyMap[k]] = false;
});
window.addEventListener('blur', () => { keys.up = keys.down = keys.left = keys.right = false; });
window.addEventListener('pointerdown', () => { Sound.init(); startGame(); }, { passive: true });

/* touch buttons */
function bindHold(id, key) {
  const el = document.getElementById(id);
  const on = (e) => { e.preventDefault(); keys[key] = true; Sound.init(); startGame(); };
  const off = (e) => { e.preventDefault(); keys[key] = false; };
  el.addEventListener('touchstart', on, { passive: false });
  el.addEventListener('touchend', off);
  el.addEventListener('touchcancel', off);
  el.addEventListener('mousedown', on);
  el.addEventListener('mouseup', off);
  el.addEventListener('mouseleave', off);
}
bindHold('tUp', 'up'); bindHold('tDown', 'down'); bindHold('tLeft', 'left'); bindHold('tRight', 'right');
if (window.matchMedia('(pointer: coarse)').matches) {
  document.getElementById('touch').style.display = 'flex';
}

/* ================================================================
   🪟 Panels (DOM)
   ================================================================ */
const panelEl = document.getElementById('panel');
const panelTitle = document.getElementById('panelTitle');
const panelBody = document.getElementById('panelBody');
const panelDot = document.getElementById('panelDot');
let panelOpen = false;
let activeZone = null;

const renderers = {
  about() {
    const c = CONFIG.about;
    return `<p class="lead">${c.lead}</p>
      <p class="lead" style="font-size:15px;color:#55517a">${c.text}</p>
      <div class="chips">${c.chips.map(x => `<span class="chip">${x}</span>`).join('')}</div>
      <p class="lead" style="font-size:14px;margin-top:10px">📍 ${CONFIG.location}</p>`;
  },
  projects() {
    return CONFIG.projects.map(p => `
      <div class="proj">
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <div class="tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        ${p.link ? `<a class="plink" href="${p.link}" target="_blank" rel="noopener">Learn more →</a>` : ''}
      </div>`).join('');
  },
  skills() {
    const bars = CONFIG.skills.map(s => `
      <div class="skill"><span>${s.name}</span><div class="bar"><i style="width:${s.level}%"></i></div></div>`).join('');
    return `<p class="lead">Things I'm good at 👇</p>` + bars;
  },
  contact() {
    const c = CONFIG.contact;
    return `<p class="lead">Want to collaborate, talk fashion retail, or explore digital solutions? My inbox and phone are always open 💌</p>
      <div class="cbtns">
        <a class="cbtn mail" href="mailto:${c.email}">✉️ ${c.email}</a>
        <a class="cbtn fb" href="${c.facebook}" target="_blank" rel="noopener">👍 Facebook</a>
        <a class="cbtn ph" href="tel:${c.phoneUAE.replace(/\s/g, '')}">📱 UAE ${c.phoneUAE}</a>
        <a class="cbtn ph" href="tel:${c.phoneBD.replace(/\s/g, '')}">📱 BD ${c.phoneBD}</a>
      </div>`;
  }
};

function openPanel(zone) {
  panelTitle.textContent = zone.label.charAt(0) + zone.label.slice(1).toLowerCase();
  panelDot.style.background = '#' + zone.color.toString(16).padStart(6, '0');
  panelBody.innerHTML = renderers[zone.id]();
  panelEl.classList.remove('hidden');
  panelOpen = true;
  keys.up = keys.down = keys.left = keys.right = false;
  Sound.ding();
}
function closePanel() {
  if (!panelOpen) return;
  panelEl.classList.add('hidden');
  panelOpen = false;
}
document.getElementById('panelClose').addEventListener('click', closePanel);
document.getElementById('panelBackdrop').addEventListener('click', closePanel);

/* HUD buttons */
document.getElementById('btnSound').addEventListener('click', (e) => {
  Sound.init();
  const m = Sound.toggle();
  e.currentTarget.textContent = m ? '🔇' : '🔊';
});
const helpEl = document.getElementById('help');
document.getElementById('btnHelp').addEventListener('click', () => helpEl.classList.toggle('hidden'));
document.getElementById('helpClose').addEventListener('click', () => helpEl.classList.add('hidden'));
helpEl.addEventListener('click', (e) => { if (e.target === helpEl) helpEl.classList.add('hidden'); });

/* Fill CONFIG-driven DOM */
document.getElementById('hudName').textContent = CONFIG.name;
document.getElementById('startTitle').textContent = CONFIG.name;
document.getElementById('startTag').textContent = CONFIG.tagline;
document.title = `${CONFIG.name} — 3D Portfolio`;

/* ================================================================
   🗺️ Minimap
   ================================================================ */
const mm = document.getElementById('minimap').getContext('2d');
function drawMinimap() {
  const S = 132, c = S / 2, k = (S / 2 - 8) / WORLD_R;
  mm.clearRect(0, 0, S, S);
  mm.beginPath(); mm.arc(c, c, WORLD_R * k, 0, 7); mm.strokeStyle = 'rgba(255,255,255,.5)'; mm.lineWidth = 2; mm.stroke();
  for (const z of ZONES) {
    mm.beginPath(); mm.arc(c + z.pos.x * k, c + z.pos.z * k, 5, 0, 7);
    mm.fillStyle = '#' + z.color.toString(16).padStart(6, '0'); mm.fill();
    mm.lineWidth = 1.5; mm.strokeStyle = '#fff'; mm.stroke();
  }
  mm.beginPath(); mm.arc(c + START.x * k, c + START.z * k, 3, 0, 7); mm.fillStyle = 'rgba(255,255,255,.6)'; mm.fill();
  mm.save();
  mm.translate(c + carState.pos.x * k, c + carState.pos.z * k);
  mm.rotate(Math.PI - carState.heading);
  mm.beginPath(); mm.moveTo(0, -6); mm.lineTo(4.5, 5); mm.lineTo(-4.5, 5); mm.closePath();
  mm.fillStyle = '#fff'; mm.fill(); mm.lineWidth = 1.5; mm.strokeStyle = '#2d2a45'; mm.stroke();
  mm.restore();
}

/* ================================================================
   🔁 Main loop
   ================================================================ */
const clock = new THREE.Clock();
let camBlend = 0;
const desiredCam = new THREE.Vector3();
const lookTarget = new THREE.Vector3();

function knockCheck() {
  for (const kb of knockables) {
    if (kb.state !== 'idle') continue;
    const p = kb.worldPos || kb.obj.position;
    const px = p.x - carState.pos.x, pz = p.z - carState.pos.z;
    const d = Math.hypot(px, pz);
    if (d < kb.r + 0.9 && Math.abs(carState.speed) > 1) {
      kb.state = 'fall';
      kb.prog = 0;
      kb.dirX = px / (d || 1);
      kb.dirZ = pz / (d || 1);
      Sound.thock();
    }
  }
}

function updateKnockables(dt) {
  for (const kb of knockables) {
    if (kb.state === 'idle') continue;
    if (kb.state === 'fall') {
      kb.prog = Math.min(1, kb.prog + dt * 2.4);
      const ang = kb.prog * 1.35;
      kb.obj.rotation.x = kb.dirZ * ang;
      kb.obj.rotation.z = -kb.dirX * ang;
      if (kb.prog >= 1) { kb.state = 'hold'; kb.hold = rnd(1.2, 2.2); }
    } else if (kb.state === 'hold') {
      kb.hold -= dt;
      if (kb.hold <= 0) kb.state = 'back';
    } else if (kb.state === 'back') {
      kb.prog = Math.max(0, kb.prog - dt * 1.3);
      const ang = kb.prog * 1.35;
      kb.obj.rotation.x = kb.dirZ * ang;
      kb.obj.rotation.z = -kb.dirX * ang;
      if (kb.prog <= 0) kb.state = 'idle';
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;

  /* ----- driving physics ----- */
  if (started && !panelOpen) {
    const input = (keys.up ? 1 : 0) - (keys.down ? 1 : 0);
    const ACCEL = 13, BRAKE = 20;
    if (input > 0) carState.speed += ACCEL * dt;
    else if (input < 0) carState.speed -= (carState.speed > 0.5 ? BRAKE : ACCEL * 0.55) * dt;
    carState.speed -= carState.speed * 0.9 * dt;
    carState.speed = THREE.MathUtils.clamp(carState.speed, -7, 16);

    const steerTarget = ((keys.left ? 1 : 0) - (keys.right ? 1 : 0)) * 0.55;
    carState.steer += (steerTarget - carState.steer) * Math.min(1, 9 * dt);
    carState.heading += carState.steer * THREE.MathUtils.clamp(carState.speed / 7, -1, 1) * 2.1 * dt;

    const fwd = new THREE.Vector3(Math.sin(carState.heading), 0, Math.cos(carState.heading));
    carState.pos.addScaledVector(fwd, carState.speed * dt);

    const d = Math.hypot(carState.pos.x, carState.pos.z);
    if (d > WORLD_R) {
      carState.pos.multiplyScalar(WORLD_R / d);
      carState.speed *= -0.35;
      Sound.thock();
    }

    knockCheck();
  } else {
    carState.speed -= carState.speed * 3 * dt;
    carState.steer *= 0.9;
  }

  /* ----- apply to car ----- */
  car.position.copy(carState.pos);
  car.rotation.y = carState.heading;
  const spin = (carState.speed * dt) / 0.34;
  for (const w of wheels) {
    w.roll.rotation.x += spin;
    if (w.steerable) w.pivot.rotation.y = carState.steer * 0.7;
  }
  // subtle body roll
  car.rotation.z = -carState.steer * Math.min(Math.abs(carState.speed) / 16, 1) * 0.06;

  updateKnockables(dt);

  /* ----- zone triggers ----- */
  if (started && !panelOpen) {
    let hit = null;
    for (const z of ZONES) {
      if (Math.hypot(carState.pos.x - z.pos.x, carState.pos.z - z.pos.z) < z.r) { hit = z; break; }
    }
    if (hit && activeZone !== hit.id) { activeZone = hit.id; openPanel(hit); }
    else if (!hit) activeZone = null;
  }

  /* ----- ambient animation ----- */
  for (const c of clouds) {
    c.g.position.x += c.speed * dt;
    if (c.g.position.x > 95) c.g.position.x = -95;
    c.g.position.y = c.baseY + Math.sin(t * 0.5 + c.phase) * 0.7;
  }
  for (const f of flags) f.fg.rotation.y = Math.sin(t * 2.2 + f.phase) * 0.25;

  /* ----- camera + speed FOV kick ----- */
  if (!started) {
    const a = t * 0.18;
    camera.position.set(Math.cos(a) * 34, 20, Math.sin(a) * 34);
    camera.lookAt(0, 0, 0);
  } else {
    camBlend = Math.min(1, camBlend + dt / 1.4);
    const fwd = new THREE.Vector3(Math.sin(carState.heading), 0, Math.cos(carState.heading));
    desiredCam.copy(carState.pos).addScaledVector(fwd, -9.2);
    desiredCam.y = 5.4;
    const lerpK = camBlend < 1 ? 2.2 * dt : 1 - Math.pow(0.0015, dt);
    camera.position.lerp(desiredCam, lerpK);
    lookTarget.copy(carState.pos).addScaledVector(fwd, 5);
    lookTarget.y = 1.4;
    camera.lookAt(lookTarget);
    const targetFov = 60 + Math.min(Math.abs(carState.speed) / 16, 1) * 9;
    camera.fov += (targetFov - camera.fov) * Math.min(1, 4 * dt);
    camera.updateProjectionMatrix();
  }

  Sound.setEngine(carState.speed);
  drawMinimap();
  renderer.render(scene, camera);
}
animate();

/* resize */
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
