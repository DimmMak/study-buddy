# 📜 cowatch Changelog

## v0.2.0 — 2026-04-18

**World-Class Overhaul shipped.** Part of the fleet-wide upgrade to tree+plugin+unix architecture.

- 🌳 **Tree:** `domain:` field added to frontmatter (learning)
- 🎮 **Plugin:** `capabilities:` block declares reads / writes / calls / cannot
- 🐧 **Unix:** `unix_contract:` block declares data_format / schema_version / stdin_support / stdout_format / composable_with
- 🛡️ Schema v0.3 validation required at install (via `future-proof/scripts/validate-skill.py`)
- 🔗 Install converted to symlink pattern (kills drift between Desktop source and live install)
- 🏷️ Tagged at `v-2026-04-18-world-class` for rollback

See `memory/project_world_class_architecture.md` for the full model.

---


## v1.0.0 — 2026-04-16 — Initial Release

### 🚀 Shipped
- **`SKILL.md`** — Claude `.skill` for live lecture co-watching
  - 8 cue verbs (`look`, `thoughts?`, `capture that`, `explain that`, `is this in my notes?`, `quiz me`, `next`, `done`)
  - Tampermonkey-first transcript pipeline with browser MCP fallback
  - Optional integration with notes-repo conventions (auto-detects MEMORIZE.md, modules/, PREFERENCES.md)
  - Proactive callout system with frequency cap (max 1 per ~5 chunks)
  - End-of-lecture flow generates ready-to-paste capture commands

- **`tampermonkey/study-buddy-coursera.user.js`** — Userscript for Coursera lectures
  - Auto-detects transcript via `[data-test="phrase"]` selector
  - Captures full text + active phrase + video timestamp every 3 seconds
  - Floating green badge UI with click-to-copy
  - Writes to `localStorage` (zero network calls)

- **`tampermonkey/study-buddy-youtube.user.js`** — Userscript for YouTube videos
  - Captures via `ytd-transcript-segment-renderer` selector
  - Requires user to manually open transcript panel ("..." menu → Show transcript)
  - Same storage schema as Coursera variant

- **`tampermonkey/README.md`** — Install guide + storage schema docs + porting guide for new sites

- **README.md** — Pitch, install, cue vocabulary, comparison vs Otter / Read.ai / Notion AI, privacy notes

- **MIT LICENSE** — Use it however

### 💡 Why this exists
Born inside [ClaudeNotes](https://github.com/DimmMak/claudenotes) as the 9th teammate (DITTO #132). Spun out as a standalone project because the live-co-watching pattern is genuinely novel and useful beyond any one notes system. The combination of (1) live browser observation, (2) personal context awareness, (3) cue-driven reactions, and (4) capture suggestions doesn't exist as a single open-source `.skill` anywhere else as of April 2026.

### 🎯 Design principles
- **Cue-driven, not surveillance.** Speaks only when asked.
- **Local-only privacy.** No network, no telemetry, no backend.
- **Site-extensible.** Adding a new lecture site is ~30 lines of JavaScript.
- **Fallback-friendly.** Works without Tampermonkey via browser MCP scraping (slower, less clean).

🎮📺👥
