# Franchise Acquisition & Operating Platform — Company Design

**Status:** working design document, not a pitch deck. Written to be argued with.
**Labeling key used throughout:** `[Fact]` = sourced/verifiable claim · `[User research]` = stated by the requester, not independently re-verified in this pass · `[Assumption]` = reasonable but unverified premise · `[Product]` = a feature we are proposing to build · `[Estimate]` = a modeled number that needs validation before anyone relies on it.

---

## 1. Company thesis

Buying a franchise is sold as a turnkey business but delivered as a fragmented, adversarial process: a broker paid by the franchisor, a franchisor whose FDD is a legal disclosure rather than a business case, a lender who underwrites from scratch, a site-selection consultant, a GC, and a training manual — none of whom share data, none of whom are accountable for whether the unit actually makes money. The company's job is to replace that fragmentation with one underwriting-and-orchestration layer that takes a candidate from "I think I want to own a business" to a financed, staffed, opening-ready unit, then stays attached through the operating years so it can do the same thing again for unit two. The product is not a smarter directory; it is a **decision system with a project manager attached** — and eventually, once it has enough of its own performance data, a selective capital allocator. AI does the matching, scoring, document assembly, monitoring, and coordination; humans still run the physical business.

## 2. The exact customer problem

| Stakeholder | Problem today |
|---|---|
| First-time candidate | Doesn't know which of ~4,000 franchise brands they actually qualify for, can't independently verify a brand's real economics (Item 19 is often absent or unaudited), and has to run parallel, uncoordinated processes with a broker, a bank, a lawyer, and a landlord — each of whom only sees their slice. |
| Existing single-unit operator | Wants unit two but has no packaged way to prove the first unit's performance to a lender, no benchmark for whether they're actually ready operationally, and no single place to compare debt vs. franchisor co-invest vs. seller financing. |
| Small/mid franchisor (<100 units) | Cannot afford an internal real-estate, finance, and franchise-development team; relies on brokers whose incentive is to close *a* deal, not necessarily a durable franchisee-market fit. |
| Lender (SBA and conventional) | Franchise underwriting is manual, brand-by-brand, and the SBA Franchise Directory's eligibility conditions (management agreements, purchase options, area-development structures) are read inconsistently across loan officers, producing both bad declines and bad approvals. |

The company's wedge is **information asymmetry and coordination cost**, not lead generation. A directory or broker earns a fee for introducing parties; this company earns a fee (and eventually equity) for reducing the odds that the introduction fails.

## 3. Stakeholder map

```
Candidate (owner-operator, semi-absentee, multi-unit) ─┐
Existing multi-unit operator seeking unit N ───────────┤
Franchisor (dev team, or none) ────────────────────────┤──▶  PLATFORM  ──▶  Lenders (SBA 7(a)/Express, conventional, equipment, private credit)
Landlord / commercial real-estate broker ──────────────┤              ──▶  Franchise attorneys, accountants
Vendors (build-out, POS, equipment, insurance) ────────┤              ──▶  Franchisor development/legal teams
Franchise brokers/consultants (initially co-opted, ────┘              ──▶  (later) Capital partners / warehouse lenders for Engine 2
  later partially disintermediated)
```
The platform sits in the middle as the only party whose fee structure can be aligned with the *outcome* (unit opens, survives, expands) rather than the *transaction* (deal closes). That alignment has to be engineered deliberately — see §15 — because left alone, commission structures pull it back toward "close anything."

## 4. End-to-end customer journey

| Stage | Candidate experience | What the platform does |
|---|---|---|
| 1. Intake | Structured questionnaire (~20–30 min), not a form dump | Builds a candidate profile; runs hard eligibility filters immediately so no one wastes weeks on brands they can't afford or aren't licensed for |
| 2. Matching | Ranked shortlist (3–8 brands, not 50) with a plain-language "why" for each | Scores fit; shows exclusions and the reason for each; flags missing data explicitly |
| 3. Diligence | Candidate reads an underwriting-style memo per brand/territory, not raw FDD pages | Pulls FDD structured data, territory analytics, unit-economics model; routes anything not verifiable to human review |
| 4. Financing readiness | Candidate sees "what you can borrow, from whom, on what terms" before a single lender application | Pre-qualification engine + SBA Franchise Directory eligibility rules + lender routing |
| 5. Application | One intake, documents collected once | Packages the application, submits to matched lenders, tracks status |
| 6. Launch | Shared project tracker with dates, owners, blockers | Coordinates entity formation, lease, permitting, vendors, hiring, training, marketing, lender draw schedule |
| 7. Operate | Monthly dashboard + alerts, not a new back-office system to run | Ingests POS/bank data, tracks covenants, flags deviations, benchmarks vs. comparable units |
| 8. Expand | "You are/are not ready for unit two" scorecard | Underwrites expansion using the platform's own performance data on unit one |
| 9. (Later) Capital | Selective platform-funded or co-owned units | Only after Engine 1 has enough outcome data — see §9 |

## 5. Product architecture

Four layers, deliberately decoupled so each can be sold, sequenced, and killed independently:

1. **Matching & eligibility engine** — rules-first hard filters + weighted soft scoring (§6).
2. **Diligence & underwriting layer** — brand/territory/unit risk assessment producing an investment-memo-style document (§6).
3. **Financing orchestration layer** — SBA/lender eligibility rules, application packaging, lender routing, status tracking (§7).
4. **Launch & operations layer** — shared project-management interface (§8) and a narrow post-launch monitoring wedge (§8), not a full franchise-management suite.

All four write into one **event-sourced data layer** (§10) — every view, rejection, application, decision, and outcome is a row, because that dataset is the actual long-term asset, not any individual UI.

`[Product]` Build order matters: layers 1–2 can be delivered manually/semi-automated in Phase 1 (a human analyst + structured templates); layers 3–4 require partner integrations and should not be automated until volume justifies the engineering cost (§13).

## 6. Matching and diligence model

### 6.1 Candidate profile (input)

Employment/operating background, industry experience, management experience, sales aptitude, willingness to manage employees, physical vs. home-based preference, preferred industry/geography, relocation flexibility, ownership involvement level (owner-operator / semi-absentee / manager-led), target unit count, time horizon, risk tolerance, credit profile, net worth, liquid capital, income requirement, collateral, visa/immigration constraints, lifestyle constraints, exit horizon.

### 6.2 Franchise profile (input)

Total initial investment, franchise fee, required liquid capital/net worth, royalty and marketing fees, unit economics (Item 19 where disclosed), system maturity, unit count and closures, litigation/bankruptcy history, territory availability, operator-involvement requirement, multi-unit suitability, time to launch, staffing intensity, real-estate requirement, category/geographic growth trend, SBA eligibility and brand-specific conditions, resale liquidity, franchisor support quality, franchisee satisfaction, transfer/renewal/termination terms, concentration/brand-level risk.

### 6.3 Scoring architecture — hard filters vs. soft ranking

**Hard filters (eliminate, don't rank):**
- Liquid capital and net worth below the franchisor's stated minimum
- No available territory in the candidate's target market
- Candidate ineligible under a brand's SBA-specific conditions (e.g., a management-agreement structure the candidate's proposed ownership form can't satisfy)
- Legal/visa disqualification for the proposed ownership or work-authorization structure
- Brand not accepting new franchisees, in litigation freeze, or franchisor insolvency risk flagged

**Soft scoring (weighted, explainable):** management/industry experience alignment, involvement-level match, risk-tolerance vs. brand volatility, lifestyle/hours fit, growth trajectory vs. candidate's time horizon, multi-unit suitability vs. candidate's stated ambition. `[Product]` Each factor's weight and the resulting score contribution must be shown to the candidate — a bar-chart-style "why this ranked here" view, not a black-box percentage.

### 6.4 Preventing commission-driven bias

This is the single highest-trust-risk design decision in the product.

- `[Product]` **Flat-fee or capped-fee franchisor agreements**, not variable commission tied to deal size or brand identity — every matched brand pays the same placement-fee schedule regardless of size, so ranking logic has no monetary reason to prefer one over another.
- `[Product]` **Ranking algorithm and franchisor commercial terms live in separate systems** with no shared input; the matching engine cannot see fee-per-brand, and this is enforced technically (separate services, audit-logged) not just by policy.
- `[Product]` **Published, versioned scoring rubric** — candidates and regulators can see the weight schema itself, not just their own result.
- `[Product]` **Exclusion log is mandatory output**: every brand a candidate qualified for but that didn't make the shortlist gets a stated reason (lower fit score, territory conflict, etc.), and every brand excluded by a hard filter states which filter.
- `[Product]` **Assumptions and data gaps are surfaced, not hidden**: "Item 19 not independently audited," "territory demand estimated from Census data, not verified with existing franchisees," "candidate's stated liquidity not yet document-verified."
- `[Product]` **Overstretch warning**: if the financing-readiness model shows the candidate would be at or near the outer edge of serviceable debt for a shortlisted brand, that is surfaced explicitly on the recommendation, not just in the financing step later.
- Independent question the company must keep asking itself: does the ranking correlate with brand health data (closures, litigation, franchisee turnover) or with brand payment tier? This should be an internal, auditable metric from day one, and ideally spot-checked by an outside party as the company scales — a captured recommendation engine is the most likely way this business quietly becomes untrustworthy.

### 6.5 Brand, territory, and unit diligence

| Risk layer | Assessed on | Automatable now | Requires human review | Must be verified directly with franchisor/franchisees |
|---|---|---|---|---|
| Brand | FDD structured extraction, unit open/close counts, litigation history, management turnover, franchisor financial statements (Item 21) | Extraction, trend flags, litigation search | Interpreting a spike in closures or a management change | Franchisee satisfaction, real support quality |
| Territory | Population/demographics, income, competitor density, traffic counts, commercial rent comps, labor-market data, existing territory map | Most of this — public/licensed data | Local regulatory nuance, true cannibalization risk against a franchisor's territory map | Confirmed territory boundary and any pending grants from the franchisor |
| Unit | Build-out budget, lease terms, staffing model, ramp curve, working-capital need, break-even timeline, downside case | Modeling given inputs | Judgment on realistic ramp assumptions for this specific operator | Actual signed lease terms, contractor quotes, franchisor-approved build spec |

Output: an **investment-style memo** (thesis, risks, assumptions, downside case, open questions) per candidate–brand–territory combination — not a lead-gen recommendation card. `[Product]` This is the artifact that differentiates the company from a directory and is worth a standalone fee even absent financing or launch services.

## 7. Financing model

**Positioning at launch: broker/marketplace only. No balance-sheet lending, no proprietary underwriting-advantage claims on day one** — those have to be earned with data (§10).

### 7.1 Turning SBA Franchise Directory research into a rules engine `[User research, not independently re-verified here]`

The user's research states the SBA Franchise Directory holds 3,277 listings, of which 2,254 were coded as meeting the FTC franchise definition and 1,009 as not (often dealer/agent/distributor/agency relationships). This is treated here as **directionally credible input requiring independent re-verification against the live SBA directory before it drives any lending decision** — SBA directory contents and counts change on an ongoing basis and must be pulled fresh, not hard-coded.

The design implication is concrete: **the directory alone is not a franchise-eligibility signal.** A brand-eligibility rules table must be built and kept current:

| Directory signal | System action |
|---|---|
| Not coded as meeting FTC franchise definition | Hard-block from SBA-franchise-path financing; route to conventional/other |
| Lease rider required | Flag: lender will require landlord to sign SBA-specific lease rider; add to closing checklist |
| Management agreement present | Flag for review: if the agreement gives a manager effective control, the borrower may be classified as a passive investor — SBA generally requires active management by the small-business applicant, so this can be disqualifying and needs specific legal review before proceeding |
| Purchase option in franchise/lease docs | Flag: may conflict with lender's collateral position; requires resolution before closing |
| Area-development / sub-franchising structure | Route to enhanced review — multiple units/territories change collateral, guarantee, and draw-schedule structure |
| Hotel/lodging brand | Flag: borrower must demonstrate an operating hospitality business (staffing, guest services, short-stay use), not a passive real-estate hold, to qualify |
| Recertification/status change | `[Product]` Monitoring product: alert franchisors, lenders, and in-pipeline candidates when a brand's directory status or recertification date changes |

`[Product]` This becomes an internally maintained **brand eligibility ledger**, versioned, with a change log — because a candidate's approval odds depend on directory state at time of underwriting, and that state is not static.

### 7.2 What the financing journey must determine, per application

Brand eligibility → candidate eligibility → ownership/management structure eligibility → required equity injection → financeable vs. non-financeable costs → collateral requirement → personal guarantee requirement → debt-service coverage → total cash required at closing → post-launch working capital → downside affordability (can the candidate service debt in a below-plan month 6–12 scenario, not just the base case).

### 7.3 Financing routes to support (roughly launch-order priority)

SBA 7(a) and SBA Express-type programs first (largest addressable share of franchise financing and the most rule-dense — the hardest part to get right, so build it first while volume is low); conventional bank; equipment finance; seller financing for resales; franchisor financing where offered; home-equity-backed; ROBS (flag heightened fiduciary/compliance complexity — likely a referral-out to a specialist administrator rather than something the platform packages itself at launch); private credit and growth financing for multi-unit operators (later, once track record exists).

### 7.4 How underwriting advantage is actually built (not claimed)

Day one: the company has no proprietary default data and should not imply otherwise to candidates or lenders. The credible sequence is: (1) codify public/franchisor-disclosed rules (Item 19, SBA directory conditions) into a transparent, explainable rules engine; (2) layer in external data (Census, commercial rent indices, BLS labor data) for territory scoring; (3) use human underwriter review as the source of truth while volume is low, logging every human judgment as labeled training data; (4) only after enough loans have been observed through funding, repayment, and (for some) default — which for SBA 7(a) franchise loans realistically means **multiple years**, not months — begin building statistical/ML models on top of the rules engine, and even then keep the rules engine as an interpretable floor, not replace it.

## 8. Launch and operations model

### 8.1 Launch coordination — what's software, partner, or internal

| Function | Delivery |
|---|---|
| Territory confirmation, document collection, deadline tracking, approvals, exception alerts | Software (the shared project tracker) |
| Entity formation, compliance filings | Partner (registered agent / legal-tech integration) |
| Lease search, site selection | Partner network (commercial real-estate brokers) + platform data layer for screening |
| Design/permitting, contractor procurement | Partner network, platform-managed scope/checklist |
| Equipment purchasing, insurance | Partner network, platform can negotiate volume terms over time |
| Hiring, training | Largely franchisor-provided; platform tracks readiness, doesn't replace franchisor systems |
| Pre-opening marketing | Software templates + local partner execution |
| Lender draw schedules | Software, tightly coupled to the financing layer |
| Opening-readiness checks | Software checklist against franchisor and lender requirements |

`[Product]` **Shared project-management interface**: one workspace visible (with permissioned views) to franchisee, franchisor, lender, and approved vendors — deadlines, document status, cost tracking, responsibility assignment, exception alerts when something is off-schedule or off-budget. This is the connective tissue that makes the platform indispensable during launch, and it is the natural precursor to the post-launch monitoring product, because it's already ingesting cost and schedule data.

### 8.2 Ongoing operating platform — the narrow wedge, deliberately

The temptation is to build a full franchise-management suite (scheduling, POS, inventory, marketing automation). **Don't.** Established players (many franchisors already mandate their own POS/back-office stack) make that a crowded, low-differentiation fight. The defensible wedge is the **operational surface that feeds back into matching, financing, and expansion underwriting** — nothing broader unless a specific module is proven necessary to protect a loan or a match:

`[Product]` Core: performance dashboard (revenue, margin, labor %) sourced from POS/bank read-only integrations · covenant and royalty-reconciliation monitoring · early-warning alerts (cash-flow deterioration, comp-sales decline) · benchmarking against comparable units in the platform's own dataset · expansion-readiness score.

Deliberately excluded at launch: labor scheduling, inventory/procurement systems, reputation management, full marketing automation — these are available from established point solutions; integrate with them, don't rebuild them.

## 9. Multi-unit expansion product

This is arguably the better first wedge (see §11) because the platform can underwrite from **real observed performance**, not projections.

### 9.1 Inputs
Historical P&L, bank/POS data, labor performance, local marketing efficiency, customer ratings, compliance history, existing debt, owner-dependence measures (does revenue hold up on weeks the owner is absent), management depth, territory availability, new-site forecast.

### 9.2 Questions the product must answer
Is unit one genuinely successful (margin and cash generation, not just top-line revenue)? Can it run without the owner physically present? Does the operator have real management bench strength for a second location, or are they about to split their own attention thin? Should unit two be funded with debt, equity, franchisor capital, or retained earnings? How fast can the operator expand without degrading unit one? Stay single-brand or go multi-brand? At what unit count does a central management layer (an actual GM, not the owner) become necessary?

### 9.3 "Second location, little or no cash at opening" — honest framing

`[Product]` Structures to support: term loan sized against unit-one cash flow; revenue-based financing; a royalty override in exchange for the platform (or franchisor) funding part of the build-out; franchisor co-investment; financing secured against unit one's equity/assets; seller or vendor financing; a joint-venture structure where the platform holds a minority stake instead of charging a fee.

**This is deferred or financed capital, never free money, and must never be marketed as free.** Advertising "no cash due at opening" without immediately and equally prominently disclosing the mechanism (debt against the existing unit, a royalty override, a JV stake given up) is a consumer-protection and likely FTC Franchise Rule / state franchise-marketing exposure. `[Product]` Every second-unit offer must show, side by side: total capital required, who is providing it, what is pledged as collateral, and the effective cost (interest, override %, equity given up) compared to a plain term loan — so "little cash at opening" is legible as a financing structure, not a discount.

## 10. Data and underwriting moat

### 10.1 Data generated across the funnel
Candidate characteristics and stated preferences · brands viewed/rejected and why · match/rejection reasons · franchise applications · FDD terms extracted · territory data · site-level forecasts vs. actuals · financing applications and outcomes · lender decisions, pricing, structures · build-out costs vs. budget · time-to-open vs. plan · actual revenue/margin over time · defaults, closures, resales · second-unit performance.

### 10.2 What it improves, and when
| Use | Improves with data volume | Realistic timeline |
|---|---|---|
| Candidate–brand matching precision | Yes — which stated attributes actually predict a good fit | 12–24 months of outcomes |
| Territory scoring | Yes, combined with external data | 12–18 months |
| Launch budgeting accuracy | Yes — actual vs. budgeted build-out costs | 6–12 months (fast feedback loop) |
| Lender routing / approval probability | Yes | 18–24 months |
| Credit underwriting (own capital) | Only after observing repayment and default | **3–5 years** realistically for SBA-type loan performance — do not shortcut this |
| Pricing | Gradual | 24+ months |
| Fraud detection | Useful earlier — pattern-based, doesn't need default outcomes | 6–12 months |
| Expansion timing | Yes, from unit-one performance curves | 12–18 months |
| Acquisition targeting (Engine 2) | Only after enough Engine 1 outcome density in a category | 3+ years |

### 10.3 Before proprietary data exists

`[Product]` Build the interpretable floor first: hand-coded eligibility and scoring rules from FDDs and SBA directory data, external data (Census, BLS, commercial rent indices) for territory scoring, franchise-industry benchmark reports (IFA, FRANdata, franchisor-published Item 19s) for unit-economics priors, and human expert review as the labeling mechanism for everything the rules engine is uncertain about. Explainable statistical models (logistic regression, gradient-boosted trees with SHAP-style explanations) come next, once there's a few hundred labeled outcomes. Opaque deep-learning underwriting has no place here for years — SBA and bank partners will not accept a black box, and neither should the company, given the bias risk in §6.4.

### 10.4 Data rights, consent, and lender restrictions `[Needs legal review — not legal advice here]`
- Candidates must explicitly consent to data use for matching *and* separately for any future underwriting use — bundled consent is a regulatory and trust risk.
- Bank/POS integrations require the operator's affirmative, revocable authorization (Plaid-style consent flows), and data use must be scoped to what's disclosed.
- Lender partners will often restrict resale or reuse of application data in their agreements — these terms must be tracked per-lender, not assumed uniform.
- FCRA applies once the company is using data to make or influence credit decisions about individuals — this has real compliance weight and needs counsel before Phase 3.
- Default/outcome data is the most sensitive and the slowest to accumulate — resist the temptation to model on outcome proxies (e.g., "still open after 12 months") as if they were true default/repayment data; they aren't the same signal.

## 11. Revenue model

| Stream | Who pays | When | Margin profile | Legal/licensing note | Conflict risk | Available at MVP? |
|---|---|---|---|---|---|---|
| Franchisor placement fee | Franchisor | On signed franchise agreement | High margin | Generally fine if flat/capped, not tied to steering | High if variable by brand — must be flat-fee (§6.4) | Yes |
| Franchisee advisory fee | Candidate | On engagement or milestone | High margin | Clean | Low | Yes |
| Site-selection fee | Candidate or franchisor | On site confirmation | Medium | Clean | Low | Later (needs partner network first) |
| Launch/project-management fee | Candidate | Milestone-based through launch | Medium (labor-heavy) | Clean | Low | Yes, manually delivered |
| Lender referral/origination fee | Lender | On funded loan | High margin | **Requires state licensing review — loan broker/finder laws vary by state; may require registration** | Must not bias routing toward the lender paying most (§6.4 logic extends here) | Yes, with licensing groundwork |
| Vendor referral/procurement rebate | Vendor | On vendor engagement | High margin | Generally fine, disclose to candidate | Moderate — must disclose | Later |
| SaaS subscription (operating dashboard) | Operator | Monthly | High margin, slow to scale revenue | Clean | Low | Phase 2+ |
| Monitoring fee | Lender or operator | Monthly | Medium | Clean | Low | Phase 2+ |
| Financing spread | Company (if warehousing debt) | Ongoing | High margin, high capital intensity | Lending license required | High — company now a direct lender | Phase 3+ only |
| Servicing income | Capital partner | Ongoing | Medium | Servicing license may apply | Low | Phase 3+ |
| Royalty override (second-unit deals) | Operator | Ongoing % of revenue | High margin | Must be clearly disclosed, not marketed as free capital (§9.3) | Moderate | Phase 3+ |
| Equity participation / owned-unit profit | N/A (company as owner) | Ongoing | Highest margin, highest risk | Full operating/regulatory burden of the underlying business | Highest — direct conflict with advisory role (§9, §15) | Phase 4 only |

**Realistic combination at MVP: franchisor placement fee + franchisee advisory fee + launch/project-management fee, with lender referral fee added once licensing is sorted.** Do not assume all fourteen streams stack on one transaction — most candidates will only trigger 2–3 of these, and stacking too many creates both a disclosure burden and a perception of being paid from every direction, which undercuts the trust the matching product depends on.

## 12. Go-to-market

**Primary wedge and first customer: existing single-unit franchisees who are ready (or nearly ready) for a second unit, launched inside one operational category, in one metro.** Reasoning: this segment has real performance data to underwrite from (removing the hardest diligence problem), higher intent and lower price sensitivity than a first-time browser, a natural lender-referral motion (banks/SBA lenders already want to see this segment), and it produces the platform's first proprietary outcome data fastest — a second unit's ramp curve is observable within a year, versus years for full loan-performance data on a first-time buyer.

`[Assumption]` A first-time-candidate concierge channel should run in parallel at low volume (it's cheap to serve manually and builds the matching dataset) but should **not** be the funded, scaled channel first — first-time-buyer diligence and financing readiness has the longest, least differentiated sales cycle and the weakest proprietary-data payoff early on.

| Segment | Channels | Sequencing |
|---|---|---|
| Prospective (first-time) franchisees | SEO, franchise exhibitions, professional-transition/outplacement communities, veteran-transition programs, visa-related search terms, accountants and wealth advisers, existing franchise brokers (as a referral source, not a competitor to disintermediate on day one) | Low-volume, concierge, parallel track |
| Existing multi-unit-track franchisees | Franchisor referral (development teams that lack their own finance function), SBA/community lenders, franchisee associations, POS/accounting integration partners (QuickBooks, Toast, Square — signal-based outreach on units showing expansion-ready metrics), direct outreach | **Primary, funded channel** |
| Emerging/mid-market franchisors (<100 units) | Direct outreach to development teams, IFA and franchise-conference presence, white-label pitch: "we are your real-estate, finance, and development team" | Second wave — sign 3–5 franchisor partners once the multi-unit product has case studies |

## 13. Phased roadmap

| | Phase 1 — Concierge MVP | Phase 2 — Repeatable marketplace | Phase 3 — Embedded finance | Phase 4 — Selective ownership |
|---|---|---|---|---|
| Product | Manually assisted matching + diligence memo + financing-readiness assessment + lender referral, for one category, one metro | Standardized intake, brand-eligibility engine, lender-routing rules, territory scoring, launch workflow software, expansion-readiness product | Servicing, portfolio monitoring, warehouse/funding partnerships, limited risk retention on proven-operator loans | Acquire/co-own a small number of units in one category; compare shared-overhead economics to traditional multi-unit operators |
| Target customer | Existing single-unit operators ready for unit two, one category/metro | Same + first-time candidates at scale + 3–5 franchisor partners | Proven multi-unit operators, capital partners | Highest-confidence operators/units only |
| Internal team | Founder(s) + 1–2 underwriting/ops analysts + part-time counsel | + engineering (3–5), + partnerships lead, + compliance hire | + credit/risk officer, + servicing ops, + licensed loan originators | + portfolio operations lead, + regional ops support |
| Partners required | 2–3 SBA/community lenders, 1 franchise attorney, 1 CRE broker | Add vendor network (build-out, insurance), POS/accounting integration partners | Warehouse/capital partner, loan servicer | Franchisor(s) willing to co-invest, JV operator candidates |
| Revenue model | Advisory + launch fee; referral fee once licensed | + franchisor placement fees, + monitoring fee pilot | + financing spread (limited), + servicing income | + equity/profit participation |
| Regulatory burden | Loan-broker licensing research per target state; no lending | Same, at scale; data-privacy program formalized | Lending license, FCRA compliance, servicing rules | Full operating-business regulatory burden per unit |
| Key metrics | Deals closed, time-to-close, unit-one performance vs. underwritten case, candidate NPS | Match-to-close conversion, lender approval rate, launch on-time/on-budget %, franchisor partner count | Loan performance vs. underwritten case, default rate vs. benchmark, servicing cost ratio | Owned-unit margin vs. franchisee-average margin, overhead-sharing delta |
| Milestone to proceed | ≥15–20 closed expansion deals with 12+ months of post-launch performance data, positive unit economics on advisory+launch fees alone | ≥100 closed deals across the funnel, lender-approval prediction demonstrably better than baseline, at least one franchisor renewal | ≥3 years of loan-performance data on a cohort large enough to be statistically meaningful (order of magnitude: hundreds of loans), licensing secured | Engine 1 shows a specific category/geography with consistently strong, low-variance unit economics and available acquisition targets |
| Kill criteria | Advisory+launch fees don't cover loaded cost per deal after 12 months; candidates route around the platform to transact directly with franchisor/lender at meaningful rate | Franchisor partners churn (perceived as pay-to-play, i.e., §6.4 has failed); lender-approval rates don't beat unassisted baseline | Loan performance materially worse than underwritten case; can't secure warehouse capital on acceptable terms | Owned-unit margins don't beat pure-advisory economics after overhead; operational incidents (health/safety, employment claims) exceed what a lean central team can responsibly manage |

## 14. Operating team and partnerships

Phase 1 needs, concretely: a founder/lead with franchise or SBA-lending operating experience (not just financial-services generalist — the SBA franchise-directory rules and FDD literacy are domain-specific and hard to fake); 1–2 underwriting analysts who can read an FDD and build a unit-economics model; part-time franchise/securities counsel from day one (the matching product is adjacent to business-opportunity and franchise-sales regulation even before any lending happens); 2–3 committed SBA/community lender partners willing to give routing feedback; one CRE broker and one franchise attorney as launch-service partners. Deliberately do not hire a full ops/build-out team in Phase 1 — subcontract that entirely and use it to learn which partners are reliable before committing to exclusive relationships.

## 15. Compliance and conflicts

| Risk | Where it bites | Control |
|---|---|---|
| Business-opportunity / franchise-sales regulation | Matching and marketing content | Counsel review of all marketing claims, especially anything resembling earnings claims (Item 19 adjacent content); never present unverified franchisor figures as the company's own claim |
| Loan-broker/finder licensing | Financing referral fees | State-by-state licensing review before turning on referral fees in a given state; start in states with clear registration paths |
| FCRA | Any use of consumer data to influence credit decisions | Counsel-reviewed consent flows, permissible-purpose documentation, adverse-action process once the company influences (not just brokers) credit outcomes |
| Steering/commission bias | Matching engine | Flat-fee franchisor terms, separated systems, published rubric, exclusion log (§6.4) — treat as a standing internal audit item, not a one-time design decision |
| Advisory/ownership conflict (Engine 2) | Once the company owns or finances units it also recommends | **Structural separation required**: Engine 2 investment decisions made by a separate team/committee with no visibility into or influence over Engine 1 candidate matching; disclosed to every candidate whether a brand/unit involves company capital; candidates retain the right to route around Engine 2 entirely. This should be documented as a formal governance policy before Engine 2 does its first deal, not retrofitted after. |
| "Free second location" marketing | Multi-unit expansion product | Mandatory side-by-side cost disclosure (§9.3); treat as FTC Franchise Rule-adjacent even though the platform isn't the franchisor |
| Joint-employer exposure | If the platform gets too involved in operator hiring/HR decisions | Keep hiring **coordination** (checklists, timing) separate from hiring **decisions**; never co-sign employment actions |
| Passive-ownership / management-agreement structures | Financing eligibility | Directory-flag-driven review (§7.1) before any application is packaged |

## 16. Unit economics — illustrative only, needs validation

`[Estimate — modeled, not sourced]`. These are placeholder ranges to stress-test the model, not claims about actual achievable numbers. Real numbers require the 90-day validation plan (§17) and should be revisited every quarter of Phase 1.

| | Conservative | Base | Upside |
|---|---|---|---|
| Deals closed per underwriting analyst per year | 6 | 12 | 20 |
| Blended fee per deal (advisory + launch, pre-lender-referral) | $8,000 | $15,000 | $25,000 |
| Fully loaded cost per analyst (salary, benefits, tools) | $140,000 | $140,000 | $140,000 |
| Revenue per analyst | $48,000 | $180,000 | $500,000 |
| Contribution before shared overhead | negative | positive, thin | strongly positive |
| Implication | Phase 1 is not viable on advisory fees alone at conservative volume; lender-referral fee and/or franchisor placement fee are load-bearing, not optional, even at MVP | Roughly break-even per analyst before shared overhead — company-level overhead (leadership, counsel, tooling) still needs to be covered by volume across analysts or by franchisor placement fees | Only achievable once matching/diligence tooling reduces analyst time per deal — i.e., Phase 2 software, not Phase 1 manual process |

The honest reading: **Phase 1 economics likely don't work on advisory fees alone**; the model depends on either (a) lender-referral fees clearing licensing quickly, or (b) 2–3 franchisor placement-fee relationships anchoring revenue while the deal-volume flywheel builds. This should be treated as a go/no-go input for the 90-day plan, not assumed away.

## 17. Key risks and kill criteria

| Risk | Mitigation | Measurable kill criterion |
|---|---|---|
| Adverse selection (weakest candidates/brands seek the platform hardest) | Hard eligibility filters up front; track shortlist quality against independent outcome data | If closed-deal 12-month survival rate is materially below industry benchmark for the category, pause growth and re-diagnose filters |
| Dependence on franchisor-supplied data | Independent data sourcing (Census, BLS, litigation search) wherever possible; explicit "unverified" flags | If >30% of active brand profiles rely solely on franchisor-self-reported data with no independent cross-check, halt onboarding new brands until resolved |
| Commission-driven bias | §6.4 controls | Any observed correlation between franchisor fee tier and match ranking beyond what fit-score data explains triggers an immediate audit and public disclosure |
| Lender licensing/disclosure gaps | Counsel-led state-by-state rollout | No referral fee activated in a state without documented licensing clearance — zero tolerance, not a metric |
| Data privacy/consent gaps | Scoped, separated consent flows | Any FCRA or state privacy complaint upheld halts related data use pending remediation |
| Inaccurate financial-performance claims | Never restate franchisor Item 19 as verified; always label source | Any claim traced to the platform found to be materially misleading in a regulatory or legal proceeding is an immediate kill-and-rebuild of the diligence layer |
| SBA policy changes | Treat SBA rules as a live, versioned ruleset, not a one-time build | N/A — ongoing monitoring cost, budget for it explicitly |
| Joint-employer risk | §15 structural separation | Any joint-employer finding against the company is a hard stop on the launch-coordination scope until legal restructuring |
| Passive-ownership disqualification | §7.1 directory-flag review | Repeated post-underwriting SBA declines on management-agreement structures (>2 in a quarter) means the review process failed and must be rebuilt before more of that structure type is packaged |
| Territory disputes / lease-collateral conflicts | Diligence layer flags purchase options and lease riders pre-close | Any deal closing with an unresolved flag from §7.1 is a process failure, tracked as a hard zero-tolerance metric |
| Brand concentration | Track revenue and deal concentration by brand | If any single brand exceeds ~25% of closed deal volume, actively diversify sourcing — concentration risk undermines both the fee-neutrality claim and the business's resilience to one brand's problems |
| Build-out overruns | Track budget-vs-actual on every launch | If median overrun exceeds 15% across a cohort, the launch-budgeting model needs rebuilding before scaling that category |
| First-time operator failure | Diligence memo explicit downside case; financing-readiness overstretch warning | 12-month closure rate materially above category benchmark → pause first-time-candidate channel expansion |
| Advisory/ownership conflict | §15 governance separation | Any deal where Engine 2 capital participation wasn't disclosed to the candidate before close is an immediate governance failure requiring public correction |
| Insufficient default data for own underwriting | §10.2 timeline discipline — do not shortcut | Do not deploy company capital (Phase 3/4) before at least one cohort has 3+ years of observed performance |
| Capital intensity of Engine 2 | Keep Engine 2 small, concentrated, evidence-gated (§18/§9) | If Engine 2 capital need starts competing with Engine 1 operating budget, Engine 2 growth pauses — Engine 1 is the moat, Engine 2 is optional |
| Automating judgment-heavy physical operations | Never claim AI runs the business; operator/local management is explicit in every product surface | N/A — a positioning discipline, revisit copy/marketing quarterly |
| Being a services business mispriced as software | Track gross margin honestly by phase; don't present Phase 1 launch-coordination labor cost as SaaS-margin | If blended gross margin is materially below what's presented to investors/partners, correct the narrative, don't chase the number |
| Incumbents copying the workflow | Data moat (§10) and franchisor relationships are the actual defensibility, not the UI | If a well-capitalized incumbent (a major broker network or an SBA fintech lender) launches a comparable product within 12 months, the multi-unit-first wedge and data-first sequencing is the differentiation to defend, not feature parity |
| Franchisors refusing to share data | Start with FDD-public data + candidate-supplied data; franchisor cooperation is upside, not a dependency | If <5 franchisor partners will share performance data after 12 months of outreach, the white-label/franchisor-tools angle is not viable yet — don't force it |
| Free-recommendation leakage (candidates take the match, transact elsewhere) | Fee structure tied to milestones beyond matching (financing, launch), so pure "browse and leave" captures no revenue but also costs little to serve | If >50% of qualified matches transact outside the platform within 12 months, the advisory/launch fee is priced or bundled wrong — revisit before scaling acquisition spend |

## 18. First 90-day validation plan

Weeks 1–2: pick one category (recommend a recession-resistant, moderate-capital service category — e.g., a residential or commercial service franchise segment, not QSR, which has thinner margins and heavier real-estate complexity) and one metro; confirm 2–3 SBA/community lender partners willing to give real feedback; retain part-time franchise counsel.

Weeks 3–6: manually build the eligibility ruleset and diligence template for 10–15 brands in the chosen category using public FDD data and the SBA directory `[requires independently re-pulling current directory data, not relying on the 3,277/2,254/1,009 figures without re-verification]`; identify 15–20 existing single-unit operators in that category/metro as the primary (multi-unit expansion) outreach list.

Weeks 7–10: run the full manual process — intake, matching memo, financing-readiness assessment, lender introduction — on the first 5–8 candidates; track time spent per deal (this directly tests the §16 economics).

Weeks 11–13: close (or fail to close) the first cohort; conduct a structured post-mortem on every non-close (candidate declined by lender, candidate walked away, deal died in diligence) — this is the highest-value data of the entire 90 days; decide, with real numbers, whether Phase 1 economics (§16) are survivable and whether multi-unit-first was the right wedge.

**Go/no-go gate at day 90:** at least 3 closed or near-closed deals with a clear picture of time-cost-per-deal and lender-approval friction; if fewer than 2 close and the reasons trace to the product thesis (not just early-stage execution noise), revisit the wedge choice before raising the next round of effort/capital.

## 19. Unanswered questions

- Which specific franchise category should Phase 1 target? This document argues for a moderate-capital, recession-resistant service category but doesn't name one — that's a real-world decision requiring current territory and lender-appetite data, not something to guess here.
- What are current, re-verified SBA Franchise Directory counts and the actual current text of its notes/flags? The 3,277/2,254/1,009 figures are the user's research and must be re-pulled before being operationalized.
- Which states have loan-broker/finder licensing regimes that make the referral-fee revenue stream fast to activate vs. slow? This determines early-stage viability per §16 and needs a state-by-state legal survey.
- What will 2–3 real lender partners actually commit to in terms of feedback loops and volume — this is unknowable until partnership conversations happen, and the whole financing-routing model rests on it.
- Is there franchisor appetite for flat-fee (non-variable) placement arrangements, or will major brands only pay standard broker commission structures? This affects whether §6.4's bias-prevention design is commercially viable at the fee levels franchisors are used to paying.
- What is the real average deal-cycle time for a second-unit expansion candidate, start to open? The 90-day plan will produce a first real data point; everything before that is a guess.
- How much of the FDD/franchisor-disclosure extraction can actually be automated reliably vs. needing a human reader — this is an engineering feasibility question that should be spiked early in Phase 1, not assumed.

## 20. Final verdict — what to build first

Build the **multi-unit expansion advisory + financing-readiness product**, manually delivered, for one moderate-capital service category, in one metro, targeting existing single-unit franchisees. Not a broad matching directory, not a first-time-candidate funnel, not any software platform, and not any form of company capital deployment.

Reasoning, stated plainly: the full 20-part vision in this document is coherent as a **destination**, not as a starting point. The parts that depend on data the company doesn't have yet (underwriting advantage, owned units, embedded finance) are multi-year builds gated on outcome data that takes years to accumulate honestly — trying to shortcut that with modeled or purchased data would undermine the one asset (trustworthy, bias-resistant underwriting) that makes this company different from a broker. The parts that are attractive-sounding but structurally risky right now — "free second location" marketing, owning units while also recommending them — should stay explicitly deferred and gated behind the disclosures and governance controls in §15/§9.3, not built early for growth's sake.

The multi-unit wedge is chosen over first-time-candidate matching because it is the only starting point that is simultaneously: revenue-plausible without a lending license (advisory + launch fees, referral fee as upside once licensed), fast to get real outcome data from (a second unit's ramp is observable in ~12 months, not years), lower diligence risk (real P&L exists, vs. modeling a stranger's first unit from scratch), and a natural, low-cost lead into the eventual data moat this business needs to justify everything past Phase 2. Everything else in this document — the matching engine, the financing-eligibility rules engine, the launch project-management tool, and eventually selective ownership — should be sequenced in as this first wedge proves out, not built in parallel on faith.
