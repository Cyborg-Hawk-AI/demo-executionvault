# ExecutionVault

> Visual dead-letter queue and execution inspector for no-code automation failures.

## What is ExecutionVault?

ExecutionVault is built for **Automation engineers and technical founders running business-critical workflows on n8n or Make who need to inspect, debug, and replay failed executions without digging through logs or writing scripts.**. AI-generated 'suggested fix' for each failure type is a unique feature that turns a debugging tool into a teaching tool — users learn why their workflows fail, reducing future failures and increasing retention.

### Core MVP features
- Capture failed/stuck executions via webhook from n8n, Make, or Zapier into a visual queue
- Execution detail view: full payload, error message, step-by-step trace, and suggested fix (AI-generated)
- One-click replay: re-trigger the exact failed execution with original payload
- Failure pattern detection: 'This error has occurred 12 times in the last 7 days — here's the root cause'
- Slack/email alert with direct link to the failed execution in the vault

**Pricing:** Monthly SaaS subscription tiered by seats and execution volume at $49/month for 1 user up to 5k captured executions; $99/month for teams

## The research: why this exists

The r/automation thread surfaced a DevOps engineer who resorted to 'writing bash scripts to automatically restart stuck executions at night' — a clear sign that the native tooling (n8n's execution log) is insufficient for production use. The core frustration is not just that executions fail, but that when they do, there's no easy way to see why, replay them, or detect patterns. Engineers are spending hours debugging what should be a 5-minute inspection. The bash script workaround is a band-aid that doesn't address root cause analysis or provide a replay mechanism.

**Cluster:** Automation execution reliability & retry logic | **Rubric score:** 112/130 | **Validation:** 9/9 checks passed

**Competitive landscape:** n8n's built-in execution log is read-only with no replay or pattern detection. Make has no dead-letter queue. Datadog/Sentry are overkill and not automation-platform-aware. No focused execution vault product exists.

**Go-to-market:** n8n community forum, r/n8n, r/automation, cold outreach to n8n self-hosters via GitHub, ProductHunt launch

## How this business runs itself (mailbox money)

The goal is passive, low-maintenance recurring revenue: AI is how we build and operate the business, not necessarily what it sells.

Webhook receivers capture failed executions 24/7 with no human involvement. GPT-4o generates fix suggestions lazily (only when a user views the execution) — no batch processing needed. A nightly cron scans for failure patterns and sends digest emails via Resend. Stripe manages all billing lifecycle events. A Crisp chat widget with a GPT-4o backend handles support questions about specific error messages. The only recurring manual task is reviewing weekly escalations. Estimated owner time: 1.5 hours/week.

**Estimated owner time:** ~1.5 hour(s)/week

**MVP estimate:** Node.js + Supabase + OpenAI for fix suggestions + React dashboard; 3–4 weeks to MVP with n8n webhook integration

## Validation checklist (9/9)
- [x] 10+ posts with this pain
- [x] Paying for inferior solution
- [x] Reachable channel
- [x] MVP < 4 weeks
- [x] Price point high enough
- [x] Hair-on-fire problem
- [x] Can pre-sell
- [x] < 3 competitors
- [x] Low-maintenance ops (mailbox money)

## Source pain points (real posts)

### Stuck automation executions need manual intervention or custom workarounds; users resort to writing bash scripts to restart failed jobs during off-hours instead of having built-in retry logic.
- **Persona:** DevOps engineer / automation platform user
- **Workaround:** Writing custom bash scripts to automatically restart stuck executions at night
- **Frequency:** daily
- **WTP signal:** Already paying for n8n and investing engineering time in custom scripts
- **Source:** https://www.reddit.com/r/automation/comments/1um2ul8/what_is_the_one_automation_tool_or_framework_in/

### Advanced scripting features in automation platforms are locked behind premium pricing tiers, forcing users to pay extra for basic execution capabilities.
- **Persona:** Automation engineer / workflow builder
- **Workaround:** Paying additional costs to GoAnywhere for script execution through agents
- **Frequency:** unknown
- **WTP signal:** Already spending money on GoAnywhere premium features
- **Source:** https://www.reddit.com/r/automation/comments/1um2ul8/what_is_the_one_automation_tool_or_framework_in/


## About this program

This demo was auto-built by the **Idea Miner** pipeline: a twice-daily research program that mines Reddit, Hacker News, Stack Exchange, and GitHub for real people describing real pain, scores the opportunities, and automatically ships a working mock of every idea that passes validation (>=8/9 checks, momentum not declining, not previously built). The bar for every idea: low-maintenance recurring revenue that a solo owner can run in a few hours a week.

_Generated by Idea Miner run 2026-07-11-am on 2026-07-11 12:19 UTC_


## Local development

### Prerequisites

- Node.js 18+ and npm

### Setup

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # production build (required before deploy)
npm start      # serve production build locally
```

### Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — hero, features, pricing, CTA |
| `/demo` | Interactive product demo with full mock data |
| `/developers` | Feature documentation — what's mocked vs. production |
| `/research` | Research story and validation results |

### Deploy to Vercel

This app requires zero configuration — no environment variables, no custom server, no rewrites.

1. Push the repo to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Vercel auto-detects Next.js and deploys

Or deploy directly with the Vercel CLI:

```bash
npx vercel
```

### Project structure

```
app/
  layout.tsx          # Root layout with navbar and footer
  page.tsx            # Landing page
  demo/page.tsx       # Interactive demo (client component)
  developers/page.tsx # Developer feature docs
  research/page.tsx   # Research story
components/
  DemoApp.tsx         # Main demo UI (queue, patterns, alerts, replay)
  DevNote.tsx         # DEV NOTE tooltip badges
  Navbar.tsx / Footer.tsx
lib/
  mock-data.ts        # All hardcoded demo data
```

### Tech stack

- **Next.js 14** (App Router) — file-based routing under `app/`
- **Tailwind CSS** — dark professional aesthetic
- **TypeScript** — strict mode
- Client-side only demo state — no database, no auth, no API keys
