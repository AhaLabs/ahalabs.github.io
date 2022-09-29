---
title: "Grant Application to The Graph"
pubDate: "2022-09-29"
author: "@chadoh"
---

We applied for a grant from [The Graph](https://thegraph.com/en/). Here are the interesting parts.

You can learn [more about grants from The Graph](https://thegraph.com/ecosystem/grants/), and see the current application [on TypeForm](https://thegraph.typeform.com/applynow?typeform-source=ahalabs.dev).

# Please outline and describe your proposal:
_Share a short paragraph about your proposal. This is your moment to share your idea!_

RAEN (pronounced "rain"; it's "NEAR" backward) is a framework for ambitious dapps. Born in the NEAR ecosystem, our scrappy team of experts implemented NEAR's missing ABI system in less time than the "official" solution from Pagoda fka Near Inc. Our solution leapfrogs Ethereum's ABI system by harnessing WIT, WebAssembly Interface Types, a new standard born out of WebAssembly and being shepherded/championed by the WebAssembly team, with eventual plans to merge with WebAssembly itself. We love The Graph and want to make sure that every hackathon hacker to production engineer building on the Open Web gets a good starting Subgraph, harnessing the same underlying WIT that now powers collaborative smart contract builders on NEAR.

# Goals & Milestones
_Please include the overarching goals, milestones and targeted measurable KPIs. Let us know what your vision of success is and please include as much detail as possible. Include timelines, what stage the project is currently in (eg. pre-development, demo, launched; Examples: Month 1 - Building 4 Subgraphs; Month 2 - Translating 6 documents; etc...)_

- Month 1: `raen generate subgraph` CLI tool to generate a starting Subgraph from an existing Smart Contract that was build with `raen build`
- Month 2-3: `raen generate scaffold` generates both the Subgraph and React frontend, with React boilerplate to interact directly with smart contract and also with Subgraph, defaulting to Subgraph for read and SC for write

# What sort of impact will your project have on The Graph?
_What value will your project produce?_

When people build ambitious dapps with RAEN, they will start out with Subgraphs. More people will use The Graph, specifically with NEAR. NEAR's Subgraph tooling will mature, thanks to the WIT/ABI from RAEN.

# We would like to learn more about why you're interested in contributing to The Graph. What can you share with us?

I ([@chadoh]) contributed to Aragon's DAO tooling for Ethereum in 2019, which initially used all in-browser indexing. The Problem Of Indexing and the patchwork of workarounds/solutions at the time disappointed my decentralized web dreams. The Graph brought hope! Learning to build and launch Subgraphs was my favorite web3 onboarding experience at the time. Indexing is a thorny problem, but every dapp bigger than a hackathon Proof of Concept needs it, and The Graph has years of lead time over every other solution in the space.

# Please list where you've received previous funding from and how much.

Chad & Willem: each received $16k/month from NEAR Foundation's Education department, as Entrepreneurs in Residence, from mid-January to May 2022.

Jonathon & the rest of the Pixel8 team: received a grant from NEAR for the build-out of neartooling.com. This grant was for $10,000. Additionally, we have received a $10,000 grant from the Stacks foundation for a claim link platform. Details of this grant can be found here: https://grantsdashboard.stacks.org/dashboard/grants/512

# Who is on your team?

- [Willem Wyndham](https://github.com/willemneal):     Studied programming languages at a doctorate level. Built near-sdk-as, the AssemblyScript gateway to NEAR for thousands of developers. At bleeding edge of WebAssembly via active involvement in the community group. Built simulation testing for NEAR in 2020 and superseded it with near-workspaces in 2021. Cofounded TENK NFT accelerator; built smart contract that powers most (and most successful) NFTs in NEAR ecosystem. Built back half of RAEN in first half of 2022.
- [Chad Ostrowski](https://github.com/chadoh):         9-year veteran of web2 startup & consultancy world, full-time in web3 for 3 years since. Built initial Rainbow Bridge UI; delivered well-loved talk about Rainbow Bridge at ETH Denver 2021. Collaborated with Willem on near-workspaces. Built front half of RAEN in first half of 2022.
- [Jonathon Hammond](https://github.com/jhammond2012): Worked as a web2 developer and consultant since 2012 specializing in software automation. Made the web3 transition in late 2020 and has been part of NEAR projects including Fayyr and Amplify Art.
- [Andrew Nickell](https://github.com/andrewnickell):  UI/UX expert creating work in both web2 and web3 for the last 10+ years. Has worked on NEAR projects Fayyr, RAEN and Amplify Art.
- [Jenni Dinsmore](https://github.com/JenniDins):      A background in project management from the interior design world, made transition to software project management in late 2021.

# What's your Twitter handle?
_Your personal or your team's. This will be used for marketing comms if accepted for a grant._

https://twitter.com/raendev

# Past Work
_This is the place to share where you've contributed (ie. Github), examples of your work, and anything else that's relevant!_

https://github.com/raendev

# Anything else you'd like to share?
 
This proposal was made at the urging and with the guidance of Simon Emanuel, who I ([@chadoh]) spoke with at NEARCON and again in a follow-up call. Quote from Simon: “Given the skills and experience of this team, I have the impression that they could become a long term contributor to The Graph by creating best-in-class tooling for NEAR dapp developers”.

Future Work: We anticipate many improvements and additional features to this starting tooling. For example, we would love a 'raen watch' command that automatically updates relevant parts of Subgraphs as contracts change, especially for local full-stack development. We will apply for a follow-up grant to fund such continued development.

  [@chadoh]: https://twitter.com/chadoh
