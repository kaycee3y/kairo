# Kairo an AI task coach for ADHD

**Built for the IncludAI Neurodiversity Hackathon (Track 1: AI for Learners Who Think Differently), in partnership with Stanford NNEA.**

Kairo is not a to-do list. It's a calm, encouraging AI coach that helps students and young adults with ADHD start tasks they're stuck on by breaking any task into small, doable steps, staying with them when it gets hard, and celebrating progress without ever guilting them for it.

---

## The problem

For many people with ADHD, the hardest part of a task isn't finishing it, it's *starting* it. A vague, overwhelming task like "clean my room" or "study for chemistry" has no obvious first move, and that ambiguity is often enough to stall someone out before they even begin. Most productivity tools assume the hard part is remembering the task. Kairo assumes the hard part is *starting* it, and is built around that instead.

## Who it's for

Students and young adults with ADHD (or anyone who experiences task initiation paralysis) who need a tool that breaks work down for them, in the moment, without judgment rather than another list they have to organize themselves.

## How Kairo uses AI

Kairo's core loop is powered by an LLM (via [Groq](https://groq.com)) operating in two distinct modes:

1. **Task Breakdown** — given any task in plain language, the AI generates a short (3–6 step) roadmap, always starting with an almost zero effort first step (the "snowball" effect), plus a soft, non-strict time estimate.
2. **Empathy Restructure** — if someone is still stuck after multiple attempts, Kairo asks *why* (too big / distracted / tired / don't understand / something else) and generates a targeted, smaller plan based on the actual reason rather than a generic "try again."

Both modes run through a single system prompt tuned specifically for calm, non judgmental, ADHD aware language  explicitly avoiding words like "must," "should," and "failed."

## Features

- **AI task breakdown** — any task, broken into small steps in seconds
- **Focus Mode** — only one step visible at a time, no clutter
- **Gentle stopwatch timer** — counts up (never down), stretches when you need more time instead of penalizing you, and is fully hideable
- **"Need More Time" empathy flow** — after 3 tries on one step, Kairo asks what's making it hard and rebuilds the plan around the real reason
- **XP, levels, and streaks** — lightweight gamification that rewards effort, not just completion
- **Growth journey stats** — a look back at total missions, focus minutes, and streaks
- **Mission history** — every completed mission, kept
- **No accounts, no server-side data** — everything is stored locally in your browser

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Icons | Lucide React |
| State | Zustand |
| Persistence | Browser Local Storage (no backend, no accounts) |
| AI | Groq API (Llama 3.3 70B) |

## Getting started

**Prerequisites:** Node.js 18+, npm, and a free [Groq API key](https://console.groq.com/keys).

```bash
git clone https://github.com/YOUR_USERNAME/kairo.git
cd kairo
npm install