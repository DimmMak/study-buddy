# 📺👥 cowatch

> **Live study buddy for Claude Code.** Watches lectures with you in your browser, reacts in real-time to what's on screen, and helps you capture the right notes at the right moments.

A Claude `.skill` + Tampermonkey userscript pipeline. Open source, MIT licensed.

```
┌──────────────────────────────────────────────────────────────┐
│  YOU                CLAUDE                  COWATCH SKILL    │
│   │                   │                          │           │
│   ├──watches lecture──┤                          │           │
│   │                   │                          │           │
│   ├──"thoughts?"──────►──reads transcript───────►├─reacts────┤
│   │                   │                          │           │
│   ├──"capture that"──►──generates capture───────►├─suggests──┤
│   │                   │                          │           │
│   └──"done"──────────►──end-of-lecture flow─────►├─wraps up──┤
└──────────────────────────────────────────────────────────────┘
```

---

## 🎯 What this is (and isn't)

**It IS:**
- 📺 A real-time co-watcher that pulls live transcripts from your browser tab
- 🧠 A reactive study partner that understands the lecture context
- ⚡ A capture assistant that suggests perfectly-timed notes
- 🃏 An open standard you can extend to any video site

**It is NOT:**
- ❌ A continuous surveillance tool (cue-driven, not always-on)
- ❌ A full transcription service (uses the site's existing transcript when available)
- ❌ A note-taking app (it suggests captures, you decide where they go)

---

## 🚀 Install (60 seconds)

### 1. Install Tampermonkey
[Get it here](https://www.tampermonkey.net/) — Chrome / Firefox / Safari / Edge

### 2. Install the userscript
- Click the Tampermonkey icon → **Create a new script**
- Paste contents of [`tampermonkey/cowatch-coursera.user.js`](tampermonkey/cowatch-coursera.user.js)
- **Cmd/Ctrl + S** to save
- Open any Coursera lecture
- You should see a green badge in the bottom-right: `📺 Cowatch: 1432c | t=2:14`

### 3. Install the Claude skill
Drop [`SKILL.md`](SKILL.md) into your Claude skills directory:

```bash
# macOS / Linux
mkdir -p ~/.claude/skills/cowatch
curl -o ~/.claude/skills/cowatch/SKILL.md https://raw.githubusercontent.com/DimmMak/cowatch/main/SKILL.md

# Or just clone the repo
git clone https://github.com/DimmMak/cowatch.git ~/.claude/skills/cowatch-repo
ln -s ~/.claude/skills/cowatch-repo/SKILL.md ~/.claude/skills/cowatch/SKILL.md
```

### 4. Use it
In any Claude Code session:

```
/cowatch i'm watching, follow along
```

---

## 🎬 The cue vocabulary

Talk to cowatch in plain English. It maps your words to actions:

| You say... | Cowatch does... |
|---|---|
| `look` / `where are we?` | Reads the latest transcript chunk, summarizes in 2-3 sentences |
| `thoughts?` / `is this important?` | Honest take on the current topic + flags MEMORIZE candidates |
| `capture that` / `save this` | Generates a perfectly-timed `/capture` command for you to run |
| `explain that` / `wait what?` | ELI5 explanation + analogy |
| `is this in my notes?` | Searches your repo for the term |
| `quiz me` | First-letter recall question on what was just said |
| `next` / `continue` | Acknowledges, waits for next cue |
| `done` / `lecture's over` | End-of-lecture flow: top takeaways + ready-to-paste captures |

---

## 🐒 Supported sites

| Site | Status | Script |
|---|---|---|
| ✅ Coursera | Stable | [`cowatch-coursera.user.js`](tampermonkey/cowatch-coursera.user.js) |
| ✅ YouTube | Stable | [`cowatch-youtube.user.js`](tampermonkey/cowatch-youtube.user.js) |
| 🟡 Udemy | PRs welcome | — |
| 🟡 edX | PRs welcome | — |
| 🟡 Vimeo | PRs welcome | — |

Adding a new site is ~30 lines of JS. See [`tampermonkey/README.md`](tampermonkey/README.md) for the porting guide.

---

## 💡 Why this is different from Otter / Read.ai / Notion AI

| Tool | Live observation | Personal context | Cue-driven | Capture suggestions |
|---|:---:|:---:|:---:|:---:|
| **cowatch** | ✅ | ✅ | ✅ | ✅ |
| Otter.ai | ✅ | ❌ | ❌ | ❌ |
| Read.ai | 🟡 (post-hoc) | ❌ | ❌ | ❌ |
| Notion AI | ❌ | ✅ | 🟡 | ❌ |
| Custom GPT + browse | 🟡 | 🟡 | ✅ | ❌ |

The combination of all four is what makes cowatch novel: **it watches with you, knows your prior notes, only speaks when cued, and suggests captures tied to your specific knowledge graph.**

---

## 🔒 Privacy

- Transcripts live in **your browser's localStorage only**
- **No external network calls** — the userscript doesn't phone home
- **No telemetry** — there is none, the project doesn't have a backend
- Your Claude session reads the transcript on demand via the [Claude in Chrome](https://www.anthropic.com/claude-code) browser MCP (also local)

---

## 🛠️ How it actually works

```
1. Tampermonkey script runs on the lecture page
2. Every 3 seconds, it samples the transcript DOM
3. Writes clean text to localStorage:
     localStorage.cowatch_transcript   = "...full text so far..."
     localStorage.cowatch_meta         = { url, title, videoTime, activeText, ... }

4. When you cue Claude with "look", "thoughts?", etc.:
   The /cowatch skill executes JavaScript via Claude in Chrome MCP
   to read those localStorage keys directly. Clean text, no OCR.

5. Claude reacts based on transcript + your repo context.
```

See [`tampermonkey/README.md`](tampermonkey/README.md) for the full storage schema.

---

## 🤝 Contributing

PRs welcome. Easiest contribution: add support for a new video site by writing a new userscript variant. See [`tampermonkey/README.md`](tampermonkey/README.md) for the porting guide.

---

## 📜 License

MIT — do whatever you want with it.

---

## 🃏 Built by

[@DimmMak](https://github.com/DimmMak) as part of a broader exploration of `.skill`-based agent factories.

**Sister projects:**
- [ClaudeNotes](https://github.com/DimmMak/claudenotes) — agent factory for personal note-taking (where cowatch was born)
- [Promptlatro](https://github.com/DimmMak/promptlatro) — roguelike that drills prompt engineering patterns
- [CodeRecall](https://github.com/DimmMak/coderecall) — first-letter recall drilling for SQL/Python

🎮📺👥
