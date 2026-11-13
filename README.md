# swasti. — portfolio

Static site: `index.html`, `styles.css`, `script.js`, `assets/`. No build step.

**Run locally:** `python3 -m http.server 8000` → http://localhost:8000

**Edit content:** projects, the experience log, the stack and the chat agent's answers are all plain arrays at the top of `script.js` (`PROJECTS`, `RECORD`, `STACK`, `KB`).

**Deploy:** drag the folder into vercel.com/new, or push to GitHub and enable GitHub Pages / Netlify.

Deep links: `/#polygraph`, `/#papertrail`, `/#handshake` … open that project's drawer directly.

## Stretchy portrait (face.js)
Drag the hero photo to stretch it; pull hard and the tech stack spills out (icons in `tech-icons.js`).
Optional expression photos — same framing and plain background as `assets/swasti.jpg`:
- `assets/swasti-pull.jpg` — shown while being pulled (surprised / "ouch")
- `assets/swasti-release.jpg` — flashes after letting go (laughing)
Just drop them in; no code changes needed.
