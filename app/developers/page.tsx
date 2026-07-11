import Link from "next/link";

const features = [
  {
    name: "Webhook Capture Queue",
    demoPath: "/demo → Dead-Letter Queue tab",
    tryIt: "Click 'Test Webhook' in the header, then 'Simulate Webhook POST'. A new execution appears at the top of the queue.",
    mocked: "Webhook POST is simulated client-side. No HTTP server receives the payload.",
    production:
      "Node.js API routes at /hooks/{platform}/{workspace} validate HMAC signatures from n8n/Make/Zapier, normalize the payload schema, and INSERT into Supabase `executions` table. Failed executions trigger real-time WebSocket updates to connected dashboards.",
  },
  {
    name: "Execution Detail View",
    demoPath: "/demo → Dead-Letter Queue → click any row",
    tryIt: "Select any execution in the left panel. Switch between Overview, Payload, Step Trace, and Suggested Fix tabs.",
    mocked: "All execution data is hardcoded in lib/mock-data.ts. Tab switching is client-side React state.",
    production:
      "GET /api/executions/:id fetches from Supabase with joined step traces. Payload is stored as JSONB. Step traces are parsed from platform-specific error formats (n8n node execution data, Make scenario modules, Zapier task history).",
  },
  {
    name: "AI Suggested Fix (GPT-4o)",
    demoPath: "/demo → select execution → 'Generate AI Fix' button or Suggested Fix tab",
    tryIt: "Click 'Generate AI Fix' on any execution. Watch the 1.2s loading state, then read the AI-generated fix suggestion.",
    mocked: "Fix text is pre-written in mock data. Loading spinner is cosmetic — no OpenAI API call.",
    production:
      "Lazy generation: when a user opens the Suggested Fix tab and no `suggested_fix` column exists, the API calls GPT-4o with the error message, step trace, and payload. Result is cached in Supabase so subsequent views are instant. Estimated cost: ~$0.01 per unique failure type.",
  },
  {
    name: "One-Click Replay",
    demoPath: "/demo → 'Replay Selected' or 'Replay Execution' buttons",
    tryIt: "Select a failed execution, click 'Replay Execution', advance through the 4-step wizard, and complete. Status changes to 'replayed'.",
    mocked: "Replay wizard is a UI state machine. No actual API call to n8n/Make/Zapier.",
    production:
      "POST /api/executions/:id/replay retrieves stored payload and calls the platform API: n8n POST /api/v1/executions (with workflow ID + data), Make POST /api/v2/scenarios/{id}/run, Zapier POST /v1/zaps/{id}/execute. Replay is logged in `replay_history` with timestamp and result.",
  },
  {
    name: "Failure Pattern Detection",
    demoPath: "/demo → Failure Patterns tab",
    tryIt: "Click any pattern in the left list. Read the root cause analysis. Click 'View Nightly Digest Email Preview' for the email mock.",
    mocked: "Patterns are static data. Occurrence counts and trends are hardcoded.",
    production:
      "Nightly cron (Vercel Cron or Supabase Edge Function at 2:00 AM UTC) runs SQL aggregation: GROUP BY error_code HAVING COUNT(*) >= 3 in last 7 days. GPT-4o generates root cause narrative. Results stored in `failure_patterns` table. Digest emails sent via Resend.",
  },
  {
    name: "Slack & Email Alerts",
    demoPath: "/demo → Alerts tab, or 'Send Alert' in header",
    tryIt: "Click 'Send Alert' → choose Slack or Email. New row appears in alerts table. Click 'Open in Vault →' to jump to the execution.",
    mocked: "Alerts are appended to local React state. No Slack webhook or Resend API calls.",
    production:
      "On capture, webhook handler checks alert rules (per-workflow or per-error-code). Slack: Incoming Webhook with Block Kit message including signed deep link. Email: Resend template with execution summary and CTA button. Click tracking via /api/alerts/:id/click redirect.",
  },
  {
    name: "Search & Filters",
    demoPath: "/demo → Dead-Letter Queue → search bar and dropdowns",
    tryIt: "Type 'HubSpot' in search, filter by platform 'n8n', or filter by status 'failed'. Queue list updates instantly.",
    mocked: "Client-side filter on hardcoded array using useMemo.",
    production:
      "Supabase full-text search on workflow_name, error_code, company. Filters as query params: GET /api/executions?platform=n8n&status=failed&q=hubspot. Paginated with cursor-based pagination.",
  },
  {
    name: "Activity Feed",
    demoPath: "/demo → Activity Feed tab",
    tryIt: "Click any activity item. Items linked to executions navigate to the queue with that execution selected.",
    mocked: "Static activity feed from mock data.",
    production:
      "Append-only `activity_log` table populated by database triggers on executions, replays, alerts, and pattern detections. Real-time subscription via Supabase Realtime.",
  },
  {
    name: "Webhook Endpoints",
    demoPath: "/demo → Webhook Endpoints tab",
    tryIt: "Copy URL (toast confirmation), send test payload, or click platform distribution cards to filter the queue.",
    mocked: "URLs are display-only. Test payload opens the same simulate modal as header button.",
    production:
      "Each workspace gets unique webhook URLs generated on signup. URLs include workspace slug and HMAC secret. Platform-specific setup guides linked from dashboard. Rate limited to 100 req/min per endpoint.",
  },
  {
    name: "Failure Chart & Stats",
    demoPath: "/demo → stats bar at top",
    tryIt: "Hover and click the mini bar chart days to see toast with failure counts.",
    mocked: "Chart data from chartData in mock-data.ts.",
    production:
      "Materialized view refreshed hourly: failures_by_day, by_platform, capture_volume. Displayed on dashboard with Recharts. Plan limits enforced against capture_volume.",
  },
];

const architecture = [
  { layer: "Capture", tech: "Node.js webhook receivers on Vercel Serverless", detail: "Inbound POST from n8n/Make/Zapier → validate → store" },
  { layer: "Storage", tech: "Supabase (PostgreSQL + Realtime)", detail: "executions, steps, patterns, alerts, activity_log tables" },
  { layer: "AI", tech: "OpenAI GPT-4o", detail: "Lazy fix suggestions + pattern root cause analysis" },
  { layer: "Alerts", tech: "Resend + Slack Incoming Webhooks", detail: "Instant alerts on capture + nightly digest" },
  { layer: "Billing", tech: "Stripe Checkout + Webhooks", detail: "Solo ($49) and Team ($99) tiers, usage metering" },
  { layer: "Support", tech: "Crisp + GPT-4o backend", detail: "AI bot trained on common n8n/Make error patterns" },
  { layer: "Frontend", tech: "Next.js 14 App Router + React", detail: "This demo — deploys zero-config to Vercel" },
];

export const metadata = {
  title: "Developers — ExecutionVault",
  description: "Feature documentation and integration guide for ExecutionVault.",
};

export default function DevelopersPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12">
        <p className="text-sm font-medium text-emerald-400">Developer Documentation</p>
        <h1 className="mt-2 text-4xl font-bold">ExecutionVault Feature Guide</h1>
        <p className="mt-4 text-lg text-vault-muted leading-relaxed">
          Every feature in the{" "}
          <Link href="/demo" className="text-emerald-400 hover:underline">
            interactive demo
          </Link>{" "}
          is documented below: what it does, where to try it, what&apos;s mocked vs. production, and the intended data flow.
        </p>
      </div>

      <div className="mb-16 rounded-xl border border-vault-border bg-vault-card p-6">
        <h2 className="text-lg font-semibold">Quick Start</h2>
        <ol className="mt-4 space-y-2 text-sm text-vault-muted list-decimal list-inside">
          <li>
            Open the{" "}
            <Link href="/demo" className="text-emerald-400 hover:underline">
              /demo
            </Link>{" "}
            page
          </li>
          <li>Look for amber <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-500/20 text-[10px] font-bold text-amber-400 ring-1 ring-amber-500/30">i</span> DEV NOTE icons beside controls</li>
          <li>Work through each feature section below, clicking the documented UI elements</li>
        </ol>
      </div>

      <div className="space-y-8">
        {features.map((feature, i) => (
          <div key={feature.name} className="rounded-xl border border-vault-border bg-vault-card overflow-hidden">
            <div className="border-b border-vault-border bg-vault-surface px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-sm font-bold text-emerald-400">
                  {i + 1}
                </span>
                <h2 className="text-xl font-semibold">{feature.name}</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-vault-muted">Where to try it</p>
                <p className="mt-1 text-sm">
                  <Link href="/demo" className="text-emerald-400 hover:underline">
                    {feature.demoPath}
                  </Link>
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-vault-muted">How to interact</p>
                <p className="mt-1 text-sm text-vault-muted">{feature.tryIt}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-400">Mocked in demo</p>
                  <p className="mt-2 text-sm text-vault-muted">{feature.mocked}</p>
                </div>
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Production implementation</p>
                  <p className="mt-2 text-sm text-vault-muted">{feature.production}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold">Architecture Overview</h2>
        <p className="mt-2 text-vault-muted">Planned production stack (not implemented in this demo).</p>
        <div className="mt-6 space-y-3">
          {architecture.map((item) => (
            <div key={item.layer} className="flex gap-4 rounded-lg border border-vault-border bg-vault-card p-4">
              <span className="shrink-0 w-20 text-sm font-medium text-emerald-400">{item.layer}</span>
              <div>
                <p className="text-sm font-medium">{item.tech}</p>
                <p className="text-xs text-vault-muted mt-0.5">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 rounded-xl border border-vault-border bg-vault-card p-6">
        <h2 className="text-lg font-semibold">Webhook Integration Example (n8n)</h2>
        <pre className="mt-4 overflow-x-auto rounded-lg border border-vault-border bg-vault-surface p-4 text-xs font-mono text-emerald-300/80">
{`// n8n Error Trigger workflow
// 1. Error Trigger node (catches workflow failures)
// 2. HTTP Request node:
//    Method: POST
//    URL: https://vault.executionvault.io/hooks/n8n/{workspace}
//    Body: {{ JSON.stringify({
//      execution_id: $execution.id,
//      workflow_id: $workflow.id,
//      workflow_name: $workflow.name,
//      error: $json.error.message,
//      error_code: $json.error.code,
//      payload: $json.data,
//      steps: $json.executionData
//    }) }}
//    Headers: X-EV-Signature: {{ hmac(payload, secret) }}`}
        </pre>
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/demo"
          className="inline-block rounded-lg bg-emerald-500 px-8 py-3 font-semibold text-white hover:bg-emerald-600 transition-colors"
        >
          Open Interactive Demo →
        </Link>
      </div>
    </div>
  );
}
