// ==UserScript==
// @name         ClaudeNotes Cowatch — Coursera Transcript Capture
// @namespace    https://github.com/DimmMak/claudenotes
// @version      1.0.0
// @description  Captures live Coursera lecture transcripts to localStorage so the /cowatch skill can read them on demand.
// @author       Danny (DimmMak)
// @match        https://www.coursera.org/learn/*
// @grant        none
// @run-at       document-idle
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
    indicator.textContent = '📺 Cowatch: starting…';
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

    // ─── Capture logic ─────────────────────────────────────────────
    function getVideoCurrentTime() {
        const video = document.querySelector('video');
        if (!video) return 'n/a';
        const t = Math.floor(video.currentTime);
        return `${Math.floor(t/60)}:${String(t%60).padStart(2,'0')}`;
    }

    function captureTranscript() {
        // Coursera renders each transcript phrase with a data-test="phrase" attribute
        const phrases = document.querySelectorAll('[data-test="phrase"]');
        if (!phrases.length) {
            indicator.textContent = '📺 Cowatch: no transcript visible';
            indicator.style.color = '#fbbf24';
            return;
        }

        const fullText = Array.from(phrases)
            .map(p => p.textContent.trim())
            .filter(Boolean)
            .join(' ');

        // Active phrase is the one currently being spoken — Coursera highlights it.
        // Selectors vary; try a couple.
        const active = document.querySelector(
            '[data-test="phrase"].rc-Phrase--active, [data-test="phrase"][class*="active"]'
        );
        const activeText = active ? active.textContent.trim() : '';

        const meta = {
            url: location.href,
            title: document.title,
            timestamp: new Date().toISOString(),
            videoTime: getVideoCurrentTime(),
            activeText: activeText,
            charCount: fullText.length,
            phraseCount: phrases.length
        };

        localStorage.setItem(STORAGE_KEY, fullText);
        localStorage.setItem(META_KEY, JSON.stringify(meta));

        indicator.textContent = `📺 Cowatch: ${fullText.length}c | t=${meta.videoTime}`;
        indicator.style.color = '#4ade80';
    }

    // ─── Start the loop ────────────────────────────────────────────
    setInterval(captureTranscript, SAMPLE_INTERVAL_MS);
    captureTranscript();

    console.log('[Cowatch] Tampermonkey script loaded. Sampling every 3s.');
})();
