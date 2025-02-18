---
layout: ../../layouts/BlogPost.astro
title: Developer Experience (DevX) Audit
description: What Aha Labs can do for your software platform or blockchain project
---

Get your software platform ready for mass adoption.

Your developer onboarding journey is the top of your funnel. The front door, for your most crucial audience.

Maybe you have a B2D2C business model (that's "Business to Developers to Consumers"), or a developer platform that's otherwise crucial to your strategy.

**Is the front door working?**

We get it: making new platforms is hard! It requires intense collaboration between interdisciplinary teams. [We've been on these teams!](/team) Early on, just getting anything to work is heroic. Developer docs and developer experience become an afterthought in that scramble to have anything at all. And besides, early on, everyone working on your platform is paid to be there. They have full workdays to work through traps and sharp edges.

Your target audience doesn't have that luxury. They're going to give you an hour, maybe 30 minutes. They're going to spend a single, precious evening with you. Will your onboarding journey convince them to give you a second date? Will they feel a spark? Will they end that first half hour feeling like they know why your product exists, what it's good for, and like they could build something awesome?

With our DevX Audit, we will go through your developer onboarding journey and give you an in-depth report. We're experts who can work through your rough edges and gaps in documentation. And we're empathic teachers, who understand the challenges faced by beginners. Here's what we'll do:

1. For small issues—typos, inconsistences, out-of-date information—we'll send immediate code change requests (GitHub calls these Pull Requests). This is basic, baseline Open Source etiquette.
2. Beyond that, we'll consider your documentation at a more holistic level. Does it make sense to your core audience? How does it need to be restructured to quickly orient developers of diverse skill and background? When a developer gives you that first half hour, will they be able to move your product from their list of "unknown unknowns" to "known unknowns"? Will they feel empowered; will they be excited to come back?
3. We'll probably recommend that your documentation provide a quick end-to-end overview, in the form of a tutorial, as the first touch-point for developers. This tutorial should only require 3 to 5 steps, and should take 20 to 30 minutes for skilled developers. What needs to change, in your core tooling, to make that possible? We'll make extensive recommendations at all levels of your software stack: core SDKs, Command Line Interfaces, JavaScript libraries, testing frameworks, and more. Even more than analyzing what's there, we'll analyze what's not. Are there gaps in your tooling? Just as your documentation might require reorganization, so too might your tooling.

Our report will give you actionable next-steps to ensure developers start building great things on your platform. We'll then schedule a Report Readout Meeting, to go over the report with you and answer any outstanding questions.

Our DevX Audit is priced competitively, making it easy to justify as a low-level grant/engagement.

## Case Study: Stellar

[Stellar](https://stellar.org/) launched in 2014 with a focus on global remittance payments and without generic programming, aka "smart contract", capabilities. They started adding a new smart contract layer to their platform in 2022, with the goal of marketing it as a "batteries included" developer experience. The problem was, their internal team didn't have the time/expertise to install those batteries. At least not in the timeframe they needed. So they sent someone out, attending almost all the blockchain conferences of 2022, scouting. Did any team working on any blockchain have both the vision and the engineering chops to help them meet their ambitious deadline? They found one.

At the time, Aha Labs had been focused on the NEAR ecosystem, building an [ancestor](https://raen.dev/admin/) to what became [Loam](https://loam.build). Stellar's representative attended NEARCON, where he saw a [talk](https://youtu.be/VenoNgWdvw0) by Aha Labs cofounder Chad O, and said "hey I want you to come do that on Stellar."

We kicked things off with a DevX Audit, creating multiple documents for the Stellar team:

1. [Soroban CLI Proposal](https://docs.google.com/document/d/16lJhyMU6cqRzNtMclr9yXd978MJgbZ0El9UhxbTz_Ts/edit?tab=t.0#heading=h.4tvfd2wht2ga): The name for Stellar's Smart Contract functionality was Soroban in 2022. We went through Soroban CLI's existing organization and behavior and suggested improvements. You can see a diff view at the end of the document showing a quick before-and-after, if all of our suggestions were to be implemented.
2. [Extending Soroban CLI's `invoke` behavior](https://docs.google.com/document/d/1LASaLyxIA2-YqLnn2NqI5NZGnEmdzx9lLh-j7n0-i4A/edit?tab=t.0#heading=h.rr1xfyfdbyqw): This document helped us go deeper on specific design considerations for one of Stellar CLI's most powerful features.
3. [Soroban Docs](https://docs.google.com/document/d/1qtMqTQZStR1Q9syaG-LgZKT_rcuEg0FLMIXhuAK1nYQ/edit?tab=t.0#heading=h.tuiqqltzs76h): We also did a deep analysis of the Soroban documentation that existed at the time, suggested how to reorganize it, and recommended new pages for topics not yet covered.
4. [Comparing Soroban to other Wasm storage strategies](https://ahalabs.dev/posts/comparing-rust-smart-contract-storage-approaches/): As we were learning about Stellar smart contracts, we created blog posts and videos comparing their solutions to other blockchains.
5. [Comparing Wasm file sizes between different blockchains](https://github.com/stellar/sorobanathon/discussions/26): as part of an early "Sorobanathon" event organized by the Stellar ecosystem to garner interest in their new smart contract initiative, we contributed comparisons of Wasm files sizes and the trade-offs different blockchains use to achieve them.

The Stellar team loved our proposals and we have worked closely together since, shipping many of the recommendations from our original DevX Audit.

## Case Study: Starknet

[Starknet](https://www.starknet.io/) is a Layer 2 network for Ethereum that harnesses Zero Knowledge proofs to enhance privacy and speed. Two of our engineers went through their onboarding documentation over the course of a week and found that, even for experienced engineers, it took multiple working days to create functional code. This is a non-starter, for hackathon participants and curious dabblers! We created three documents for them, to help them get this down to a 30-60min onboarding journey:

1. [Analysis of the Core Onboarding Journey](https://docs.google.com/document/d/1z5_nkwNhxXitz6PYeUZu-avv6gGrWuDTXsL25luAh4I/edit?tab=t.0#heading=h.hmhw8fbeiiq5): high-level feedback about our onboarding experience as a whole
2. [Suggestions for their CLI](https://docs.google.com/document/d/17OaiXeSVJH1bEJVVNx_ZiWmJZsbgF9vAdEMcHNZYIwM/edit?tab=t.0#heading=h.wf127bwxcmvq): given the central role that Command Line Interfaces play in a developer's workflow, we wanted to encourage Starknet to make a variety of both small and large improvements to the ergonomics of their CLI
3. [A Short Explanation of Loam](https://docs.google.com/document/d/1fHkrZeQMj_v4xzne8g4toKRa71Q-EKW_oR71_Cn1lPo/edit?tab=t.0#heading=h.pp9a87xx5ks8): the Starknet team specifically asked us to imagine what our [Loam](https://loam.build/) product might look like, if it were extended to work with Starknet

After receiving our feedback, the team decided that Loam is not interesting to them at this time, but we hopped on a call to discuss our DevX Audit and determine next steps. Shortly after we got their team this feedback, they were [able to](https://github.com/starknet-io/starknet-docs/pull/1480) restructure their docs to incorporate some of our suggestions.

## Ready to Take the Next Step?

Get in touch: <a href="mailto:hello@ahalabs.dev?subject=DevX Audit">hello@ahalabs.dev</a>

Let’s discuss your unique needs and co-create a solution that delivers true transformation.
