# 00 — Start Here

## The honest framing

MATS gets ~2000 applications per cohort for ~50 spots. The selection signal mentors actually use is roughly:

1. **Did this person ship something concrete and interesting?** (GitHub, blog post, demo)
2. **Can they reason about ML systems, not just use them?** (writeup quality, error analysis depth)
3. **Do they have a taste that points at real problems?** (project choice, mentor selection)
4. **Are they pleasant and high-agency in writing?** (application essays)

You can't get a publication in 3 weeks. You **can** get (1)–(4). This vault is optimized for that.

## Your existing edge

From [[01-Positioning]]:
- **Physics reasoning** → unusual analytical framings (phase transitions, scaling laws, symmetry arguments)
- **Systems engineering** → eval harnesses, reproducibility, clean repos
- **Startup execution** → you ship; most ML grads don't
- **Infra thinking** → you can talk about throughput, latency, observability
- **Rapid iteration** → you can do 3 weeks of focused work without getting stuck
- **Unusual project taste** → this is what the project below leans into

**What you are NOT competing on:** ML coursework, math olympiad, papers, big-lab pedigree. Stop apologizing for not having those.

## The 21-day plan in one paragraph

Week 1 you build ML fluency by **shipping** four tiny artifacts: a token inspector, an attention visualizer, a ReAct agent, a multi-provider eval runner. Week 2 you build the main project — a system that perturbs LLM agents with distracting context and maps where they break. Week 3 you write it up as a technical blog post, polish the GitHub, and submit MATS.

Three weeks. One main project. Three to four mini projects (see [[03-Mini-Projects]]). One blog post. One clean repo. One application.

## Today (Day 0, before the 21 days start)

Do these now, not tomorrow:

- [ ] Decide your start date. Block 4–6 hours per day on your calendar for 21 consecutive days.
- [ ] Apply for OpenAI + Anthropic API credits (Anthropic Builder, OpenAI Researcher Access). Budget ~$100–200 if you don't get free credits.
- [ ] Get a Modal, RunPod, or Lambda account for GPU when you need one. (You won't need it most days — a Mac or CPU is fine for Week 1.)
- [ ] Create a new GitHub repo: `reliability-maps` (or whatever you name the main project). Push an empty README today so the first commit timestamp is real.
- [ ] Skim [[02-Main-Project]] and [[03-Mini-Projects]] and decide which creative angle excites you most. Tell a friend out loud what you're building and why. If you stumble, the framing is wrong.
- [ ] Read [[07-MATS-Application-Strategy]] so you know what artifacts the next 21 days are pointed at.

## Rules to keep yourself honest

1. **Ship something every day.** Commit. Even broken code with a TODO is better than silence.
2. **Public from Day 7.** Push the repo public at end of Week 1. Public deadlines are real deadlines.
3. **One paper a day, max.** Reading without building is procrastination. Cap it at ~1 hour/day.
4. **No new project ideas after Day 3.** Pick once and commit. The plan changes shape; the goal doesn't.
5. **Write daily.** A `LOG.md` in the repo with 3–5 lines/day. Future-you (and mentors) will read this.

→ Next: [[01-Positioning]]
