# Initial Tasks — Hyra Supplier Portal

> Ordered checklist of tasks to bootstrap the project from an empty repo to a working application.

---

## Phase 0 — Project Setup

- [ ] **T-001**: Initialize project with Vite + React + TypeScript (`npm create vite@latest`)
- [ ] **T-002**: Install and configure Tailwind CSS
- [ ] **T-003**: Install and configure shadcn/ui (`npx shadcn-ui@latest init`)
- [ ] **T-004**: Configure ESLint + TypeScript strict mode
- [ ] **T-005**: Set up path aliases (`@/` → `src/`)
- [ ] **T-006**: Create folder structure (`components/`, `pages/`, `hooks/`, `lib/`, `types/`, `services/`)
- [ ] **T-007**: Verify `npm run dev`, `npm run build`, `npm run lint` all pass
- [ ] **T-008**: Initialize git repo, add `.gitignore`, make first commit

## Phase 1 — Core Layout & Routing

- [ ] **T-009**: Install React Router DOM v6
- [ ] **T-010**: Create app shell (header, sidebar/nav, main content area, footer)
- [ ] **T-011**: Set up route structure (dashboard, suppliers, orders, invoices, etc.)
- [ ] **T-012**: Create `NotFound` (404) page

## Phase 2 — Authentication

- [ ] **T-013**: Choose and integrate auth provider (TODO — OAuth / SSO / JWT?)
- [ ] **T-014**: Create login page
- [ ] **T-015**: Add protected route wrapper
- [ ] **T-016**: Add role-based access (Supplier vs Admin — TODO confirm roles)

## Phase 3 — Data Layer

- [ ] **T-017**: Define TypeScript interfaces for core entities (Supplier, Order, Invoice, etc.)
- [ ] **T-018**: Set up API client (`src/services/`)
- [ ] **T-019**: Connect to backend API (TODO — define backend)
- [ ] **T-020**: Set up state management (TODO — React Query / Zustand / Context)

## Phase 4 — Supplier Features

- [ ] **T-021**: Supplier profile view/edit page
- [ ] **T-022**: Orders list and detail pages
- [ ] **T-023**: Invoices list and detail pages
- [ ] **T-024**: TODO — additional supplier-facing features from PRD

## Phase 5 — Metrics Dashboard

- [ ] **T-025**: Display available metrics (Unit Price, Off-Hire Collection, Breakdown Frequency, Breakdown Time to Fix, Final Charges, Credit Terms)
- [ ] **T-026**: Connect metrics to OnHire table data source
- [ ] **T-027**: Investigate Lightyear API integration for Invoice Accuracy + Query Resolution Time
- [ ] **T-028**: TODO — email parsing spike for Transport Cost, Quote Response Time, Availability, Delivery/Collection Accuracy

## Phase 6 — Testing & CI

- [ ] **T-029**: Set up test runner (TODO — Vitest recommended for Vite projects)
- [ ] **T-030**: Write initial component tests
- [ ] **T-031**: Set up CI pipeline (TODO — GitHub Actions / etc.)
- [ ] **T-032**: Add Lighthouse CI for performance/a11y checks

## Phase 7 — Deployment

- [ ] **T-033**: Choose hosting (TODO — Vercel / AWS / Azure / etc.)
- [ ] **T-034**: Configure staging environment
- [ ] **T-035**: Configure production environment
- [ ] **T-036**: Set up monitoring and error tracking (TODO — Sentry / etc.)
