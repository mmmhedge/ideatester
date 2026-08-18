# Franchise acquisition & operating platform

Company design work for an AI-driven franchise matching, underwriting, financing, and operating platform — kept in its own folder, separate from the `ideatester` landing-page app in the repo root.

- **`docs/COMPANY-DESIGN.md`** — the full company design document: thesis, customer journey, matching/diligence model, financing model, launch/ops model, multi-unit expansion product, data moat, revenue model, go-to-market, phased roadmap, risks/kill criteria, unit economics, and a 90-day validation plan. Read this first.

## What's being tested first

The design doc's verdict (§20) is to build the **multi-unit expansion advisory + financing-readiness product** first — not a broad matching directory — targeting existing single-unit franchisees who are ready for a second location, in one category and one metro.

A landing page testing that specific wedge is registered in the main app at `/secondunit` (`ideas/secondunit.ts`), using this repo's existing idea-testing mechanism (`README.md` at the repo root) rather than a separate product build. That keeps the validation loop cheap: ship the page, run a small ad/outreach test per the repo's runbooks, see if existing operators actually raise their hand before any matching engine, financing rules engine, or project-management software gets built.

## Status

Design-stage. No code for the matching engine, diligence layer, financing-eligibility rules engine, or launch-tracking product exists yet — per the roadmap in the design doc (§13), those are Phase 2+ builds gated on the 90-day validation plan (§18) producing real signal.
