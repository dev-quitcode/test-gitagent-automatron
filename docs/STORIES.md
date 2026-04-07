# User Stories

> Atomic stories organized by phase. Each story is independently shippable.
> Reference in commits: `feat: HSP-101 — ...`

---

## Status Legend

| Status      | Meaning                        |
|-------------|--------------------------------|
| Backlog     | Defined but not yet started    |
| In Progress | Actively being worked on       |
| Review      | Code complete, awaiting review |
| Done        | Merged and verified            |
| Blocked     | Cannot proceed — see Notes     |

---

## Phase 1 Stories

### Scaffold & Connect

| ID       | Story                                                                 | Acceptance Criteria                                                                                      | Status      | Notes |
|----------|-----------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|-------------|-------|
| HSP-100  | Initialize Vite + React + TS project with Supabase client             | `npm run dev` starts; `supabase.ts` exports typed client; `.env.local` has `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` | Done | Build + lint pass; App.tsx queries Suppliers table |
| HSP-101  | Generate TypeScript types from live Supabase schema                   | `src/types/database.ts` exists; types match all 20+ tables; no `any`                                     | Done        | Generated from OpenAPI spec; typed client wired up |
| HSP-102  | Add a health-check page that queries `Suppliers` and shows row count  | `/health` route renders count; verifies end-to-end Supabase connectivity                                 | Done        | Checks 5 key tables; React Router added |

### Airtable Sync Verification

| ID       | Story                                                                 | Acceptance Criteria                                                                                      | Status  | Notes |
|----------|-----------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|---------|-------|
| HSP-110  | Create service to read `sync_checkpoints` and display last sync times | `services/sync.ts` exports `getSyncStatus()`; page shows table name, last sync, record count             | Done    | `/sync` route; relative time display |
| HSP-111  | Display `Suppliers` list with name, status, credit terms              | `/suppliers` page; table with sort; fetches from Supabase; loading + empty states                        | Done    | Sortable columns; links to detail page |
| HSP-112  | Display `on_hire_orders` for a single supplier                        | `/suppliers/:id` shows orders table; columns: contract, status, unit price, dates                        | Done    | Batched with 113+114 into SupplierDetail.tsx |
| HSP-113  | Display `breakdowns` for a single supplier                            | Same supplier detail page; breakdowns section with raised_at, completed_at, stage                        | Done    | Batched with 112+114 |
| HSP-114  | Display `extra_charges` for a single supplier                         | Same supplier detail page; extra charges section with type, amount, date                                 | Done    | Batched with 112+113 |

### Email Ingestion Verification

| ID       | Story                                                                 | Acceptance Criteria                                                                                      | Status  | Notes |
|----------|-----------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|---------|-------|
| HSP-120  | Create service to read `emails` table with filters                    | `services/emails.ts`; filter by supplier_id, parse_status, date range; paginated                         | Done    | Also includes `getEmailStats()` and `getLatestBackfillRun()` |
| HSP-121  | Display email ingestion status (parsed vs unparsed counts)            | Dashboard card showing: total emails, parsed count, unparsed count, latest `front_backfill_runs` status  | Done    | `/emails` route with stat cards + recent emails table |
| HSP-122  | Display `email_domain_map` and `email_identity_map` status            | Admin page showing domain→supplier mappings and email→entity mappings; read-only                         | Done    | `/email-maps` route; domain + identity tables |
| HSP-123  | Display `semantic_events` for a supplier                              | Supplier detail page; events list with type, sub_type, timestamp, confidence                             | Done    | Added to SupplierDetail.tsx with confidence % |
| HSP-124  | Display `communication_requests` with linked emails                   | Communication thread view; shows request type, status, timeline of linked emails                         | Done    | `/comms` route; table with type, status, initiator, dates |

### Computed Metrics Verification

| ID       | Story                                                                 | Acceptance Criteria                                                                                      | Status  | Notes |
|----------|-----------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|---------|-------|
| HSP-130  | Create service to read `supplier_weekly_stats`                        | `services/metrics.ts`; query by supplier_id + date range; returns typed rows                             | Done    | Also includes `getLatestWeeklyStats()` and `getValidationLog()` |
| HSP-131  | Display weekly stats summary card for a supplier                      | Supplier detail page; card with latest week's KPIs (delivery %, breakdown rate, quote response time)     | Done    | KPI grid with 10 metrics on SupplierDetail |
| HSP-132  | Display `metrics_validation_log` warnings                             | Admin page; table of validation warnings with severity, check name, details                              | Done    | `/validation` route; color-coded severity |

---

## Phase 2 Stories — Polish & Interactivity

### UI Foundation

| ID       | Story                                                                 | Acceptance Criteria                                                                                      | Status  | Notes |
|----------|-----------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|---------|-------|
| HSP-200  | Add Tailwind CSS v4 + configure design tokens                         | `tailwindcss` installed; `@tailwind` directives in CSS; utility classes work in components                | Done    | @tailwindcss/vite plugin; custom theme tokens |
| HSP-201  | Create shared layout with sidebar navigation                          | `Layout` component wraps all routes; sidebar with links; responsive; replaces inline nav                 | Done    | NavLink with active state; Outlet pattern |
| HSP-202  | Restyle all pages with Tailwind utilities                             | Remove all inline `style={{}}` objects; consistent spacing, typography, colors via Tailwind               | Done    | All 9 pages converted; zero inline styles |

### Data Visualization

| ID       | Story                                                                 | Acceptance Criteria                                                                                      | Status  | Notes |
|----------|-----------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|---------|-------|
| HSP-210  | Add weekly stats trend chart on supplier detail                       | Line/bar chart showing key metrics over last 12 weeks; uses `getWeeklyStatsBySupplierId()`               | Done    | recharts LineChart; 4 metrics plotted |
| HSP-211  | Add supplier comparison dashboard                                     | `/dashboard` page; top-N suppliers by key metrics; summary cards                                         | Done    | Horizontal bar chart + metric selector + full table |

### Interactivity

| ID       | Story                                                                 | Acceptance Criteria                                                                                      | Status  | Notes |
|----------|-----------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|---------|-------|
| HSP-220  | Add RPC trigger buttons (recalculate stats, refresh maps)             | Admin buttons that call Supabase RPCs; loading state; success/error feedback                              | Done    | `/admin` page; 5 RPCs; loading/success/error states |
| HSP-221  | Add search/filter to suppliers list                                   | Text search by name; filter by status, importance; persists in URL params                                | Done    | useSearchParams; dropdowns for status + importance |
| HSP-222  | Add pagination to emails list                                         | Next/prev buttons; page size selector; uses existing offset/limit in service                             | Done    | 20/50/100 page sizes; prev/next with total count |

---

## Phase 3 Stories — Production Readiness

### Performance

| ID       | Story                                                                 | Acceptance Criteria                                                                                      | Status  | Notes |
|----------|-----------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|---------|-------|
| HSP-300  | Lazy-load chart-heavy pages to reduce initial bundle                  | Dashboard + SupplierDetail loaded via `React.lazy`; main bundle under 500kB                              | Done    | All pages lazy-loaded; main bundle 407kB |

### UX Polish

| ID       | Story                                                                 | Acceptance Criteria                                                                                      | Status  | Notes |
|----------|-----------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|---------|-------|
| HSP-310  | Add dark mode toggle with system preference detection                 | Toggle in sidebar; persists in localStorage; respects `prefers-color-scheme`; all pages styled            | Done    | useDarkMode hook; light/dark/system cycle; CSS overrides |
| HSP-311  | Upgrade Home page to a summary dashboard                              | Show key stats: supplier count, email count, latest sync time, latest validation warnings                | Done    | StatCards + validation table + quick links |
| HSP-312  | Add loading skeletons and error boundaries                            | Skeleton placeholders during loads; ErrorBoundary catches render errors with retry button                 | Done    | ErrorBoundary class component; PageSkeleton with animated pulse |

---

## Phase 4 Stories — UX & Productivity

### Navigation & Discovery

| ID       | Story                                                                 | Acceptance Criteria                                                                                      | Status  | Notes |
|----------|-----------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|---------|-------|
| HSP-400  | Add global search (Cmd+K) across suppliers and emails                 | Modal opens on Cmd+K; searches suppliers by name, emails by subject; navigates on select; debounced input | Done    | SearchModal component; keyboard nav; sidebar trigger |
| HSP-401  | Add breadcrumb navigation to nested pages                             | SupplierDetail shows Home > Suppliers > [Name]; all pages show contextual breadcrumbs                    | Done    | Breadcrumbs component in Layout; path-based |

### Mobile & Responsiveness

| ID       | Story                                                                 | Acceptance Criteria                                                                                      | Status  | Notes |
|----------|-----------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|---------|-------|
| HSP-410  | Make sidebar responsive with mobile hamburger menu                    | Sidebar collapses on small screens; hamburger toggle; overlay on mobile; persists state                  | Done    | hidden md:flex; overlay sidebar; auto-close on navigate |
| HSP-411  | Make tables horizontally scrollable on mobile                         | All data tables scroll horizontally on small viewports; no layout overflow                               | Done    | All 10 tables wrapped in overflow-x-auto |

### Data Export & Details

| ID       | Story                                                                 | Acceptance Criteria                                                                                      | Status  | Notes |
|----------|-----------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|---------|-------|
| HSP-420  | Add CSV export button to key tables                                   | Export button on Suppliers, Emails, Validation pages; generates CSV with headers; triggers download       | Done    | csv.ts utility; export on 3 pages |
| HSP-421  | Add email detail expandable row / modal                               | Click email row to expand or open modal; shows full subject, body preview, parsed fields, linked events  | Done    | Click-to-expand row; 12 fields + snippet preview |

---

## Phase 5 Stories — Security & Production Deployment

### Authentication & Access Control

| ID       | Story                                                                 | Acceptance Criteria                                                                                      | Status  | Notes |
|----------|-----------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|---------|-------|
| HSP-500  | Add Supabase Auth with magic-link login                               | `/login` page with email input; Supabase `signInWithOtp`; session persisted via Supabase client          | Backlog | |
| HSP-501  | Protect all routes behind auth guard                                  | Unauthenticated users redirected to `/login`; `ProtectedRoute` wrapper in router; session checked on load | Backlog | |
| HSP-502  | Show logged-in user and logout button in sidebar                      | User email shown at bottom of sidebar; logout clears session and redirects to `/login`                   | Backlog | Depends on HSP-500/501 |

### Deployment

| ID       | Story                                                                 | Acceptance Criteria                                                                                      | Status  | Notes |
|----------|-----------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|---------|-------|
| HSP-510  | Deploy to Vercel with environment variable configuration              | App live on Vercel URL; `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` set in Vercel env; preview deploys on PR | Backlog | |
| HSP-511  | Add GitHub Actions CI — lint + build on every PR                      | `.github/workflows/ci.yml`; runs `npm run lint` + `npm run build`; blocks merge on failure               | Backlog | |

### Polish & Completeness

| ID       | Story                                                                 | Acceptance Criteria                                                                                      | Status  | Notes |
|----------|-----------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|---------|-------|
| HSP-520  | Resolve supplier name in breadcrumbs on detail page                   | SupplierDetail breadcrumb shows actual supplier name (not ID); fetched from existing page query           | Backlog | |
| HSP-521  | Add keyboard shortcut hint to search trigger in sidebar               | Sidebar search button shows `⌘K` badge (Mac) or `Ctrl+K` badge (Windows/Linux)                          | Backlog | |
| HSP-522  | Add auto-refresh toggle to Sync Status page                           | Toggle button enables 30s polling; badge shows "Live" when active; stops on toggle-off or unmount        | Backlog | |

---

## Template for New Stories

```markdown
| HSP-NNN  | As a [persona], I want to [action] so that [benefit] | - [ ] Criteria 1 - [ ] Criteria 2 | Backlog | |
```
