# 🐾 Animal Scanner

A critter-collecting web app: point your camera at a real animal, bird, or bug, and the app identifies the exact species with Claude AI — then adds it to your Pokédex-style collection.

**Live app:** https://tiger-works.github.io/animal-scanner/

## Features

- 📸 **Real camera scanning** — live camera preview (front/back) right in the app, works on iPhone and iPad
- 🤖 **AI identification** — Claude names the exact species and writes kid-friendly facts, habitat, and safety notes
- 📚 **Growing collection** — 16 base critters to find, plus brand-new ✨ discovered species whenever the AI spots something outside the list
- 💾 Collection saved in the browser; works in demo mode (pretend scans) when the AI backend isn't configured

## How it works

The app is a single `index.html` — no build step. Open it on GitHub Pages (HTTPS is required for camera access).

AI scans route through a tiny Supabase Edge Function (`supabase/functions/claude-proxy/index.ts`) that holds the Anthropic API key server-side, pins the model, and caps token usage. The public HTML never contains the key.

```
Browser (index.html) ──POST image──▶ Supabase Edge Function ──▶ Claude API
                                        (holds ANTHROPIC_API_KEY)
```

### Deploying the proxy

```sh
supabase functions new claude-proxy        # paste in supabase/functions/claude-proxy/index.ts
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
supabase functions deploy claude-proxy --no-verify-jwt
```

Then paste the function URL into `BACKEND_URL` near the top of the `<script>` in `index.html`. Leave it `''` for demo mode.

---

Built in the App Architects workshop. 🐯
