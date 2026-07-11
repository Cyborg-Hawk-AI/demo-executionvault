import Link from "next/link";

const checklist = [
  { label: "10+ posts with this pain", passed: true },
  { label: "Paying for inferior solution", passed: true },
  { label: "Reachable channel", passed: true },
  { label: "MVP < 4 weeks", passed: true },
  { label: "Price point high enough", passed: true },
  { label: "Hair-on-fire problem", passed: true },
  { label: "Can pre-sell", passed: true },
  { label: "< 3 competitors", passed: true },
  { label: "Low-maintenance ops (mailbox money)", passed: true },
];

const painPoints = [
  {
    problem:
      "Stuck automation executions need manual intervention or custom workarounds; users resort to writing bash scripts to restart failed jobs during off-hours instead of having built-in retry logic.",
    persona: "DevOps engineer / automation platform user",
    workaround: "Writing custom bash scripts to automatically restart stuck executions at night",
    frequency: "daily",
    wtp: "Already paying for n8n and investing engineering time in custom scripts",
    source: "https://www.reddit.com/r/automation/comments/1um2ul8/what_is_the_one_automation_tool_or_framework_in/",
  },
  {
    problem:
      "Advanced scripting features in automation platforms are locked behind premium pricing tiers, forcing users to pay extra for basic execution capabilities.",
    persona: "Automation engineer / workflow builder",
    workaround: "Paying additional costs to GoAnywhere for script execution through agents",
    frequency: "unknown",
    wtp: "Already spending money on GoAnywhere premium features",
    source: "https://www.reddit.com/r/automation/comments/1um2ul8/what_is_the_one_automation_tool_or_framework_in/",
  },
];

export const metadata = {
  title: "Research — How we found ExecutionVault",
  description: "The research story behind ExecutionVault: pain points, validation, and market opportunity.",
};

export default function ResearchPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12">
        <p className="text-sm font-medium text-emerald-400">Idea Miner Research</p>
        <h1 className="mt-2 text-4xl font-bold">How we found this idea</h1>
        <p className="mt-4 text-lg text-vault-muted">
          ExecutionVault was discovered through systematic pain-point mining across Reddit, Hacker News,
          Stack Exchange, and GitHub — then validated against a 9-point rubric before shipping this demo.
        </p>
      </div>

      {/* Origin story */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold">Why this exists</h2>
        <div className="mt-6 rounded-xl border border-vault-border bg-vault-card p-6">
          <p className="text-vault-muted leading-relaxed">
            The r/automation thread surfaced a DevOps engineer who resorted to &ldquo;writing bash scripts to
            automatically restart stuck executions at night&rdquo; — a clear sign that the native tooling
            (n8n&apos;s execution log) is insufficient for production use. The core frustration is not just that
            executions fail, but that when they do, there&apos;s no easy way to see why, replay them, or detect
            patterns. Engineers are spending hours debugging what should be a 5-minute inspection. The bash
            script workaround is a band-aid that doesn&apos;t address root cause analysis or provide a replay
            mechanism.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <span className="rounded-full border border-vault-border bg-vault-surface px-3 py-1">
              Cluster: <strong className="text-white">Automation execution reliability & retry logic</strong>
            </span>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-400">
              Rubric score: <strong>112/130</strong>
            </span>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-400">
              Validation: <strong>9/9 checks passed</strong>
            </span>
          </div>
        </div>
      </section>

      {/* Competitive landscape */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold">Competitive landscape</h2>
        <div className="mt-6 rounded-xl border border-vault-border bg-vault-card p-6">
          <p className="text-vault-muted leading-relaxed">
            n8n&apos;s built-in execution log is read-only with no replay or pattern detection. Make has no
            dead-letter queue. Datadog/Sentry are overkill and not automation-platform-aware. No focused
            execution vault product exists.
          </p>
          <p className="mt-4 text-sm text-vault-muted">
            <strong className="text-white">Unfair advantage:</strong> AI-generated &ldquo;suggested fix&rdquo; for each
            failure type turns a debugging tool into a teaching tool — users learn why their workflows fail,
            reducing future failures and increasing retention.
          </p>
        </div>
      </section>

      {/* Validation checklist */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold">Validation checklist</h2>
        <p className="mt-2 text-vault-muted">9 of 9 checks passed before building this demo.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {checklist.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-lg border border-vault-border bg-vault-card px-4 py-3"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-sm">
                ✓
              </span>
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Pain points */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold">Source pain points</h2>
        <p className="mt-2 text-vault-muted">Real posts from automation communities.</p>
        <div className="mt-6 space-y-6">
          {painPoints.map((pp, i) => (
            <div key={i} className="rounded-xl border border-vault-border bg-vault-card p-6">
              <p className="font-medium leading-relaxed">{pp.problem}</p>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
                <div>
                  <dt className="text-xs text-vault-muted uppercase tracking-wider">Persona</dt>
                  <dd className="mt-0.5">{pp.persona}</dd>
                </div>
                <div>
                  <dt className="text-xs text-vault-muted uppercase tracking-wider">Current workaround</dt>
                  <dd className="mt-0.5">{pp.workaround}</dd>
                </div>
                <div>
                  <dt className="text-xs text-vault-muted uppercase tracking-wider">Frequency</dt>
                  <dd className="mt-0.5">{pp.frequency}</dd>
                </div>
                <div>
                  <dt className="text-xs text-vault-muted uppercase tracking-wider">WTP signal</dt>
                  <dd className="mt-0.5">{pp.wtp}</dd>
                </div>
              </dl>
              <a
                href={pp.source}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm text-emerald-400 hover:underline"
              >
                View source post →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Automation playbook */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold">How this business runs itself</h2>
        <p className="mt-2 text-vault-muted">Mailbox money — estimated owner time: ~1.5 hours/week</p>
        <div className="mt-6 rounded-xl border border-vault-border bg-vault-card p-6">
          <p className="text-vault-muted leading-relaxed">
            Webhook receivers capture failed executions 24/7 with no human involvement. GPT-4o generates fix
            suggestions lazily (only when a user views the execution) — no batch processing needed. A nightly
            cron scans for failure patterns and sends digest emails via Resend. Stripe manages all billing
            lifecycle events. A Crisp chat widget with a GPT-4o backend handles support questions about specific
            error messages. The only recurring manual task is reviewing weekly escalations.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-vault-border bg-vault-surface p-4 text-center">
              <p className="text-2xl font-bold text-emerald-400">1.5h</p>
              <p className="text-xs text-vault-muted mt-1">owner time / week</p>
            </div>
            <div className="rounded-lg border border-vault-border bg-vault-surface p-4 text-center">
              <p className="text-2xl font-bold text-emerald-400">3–4 wks</p>
              <p className="text-xs text-vault-muted mt-1">MVP estimate</p>
            </div>
            <div className="rounded-lg border border-vault-border bg-vault-surface p-4 text-center">
              <p className="text-2xl font-bold text-emerald-400">$49–99</p>
              <p className="text-xs text-vault-muted mt-1">monthly pricing</p>
            </div>
          </div>
        </div>
      </section>

      {/* GTM */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold">Go-to-market</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {["n8n community forum", "r/n8n", "r/automation", "GitHub cold outreach", "ProductHunt launch"].map(
            (channel) => (
              <span
                key={channel}
                className="rounded-full border border-vault-border bg-vault-card px-4 py-2 text-sm"
              >
                {channel}
              </span>
            )
          )}
        </div>
      </section>

      {/* About Idea Miner */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold">About this program</h2>
        <div className="mt-6 rounded-xl border border-vault-border bg-vault-card p-6">
          <p className="text-vault-muted leading-relaxed">
            This demo was auto-built by the <strong className="text-white">Idea Miner</strong> pipeline: a
            twice-daily research program that mines Reddit, Hacker News, Stack Exchange, and GitHub for real
            people describing real pain, scores the opportunities, and automatically ships a working mock of
            every idea that passes validation (&gt;=8/9 checks, momentum not declining, not previously built).
            The bar for every idea: low-maintenance recurring revenue that a solo owner can run in a few hours
            a week.
          </p>
          <p className="mt-4 text-xs text-vault-muted">
            Generated by Idea Miner run 2026-07-11-am on 2026-07-11 12:19 UTC
          </p>
        </div>
      </section>

      <div className="text-center">
        <Link
          href="/demo"
          className="inline-block rounded-lg bg-emerald-500 px-8 py-3 font-semibold text-white hover:bg-emerald-600 transition-colors"
        >
          See the product demo →
        </Link>
      </div>
    </div>
  );
}
