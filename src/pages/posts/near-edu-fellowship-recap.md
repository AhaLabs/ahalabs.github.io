---
title: "Our time as NEAR Education Fellows: Reflections, Retrospective, Accomplishments, What's Next"
pubDate: "2022-07-11"
author: "@raendev"
description: "Aha Labs joined the NEAR Education Fellowship program in January 2022. Reflections, retrospective, and what's next."
---

Aha Labs joined the NEAR Education Fellowship program in January 2022. This program has changed structure; our time with it ended in May. Some highlights:

## Product launches

Collaborated with TENK [to](https://github.com/TENK-DAO/world-of-the-abyss) [launch](https://github.com/TENK-DAO/nearnymphs) [many](https://github.com/TENK-DAO/monkegodz) [NFT](https://github.com/TENK-DAO/shintosociety) [projects](https://github.com/TENK-DAO/monkedemonz) [in](https://github.com/TENK-DAO/beer-punks) [the](https://github.com/TENK-DAO/im-question-mark) [NEAR](https://github.com/TENK-DAO/neartrees) [ecosystem](https://github.com/TENK-DAO/friendlyseacreatures).

## Turn-key solutions

Created [contract](https://github.com/tenk-dao/tenk) and [frontend](https://github.com/tenk-dao/frontend-starter) templates that powered [many](https://paras.id/collection/asac.near) [NFT](https://paras.id/collection/secretskelliessociety.near) [launches](https://paras.id/collection/tayc-nft.near) [outside](https://paras.id/collection/mara-smartcontract.near) [of](https://paras.id/collection/rocketbois.neartopia.near) TENK partnerships (here we've linked to merely the first five found among the past-7-days-top-sellers on [Paras](https://paras.id)).

## Powering NEAR Education

Reviewed hundreds of applications to the [NEAR Certified Developer](https://www.near.university/courses/near-certified-developer) program, highlighting strong candidates for further boosting/collaboration with NEAR Education and marketing teams

## NEAR promotion/education at events

- [Harvard Blockchain Conference](https://twitter.com/hbc_2022): staffed the NEAR booth, served as point-person for technical questions.
- [NEAR Hacker House](https://twitter.com/NearHacks): [Miami](https://t.me/+LJ5pSZMet41mYzYx): Provided technical help, led a workshop and gave a talk on how to use TENK.
- NEAR Hacker House: [Austin](https://t.me/+eRftRXpP9UUyM2Q5): Debuted the [RAEN Guide](https://raen.dev/guide) to introduce people to NEAR using RAEN and the RAEN Admin panel (see below).

## Differentiating NEAR from other blockchains

Our work this quarter culminated here.

We applied our learnings with TENK to create a [user-friendly contract administration panel called RAEN Admin](https://raen.dev/admin/), with no technical knowledge needed. This went through [multiple](https://tenk-dao.github.io/tenk/#/v2.tenk.testnet) [iterations](https://github.com/raendev/admin/pull/3/files) to transform from TENK-specific to fully general-purpose. To take advantage of RAEN Admin, contract authors need only build their contracts with [the RAEN CLI](https://github.com/raendev/raen).

**The open-ended nature of the NEAR Education Fellowship program during this period gave us the exploration time needed to pull this off well.** It required months of deep technical work, which we were able to accomplish alongside everything above.

We architected RAEN around [WebAssembly Interface Types](https://github.com/bytecodealliance/wit-bindgen/blob/main/WIT.md) (Wit), a new standard that will eventually merge with WebAssembly core. This will ensure long-term compatibility between our work and [NEAR's runtime](https://nomicon.io/RuntimeSpec/Preparation#validation), even making it possible to incorporate our work into nearcore in the future. Given the early stage Wit was in when we started, achieving our goal required many foundational open source contributions. We:

- Made major contributions to [witgen](https://github.com/bnjjj/witgen)
- Created [witme](https://github.com/ahalabs/witme)
- Worked with the [wit-bindgen](https://github.com/bytecodealliance/wit-bindgen) project to [ensure stability for wit](https://github.com/bytecodealliance/wit-bindgen/issues/214#issuecomment-1116237538) in the short term

To top it off, we collaborated with fellow NEAR-ecosystem consultancy [Pixel8](https://github.com/Pixel8-LLC) to design a beautiful and accessible frontend, available now at [raen.dev/admin](https://raen.dev/admin).

## What's next

We keep building, making it easier for developers of all skill levels to build ambitious apps on NEAR, whether with their own or existing smart contracts.

Specifically, the foundations laid during our time as Fellows creates many new possibilities:

- Incorporate RAEN Admin-like functionality into [nearblocks.io](https://nearblocks.io/) (discussions underway)
- User-test [The Guide](https://raen.dev/guide), working toward more complete developer onboarding into NEAR + Rust, including possible paid courses for those who wish to go deeper. (RAEN Admin is a fabulous tool for teaching NEAR smart contract development.)
- Build more tooling that consumes the Wit specification that powers RAEN Admin. Every contract built with RAEN now has a fully-typed, discoverable interface, available right on-chain with the contract code itself. This will power drastically improved developer tooling, **unmatched by any other blockchain.** Some of what we plan to build ourselves, which will also serve as inspiration for other tool-builders:
  - Auto-generate cross-contract call boilerplate
  - Auto-generate TypeScript interfaces for web & mobile apps
  - Auto-generate [OpenRPC](https://open-rpc.org/) specifications, allowing seamless integration with the world of tooling already developed by that community
  - Explore possibility of auto-generating a starting-point [Subgraph](https://thegraph.com/)

And it doesn't stop with Wit. While continuing to promote and improve our Wit and RAEN tooling, we've also been busy building a new library for Rust smart contracts that will allow greater safety, upgradeability, and code-sharing between projects. Keep an eye on this blog and [our Twitter feed](https://twitter.com/raendev) for an announcement!
