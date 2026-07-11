"use client";

import { useState, useMemo } from "react";
import {
  executions as initialExecutions,
  failurePatterns,
  alerts as initialAlerts,
  activityFeed,
  chartData,
  webhookEndpoints,
  type Execution,
  type ExecutionStatus,
  type Platform,
} from "@/lib/mock-data";
import { DevNote } from "@/components/DevNote";
import { useToast, ToastContainer, Modal } from "@/components/ui";

type Tab = "queue" | "patterns" | "alerts" | "webhooks" | "activity";
type DetailTab = "overview" | "payload" | "trace" | "fix";

const platformColors: Record<Platform, string> = {
  n8n: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Make: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Zapier: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

const statusColors: Record<ExecutionStatus, string> = {
  failed: "text-red-400 bg-red-500/10 border-red-500/30",
  stuck: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  replayed: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
  resolved: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(ms: number) {
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
  return `${ms}ms`;
}

export function DemoApp() {
  const { toasts, showToast, dismissToast } = useToast();
  const [executions, setExecutions] = useState(initialExecutions);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [activeTab, setActiveTab] = useState<Tab>("queue");
  const [selectedId, setSelectedId] = useState<string>("ex_8f3a2b1c");
  const [detailTab, setDetailTab] = useState<DetailTab>("overview");
  const [platformFilter, setPlatformFilter] = useState<Platform | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ExecutionStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showReplayModal, setShowReplayModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [showPatternModal, setShowPatternModal] = useState<string | null>(null);
  const [fixLoading, setFixLoading] = useState(false);
  const [fixLoaded, setFixLoaded] = useState<Set<string>>(new Set());
  const [replayStep, setReplayStep] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState(failurePatterns[0].id);

  const selected = executions.find((e) => e.id === selectedId) ?? executions[0];

  const filteredExecutions = useMemo(() => {
    return executions.filter((e) => {
      if (platformFilter !== "all" && e.platform !== platformFilter) return false;
      if (statusFilter !== "all" && e.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          e.workflowName.toLowerCase().includes(q) ||
          e.company.toLowerCase().includes(q) ||
          e.errorCode.toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [executions, platformFilter, statusFilter, searchQuery]);

  const maxChart = Math.max(...chartData.failuresByDay.map((d) => d.count));

  const handleReplay = () => {
    setShowReplayModal(true);
    setReplayStep(0);
  };

  const advanceReplay = () => {
    if (replayStep < 3) {
      setReplayStep((s) => s + 1);
    } else {
      setExecutions((prev) =>
        prev.map((e) =>
          e.id === selectedId ? { ...e, status: "replayed" as ExecutionStatus } : e
        )
      );
      setShowReplayModal(false);
      showToast(`Replayed ${selected.workflowName} with original payload — succeeded`, "success");
    }
  };

  const handleLoadFix = () => {
    if (fixLoaded.has(selectedId)) {
      setDetailTab("fix");
      return;
    }
    setFixLoading(true);
    setTimeout(() => {
      setFixLoading(false);
      setFixLoaded((prev) => new Set(prev).add(selectedId));
      setDetailTab("fix");
      showToast("GPT-4o fix suggestion generated on-demand", "info");
    }, 1200);
  };

  const handleResolve = () => {
    setExecutions((prev) =>
      prev.map((e) =>
        e.id === selectedId ? { ...e, status: "resolved" as ExecutionStatus } : e
      )
    );
    showToast(`Marked ${selected.id} as resolved`, "success");
  };

  const handleSendAlert = (channel: "slack" | "email") => {
    const newAlert = {
      id: `alert_${Date.now()}`,
      channel,
      recipient: channel === "slack" ? "#ops-alerts" : "devops@meridian-analytics.io",
      executionId: selectedId,
      workflowName: selected.workflowName,
      sentAt: new Date().toISOString(),
      status: "delivered" as const,
      preview: `🔴 Execution failed: ${selected.errorCode} — ${selected.workflowName}`,
    };
    setAlerts((prev) => [newAlert, ...prev]);
    setShowAlertModal(false);
    showToast(`${channel === "slack" ? "Slack" : "Email"} alert sent with vault link`, "success");
  };

  const handleSimulateWebhook = () => {
    const newExec: Execution = {
      id: `ex_${Math.random().toString(36).slice(2, 10)}`,
      workflowName: "Simulated Webhook Capture",
      platform: "n8n",
      status: "failed",
      errorMessage: "Simulated failure: Connection reset by peer",
      errorCode: "CONN_RESET",
      company: "Demo Workspace",
      triggeredBy: "Manual webhook test",
      capturedAt: new Date().toISOString(),
      durationMs: 450,
      retryCount: 0,
      payload: { test: true, timestamp: new Date().toISOString() },
      steps: [
        { id: "s1", name: "Webhook Trigger", status: "success", durationMs: 5, output: "Test payload received" },
        { id: "s2", name: "Process", status: "failed", durationMs: 445, error: "Connection reset by peer" },
      ],
      suggestedFix: "This is a simulated capture. In production, n8n would POST failed execution metadata to your vault webhook URL.",
    };
    setExecutions((prev) => [newExec, ...prev]);
    setSelectedId(newExec.id);
    setShowWebhookModal(false);
    showToast("Webhook received — new execution captured in queue", "success");
  };

  const pattern = failurePatterns.find((p) => p.id === selectedPattern);

  return (
    <div className="min-h-screen bg-vault-bg">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Demo header */}
      <div className="border-b border-vault-border bg-vault-surface">
        <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-xl font-bold">ExecutionVault Dashboard</h1>
              <p className="text-sm text-vault-muted">Meridian Analytics workspace · 3 webhook endpoints active</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowWebhookModal(true)}
                className="rounded-lg border border-vault-border bg-vault-card px-3 py-1.5 text-sm hover:border-emerald-500/50"
              >
                Test Webhook
                <DevNote title="Webhook Capture">
                  In production, n8n/Make/Zapier POST failed execution JSON to unique webhook URLs. Node.js receivers validate signatures and store in Supabase.
                </DevNote>
              </button>
              <button
                type="button"
                onClick={() => setShowAlertModal(true)}
                className="rounded-lg border border-vault-border bg-vault-card px-3 py-1.5 text-sm hover:border-emerald-500/50"
              >
                Send Alert
                <DevNote title="Slack/Email Alerts">
                  Alerts fire via Resend (email) and Slack Incoming Webhooks with a signed deep link to the execution detail page.
                </DevNote>
              </button>
              <button
                type="button"
                onClick={handleReplay}
                className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-600"
              >
                Replay Selected
                <DevNote title="One-Click Replay">
                  Production replays POST the stored payload back to the original platform&apos;s API (n8n execution API, Make scenario run, etc.).
                </DevNote>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="border-b border-vault-border bg-vault-surface/50">
        <div className="mx-auto max-w-[1600px] px-4 py-3 sm:px-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            <div className="rounded-lg border border-vault-border bg-vault-card p-3">
              <p className="text-xs text-vault-muted">Failed / Stuck</p>
              <p className="text-xl font-bold text-red-400">
                {executions.filter((e) => e.status === "failed" || e.status === "stuck").length}
              </p>
            </div>
            <div className="rounded-lg border border-vault-border bg-vault-card p-3">
              <p className="text-xs text-vault-muted">Captured This Month</p>
              <p className="text-xl font-bold text-emerald-400">
                {chartData.capturedThisMonth.toLocaleString()}
                <span className="text-xs font-normal text-vault-muted"> / {chartData.captureLimit.toLocaleString()}</span>
              </p>
            </div>
            <div className="rounded-lg border border-vault-border bg-vault-card p-3">
              <p className="text-xs text-vault-muted">Active Patterns</p>
              <p className="text-xl font-bold text-amber-400">{failurePatterns.length}</p>
            </div>
            <div className="rounded-lg border border-vault-border bg-vault-card p-3">
              <p className="text-xs text-vault-muted">Alerts Sent (7d)</p>
              <p className="text-xl font-bold text-cyan-400">{alerts.length}</p>
            </div>
            <div className="col-span-2 md:col-span-1 rounded-lg border border-vault-border bg-vault-card p-3">
              <p className="text-xs text-vault-muted mb-2">Failures (7 days)</p>
              <div className="flex items-end gap-1 h-8">
                {chartData.failuresByDay.map((d) => (
                  <div
                    key={d.day}
                    className="flex-1 bg-emerald-500/60 rounded-t hover:bg-emerald-400 transition-colors cursor-pointer"
                    style={{ height: `${(d.count / maxChart) * 100}%` }}
                    title={`${d.day}: ${d.count} failures`}
                    onClick={() => showToast(`${d.day}: ${d.count} failures captured`, "info")}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main tabs */}
      <div className="border-b border-vault-border">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto">
            {(
              [
                ["queue", "Dead-Letter Queue"],
                ["patterns", "Failure Patterns"],
                ["alerts", "Alerts"],
                ["webhooks", "Webhook Endpoints"],
                ["activity", "Activity Feed"],
              ] as const
            ).map(([tab, label]) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? "border-emerald-500 text-emerald-400"
                    : "border-transparent text-vault-muted hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
        {activeTab === "queue" && (
          <div className="grid gap-6 lg:grid-cols-5">
            {/* Queue list */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  placeholder="Search workflows, companies, error codes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 rounded-lg border border-vault-border bg-vault-card px-3 py-2 text-sm placeholder:text-vault-muted focus:border-emerald-500/50 focus:outline-none"
                />
                <select
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value as Platform | "all")}
                  className="rounded-lg border border-vault-border bg-vault-card px-3 py-2 text-sm focus:border-emerald-500/50 focus:outline-none"
                >
                  <option value="all">All platforms</option>
                  <option value="n8n">n8n</option>
                  <option value="Make">Make</option>
                  <option value="Zapier">Zapier</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as ExecutionStatus | "all")}
                  className="rounded-lg border border-vault-border bg-vault-card px-3 py-2 text-sm focus:border-emerald-500/50 focus:outline-none"
                >
                  <option value="all">All statuses</option>
                  <option value="failed">Failed</option>
                  <option value="stuck">Stuck</option>
                  <option value="replayed">Replayed</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div className="space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto">
                {filteredExecutions.map((exec) => (
                  <button
                    key={exec.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(exec.id);
                      setDetailTab("overview");
                    }}
                    className={`w-full text-left rounded-lg border p-4 transition-all ${
                      selectedId === exec.id
                        ? "border-emerald-500/50 bg-emerald-500/5"
                        : "border-vault-border bg-vault-card hover:border-vault-border/80 hover:bg-vault-card/80"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{exec.workflowName}</p>
                        <p className="text-xs text-vault-muted mt-0.5">{exec.company}</p>
                      </div>
                      <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase ${statusColors[exec.status]}`}>
                        {exec.status}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${platformColors[exec.platform]}`}>
                        {exec.platform}
                      </span>
                      <span className="text-xs text-red-400 truncate">{exec.errorCode}</span>
                    </div>
                    <p className="mt-1 text-xs text-vault-muted">{formatDate(exec.capturedAt)}</p>
                  </button>
                ))}
                {filteredExecutions.length === 0 && (
                  <p className="text-center text-sm text-vault-muted py-8">No executions match filters</p>
                )}
              </div>
            </div>

            {/* Detail panel */}
            <div className="lg:col-span-3">
              <div className="rounded-xl border border-vault-border bg-vault-card">
                <div className="border-b border-vault-border p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold">{selected.workflowName}</h2>
                      <p className="text-sm text-vault-muted font-mono">{selected.id}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleResolve}
                        className="rounded-lg border border-vault-border px-3 py-1.5 text-xs hover:border-emerald-500/50"
                      >
                        Mark Resolved
                      </button>
                      <button
                        type="button"
                        onClick={handleLoadFix}
                        className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-400 hover:bg-amber-500/20"
                      >
                        {fixLoading ? "Generating fix..." : fixLoaded.has(selectedId) ? "View AI Fix" : "Generate AI Fix"}
                        <DevNote title="Lazy AI Fix">
                          GPT-4o generates fix suggestions only when a user opens an execution — no batch processing, no wasted API calls.
                        </DevNote>
                      </button>
                      <button
                        type="button"
                        onClick={handleReplay}
                        className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600"
                      >
                        Replay Execution
                      </button>
                    </div>
                  </div>

                  {/* Detail tabs */}
                  <div className="mt-4 flex gap-1 border-b border-vault-border -mb-px">
                    {(
                      [
                        ["overview", "Overview"],
                        ["payload", "Payload"],
                        ["trace", "Step Trace"],
                        ["fix", "Suggested Fix"],
                      ] as const
                    ).map(([tab, label]) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => {
                          if (tab === "fix" && !fixLoaded.has(selectedId)) {
                            handleLoadFix();
                          } else {
                            setDetailTab(tab);
                          }
                        }}
                        className={`px-4 py-2 text-sm border-b-2 transition-colors ${
                          detailTab === tab
                            ? "border-emerald-500 text-emerald-400"
                            : "border-transparent text-vault-muted hover:text-white"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4">
                  {detailTab === "overview" && (
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-lg border border-vault-border bg-vault-surface p-3">
                          <p className="text-xs text-vault-muted">Error</p>
                          <p className="mt-1 text-sm text-red-400">{selected.errorMessage}</p>
                        </div>
                        <div className="rounded-lg border border-vault-border bg-vault-surface p-3">
                          <p className="text-xs text-vault-muted">Triggered By</p>
                          <p className="mt-1 text-sm">{selected.triggeredBy}</p>
                        </div>
                        <div className="rounded-lg border border-vault-border bg-vault-surface p-3">
                          <p className="text-xs text-vault-muted">Duration</p>
                          <p className="mt-1 text-sm font-mono">{formatDuration(selected.durationMs)}</p>
                        </div>
                        <div className="rounded-lg border border-vault-border bg-vault-surface p-3">
                          <p className="text-xs text-vault-muted">Retries</p>
                          <p className="mt-1 text-sm">{selected.retryCount}</p>
                        </div>
                      </div>

                      {selected.patternId && (
                        <div
                          className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 cursor-pointer hover:bg-amber-500/10 transition-colors"
                          onClick={() => {
                            setActiveTab("patterns");
                            setSelectedPattern(selected.patternId!);
                          }}
                        >
                          <p className="text-sm font-medium text-amber-400">
                            ⚠️ Pattern detected
                            <DevNote title="Failure Pattern Detection">
                              Nightly cron scans error codes grouped by workflow. When occurrences exceed threshold, root cause analysis runs via GPT-4o and digest emails send via Resend.
                            </DevNote>
                          </p>
                          <p className="mt-1 text-sm text-vault-muted">
                            {failurePatterns.find((p) => p.id === selected.patternId)?.title} — occurred{" "}
                            {failurePatterns.find((p) => p.id === selected.patternId)?.occurrences} times in the last 7 days
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {detailTab === "payload" && (
                    <pre className="overflow-x-auto rounded-lg border border-vault-border bg-vault-surface p-4 text-xs font-mono text-emerald-300/90">
                      {JSON.stringify(selected.payload, null, 2)}
                    </pre>
                  )}

                  {detailTab === "trace" && (
                    <div className="space-y-2">
                      {selected.steps.map((step, i) => (
                        <div
                          key={step.id}
                          className={`rounded-lg border p-3 ${
                            step.status === "failed"
                              ? "border-red-500/30 bg-red-500/5"
                              : step.status === "success"
                              ? "border-vault-border bg-vault-surface"
                              : "border-vault-border bg-vault-surface/50 opacity-60"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-vault-border text-xs font-mono">
                                {i + 1}
                              </span>
                              <span className="font-medium text-sm">{step.name}</span>
                              <span
                                className={`rounded px-1.5 py-0.5 text-[10px] uppercase font-medium ${
                                  step.status === "success"
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : step.status === "failed"
                                    ? "bg-red-500/20 text-red-400"
                                    : "bg-vault-border text-vault-muted"
                                }`}
                              >
                                {step.status}
                              </span>
                            </div>
                            <span className="text-xs text-vault-muted font-mono">{formatDuration(step.durationMs)}</span>
                          </div>
                          {step.output && (
                            <p className="mt-2 ml-8 text-xs text-vault-muted">{step.output}</p>
                          )}
                          {step.error && (
                            <p className="mt-2 ml-8 text-xs text-red-400">{step.error}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {detailTab === "fix" && (
                    <div className="space-y-4">
                      {fixLoading ? (
                        <div className="flex items-center gap-3 py-8 justify-center">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                          <span className="text-sm text-vault-muted">GPT-4o analyzing execution trace...</span>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 text-xs text-amber-400">
                            <span className="rounded bg-amber-500/20 px-2 py-0.5 font-medium">AI Generated</span>
                            <span className="text-vault-muted">Model: GPT-4o · Generated on view</span>
                          </div>
                          <p className="text-sm leading-relaxed text-vault-muted">{selected.suggestedFix}</p>
                          <button
                            type="button"
                            onClick={() => showToast("Fix copied to clipboard", "success")}
                            className="rounded-lg border border-vault-border px-3 py-1.5 text-xs hover:border-emerald-500/50"
                          >
                            Copy Fix to Clipboard
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "patterns" && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-3">
              {failurePatterns.map((pat) => (
                <button
                  key={pat.id}
                  type="button"
                  onClick={() => setSelectedPattern(pat.id)}
                  className={`w-full text-left rounded-lg border p-4 transition-all ${
                    selectedPattern === pat.id
                      ? "border-amber-500/50 bg-amber-500/5"
                      : "border-vault-border bg-vault-card hover:border-vault-border/80"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{pat.title}</span>
                    <span
                      className={`text-[10px] uppercase font-medium px-1.5 py-0.5 rounded ${
                        pat.trend === "rising"
                          ? "bg-red-500/20 text-red-400"
                          : pat.trend === "declining"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-vault-border text-vault-muted"
                      }`}
                    >
                      {pat.trend}
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-amber-400">{pat.occurrences}x</p>
                  <p className="text-xs text-vault-muted">in last {pat.windowDays} days</p>
                </button>
              ))}
            </div>

            {pattern && (
              <div className="lg:col-span-2 rounded-xl border border-vault-border bg-vault-card p-6">
                <h2 className="text-lg font-semibold">{pattern.title}</h2>
                <p className="mt-1 text-sm font-mono text-vault-muted">{pattern.errorCode}</p>

                <div className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
                  <p className="text-sm font-medium text-amber-400">
                    This error has occurred {pattern.occurrences} times in the last {pattern.windowDays} days
                  </p>
                  <p className="mt-2 text-sm text-vault-muted leading-relaxed">{pattern.rootCause}</p>
                </div>

                <div className="mt-6">
                  <p className="text-sm font-medium">Affected Workflows</p>
                  <ul className="mt-2 space-y-1">
                    {pattern.affectedWorkflows.map((w) => (
                      <li key={w} className="text-sm text-vault-muted flex items-center gap-2">
                        <span className="text-red-400">●</span> {w}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-vault-border bg-vault-surface p-3">
                    <p className="text-xs text-vault-muted">First Seen</p>
                    <p className="text-sm">{formatDate(pattern.firstSeen)}</p>
                  </div>
                  <div className="rounded-lg border border-vault-border bg-vault-surface p-3">
                    <p className="text-xs text-vault-muted">Last Seen</p>
                    <p className="text-sm">{formatDate(pattern.lastSeen)}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPatternModal(pattern.id)}
                  className="mt-6 rounded-lg bg-amber-500/20 border border-amber-500/30 px-4 py-2 text-sm text-amber-400 hover:bg-amber-500/30"
                >
                  View Nightly Digest Email Preview
                  <DevNote title="Nightly Digest">
                    Cron job at 2:00 AM UTC aggregates patterns and sends digest via Resend to configured recipients.
                  </DevNote>
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "alerts" && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowAlertModal(true)}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
              >
                Send New Alert
              </button>
              <select
                className="rounded-lg border border-vault-border bg-vault-card px-3 py-2 text-sm"
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "all") return;
                  showToast(`Filtered alerts by ${val}`, "info");
                }}
              >
                <option value="all">All channels</option>
                <option value="slack">Slack only</option>
                <option value="email">Email only</option>
              </select>
            </div>

            <div className="rounded-xl border border-vault-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-vault-surface border-b border-vault-border">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-vault-muted">Channel</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-vault-muted">Recipient</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-vault-muted">Workflow</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-vault-muted">Sent</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-vault-muted">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-vault-muted">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-vault-border">
                  {alerts.map((alert) => (
                    <tr key={alert.id} className="hover:bg-vault-surface/50">
                      <td className="px-4 py-3">
                        <span className={`rounded px-2 py-0.5 text-xs font-medium ${
                          alert.channel === "slack" ? "bg-purple-500/20 text-purple-400" : "bg-cyan-500/20 text-cyan-400"
                        }`}>
                          {alert.channel}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{alert.recipient}</td>
                      <td className="px-4 py-3">{alert.workflowName}</td>
                      <td className="px-4 py-3 text-vault-muted">{formatDate(alert.sentAt)}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded px-2 py-0.5 text-xs ${
                          alert.status === "clicked" ? "bg-emerald-500/20 text-emerald-400" :
                          alert.status === "delivered" ? "bg-cyan-500/20 text-cyan-400" :
                          "bg-amber-500/20 text-amber-400"
                        }`}>
                          {alert.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedId(alert.executionId);
                            setActiveTab("queue");
                            showToast(`Opened execution ${alert.executionId} from alert link`, "info");
                          }}
                          className="text-xs text-emerald-400 hover:underline"
                        >
                          Open in Vault →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "webhooks" && (
          <div className="space-y-4">
            <p className="text-sm text-vault-muted">
              Configure these URLs in your automation platform to capture failed executions.
            </p>
            {webhookEndpoints.map((ep) => (
              <div key={ep.url} className="rounded-xl border border-vault-border bg-vault-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`rounded border px-2 py-0.5 text-xs font-medium ${platformColors[ep.platform as Platform]}`}>
                      {ep.platform}
                    </span>
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400">{ep.status}</span>
                  </div>
                  <p className="text-xs text-vault-muted">{ep.count.toLocaleString()} executions captured</p>
                </div>
                <code className="mt-3 block rounded-lg bg-vault-surface border border-vault-border p-3 text-xs font-mono text-emerald-300/80 break-all">
                  {ep.url}
                </code>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => showToast("Webhook URL copied to clipboard", "success")}
                    className="rounded-lg border border-vault-border px-3 py-1.5 text-xs hover:border-emerald-500/50"
                  >
                    Copy URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowWebhookModal(true)}
                    className="rounded-lg border border-vault-border px-3 py-1.5 text-xs hover:border-emerald-500/50"
                  >
                    Send Test Payload
                  </button>
                </div>
                <p className="mt-2 text-xs text-vault-muted">Last received: {formatDate(ep.lastReceived)}</p>
              </div>
            ))}

            <div className="rounded-xl border border-vault-border bg-vault-card p-4">
              <p className="text-sm font-medium">Platform Distribution</p>
              <div className="mt-4 flex gap-4">
                {chartData.byPlatform.map((p) => (
                  <button
                    key={p.platform}
                    type="button"
                    onClick={() => {
                      setPlatformFilter(p.platform as Platform);
                      setActiveTab("queue");
                      showToast(`Filtered queue to ${p.platform}`, "info");
                    }}
                    className="flex-1 rounded-lg border border-vault-border bg-vault-surface p-3 text-center hover:border-emerald-500/30 transition-colors"
                  >
                    <p className="text-2xl font-bold" style={{ color: p.color }}>{p.count}</p>
                    <p className="text-xs text-vault-muted">{p.platform}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-3 max-w-3xl">
            {activityFeed.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-lg border border-vault-border bg-vault-card p-4 hover:border-emerald-500/20 transition-colors cursor-pointer"
                onClick={() => {
                  if (item.executionId) {
                    setSelectedId(item.executionId);
                    setActiveTab("queue");
                  } else {
                    showToast(item.message, "info");
                  }
                }}
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs ${
                  item.type === "capture" ? "bg-red-500/20 text-red-400" :
                  item.type === "replay" ? "bg-cyan-500/20 text-cyan-400" :
                  item.type === "alert" ? "bg-purple-500/20 text-purple-400" :
                  item.type === "pattern" ? "bg-amber-500/20 text-amber-400" :
                  "bg-emerald-500/20 text-emerald-400"
                }`}>
                  {item.type === "capture" ? "📥" : item.type === "replay" ? "🔄" : item.type === "alert" ? "🔔" : item.type === "pattern" ? "📊" : "✓"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{item.message}</p>
                  <p className="text-xs text-vault-muted mt-1">{formatDate(item.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Replay Modal */}
      <Modal open={showReplayModal} onClose={() => setShowReplayModal(false)} title="Replay Execution">
        <div className="space-y-4">
          <p className="text-sm text-vault-muted">
            Re-triggering <strong className="text-white">{selected.workflowName}</strong> with the original payload via {selected.platform} API.
          </p>
          <div className="space-y-2">
            {["Validating stored payload", "Authenticating with platform API", "Submitting replay request", "Confirming execution success"].map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                  i < replayStep ? "bg-emerald-500 text-white" :
                  i === replayStep ? "bg-emerald-500/30 text-emerald-400 animate-pulse" :
                  "bg-vault-border text-vault-muted"
                }`}>
                  {i < replayStep ? "✓" : i + 1}
                </span>
                <span className={`text-sm ${i <= replayStep ? "text-white" : "text-vault-muted"}`}>{step}</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={advanceReplay}
            className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-medium text-white hover:bg-emerald-600"
          >
            {replayStep < 3 ? "Continue Replay" : "Complete Replay"}
          </button>
        </div>
      </Modal>

      {/* Alert Modal */}
      <Modal open={showAlertModal} onClose={() => setShowAlertModal(false)} title="Send Alert">
        <div className="space-y-4">
          <p className="text-sm text-vault-muted">
            Send an alert for <strong className="text-white">{selected.workflowName}</strong> ({selected.id})
          </p>
          <div className="rounded-lg border border-vault-border bg-vault-surface p-3 text-sm">
            <p className="font-mono text-xs text-vault-muted">Deep link:</p>
            <p className="mt-1 text-emerald-400 text-xs break-all">
              https://vault.executionvault.io/executions/{selectedId}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleSendAlert("slack")}
              className="flex-1 rounded-lg bg-purple-500/20 border border-purple-500/30 py-2.5 text-sm text-purple-400 hover:bg-purple-500/30"
            >
              Send to Slack
            </button>
            <button
              type="button"
              onClick={() => handleSendAlert("email")}
              className="flex-1 rounded-lg bg-cyan-500/20 border border-cyan-500/30 py-2.5 text-sm text-cyan-400 hover:bg-cyan-500/30"
            >
              Send via Email
            </button>
          </div>
        </div>
      </Modal>

      {/* Webhook Test Modal */}
      <Modal open={showWebhookModal} onClose={() => setShowWebhookModal(false)} title="Test Webhook Capture">
        <div className="space-y-4">
          <p className="text-sm text-vault-muted">
            Simulate an inbound webhook POST from n8n with a failed execution payload.
          </p>
          <pre className="rounded-lg border border-vault-border bg-vault-surface p-3 text-xs font-mono overflow-x-auto">
{`POST /hooks/n8n/meridian-analytics
Content-Type: application/json

{
  "execution_id": "sim_${Date.now()}",
  "workflow": "Test Workflow",
  "status": "error",
  "error": "Connection reset by peer"
}`}
          </pre>
          <button
            type="button"
            onClick={handleSimulateWebhook}
            className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-medium text-white hover:bg-emerald-600"
          >
            Simulate Webhook POST
          </button>
        </div>
      </Modal>

      {/* Pattern Digest Modal */}
      <Modal
        open={!!showPatternModal}
        onClose={() => setShowPatternModal(null)}
        title="Nightly Digest Email Preview"
      >
        {showPatternModal && (
          <div className="space-y-4 font-mono text-xs">
            <p className="text-vault-muted">From: alerts@executionvault.io</p>
            <p className="text-vault-muted">To: devops@meridian-analytics.io</p>
            <p className="text-vault-muted">Subject: ExecutionVault Weekly Pattern Digest — 4 active patterns</p>
            <div className="rounded-lg border border-vault-border bg-vault-surface p-4 text-sm font-sans">
              <p className="font-medium">Hi team,</p>
              <p className="mt-2 text-vault-muted">
                {failurePatterns.find((p) => p.id === showPatternModal)?.occurrences} occurrences of{" "}
                <strong className="text-amber-400">{failurePatterns.find((p) => p.id === showPatternModal)?.errorCode}</strong>{" "}
                detected this week.
              </p>
              <p className="mt-2 text-vault-muted">
                Root cause: {failurePatterns.find((p) => p.id === showPatternModal)?.rootCause}
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowPatternModal(null);
                  setActiveTab("patterns");
                  setSelectedPattern(showPatternModal);
                }}
                className="mt-4 rounded bg-emerald-500 px-4 py-2 text-xs text-white"
              >
                View in Dashboard →
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
