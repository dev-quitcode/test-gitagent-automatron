# Architecture — Hyra Supplier Data Portal

> **Status:** Phase 1 — Database & Email Ingestion
> **Last Updated:** 2026-02-17

---

## 1. High-Level Overview

The Supplier Data Portal aggregates data from three sources into Supabase, computes weekly supplier metrics, and exposes them through a React dashboard.

```
┌──────────────┐   ┌──────────────┐   ┌───────────────┐
│  Airtable    │   │  Front App   │   │  Lightyear    │
│  (OnHire/    │   │  (Email      │   │  (Invoice     │
│   Suppliers) │   │   Inbox)     │   │   Accuracy)   │
└──────┬───────┘   └──────┬───────┘   └──────┬────────┘
       │                  │                   │
       ▼                  ▼                   ▼
┌─────────────────────────────────────────────────────┐
│              Supabase (PostgreSQL)                   │
│                                                     │
│  ┌─────────────┐ ┌────────┐ ┌────────────────────┐ │
│  │ Suppliers   │ │ emails │ │ on_hire_orders     │ │
│  │ Contacts    │ │ sem.   │ │ breakdowns         │ │
│  │ Rate Cards  │ │ events │ │ extra_charges      │ │
│  └─────────────┘ └────────┘ └────────────────────┘ │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  supplier_weekly_stats (computed via RPC)    │   │
│  │  metrics_validation_log                      │   │
│  └─────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
              ┌──────────────────┐
              │   React SPA      │
              │   (Vite + TS)    │
              └──────────────────┘
```

---

## 2. Data Sources

| Source         | What it provides                                    | Sync method               |
|----------------|-----------------------------------------------------|---------------------------|
| **Airtable**   | Suppliers, Contacts, On-Hire Orders, Products, Rate Cards, Areas, Depots | `airtable_sync_reconcile` RPC + `sync_checkpoints` |
| **Front App**  | Emails → parsed into semantic events, communication requests | `front_backfill_runs` + email ingestion pipeline |
| **Lightyear**  | Invoice Accuracy, Invoice Query Resolution Time     | TODO — external integration |

---

## 3. Database Schema (Supabase)

Full DDL: [`supabase/migrations/20260217000001_baseline_schema.sql`](../supabase/migrations/20260217000001_baseline_schema.sql)

### Entity Groups

| Group                  | Tables                                                                                   |
|------------------------|------------------------------------------------------------------------------------------|
| **Core entities**      | `Suppliers`, `Accounts - Company`, `Products`, `Categories`, `Contacts`                  |
| **Geography**          | `Area`, `Area Relationship`, `Supplier Depot`                                            |
| **Pricing**            | `Rate Cards`, `Customer Rate`, `Customer Rate Products`                                  |
| **On-Hire lifecycle**  | `on_hire_orders`, `breakdowns`, `extra_charges`                                          |
| **Email ingestion**    | `emails`, `email_domain_map`, `email_identity_map`, `semantic_events`                    |
| **Communication**      | `communication_requests`, `communication_request_emails`                                 |
| **Computed metrics**   | `supplier_weekly_stats`, `metrics_validation_log`                                        |
| **Infra / sync**       | `sync_checkpoints`, `front_backfill_runs`                                                |
| **Yesss**              | `yesss_end_customers`                                                                    |

### Key RPC Functions

| Function                                    | Purpose                                          |
|---------------------------------------------|--------------------------------------------------|
| `airtable_sync_reconcile`                   | Reconcile Airtable data into Supabase tables     |
| `calculate_supplier_weekly_stats`           | Compute `supplier_weekly_stats` from raw data    |
| `refresh_email_domain_map_from_contacts`    | Rebuild `email_domain_map` from `Contacts`       |
| `refresh_email_identity_map_from_contacts`  | Rebuild `email_identity_map` from `Contacts`     |
| `validate_supplier_weekly_stats`            | Run validation checks, log to `metrics_validation_log` |

---

## 4. Tech Stack

| Layer          | Technology                                          |
|----------------|-----------------------------------------------------|
| Database       | Supabase (PostgreSQL)                               |
| Backend logic  | Supabase RPC (PL/pgSQL) + Edge Functions (TODO)     |
| Frontend       | React 18, Vite, TypeScript                          |
| UI             | shadcn/ui, Tailwind CSS                             |
| State / data   | @supabase/supabase-js + React Query                 |
| Auth           | Supabase Auth (TODO — configure provider)           |
| External sync  | Airtable API, Front API, Lightyear API              |

---

## 5. Repository Structure

```
hyra-supplier-portal/
├── supabase/
│   └── migrations/              # SQL migrations (baseline + incremental)
├── src/
│   ├── main.tsx                 # App entry point
│   ├── App.tsx                  # Router + providers
│   ├── index.css                # Tailwind directives
│   ├── lib/
│   │   ├── supabase.ts          # Supabase client singleton
│   │   └── utils.ts             # cn() and helpers
│   ├── types/
│   │   └── database.ts          # Generated Supabase types
│   ├── hooks/
│   │   └── use-supplier-stats.ts # Data fetching hooks
│   ├── services/
│   │   ├── suppliers.ts         # Supplier queries
│   │   ├── emails.ts            # Email queries
│   │   └── metrics.ts           # Weekly stats queries
│   ├── components/
│   │   ├── ui/                  # shadcn/ui (do not hand-edit)
│   │   └── dashboard/           # Metric cards, charts
│   └── pages/
│       ├── Dashboard.tsx
│       └── SupplierDetail.tsx
├── docs/
│   ├── ARCHITECTURE.md          # This file
│   ├── PRD.md
│   ├── STORIES.md
│   ├── METRICS.md
│   ├── INITIAL_TASKS.md
│   └── LEARNINGS.md
├── CLAUDE.md
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.ts
```

---

## 6. Metrics Mapping

How each metric from `docs/METRICS.md` maps to the database:

### Available (from `on_hire_orders` + related tables → `supplier_weekly_stats`)

| Metric                        | Source column(s)                                                    |
|-------------------------------|---------------------------------------------------------------------|
| Unit Price                    | `on_hire_orders.supplier_unit_price`                                |
| Off-Hire Collection           | `on_hire_orders.off_hire_date`, `actual_collection_at` → `offhire_within_7d_pct` |
| Breakdown Frequency           | `breakdowns` count → `breakdown_rate_per_10_hires`                  |
| Breakdown Time to Fix         | `breakdowns.raised_at` → `completed_at` → `avg_breakdown_fix_time_hours` |
| Final Charges (within 4 days) | `extra_charges.created_at` → `extra_charges_within_4d_pct`          |
| Credit Terms                  | `Suppliers.credit_terms`                                            |

### Requires Email Parsing (from `emails` → `semantic_events` → `supplier_weekly_stats`)

| Metric                   | Source                                                               |
|--------------------------|----------------------------------------------------------------------|
| Transport Cost           | TODO — not yet extracted from emails                                 |
| Quote Response Time      | `emails.is_quote_request/is_quote_response` → `quote_response_avg_hours` |
| Availability             | TODO — not yet extracted from emails                                 |
| On-Time Delivery         | `emails.delivery_requested_date` vs `delivery_actual_date` → `on_time_delivery_pct` |
| On-Time Collection       | `emails.collection_requested_date` vs `collection_actual_date` → `on_time_collection_pct` |

### Requires External Integration

| Metric                          | Source             | Status |
|---------------------------------|--------------------|--------|
| Invoice Accuracy                | Lightyear API      | TODO   |
| Invoice Query Resolution Time   | Lightyear API      | TODO   |
