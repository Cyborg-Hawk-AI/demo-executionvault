export type Platform = "n8n" | "Make" | "Zapier";
export type ExecutionStatus = "failed" | "stuck" | "replayed" | "resolved";

export interface ExecutionStep {
  id: string;
  name: string;
  status: "success" | "failed" | "skipped" | "running";
  durationMs: number;
  output?: string;
  error?: string;
}

export interface Execution {
  id: string;
  workflowName: string;
  platform: Platform;
  status: ExecutionStatus;
  errorMessage: string;
  errorCode: string;
  company: string;
  triggeredBy: string;
  capturedAt: string;
  durationMs: number;
  retryCount: number;
  payload: Record<string, unknown>;
  steps: ExecutionStep[];
  suggestedFix: string;
  patternId?: string;
}

export interface FailurePattern {
  id: string;
  errorCode: string;
  title: string;
  occurrences: number;
  windowDays: number;
  rootCause: string;
  affectedWorkflows: string[];
  firstSeen: string;
  lastSeen: string;
  trend: "rising" | "stable" | "declining";
}

export interface Alert {
  id: string;
  channel: "slack" | "email";
  recipient: string;
  executionId: string;
  workflowName: string;
  sentAt: string;
  status: "delivered" | "pending" | "clicked";
  preview: string;
}

export interface ActivityItem {
  id: string;
  type: "capture" | "replay" | "alert" | "pattern" | "resolve";
  message: string;
  timestamp: string;
  executionId?: string;
}

export const executions: Execution[] = [
  {
    id: "ex_8f3a2b1c",
    workflowName: "Stripe → HubSpot Invoice Sync",
    platform: "n8n",
    status: "failed",
    errorMessage: "HTTP 429: Rate limit exceeded on HubSpot CRM API",
    errorCode: "HUBSPOT_RATE_LIMIT",
    company: "Meridian Analytics",
    triggeredBy: "stripe.invoice.paid webhook",
    capturedAt: "2026-07-11T11:42:18Z",
    durationMs: 4820,
    retryCount: 3,
    patternId: "pat_hubspot_rate",
    payload: {
      event: "invoice.paid",
      invoice_id: "in_1Qx7KpL2mN3oP4qR",
      customer_email: "billing@meridian-analytics.io",
      amount: 2499.0,
      currency: "usd",
      line_items: [
        { sku: "PRO-ANNUAL", quantity: 1, amount: 2499.0 },
      ],
      metadata: { hubspot_deal_id: "48291037" },
    },
    steps: [
      { id: "s1", name: "Webhook Trigger", status: "success", durationMs: 12, output: "Received stripe.invoice.paid" },
      { id: "s2", name: "Validate Signature", status: "success", durationMs: 45, output: "HMAC verified" },
      { id: "s3", name: "Transform Payload", status: "success", durationMs: 89, output: "Mapped to HubSpot deal format" },
      { id: "s4", name: "HubSpot Update Deal", status: "failed", durationMs: 3200, error: "429 Too Many Requests — daily API limit reached" },
      { id: "s5", name: "Send Slack Notification", status: "skipped", durationMs: 0 },
    ],
    suggestedFix:
      "HubSpot's CRM API enforces a 100 requests/10-second burst limit. Add an exponential backoff retry node before the HubSpot update, or batch deal updates via the bulk API endpoint. Consider caching deal IDs in Redis to avoid redundant lookups.",
  },
  {
    id: "ex_7e2d9f0a",
    workflowName: "Shopify Order → Fulfillment",
    platform: "Make",
    status: "stuck",
    errorMessage: "Connection timeout after 30s waiting for ShipBob API",
    errorCode: "SHIPBOB_TIMEOUT",
    company: "Lumen Home Goods",
    triggeredBy: "shopify.orders/create",
    capturedAt: "2026-07-11T10:15:33Z",
    durationMs: 30200,
    retryCount: 1,
    patternId: "pat_shipbob_timeout",
    payload: {
      order_id: "#LH-88421",
      customer: "Sarah Chen",
      items: 3,
      total: 187.45,
      shipping_address: "742 Evergreen Terrace, Portland OR 97201",
      warehouse: "shipbob-west-2",
    },
    steps: [
      { id: "s1", name: "Shopify Trigger", status: "success", durationMs: 230, output: "Order #LH-88421 captured" },
      { id: "s2", name: "Inventory Check", status: "success", durationMs: 890, output: "All items in stock at west-2" },
      { id: "s3", name: "Create ShipBob Order", status: "failed", durationMs: 30000, error: "ETIMEDOUT — no response from api.shipbob.com" },
      { id: "s4", name: "Update Shopify Tags", status: "skipped", durationMs: 0 },
    ],
    suggestedFix:
      "ShipBob's west-2 endpoint has had intermittent latency spikes this week. Increase the HTTP timeout to 60s and add a circuit breaker. As a fallback, route orders to east-1 when west-2 response time exceeds 5s on the health check.",
  },
  {
    id: "ex_6c1b8e7d",
    workflowName: "Lead Scoring Pipeline",
    platform: "Zapier",
    status: "failed",
    errorMessage: "Invalid JSON in Code by Zapier step — unexpected token at position 142",
    errorCode: "ZAPIER_JSON_PARSE",
    company: "Northstar SaaS",
    triggeredBy: "Typeform new response",
    capturedAt: "2026-07-11T09:28:07Z",
    durationMs: 1240,
    retryCount: 0,
    payload: {
      form_id: "tf_9k2m",
      respondent: "James Okafor",
      email: "j.okafor@northstarsaas.com",
      company_size: "50-200",
      raw_score: "87",
      utm_source: "linkedin",
    },
    steps: [
      { id: "s1", name: "Typeform Trigger", status: "success", durationMs: 180, output: "Response from James Okafor" },
      { id: "s2", name: "Parse Lead Score", status: "failed", durationMs: 45, error: "SyntaxError: Unexpected token } in JSON at position 142" },
      { id: "s3", name: "Update Salesforce Lead", status: "skipped", durationMs: 0 },
      { id: "s4", name: "Notify SDR Team", status: "skipped", durationMs: 0 },
    ],
    suggestedFix:
      "The Code step is concatenating a string score with a JSON object without proper escaping. Wrap the score in JSON.stringify() before merging, or use Zapier's built-in Formatter → Utilities → Line-item to JSON instead of custom code.",
  },
  {
    id: "ex_5a0f6d3e",
    workflowName: "Daily Revenue Report",
    platform: "n8n",
    status: "failed",
    errorMessage: "PostgreSQL connection refused — max_connections reached",
    errorCode: "PG_MAX_CONNECTIONS",
    company: "Cascade Fintech",
    triggeredBy: "Cron (daily 6:00 AM UTC)",
    capturedAt: "2026-07-11T06:00:12Z",
    durationMs: 2100,
    retryCount: 2,
    patternId: "pat_pg_connections",
    payload: {
      report_date: "2026-07-10",
      db_host: "db.cascade-fintech.internal",
      query: "SELECT SUM(amount) FROM transactions WHERE date = $1",
      recipients: ["cfo@cascade.io", "ops@cascade.io"],
    },
    steps: [
      { id: "s1", name: "Cron Trigger", status: "success", durationMs: 5, output: "Scheduled run started" },
      { id: "s2", name: "Connect PostgreSQL", status: "failed", durationMs: 1800, error: "FATAL: sorry, too many clients already (max_connections=100)" },
      { id: "s3", name: "Generate PDF", status: "skipped", durationMs: 0 },
      { id: "s4", name: "Email Report", status: "skipped", durationMs: 0 },
    ],
    suggestedFix:
      "Your n8n instance shares a PostgreSQL pool with 4 other workflows. Enable connection pooling via PgBouncer with a max of 20 connections per service, or switch the n8n Postgres node to use a read replica for reporting queries.",
  },
  {
    id: "ex_4b9e5c2f",
    workflowName: "Employee Onboarding",
    platform: "Make",
    status: "resolved",
    errorMessage: "Google Workspace API: User already exists",
    errorCode: "GW_USER_EXISTS",
    company: "Brightpath Education",
    triggeredBy: "BambooHR new hire",
    capturedAt: "2026-07-10T16:44:55Z",
    durationMs: 3100,
    retryCount: 1,
    payload: {
      employee_id: "EMP-2041",
      full_name: "Elena Vasquez",
      email: "elena.vasquez@brightpath.edu",
      department: "Curriculum Design",
      start_date: "2026-07-21",
    },
    steps: [
      { id: "s1", name: "BambooHR Trigger", status: "success", durationMs: 340, output: "New hire: Elena Vasquez" },
      { id: "s2", name: "Create Google Account", status: "failed", durationMs: 1200, error: "409 Conflict: Entity already exists" },
      { id: "s3", name: "Provision Slack", status: "skipped", durationMs: 0 },
      { id: "s4", name: "Send Welcome Email", status: "skipped", durationMs: 0 },
    ],
    suggestedFix:
      "Add an idempotency check: query Google Directory API for the email before attempting creation. If the user exists, skip to Slack provisioning instead of failing the entire workflow.",
  },
  {
    id: "ex_3d8a4b1e",
    workflowName: "Inventory Reorder Alert",
    platform: "n8n",
    status: "replayed",
    errorMessage: "Airtable API: Invalid permissions for base appXYZ",
    errorCode: "AIRTABLE_PERMISSION",
    company: "Forge Supply Co",
    triggeredBy: "Inventory threshold webhook",
    capturedAt: "2026-07-10T14:22:41Z",
    durationMs: 890,
    retryCount: 0,
    payload: {
      sku: "FORGE-BOLT-M8",
      current_stock: 12,
      reorder_point: 50,
      supplier: "Pacific Fasteners Inc",
      po_amount: 4200.0,
    },
    steps: [
      { id: "s1", name: "Webhook Trigger", status: "success", durationMs: 8, output: "SKU FORGE-BOLT-M8 below threshold" },
      { id: "s2", name: "Read Airtable", status: "failed", durationMs: 650, error: "403 Forbidden: Invalid permissions for base appXYZ123" },
      { id: "s3", name: "Create PO in NetSuite", status: "skipped", durationMs: 0 },
    ],
    suggestedFix:
      "The Airtable personal access token expired on July 8. Regenerate the token in Airtable → Developer Hub and update the credential in n8n. Scope must include data.records:read for base appXYZ123.",
  },
  {
    id: "ex_2c7f3a0d",
    workflowName: "Customer Churn Webhook",
    platform: "Zapier",
    status: "failed",
    errorMessage: "Intercom API returned 401 Unauthorized",
    errorCode: "INTERCOM_AUTH",
    company: "Velo Metrics",
    triggeredBy: "Stripe subscription.deleted",
    capturedAt: "2026-07-10T11:05:19Z",
    durationMs: 1560,
    retryCount: 4,
    patternId: "pat_intercom_auth",
    payload: {
      subscription_id: "sub_1Qw9MnP3kL2jH1gF",
      customer_id: "cus_Rx8mN2pQ",
      plan: "Growth Annual",
      mrr_lost: 299.0,
      churn_reason: "voluntary",
    },
    steps: [
      { id: "s1", name: "Stripe Trigger", status: "success", durationMs: 95, output: "subscription.deleted received" },
      { id: "s2", name: "Tag in Intercom", status: "failed", durationMs: 420, error: "401 Unauthorized — access token invalid or revoked" },
      { id: "s3", name: "Create Churn Survey", status: "skipped", durationMs: 0 },
      { id: "s4", name: "Alert CS Team", status: "skipped", durationMs: 0 },
    ],
    suggestedFix:
      "Intercom access tokens rotate every 90 days. The current token was issued April 12 and expired July 11. Re-authorize the Intercom connection in Zapier and enable auto-refresh if using OAuth.",
  },
  {
    id: "ex_1b6e2f9c",
    workflowName: "Webhook → Snowflake ETL",
    platform: "n8n",
    status: "stuck",
    errorMessage: "Snowflake warehouse SUSPENDED — auto-resume timeout",
    errorCode: "SNOWFLAKE_WAREHOUSE",
    company: "DataPulse Labs",
    triggeredBy: "Segment track event batch",
    capturedAt: "2026-07-10T08:33:02Z",
    durationMs: 65000,
    retryCount: 2,
    payload: {
      batch_id: "seg_batch_88291",
      event_count: 847,
      warehouse: "ETL_WH",
      table: "raw_events.staging",
      bytes: 1240000,
    },
    steps: [
      { id: "s1", name: "Webhook Trigger", status: "success", durationMs: 22, output: "847 events in batch" },
      { id: "s2", name: "Transform Events", status: "success", durationMs: 4200, output: "Normalized 847 records" },
      { id: "s3", name: "Snowflake INSERT", status: "failed", durationMs: 60000, error: "Warehouse ETL_WH suspended — auto-resume timed out after 60s" },
      { id: "s4", name: "Ack Segment", status: "skipped", durationMs: 0 },
    ],
    suggestedFix:
      "Set the Snowflake warehouse to AUTO_RESUME with a longer statement timeout, or pre-warm the warehouse with a scheduled query 5 minutes before peak ETL windows (8:00–10:00 AM UTC).",
  },
];

export const failurePatterns: FailurePattern[] = [
  {
    id: "pat_hubspot_rate",
    errorCode: "HUBSPOT_RATE_LIMIT",
    title: "HubSpot CRM rate limit exceeded",
    occurrences: 12,
    windowDays: 7,
    rootCause:
      "Three workflows (Invoice Sync, Contact Enrichment, Deal Stage Update) all hit HubSpot's CRM API concurrently during business hours. Combined burst exceeds the 100 req/10s limit.",
    affectedWorkflows: ["Stripe → HubSpot Invoice Sync", "Lead Enrichment Pipeline", "Deal Stage Auto-Update"],
    firstSeen: "2026-07-04T14:22:00Z",
    lastSeen: "2026-07-11T11:42:18Z",
    trend: "rising",
  },
  {
    id: "pat_shipbob_timeout",
    errorCode: "SHIPBOB_TIMEOUT",
    title: "ShipBob API connection timeouts",
    occurrences: 8,
    windowDays: 7,
    rootCause:
      "ShipBob west-2 region experiencing elevated latency since July 8. 73% of timeouts occur between 10:00–14:00 UTC when order volume peaks.",
    affectedWorkflows: ["Shopify Order → Fulfillment", "Returns Processing"],
    firstSeen: "2026-07-08T09:15:00Z",
    lastSeen: "2026-07-11T10:15:33Z",
    trend: "rising",
  },
  {
    id: "pat_pg_connections",
    errorCode: "PG_MAX_CONNECTIONS",
    title: "PostgreSQL max_connections exhausted",
    occurrences: 5,
    windowDays: 7,
    rootCause:
      "n8n Postgres nodes open a new connection per execution without pooling. Daily cron jobs at 6:00 AM UTC collide with backup scripts, exhausting the 100-connection limit.",
    affectedWorkflows: ["Daily Revenue Report", "User Analytics Snapshot"],
    firstSeen: "2026-07-06T06:00:00Z",
    lastSeen: "2026-07-11T06:00:12Z",
    trend: "stable",
  },
  {
    id: "pat_intercom_auth",
    errorCode: "INTERCOM_AUTH",
    title: "Intercom token expiration",
    occurrences: 3,
    windowDays: 7,
    rootCause:
      "Intercom OAuth tokens expire every 90 days. Two Zapier zaps share the same expired token — re-authorization fixes both.",
    affectedWorkflows: ["Customer Churn Webhook", "NPS Follow-up Sequence"],
    firstSeen: "2026-07-10T11:05:19Z",
    lastSeen: "2026-07-11T08:44:00Z",
    trend: "declining",
  },
];

export const alerts: Alert[] = [
  {
    id: "alert_001",
    channel: "slack",
    recipient: "#ops-alerts",
    executionId: "ex_8f3a2b1c",
    workflowName: "Stripe → HubSpot Invoice Sync",
    sentAt: "2026-07-11T11:42:45Z",
    status: "clicked",
    preview: "🔴 Execution failed: HUBSPOT_RATE_LIMIT — Stripe → HubSpot Invoice Sync",
  },
  {
    id: "alert_002",
    channel: "email",
    recipient: "devops@meridian-analytics.io",
    executionId: "ex_8f3a2b1c",
    workflowName: "Stripe → HubSpot Invoice Sync",
    sentAt: "2026-07-11T11:43:02Z",
    status: "delivered",
    preview: "ExecutionVault Alert: Failed execution ex_8f3a2b1c requires attention",
  },
  {
    id: "alert_003",
    channel: "slack",
    recipient: "#fulfillment-ops",
    executionId: "ex_7e2d9f0a",
    workflowName: "Shopify Order → Fulfillment",
    sentAt: "2026-07-11T10:16:01Z",
    status: "delivered",
    preview: "🟡 Execution stuck: SHIPBOB_TIMEOUT — Order #LH-88421",
  },
  {
    id: "alert_004",
    channel: "email",
    recipient: "ops@lumenhome.com",
    executionId: "ex_7e2d9f0a",
    workflowName: "Shopify Order → Fulfillment",
    sentAt: "2026-07-11T10:16:15Z",
    status: "clicked",
    preview: "Stuck execution detected — ShipBob API timeout after 30s",
  },
  {
    id: "alert_005",
    channel: "slack",
    recipient: "#engineering",
    executionId: "ex_5a0f6d3e",
    workflowName: "Daily Revenue Report",
    sentAt: "2026-07-11T06:00:30Z",
    status: "delivered",
    preview: "🔴 Cron failure: PG_MAX_CONNECTIONS — Daily Revenue Report",
  },
  {
    id: "alert_006",
    channel: "email",
    recipient: "engineering@cascade.io",
    executionId: "ex_2c7f3a0d",
    workflowName: "Customer Churn Webhook",
    sentAt: "2026-07-10T11:05:45Z",
    status: "pending",
    preview: "4 retries exhausted — Intercom auth failure on churn webhook",
  },
];

export const activityFeed: ActivityItem[] = [
  { id: "act_1", type: "capture", message: "Captured failed execution from n8n — Stripe → HubSpot Invoice Sync", timestamp: "2026-07-11T11:42:18Z", executionId: "ex_8f3a2b1c" },
  { id: "act_2", type: "alert", message: "Slack alert sent to #ops-alerts with direct link", timestamp: "2026-07-11T11:42:45Z", executionId: "ex_8f3a2b1c" },
  { id: "act_3", type: "pattern", message: "Pattern detected: HUBSPOT_RATE_LIMIT occurred 12 times in 7 days", timestamp: "2026-07-11T11:43:00Z" },
  { id: "act_4", type: "capture", message: "Captured stuck execution from Make — Shopify Order → Fulfillment", timestamp: "2026-07-11T10:15:33Z", executionId: "ex_7e2d9f0a" },
  { id: "act_5", type: "replay", message: "Replayed execution ex_3d8a4b1e — Inventory Reorder Alert succeeded", timestamp: "2026-07-10T15:01:22Z", executionId: "ex_3d8a4b1e" },
  { id: "act_6", type: "resolve", message: "Marked ex_4b9e5c2f as resolved — duplicate Google account handled", timestamp: "2026-07-10T17:30:00Z", executionId: "ex_4b9e5c2f" },
  { id: "act_7", type: "alert", message: "Email digest sent to 4 team members — 3 new failures overnight", timestamp: "2026-07-11T06:30:00Z" },
  { id: "act_8", type: "capture", message: "Captured failed execution from Zapier — Lead Scoring Pipeline", timestamp: "2026-07-11T09:28:07Z", executionId: "ex_6c1b8e7d" },
];

export const chartData = {
  failuresByDay: [
    { day: "Jul 5", count: 4 },
    { day: "Jul 6", count: 7 },
    { day: "Jul 7", count: 5 },
    { day: "Jul 8", count: 11 },
    { day: "Jul 9", count: 8 },
    { day: "Jul 10", count: 14 },
    { day: "Jul 11", count: 6 },
  ],
  byPlatform: [
    { platform: "n8n", count: 28, color: "#10b981" },
    { platform: "Make", count: 15, color: "#8b5cf6" },
    { platform: "Zapier", count: 9, color: "#f59e0b" },
  ],
  capturedThisMonth: 3847,
  captureLimit: 5000,
};

export const webhookEndpoints = [
  { platform: "n8n", url: "https://vault.executionvault.io/hooks/n8n/meridian-analytics", status: "active", lastReceived: "2026-07-11T11:42:18Z", count: 1247 },
  { platform: "Make", url: "https://vault.executionvault.io/hooks/make/lumen-home", status: "active", lastReceived: "2026-07-11T10:15:33Z", count: 892 },
  { platform: "Zapier", url: "https://vault.executionvault.io/hooks/zapier/northstar", status: "active", lastReceived: "2026-07-11T09:28:07Z", count: 534 },
];
