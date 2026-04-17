# 🤝 Contributing to cowatch

PRs welcome. The fastest, highest-impact contributions are **new site adapters** (Udemy, Khan Academy, edX, Vimeo, etc.).

---

## 🌱 Adding a new site adapter (~30 min)

1. Read [`tampermonkey/README.md`](tampermonkey/README.md) "Porting to a new site"
2. Copy `tampermonkey/study-buddy-youtube.user.js` as your starting template
3. Update the `@match` URL pattern + transcript selector
4. Test on a real lecture page from that site
5. Verify the green badge appears with non-zero character count
6. Add a row to the supported-sites table in both READMEs
7. Open a PR with a screenshot of the badge working

---

## 🐛 Bug reports

Open an issue with:
- Browser + Tampermonkey version
- Site URL (or example URL)
- What the badge shows (color + text)
- Browser console errors (if any)

---

## ✨ Feature requests

Open an issue with the use case. Most useful additions:
- New cue verbs that map to common study patterns
- Auto-pause integration ("if transcript hits dense topic, pause video")
- Per-site customization (e.g., custom selectors via UI)
- Multi-tab capture (watching multiple lectures in parallel)

---

## 📜 Code style

- **JavaScript:** vanilla ES6+, no build tools, no dependencies
- **Markdown:** functional emojis paired (per the project aesthetic 🃏📺)
- **Skill files:** follow the SKILL.md frontmatter spec from Anthropic's `.skill` format

---

## 🔒 Privacy is non-negotiable

PRs that add network calls, telemetry, or external dependencies will be rejected unless they're opt-in and clearly documented. The project's promise: **everything runs locally, your transcripts never leave your machine.**

---

🎮📺👥 Thanks for contributing.
