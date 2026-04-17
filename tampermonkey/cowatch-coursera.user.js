// ==UserScript==
// @name         Transcript Capture — Coursera
// @namespace    https://github.com/DimmMak/cowatch
// @version      1.2.0
// @description  Captures live Coursera lecture transcripts to localStorage so Claude skills (/courserafied, /cowatch, etc.) can read them on demand. v1.2 renames display to skill-agnostic "Transcript". v1.1 tried 11 selectors.
// @author       Danny (DimmMak)
// @match        https://www.coursera.org/learn/*
// @grant        none
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/DimmMak/cowatch/main/tampermonkey/cowatch-coursera.user.js
// @downloadURL  https://raw.githubusercontent.com/DimmMak/cowatch/main/tampermonkey/cowatch-coursera.user.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'cowatch_transcript';
    const META_KEY = 'cowatch_meta';
    const SAMPLE_INTERVAL_MS = 3000;

    // ─── Floating indicator UI ─────────────────────────────────────
    const indicator = document.createElement('div');
    indicator.id = 'cowatch-indicator';
    indicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.85);
        color: #4ade80;
        padding: 8px 14px;
        border-radius: 8px;
        font-family: monospace;
        font-size: 12px;
        z-index: 999999;
        box-shadow: 0 2px 12px rgba(0,0,0,0.3);
        cursor: pointer;
        user-select: none;
    `;
    indicator.textContent = '📜 Transcript: starting…';
    indicator.title = 'Click to copy current transcript to clipboard';
    document.body.appendChild(indicator);

    indicator.addEventListener('click', () => {
        const text = localStorage.getItem(STORAGE_KEY) || '';
        navigator.clipboard.writeText(text).then(() => {
            const original = indicator.textContent;
            indicator.textContent = '📋 Copied!';
            setTimeout(() => { indicator.textContent = original; }, 1500);
        });
    });

    // ─── Helpers ───────────────────────────────────────────────────
    function getVideoCurrentTime() {
        const video = document.querySelector('video');
        if (!video) return 'n/a';
        const t = Math.floor(video.currentTime);
        return `${Math.floor(t/60)}:${String(t%60).padStart(2,'0')}`;
    }

    // 11 selectors covering Coursera native + popular third-party transcript scripts.
    // Order matters: most specific first.
    const SELECTORS = [
        '[data-test="phrase"]',
        '[data-testid="phrase"]',
        '[data-track-component="phrase"]',
        '.rc-Phrase',
        '.transcript-phrase',
        '[class*="phrase" i]',
        '[class*="caption" i]',
        '[class*="transcript-text" i]',
        '[class*="TranscriptText"]',
        '[class*="cue" i]',
        'span[role="button"][class*="text"]'
    ];

    function findPhrases() {
        for (const sel of SELECTORS) {
            try {
                const found = document.querySelectorAll(sel);
                // Need at least 4 elements to avoid false positives on random spans.
                if (found.length > 3) {
                    return { phrases: found, selector: sel };
                }
            } catch(e) { /* invalid selector for older browsers, skip */ }
        }
        return { phrases: [], selector: null };
    }

    function findActivePhrase() {
        // Try common active-state class names
        const activeSelectors = [
            '.rc-Phrase--active',
            '[class*="active" i]',
            '[class*="current" i]',
            '[class*="playing" i]',
            '[aria-current="true"]'
        ];
        for (const sel of activeSelectors) {
            try {
                const active = document.querySelector(sel);
                if (active && active.textContent.trim().length < 200) {
                    return active.textContent.trim();
                }
            } catch(e) {}
        }
        return '';
    }

    // ─── Main capture function ─────────────────────────────────────
    function capture() {
        const { phrases, selector } = findPhrases();

        if (!phrases.length) {
            indicator.textContent = '📜 no transcript (open transcript tab?)';
            indicator.style.color = '#fbbf24';
            return;
        }

        const fullText = Array.from(phrases)
            .map(p => p.textContent.trim())
            .filter(Boolean)
            .join(' ');

        const activeText = findActivePhrase();

        const meta = {
            url: location.href,
            title: document.title,
            timestamp: new Date().toISOString(),
            videoTime: getVideoCurrentTime(),
            activeText: activeText,
            charCount: fullText.length,
            phraseCount: phrases.length,
            selector: selector
        };

        localStorage.setItem(STORAGE_KEY, fullText);
        localStorage.setItem(META_KEY, JSON.stringify(meta));

        indicator.textContent = `📜 Transcript: ${fullText.length}c | t=${meta.videoTime}`;
        indicator.style.color = '#4ade80';
    }

    // ─── Start the loop ────────────────────────────────────────────
    setInterval(capture, SAMPLE_INTERVAL_MS);
    capture();

    console.log('[Transcript v1.2] loaded. Sampling every 3s with 11 selector fallbacks.');
})();
