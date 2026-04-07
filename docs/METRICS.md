# Metrics — Hyra Supplier Portal

---

## Available Metrics

> These can be sourced from existing data (OnHire table, internal systems).

| Metric                   | Source              | Notes |
|--------------------------|---------------------|-------|
| Unit Price               | OnHire table        |       |
| Off-Hire Collection      | OnHire table        |       |
| Breakdown Frequency      | OnHire table        |       |
| Breakdown Time to Fix    | OnHire table        |       |
| Final Charges (within 4 days) | OnHire table   |       |
| Credit Terms             | OnHire table        |       |

---

## Not Available (Requires Email Parsing)

> These metrics are not currently captured in structured data. Would require parsing inbound/outbound emails.

- Transport Cost
- Quote Response Time
- Availability
- On-Time Delivery Accuracy
- On-Time Collection Accuracy

---

## Requires External Integration

> These metrics depend on third-party systems.

| Metric                          | Integration Required |
|---------------------------------|----------------------|
| Invoice Accuracy                | Lightyear API        |
| Invoice Query Resolution Time   | Lightyear API        |
