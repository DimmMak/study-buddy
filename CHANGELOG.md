# 📜 cowatch Changelog

## v1.2.0 — 2026-04-30 — YouTube auto-open

**`cowatch-youtube.user.js` v1.2.0** — auto-clicks the "Show transcript" button so the user no longer has to do it manually.

- Detects when the transcript panel isn't open and clicks `ytd-video-description-transcript-section-renderer button` if its text matches `/show transcript/i`
- One-shot per video URL — closing the panel intentionally won't trigger a re-open battle
- SPA navigation to a new video resets the auto-open flag for the new URL
- Same UX as Coursera now: load page → wait ~6s → click green indicator → transcript on clipboard

---

## v1.1.0 — 2026-04-30 — YouTube 2026 selector fix

**`cowatch-youtube.user.js` v1.1.0** — patched after YouTube renamed the transcript DOM elements.

- Container selector: `ytd-transcript-segment-renderer` → `transcript-segment-view-model`
- Inner text selector: `.segment-text, yt-formatted-string.segment-text` → `.ytAttributedStringHost`
- Old selectors retained as fallback so the script works on both old and new YT layouts
- Discovered live on the user's video — selectors verified by Chrome MCP probe inside the running tab (273 segments, 35,948 chars captured cleanly)

### How we found it
1. Indicator stayed yellow ("open transcript panel") even with the panel visibly open
2. Probed the live page DOM via Chrome MCP `javascript_tool`
3. Found `transcript-segment-view-model` was the new wrapper for elements containing `MM:SS` timestamps
4. Inspected the inner structure — the actual line text lives in a `<span class="ytAttributedStringHost">`
5. Patched, re-served via local HTTP, Tampermonkey detected the version bump and offered "Update"

---

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
