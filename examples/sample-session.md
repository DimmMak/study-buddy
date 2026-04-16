# 🎬 Sample cowatch Session

A walkthrough of what a real co-watching session looks like. Real cues, real reactions.

---

## Setup
- Tampermonkey installed ✅
- `cowatch-coursera.user.js` enabled ✅
- Open in Chrome: a Vanderbilt prompt-engineering lecture
- Green badge appears: `📺 Cowatch: 0c | t=0:00`

---

## Session

```
[hit play on the lecture]

You:    /cowatch i'm watching, follow along

Cowatch: 📺 Got it. Watching:
         "Module 1 - Overview of Large Language Models" (Coursera)
         I'll follow along. Cue me with: look | thoughts | capture | explain | done

[2 minutes pass, lecturer explains tokens]

You:    thoughts?

Cowatch: 📺 At t=2:14 — Jules just hit the core mechanic: LLMs predict
         one token at a time, autoregressively. This is the FOUNDATIONAL
         insight everything else in the course builds on. Worth flagging
         for MEMORIZE.md.

[lecturer keeps going about randomness]

You:    capture that

Cowatch: 📥 Suggested capture (paste this):
         
         /capture memorize: LLMs are autoregressive next-token predictors.
         each output token becomes input for the next prediction. (t=2:14)
         #fundamentals
         
         Run it when ready, then "next" to continue.

You:    [paste the capture command, then says] next

Cowatch: ✅ Logged. Following along.

[3 minutes pass, dense topic on knowledge cutoff]

You:    explain that

Cowatch: 📺 At t=5:42 — Knowledge cutoff = the model only knows what was
         in its training data. ChatGPT (original) cutoff was ~2021.
         
         Analogy: imagine a librarian who fell asleep in 2021. They can
         answer anything from books shelved before then, but ask about
         a 2024 book and they have no idea.
         
         To use newer info → put it in the prompt. The model can READ what
         you give it, just can't recall what it never learned.

[lecture wraps up]

You:    done

Cowatch: 📺 Lecture complete (~12 min). Top 5 takeaways:
         
         1. LLMs predict ONE token at a time, autoregressively (t=2:14)
         2. Randomness is built in — same prompt ≠ same output (t=4:30)
         3. Knowledge cutoff is real, provide new info in prompt (t=5:42)
         4. Context within the prompt selects which pattern activates (t=8:01)
         5. Field evolves fast — bet on timeless patterns (t=10:15)
         
         Ready-to-paste captures:
         
         /capture memorize: LLMs predict ONE token at a time, autoregressively. (t=2:14) #fundamentals
         /capture memorize: randomness is built in. same prompt ≠ same output. (t=4:30) #fundamentals
         /capture memorize: knowledge cutoff is real. new info goes in the prompt. (t=5:42) #fundamentals
         /capture realized: context in the prompt selects which learned pattern activates. (t=8:01) #insight
         /capture quote: "what they're doing is they're taking your input and trying to generate the next word" — jules (t=1:48)
         
         Suggested rotation:
           /sort      → route everything
           /map       → refresh sitemap
           [tomorrow] /recall → drill what stuck
```

---

## What just happened

In ~15 minutes:
- ⚡ You watched a full lecture undistracted
- 📺 Cowatch read the transcript at 4 cue points
- 📥 5 perfectly-timed captures generated (with timestamps!)
- 🧠 One concept explained on demand with an analogy
- 🗂️ Ready to /sort + /recall the next day

**Compare to old-school note-taking:** pause-rewind-scribble-resume-repeat. Cowatch keeps you in flow.

🎮📺👥
