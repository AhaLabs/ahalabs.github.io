---
title: "NEAR + create-react-app + TypeScript"
date: "2022-02-03"
---

Build fast with a [powerful frontend template](https://github.com/AhaLabs/cra-template-near) that integrates with NEAR:

    npx create-react-app --template @ahalabs

Someone asked for this when I guest-lectured at a [NEAR Certified Developer (NCD)][ncd] course.

The NEAR ecosystem currently lacks a couple things:

- an obvious starting point when building a frontend app
- examples that use TypeScript to its full potential

This is an attempt to quickly fill that gap.

## Why not create-near-app?

Months ago, near.org pushed developers to use `create-near-app`. It has since been removed from the home page. Why?

- It tried to be too many things: vanilla JS, React, Vue, even Angular, and your choice of contract language, Rust or AssemblyScript. In its attempt to fill all of these needs and still be maintainable, its approach to any particular frontend tech was not particularly idiomatic. For example, the React template added lots of things to the `window` object, which can cause problems for people trying to switch to a React approach with Server-Side Rendering (SSR) or Static Site Generation (SSG).
- It was not well-maintained. I ([@chadoh]) was its primary maintainer for a while, but Near Inc started prioritizing other things. No one else was hired/retained and given time to work on it. The project languished.

At this point, create-near-app is fairly outdated.

## What are people using instead?

There's no clear starting point. "Go look at [near.dev](https://examples.near.org) and [NCD.L2 examples](https://github.com/learn-near?q=L2) and pick a project to fork," seems to be the general advice. This makes getting started pretty intimidating, especially for newbies.

## An alternative

Students in the NCD class thought a lightweight create-react-app template would be nicer. If you try out the template, you'll see that it doesn't even include a smart contract. I like this for two reasons:

- It mimics the structure of NCD courses – the smart contract lives in a separate repository from the frontend.
- Long-term, if the dream of the Open Web / web3 succeeds, there will be way more frontends than contracts. Multiple frontends will be able to integrate with and remix already-existing contracts. App developers will hook into existing infrastructure and skip creating their own. So we should expect many frontends to integrate with already-deployed smart contracts.

## Yay, TypeScript

When I asked if people thought I should use TypeScript, the general sentiment was "I don't why you wouldn't."

So the template uses TypeScript. It even adds proper typing to [a contract-wrapper class](https://github.com/AhaLabs/cra-template-near/blob/main/template/src/contracts/guest-book.ts), since this is a [common point of confusion](https://github.com/near/near-api-js/issues/719). Expect this [approach to evolve](https://github.com/AhaLabs/cra-template-near/pull/1) over the next few weeks as Aha Labs explores auto-generating these types from the contract source code.

## The future

For the 2+ years I've been part of NEAR, I've badly wanted something analogous to the Ruby on Rails CLI. I want to be able to type something like `scaffold nft` and end up with both a smart contract and the frontend code to wrap it and integrate it into my app.

React + TypeScript seem like [good choices](https://2020.stateofjs.com/) for the frontend part of this scaffolding.

Is create-react-app the best choice? Unclear. I've [been](https://github.com/AhaLabs/tenk-template-gatsby) [researching](https://github.com/AhaLabs/tenk-template-nextjs) other approaches. Whatever we choose, this early work will transfer easily.

Please try out this template and be loud with all feedback. Make pull-requests, make [issues](https://github.com/AhaLabs/cra-template-near/issues), or just `@` me [on Twitter][@chadoh].

[ncd]: https://www.near.university/courses/near-certified-developer
[@chadoh]: https://twitter.com/chadoh
