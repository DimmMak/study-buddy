# 🐒 Tampermonkey Userscripts

Userscripts that capture live lecture transcripts to `localStorage` so the [`cowatch`](../SKILL.md) Claude skill can read them on demand.

---

## 📜 Available scripts

| Script | Site | Status | Notes |
|---|---|---|---|
| [`cowatch-coursera.user.js`](cowatch-coursera.user.js) | coursera.org/learn/* | ✅ Stable | Auto-detects transcript |
| [`cowatch-youtube.user.js`](cowatch-youtube.user.js) | youtube.com/watch* | ✅ Stable (v1.2) | Auto-opens transcript panel; uses YT's 2026 `transcript-segment-view-model` selector with legacy fallback |

PRs welcome for: Udemy, edX, Vimeo, Khan Academy, MIT OCW, anywhere with a transcript pane.

---

## 🛠️ Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) (Chrome / Firefox / Safari / Edge)
2. Click the Tampermonkey icon → **Create a new script**
3. Replace the default content with the contents of the relevant `.user.js` file
4. **Cmd/Ctrl + S** to save
5. Refresh any matching page (e.g., a Coursera lecture, a YouTube video)
6. You should see a green badge in the bottom-right corner: `📺 Cowatch: 1432c | t=2:14`

That badge proves the script is working. Click it to copy the current transcript to your clipboard.

---

## 🧱 Storage schema

All scripts write to two `localStorage` keys (overwritten every 3 seconds):

```
cowatch_transcript   string       // full transcript text up to current moment
cowatch_meta         JSON object  // metadata (see below)
```

The `cowatch_meta` shape:

```json
{
  "url": "https://www.coursera.org/learn/prompt-engineering/lecture/...",
  "title": "Module 1 - Overview of Large Language Models | Coursera",
  "timestamp": "2026-04-16T15:42:18.123Z",
  "videoTime": "2:14",
  "activeText": "they're learning patterns from our human language",
  "charCount": 1432,
  "phraseCount": 87
}
```

The `/study-buddy` skill reads these via:

```js
const meta = JSON.parse(localStorage.getItem('cowatch_meta') || '{}');
const transcript = localStorage.getItem('cowatch_transcript') || '';
```

…executed via the [Claude in Chrome](https://www.anthropic.com/claude-code) browser MCP's JavaScript tool.

---

## 🌱 Porting to a new site

To add support for Udemy, Khan Academy, Vimeo, etc.:

### 1. Copy a starter
Use `cowatch-youtube.user.js` as your template (it's the most general).

### 2. Update the script header
```js
// @name         study-buddy — {Site} Transcript Capture
// @match        https://www.{site}.com/{lecture-path}*
```

### 3. Update the transcript selector
Each site uses different DOM. Open DevTools on a lecture page, find the transcript element, copy its selector. Replace the line:

```js
const segments = document.querySelectorAll('transcript-segment-view-model, ytd-transcript-segment-renderer');
```

With your site's equivalent. Then update the inner `.ytAttributedStringHost, .segment-text` selector to match the per-line element.

> **Tip:** sites rename DOM elements over time (YouTube did so in 2026 — `ytd-transcript-segment-renderer` → `transcript-segment-view-model`). When that happens, prefer extending the selector with a fallback (`new-name, old-name`) instead of replacing — the script keeps working on stragglers running cached page versions.

### 4. Detect the active phrase
Most sites highlight the currently-spoken phrase with a CSS class. Find it and update:

```js
const active = document.querySelector('your-active-selector');
```

If your site doesn't highlight, just leave `activeText` empty — it's optional.

### 5. Test
- Save the script
- Open a lecture
- Check that the green badge appears with a non-zero character count
- Check that the count increases as the lecture plays

### 6. PR it
File: `cowatch-{site}.user.js`. Update this README's table. Done.

---

## 🔒 Privacy

These scripts:
- Run **locally** in your browser only
- Write to **your** localStorage only
- Make **no network calls** (no telemetry, no phone-home)
- Do not modify the lecture page beyond adding the small floating badge

If you find any of those untrue, open an issue immediately — that would be a bug.

---

🃏📺👥
