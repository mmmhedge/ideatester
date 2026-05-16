# 07 — MATS Application Strategy

> **Disclaimer**: MATS rules and mentor rosters change each cohort. Verify everything against the current cohort's official page before submitting. This file is your strategy *prior*; the application form is ground truth.

## What MATS actually selects on

In rough decreasing order:

1. **Concrete artifacts** — a GitHub repo or writeup they can click and assess in 5 minutes
2. **Evidence of taste** — your project choices, mentor selections, and how you describe the problem
3. **Writing quality** — your essay reads like someone who thinks clearly under constraints
4. **Mentor fit** — chosen mentors plausibly want to work with you; not just famous names
5. **Background signals** — your CV, but only as supporting evidence for (1)–(4)

You're spending 21 days dialing (1) and (2). This file is about how to land (3), (4), (5) on Day 21.

## Mentor selection — how to pick

Don't optimize for "biggest name". Optimize for **highest probability they read your application carefully and feel resonance**. Concretely:

- **Read each mentor's current research question** (MATS publishes them). If your project doesn't connect to it in 2 sentences, don't pick that mentor.
- Pick **3 mentors** roughly: 1 "stretch" (someone widely-loved), 1 "fit" (your project plausibly extends their last paper), 1 "less-applied-for" (someone with high quality but lower applicant volume). The last category is your highest expected-value pick.
- Cross-reference mentor's last 2 papers / blog posts. If a sentence in your application essay literally cites their work and explains how your project builds on it, you are in the top 5% of applications they read.

**Project-to-mentor fit themes that match the main project here:**

- **Evals / model behavior** (Anthropic, METR, Apollo, MATS independent mentors)
- **Interpretability** (only if you ship the steering mini-project) — Anthropic interp team alumni, mech-interp mentors
- **Agent safety / scalable oversight** — recent threads from Anthropic alignment, Redwood
- **Robustness / adversarial** — anyone who's published on jailbreaks, red-teaming

Look at the **current MATS mentor list** when you apply. Names change every cohort.

## The application essays (write these on Day 21)

Most MATS applications ask:

1. **Why you / why MATS** (~300 words)
2. **Research interests** (~300 words)
3. **A specific research direction you'd want to work on** (~500 words)
4. **Sample technical writing or project link**

Pre-drafting tips:

### Essay 1 — Why you / why MATS
Lead with the **one-sentence pitch** from [[01-Positioning]]. Spend 1 paragraph on the unusual combination (physics + systems + startup), 1 paragraph on what you've shipped this month (point at the repo + blog post), 1 paragraph on why MATS specifically — be specific about what *the program structure* gives you that a job or a PhD wouldn't.

### Essay 2 — Research interests
Avoid: "I'm interested in AI safety because [pause for applause]." Be specific. Pattern that works:
> "I'm most drawn to empirical reliability research: building infrastructure that lets us characterize how and where deployed models fail, and using those characterizations to inform mitigations. My recent project [link] is a concrete instance — I built X, found Y, and the surprising thing was Z."

### Essay 3 — Specific research direction
This is where applications get won or lost. Write a **proposal**, not a wish list. Structure:

1. The problem in one sentence (3 lines)
2. Why it matters now (3 lines)
3. A concrete experiment you'd run in the first 4 weeks (10 lines)
4. What evidence would confirm / refute the hypothesis (5 lines)
5. The natural follow-up if it works (3 lines)

Reuse pieces of your main-project blog post for (3) and (4). The application becomes a *natural next step* of the work you've already done. This is the killer move.

### Essay 4 — Project link
Point at: **(a) the public repo, (b) the blog post, (c) a single hero figure** in that order. Make the URL stable — don't break it after applying.

## CV / resume notes

- **Top section: skills + projects, not "education".** Put the MATS-prep main project AT THE TOP with the link and a 2-line summary.
- **Compress finance experience to one short block** unless a mentor explicitly works on AI-for-finance (very few do). Reframe in transferable terms: "systems engineering", "shipping under deadlines", "owning end-to-end pipelines".
- **List the 3 mini-projects briefly** if there's space.
- **No padding**. One page if possible; two only if you have a long technical track record. MATS reviewers skim.

## What to avoid

- **Don't apologize for not having an ML PhD.** It comes across as defensive. Frame your background as the unusual asset it is.
- **Don't overclaim**. "Phase transition in agent failure" is a hypothesis you investigated, not a thing you proved. Reviewers smell overclaiming from a mile.
- **Don't pick 3 superstar mentors.** It signals you didn't read.
- **Don't use AI-generated essay text.** It reads like AI-generated essay text. Use AI for outlines and structural critique only.

## Timeline note

MATS opens and closes applications on a fixed schedule per cohort (check the current dates on [matsprogram.org](https://www.matsprogram.org/)). Plan your 21 days to **end at least 3 days before the deadline** so you have buffer for unforeseen issues. Don't submit at the last minute — uploads have failed.

## After submission

Whether you get in or not:

- The artifacts you built **don't expire**. They are useful for: SERI MATS-adjacent programs, Anthropic Fellows, ARENA, MLAB, OpenAI Residency, ML Alignment Bootcamp, jobs at applied-eval companies (Apollo, METR, Redwood, Patronus, etc.).
- If you don't get in, the blog post is still your strongest portfolio piece. Iterate it. Apply elsewhere.
- If you do get in, you walk in with a working eval harness, which is rare and immediately useful.
