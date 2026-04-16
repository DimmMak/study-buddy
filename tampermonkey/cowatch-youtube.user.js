// ==UserScript==
// @name         cowatch — YouTube Transcript Capture
// @namespace    https://github.com/DimmMak/cowatch
// @version      1.0.0
// @description  Captures live YouTube lecture transcripts to localStorage so the /cowatch skill can read them on demand. Requires the user to open the transcript panel manually first time.
// @author       Danny (DimmMak)
// @match        https://www.youtube.com/watch*
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
    indicator.textContent = '📺 Cowatch: open transcript panel';
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

    function getVideoTitle() {
        const el = document.querySelector('h1.ytd-watch-metadata, h1.title');
        return el ? el.textContent.trim() : document.title;
    }

    function captureTranscript() {
        // YouTube transcript panel uses ytd-transcript-segment-renderer elements.
        // The user must open the transcript panel manually first time
        // ("..." menu under video → "Show transcript").
        const segments = document.querySelectorAll('ytd-transcript-segment-renderer');
        if (!segments.length) {
            indicator.textContent = '📺 Cowatch: open transcript panel ("..." → Show transcript)';
            indicator.style.color = '#fbbf24';
            return;
        }

        const fullText = Array.from(segments)
            .map(s => {
                const textEl = s.querySelector('.segment-text, yt-formatted-string.segment-text');
                return textEl ? textEl.textContent.trim() : '';
            })
            .filter(Boolean)
            .join(' ');

        // Active segment — YouTube highlights the current one with the .active class.
        const active = document.querySelector('ytd-transcript-segment-renderer.active, ytd-transcript-segment-renderer[active]');
        const activeText = active
            ? (active.querySelector('.segment-text, yt-formatted-string.segment-text')?.textContent.trim() || '')
            : '';

        const meta = {
            url: location.href,
            title: getVideoTitle() + ' | YouTube',
            timestamp: new Date().toISOString(),
            videoTime: getVideoCurrentTime(),
            activeText: activeText,
            charCount: fullText.length,
            segmentCount: segments.length
        };

        localStorage.setItem(STORAGE_KEY, fullText);
        localStorage.setItem(META_KEY, JSON.stringify(meta));

        indicator.textContent = `📺 Cowatch: ${fullText.length}c | t=${meta.videoTime}`;
        indicator.style.color = '#4ade80';
    }

    // ─── Start the loop ────────────────────────────────────────────
    setInterval(captureTranscript, SAMPLE_INTERVAL_MS);
    captureTranscript();

    console.log('[Cowatch] YouTube userscript loaded. Sampling every 3s.');
    console.log('[Cowatch] If transcript not detected, open the transcript panel: "..." menu → Show transcript');
})();
