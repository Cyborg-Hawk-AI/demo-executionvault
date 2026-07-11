import Link from "next/link";

const features = [
  {
    title: "Webhook Capture Queue",
    description:
      "Failed and stuck executions from n8n, Make, and Zapier land in a visual dead-letter queue — no log diving required.",
    icon: "📥",
  },
  {
    title: "Execution Inspector",
    description:
      "Full payload, error message, step-by-step trace, and GPT-4o suggested fix — everything in one view.",
    icon: "🔍",
  },
  {
    title: "One-Click Replay",
    description:
      "Re-trigger the exact failed execution with the original payload. No scripts, no manual copy-paste.",
    icon: "🔄",
  },
  {
    title: "Failure Pattern Detection",
    description:
      "Nightly scans surface recurring errors: 'This error occurred 12 times in 7 days — here's the root cause.'",
    icon: "📊",
  },
  {
    title: "Slack & Email Alerts",
    description:
      "Instant notifications with direct links to the failed execution in your vault. Click through and fix in minutes.",
    icon: "🔔",
  },
  {
    title: "AI Fix Suggestions",
    description:
      "Lazy-loaded GPT-4o analysis teaches your team why workflows fail — turning debugging into learning.",
    icon: "🤖",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-vault-bg to-vault-bg" />
        <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute top-40 right-1/4 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Built for n8n, Make & Zapier teams
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Stop debugging automations
              <br />
              <span className="gradient-text">with bash scripts</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-vault-muted">
              ExecutionVault is a visual dead-letter queue and execution inspector for no-code
              automation failures. Capture, inspect, replay, and learn from every failed workflow.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/demo"
                className="rounded-lg bg-emerald-500 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-600 hover:shadow-emerald-500/40"
              >
                Explore Live Demo
              </Link>
              <Link
                href="/developers"
                className="rounded-lg border border-vault-border bg-vault-card px-8 py-3 text-base font-semibold text-white transition-colors hover:border-emerald-500/50"
              >
                View Integration Docs
              </Link>
            </div>

            <p className="mt-6 text-sm text-vault-muted">
              Trusted by automation engineers at Meridian Analytics, Lumen Home Goods, and 40+ teams
            </p>
          </div>

          {/* Hero preview */}
          <div className="mt-16 mx-auto max-w-5xl">
            <div className="glass-card overflow-hidden shadow-2xl shadow-black/40">
              <div className="flex items-center gap-2 border-b border-vault-border px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs text-vault-muted font-mono">executionvault.io/demo</span>
              </div>
              <div className="grid grid-cols-3 gap-px bg-vault-border p-px">
                <div className="bg-vault-surface p-4">
                  <p className="text-xs font-medium text-vault-muted uppercase tracking-wider">Queue</p>
                  <p className="mt-1 text-2xl font-bold text-red-400">6</p>
                  <p className="text-xs text-vault-muted">failed / stuck</p>
                </div>
                <div className="bg-vault-surface p-4">
                  <p className="text-xs font-medium text-vault-muted uppercase tracking-wider">Captured</p>
                  <p className="mt-1 text-2xl font-bold text-emerald-400">3,847</p>
                  <p className="text-xs text-vault-muted">this month</p>
                </div>
                <div className="bg-vault-surface p-4">
                  <p className="text-xs font-medium text-vault-muted uppercase tracking-wider">Patterns</p>
                  <p className="mt-1 text-2xl font-bold text-amber-400">4</p>
                  <p className="text-xs text-vault-muted">active alerts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-vault-border bg-vault-surface/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Everything you need to debug automations</h2>
            <p className="mt-4 text-vault-muted">
              Native n8n and Make logs are read-only. ExecutionVault gives you replay, patterns, and AI fixes.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="glass-card p-6 transition-all hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5"
              >
                <span className="text-2xl">{feature.icon}</span>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-vault-muted leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 lg:p-12">
            <blockquote className="text-xl font-medium leading-relaxed lg:text-2xl">
              &ldquo;I was writing bash scripts to restart stuck n8n executions at night. ExecutionVault
              replaced all of that with a visual queue and one-click replay.&rdquo;
            </blockquote>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                DK
              </div>
              <div>
                <p className="font-medium">DevOps Engineer</p>
                <p className="text-sm text-vault-muted">r/automation community</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-vault-border bg-vault-surface/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Simple, predictable pricing</h2>
            <p className="mt-4 text-vault-muted">Tiered by seats and execution volume. No surprise overages.</p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-2 max-w-4xl mx-auto">
            <div className="glass-card p-8">
              <p className="text-sm font-medium text-emerald-400">Solo</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">$49</span>
                <span className="text-vault-muted">/month</span>
              </div>
              <p className="mt-2 text-sm text-vault-muted">1 user · up to 5,000 captured executions</p>
              <ul className="mt-6 space-y-3 text-sm text-vault-muted">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Webhook capture from n8n, Make, Zapier
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> AI fix suggestions (GPT-4o)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> One-click replay
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Slack & email alerts
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Failure pattern detection
                </li>
              </ul>
              <Link
                href="/demo"
                className="mt-8 block w-full rounded-lg border border-vault-border py-3 text-center text-sm font-medium transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/10"
              >
                Try Demo First
              </Link>
            </div>

            <div className="glass-card relative p-8 border-emerald-500/40">
              <div className="absolute -top-3 right-6 rounded-full bg-emerald-500 px-3 py-0.5 text-xs font-medium text-white">
                Popular
              </div>
              <p className="text-sm font-medium text-emerald-400">Team</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">$99</span>
                <span className="text-vault-muted">/month</span>
              </div>
              <p className="mt-2 text-sm text-vault-muted">Unlimited seats · 25,000 captured executions</p>
              <ul className="mt-6 space-y-3 text-sm text-vault-muted">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Everything in Solo
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Team roles & permissions
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Shared pattern dashboards
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Priority support (Crisp AI + human)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Custom webhook endpoints
                </li>
              </ul>
              <Link
                href="/demo"
                className="mt-8 block w-full rounded-lg bg-emerald-500 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
              >
                Start with Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-cyan-700 px-8 py-16 text-center lg:px-16">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
            <h2 className="relative text-3xl font-bold text-white sm:text-4xl">
              Your automations fail. Your debugging shouldn&apos;t take hours.
            </h2>
            <p className="relative mt-4 text-lg text-emerald-100">
              See how ExecutionVault turns a 2-hour log dive into a 5-minute inspection.
            </p>
            <Link
              href="/demo"
              className="relative mt-8 inline-block rounded-lg bg-white px-8 py-3 text-base font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
            >
              Open Interactive Demo →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
