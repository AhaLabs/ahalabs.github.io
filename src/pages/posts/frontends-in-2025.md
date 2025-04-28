---
title: "What frontend stack should we use in 2025?"
pubDate: "2025-04-12"
author: "@chadoh"
description: "Picking a reasonable frontend toolchain for Scaffold Stellar, to help developers get started with a reasonable and powerful frontend architecture"
---

We're doing it; we're building "The Ruby on Rails for Stellar" and it's going to be called Scaffold Stellar.

Start new Stellar projects quickly. A sensible starting point for ambitious apps. Strong conventions that can get out of your way quickly if you prefer something else. Help authoring your own Stellar contracts, or use existing on-chain contracts (both options are just as easy). Quickly generate NPM libraries for each contract, and get help using them in your frontend. Straightforward builds for local, test, staging, and production environments.

But that frontend piece—which frontend toolchain should we use??

It's been clear for years that the frontend "community" will never again have anything approaching consensus. "Which frontend technology is the best?" Everyone keeps inventing more answers. The options proliferate; the ecosystem splinters into smaller and smaller shards. It's going to be many roads diverging in a wood forever.

![situation: there are 14 competing standards. 14 standards? ridiculous! we need to develop one universal standard that covers everyone's use cases. situation: there are 15 competing standards](https://imgs.xkcd.com/comics/standards_2x.png)

Someday, Scaffold Stellar will provide pluggable engines that allow you to generate frontend scaffolding in many frontend component systems and libraries. React? Of course! Vue? Definitely! Svelte? Sure! Solid? Alpine? React Native? Some new Rust frontend system? Why not! Author a plugin and ship it to your people!

But for now, we need to pick a reasonable starting point. [React](https://2023.stateofjs.com/en-US/libraries/front-end-frameworks/) wins, but React _how?_ Should we use a [meta-framework](https://2023.stateofjs.com/en-US/libraries/meta-frameworks/) like NextJS or Astro? Should we "roll our own" meta-framework and use a [build tool](https://2023.stateofjs.com/en-US/libraries/build_tools/) like Vite, tsc, or SWC? What about [Tauri](https://tauri.app/)? It doesn't build _true native_ phone apps, but isn't webview better than nothing? What about Deno or Bun or, or, or... 

No matter what we pick, you are likely to disagree with part of it. Heck, no matter what we pick, **WE** are likely to disagree with part of it!

Let's make a rubric. A feature-list of things we are looking for when we evaluate frontend frameworks. Then we'll consider which of these features we care about the most, and pick the framework that fits them.

<table class="feature-rubric">
  <thead>
    <tr>
      <td></td>
      <td>Astro</td>
      <td><abbr title="existing Stellar ecosystem project that uses NextJS. See more in the &quot;about the contenders&quot; section below">create-soroban-dapp</abbr></td>
      <td>Tauri</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>broadly <abbr title="as indicated by the 2024 State of JS survey">popular</abbr></td>
      <td><abbr title="Currently clocks in at 23% usage vs NextJS's 54%, but has much higher positivity rating">😕</abbr></td>
      <td><abbr title="NextJS's 54% usage on State of JS is hardly a consensus, and it scores poorly for retention and positivity">😕</abbr></td>
      <td>?</td>
    </tr>
    <tr>
      <td>true <abbr title="Static Site Generation: the ability to compile/build the site to basic assets like HTML, CSS, JS, images & videos, suitable for uploading to a static asset host like GitHub Pages or AWS S3 Buckets">SSG</abbr></td>
      <td>✅</td>
      <td></td>
      <td>?</td>
    </tr>
    <tr>
      <td>existing Stellar project</td>
      <td></td>
      <td>✅</td>
      <td></td>
    </tr>
    <tr>
      <td>supports <abbr title="iOS, Android, Desktop">native</abbr> apps</td>
      <td></td>
      <td></td>
      <td><abbr title="Ships native apps using the &quot;webview&quot; feature of iOS and Android. It's not nothing!">😕</abbr></td>
    </tr>
  </tbody>
</table>

## The Contenders

### Astro

Categorized as a "meta-framework" by the State of JS Survey, Astro provides its own lightweight templating system suitable for building static pages with minimal runtime JavaScript, as well as allowing any more client-heavy UI libraries like React or Vue via a mature and lightweight plugin system.

Astro has been included in the State of JS survey since 2021, and has risen consistently in popularity since, while more-popular competitor NextJS has stagnated. It is also the highest-ranked—and the only meta-framework trending upward—on the "positivity" metric.

[![2024 State of JS metaframeworks](https://assets.devographics.com/captures/js2024/en-US/meta_frameworks_ratios.png)](https://2024.stateofjs.com/en-US/libraries/meta-frameworks/)

### create-soroban-dapp

Stellar ecosystem project from [Palta Labs](https://paltalabs.io/) that has been around since the birth of Stellar's smart contract platform (the effort-to-build and the feature-that-is "smart contract functionality for Stellar" was originally <a href="https://stellar.org/blog/developers/soroban-a-new-smart-contract-standard">called Soroban</a> and sometimes still is).

`create-soroban-dapp` uses NextJS. For some of the metrics in the rubric above, we used NextJS's ratings on sites like State of JS Survey, since `create-soroban-dapp` does not show up itself.

We like the idea of using existing community standards and projects where we can, rather than continuing to fracture the community. Despite our personal misgivings about underlying tech like NextJS (this author finds it egregious that NextJS [refuses to support true SSG](https://github.com/vercel/next.js/discussions/19065) and assumes it is because Next is maintained by Vercel and they're incentivized to push people toward their own hosting platform), we think the ecosystem is currently small enough that it would greatly benefit from collaboration between our team and Palta Labs.

That said, the other side of the "the community is currently quite small" coin is that a new standard could still be created that becomes much more popular than any existing project. If our investigation makes us think that most developers are likely to be frustrated by tooling choices made in `create-soroban-dapp`, and if untangling those choices seems significantly harder than starting over, then it may make more sense to start over with our own stack.

## Tauri

Tauri might be more of a competitor to Electron than it is a competitor to React Native. TODO: Let's say more about it here...

## What features matter?

Are all the features in our rubric of equal importance? Probably not.

How much does "existing ecosystem project" rank compared to "supports native apps"?

Everyone is likely to answer questions like that differently.

We sorted them roughly in order of how important the feature seems to us. Things closer to the top of the table are more important than those near the bottom. We should pick a frontend toolchain that checks more boxes near the top, and not worry so much about checked boxes (or lack thereof) near the bottom.

## And the winner is...

...
