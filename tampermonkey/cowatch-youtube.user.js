// ==UserScript==
// @name         cowatch — YouTube Transcript Capture
// @namespace    https://github.com/DimmMak/cowatch
// @version      1.2.0
// @description  Captures live YouTube lecture transcripts to localStorage so the /cowatch skill can read them on demand. v1.2: auto-click "Show transcript" once per video. v1.1: support YT's 2026 selector (transcript-segment-view-model + .ytAttributedStringHost).
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
        // YouTube transcript DOM (2026): segments are <transcript-segment-view-model>,
        // text lives in a <span class="ytAttributedStringHost"> child.
        // Legacy selector ytd-transcript-segment-renderer kept as fallback.
        // User must open the transcript panel first: scroll to description → "Show transcript".
        const segments = document.querySelectorAll(
            'transcript-segment-view-model, ytd-transcript-segment-renderer'
        );
        if (!segments.length) {
            indicator.textContent = '📺 Cowatch: open transcript panel (description → Show transcript)';
            indicator.style.color = '#fbbf24';
            return;
        }

        const extractText = s => {
            const span = s.querySelector('.ytAttributedStringHost, .segment-text, yt-formatted-string.segment-text');
            return span ? span.textContent.trim() : '';
        };

        const fullText = Array.from(segments)
            .map(extractText)
            .filter(Boolean)
            .join(' ');

        // Active segment — try multiple class/attr conventions across YT versions.
        const active = document.querySelector(
            'transcript-segment-view-model.active, transcript-segment-view-model[active], ytd-transcript-segment-renderer.active, ytd-transcript-segment-renderer[active]'
        );
        const activeText = active ? extractText(active) : '';

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

    // ─── Auto-open transcript (once per video URL) ────────────────
    // Tracks which video URLs we've already attempted, so closing the panel
    // doesn't trigger a re-open battle. SPA nav to a new video = new attempt.
    const autoOpenAttempted = new Set();

    function autoOpenTranscript() {
        const url = location.href;
        if (autoOpenAttempted.has(url)) return;
        // Already open?
        if (document.querySelectorAll('transcript-segment-view-model, ytd-transcript-segment-renderer').length) {
            autoOpenAttempted.add(url);
            return;
        }
        const btn = document.querySelector('ytd-video-description-transcript-section-renderer button');
        if (btn && /show transcript/i.test(btn.textContent || '')) {
            btn.click();
            autoOpenAttempted.add(url);
            console.log('[Cowatch] Auto-clicked "Show transcript".');
        }
    }

    // ─── Start the loop ────────────────────────────────────────────
    setInterval(() => {
        autoOpenTranscript();
        captureTranscript();
    }, SAMPLE_INTERVAL_MS);
    autoOpenTranscript();
    captureTranscript();

    console.log('[Cowatch] YouTube userscript v1.2 loaded. Sampling every 3s. Auto-open enabled.');
})();
