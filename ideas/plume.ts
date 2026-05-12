import type { Idea } from "./types";

export const plume: Idea = {
  slug: "plume",
  kind: "crypto",
  title: "Plume — Light-client infrastructure for embedded devices",
  metaDescription:
    "A 12kB Ethereum light client that runs on microcontrollers. Verify chain state from a sensor, a card, a watch.",
  hero: {
    eyebrow: "Ethereum · Infrastructure",
    headline: "Verify Ethereum state from a smartwatch.",
    sub: "A 12kB light client that runs on Cortex-M. Sub-second finality checks. No trusted RPC.",
    primaryCta: "Read the litepaper",
  },
  form: {
    fields: [
      { name: "email", label: "Email", type: "email", required: true, placeholder: "you@domain" },
      { name: "role", label: "What are you building?", type: "text", placeholder: "Hardware wallet, IoT sensor, …" },
    ],
    submitLabel: "Get testnet access",
    successHeadline: "You're on the list.",
    successBody: "Testnet drops in waves. We'll email when builds open for your platform.",
    conversionEvent: "Lead",
    conversionValue: 12,
  },
  vibe: "academic systems paper, not launchpad pitch. Cite specs. Name primitives. No token speculation.",
  crypto: {
    chain: "Ethereum",
    category: "Infrastructure",
    status: "testnet",
    problem:
      "Light clients today need 200MB+ of state and a TLS-capable runtime. That rules out the entire embedded ecosystem — sensors, cards, watches, payment terminals — from verifying their own chain reads.",
    solution:
      "Plume packs a sync-committee verifier plus incremental MPT proof recovery into 12kB of program memory, with a 2kB hot footprint. Pure Rust, no_std. Runs on Cortex-M0.",
    keyInsight:
      "You don't need full state if you batch-verify Merkle Patricia proofs against a sync-committee-signed header. The verifier is small. The cryptography is small. The hard part is proof transport — and a typed MPT proof fits in a single CoAP frame.",
    architecture: {
      overview:
        "Three components. Two off-chain services, one embedded crate. All Apache-2.0.",
      components: [
        {
          name: "Header Relay",
          role: "Streams sync-committee-signed beacon headers to subscribed devices over CoAP/UDP. Handles fork choice; devices don't.",
        },
        {
          name: "Proof Gateway",
          role: "Resolves device queries (`storage_at(addr, slot, block)`) to compact MPT proofs. Stateless, horizontally scalable, no consensus role.",
        },
        {
          name: "Embedded Verifier",
          role: "Pure Rust no_std crate. ~12kB flash, ~2kB RAM. Verifies BLS12-381 aggregate signatures, header chain, and MPT proof for one slot per call.",
        },
      ],
    },
    roadmap: [
      {
        phase: "Q1 2026",
        status: "shipped",
        items: [
          "BLS12-381 pairing in no_std",
          "Verifier passes Goerli historical replay end-to-end",
        ],
      },
      {
        phase: "Q2 2026",
        status: "in-progress",
        items: [
          "CoAP proof transport spec v1",
          "Cortex-M4 reference implementation",
          "External cryptographic review",
        ],
      },
      {
        phase: "Q3 2026",
        status: "planned",
        items: [
          "Public audit",
          "Mainnet relay launch",
          "RISC-V port",
        ],
      },
    ],
    links: {
      x: "@plumeproto",
      github: "github.com/plume-proto/plume",
      docs: "docs.plume.dev",
    },
  },
};
