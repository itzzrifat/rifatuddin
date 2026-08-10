# 🚗 Rifat Uddin — 3D Interactive Portfolio (Bruno Simon style)

Low-poly playful 3D world — car drive kore ghura jay, boro 3D word gulo te bump korle
portfolio sections khule (ABOUT / PROJECTS / SKILLS / CONTACT).

## ▶️ Run korbo kivabe

Jekono static server cholbe:

```bash
cd portfolio
python3 -m http.server 8000
# ba: npx serve
```

Tarpor browser e → `http://localhost:8000`

⚠️ Directly `index.html` double-click korle cholbe na (ES modules + font JSON load lage,
tai server dorkar).

## ✏️ Nijer info boshabo kivabe (SOHHEJ!)

`main.js` er onek upore **`CONFIG`** object ta ache — sob content okhane:

```js
const CONFIG = {
  name: "Tomar Naam",              // ← naam
  tagline: "Creative Developer",    // ← title
  location: "Dhaka, Bangladesh 🇧🇩",
  about: { ... },                   // ← about section text + chips
  skills: [                         // ← skill name + level (0-100)
    { name: "JavaScript", level: 92 },
  ],
  projects: [                       // ← project title, desc, tags, link
    { title: "Neon Shop 🛍️", ... link: "https://github.com/..." },
  ],
  contact: { email, github, linkedin, twitter }
}
```

File save kore browser refresh — done! Kono build step nei.

## 🎮 Controls

| Action | Keys |
|---|---|
| Drive | `W A S D` ba arrow keys |
| Reset car | `R` |
| Close panel | `Esc` |
| Mobile | On-screen touch buttons |

## 🎨 Customize ideas

- **Colors**: `main.js` er `COL` object (car, grass, sky...)
- **Car color**: `COL.carBody` change koro
- **Zone positions**: `ZONES` array
- **World size**: `WORLD_R`

## 🚀 Deploy (free)

Ei folder ta jekono static host e upload kore dao:

- **GitHub Pages** — repo te push → Settings → Pages
- **Netlify / Vercel** — drag & drop `portfolio` folder
- **Cloudflare Pages** — same

Sob library local (`lib/` folder), tai kono CDN/internet dependency nei (Google Fonts chara,
seta offline holeo fallback font e cholbe).

---

Inspired by [bruno-simon.com](https://bruno-simon.com) 🙏
