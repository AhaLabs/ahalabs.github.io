---
title: "Comparing Rust Smart Contract Storage Approaches"
pubDate: "2022-11-30"
author: "@chadoh"
---

I  ([@chadoh](https://twitter.com/chadoh)) recently started [exploring the CosmWasm smart contract module for Cosmos](https://github.com/Web3-Builders-Alliance/ClusterOneCodeJournal.W22MTW.Chad/blob/main/standards.md) as well as [Soroban, a new smart contract platform from the Stellar team](https://github.com/stellar/sorobanathon/discussions/19).

Having spent most of my time in NEAR with [near-sdk-rs](https://github.com/near/near-sdk-rs), the thing that immediately jumped out was the variety of approaches to storing on-chain data. While all these smart contract platforms use a simple key-value store, the way they wrap this key-value store in their Rust smart contracts varies wildly. This post will compare the various approaches.

# Simple data

As a baseline, let's see the most common approaches to storing and incrementing a number.

If you prefer video, I've summarized this section here.

<div class="responsiveVideoWrap">
    <iframe src="https://www.youtube.com/embed/uecOkEx1Cyc" title="NEAR vs Soroban vs CosmWasm: how SDKs wrap the key-value store" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

## NEAR

```rust
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::near_bindgen;

#[near_bindgen]
#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct Contract {
    counter: i8,
}

#[near_bindgen]
impl Contract {
    pub fn get_num(&self) -> i8 {
        self.counter
    }

    pub fn increment(&mut self) {
        self.counter += 1;
    }
}
```

If you're used to Rust, then this all looks pretty familiar. You can tell that the macros are doing all the heavy lifting.

You need to add the `#[near_bindgen]` macro to a `struct`, which will make that struct the main data structure of the contract. This struct is serialized with borsh and stored under the key `STATE`.

NEAR also makes you import some [Borsh](https://borsh.io/) stuff to explicitly declare the encoding/decoding format of the main data structure. You can [read more about this](https://raen.dev/guide/counter/intro.html#borsh) if you're unfamiliar with the specifics of encoding and decoding. But I don't know why `near-sdk-rs` makes you be explicit in this way—every contract I've ever seen encodes and decodes with Borsh.

Anyhow, the Borsh encoding means that the field name, `counter`, is not actually included in the stored bytes at all! Borsh serializes the struct kind of like an array, so only eight bytes will be stored for the first field. This makes it storage-efficient, with the downside that it can be a little finicky—if you add a field somewhere other than the end of the struct, or reorder your fields after you've already deployed and stored data in your contract, then you essentially brick your contract. You need to first [migrate your state](https://docs.near.org/tutorials/examples/update-contract-migrate-state#state-migration).

Then you declare `#[near_bindgen]` on an implementation, `impl`, which adds functions to your main struct. All of the public (`pub`) functions in that `impl` will be exported from the contract as functions.

If you want to play with a more complete example of this, check out the [RAEN Guide](https://raen.dev/guide/counter/intro.html).

## Soroban

Soroban is still in its early days, and has the simplest and most explicit approach to accessing the underlying key-value store:

```rust
#![no_std]
use soroban_sdk::{contractimpl, symbol, Env, Symbol};

const COUNTER: Symbol = symbol!("COUNTER");

pub struct IncrementContract;

#[contractimpl]
impl IncrementContract {
    pub fn get_num(env: Env) -> i32 {
        env.data()
            .get(COUNTER) // Returns an Option (Some or None) wrapping a Result (Ok or Err).
            .unwrap_or(Ok(0)) // Unwrap the Option. If None, no value set. Default to 0.
            .unwrap() // Unwrap the Result. If Err, COUNTER is not i32. Panic.
    }

    pub fn increment(env: Env) {
        let count: i32 = env.data().get(COUNTER).unwrap_or(Ok(0)).unwrap();
        env.data().set(COUNTER, count + 1);
    }
}
```

Soroban requires skipping the standard library (`#![no_std]`), which means you can't use [String](https://doc.rust-lang.org/std/string/struct.String.html), only [slices](https://doc.rust-lang.org/book/ch04-03-slices.html) (at least [for](https://github.com/stellar/rs-soroban-env/issues/463) [now](https://github.com/stellar/rs-soroban-env/issues/584)). The [`symbol!` macro](https://docs.rs/soroban-sdk/0.3.1/soroban_sdk/macro.symbol.html) handles converting ASCII-compatible strings of max-length 10 into an efficient 64-bit runtime [value type](https://soroban.stellar.org/docs/learn/environment-concepts#values-and-types). When persisted to the underlying key-value store, this `COUNTER` symbol gets encoded with [XDR](https://www.rfc-editor.org/rfc/rfc4506), which includes one byte each for the letters in `COUNTER`, plus some [extra encoding information](https://github.com/AhaLabs/ahalabs.github.io/pull/11/files#r1039065050) so that every key in the key-value store ends up using at least 12 bytes.

Like NEAR, there's a hash-bracket macro declared on the main `impl`, and the public functions in that implementation are exported from the contract. Unlike NEAR, you don't need to add this macro to the `struct` declaration. (Interestingly, this macro currently complains if you try to use an `i8`, which is why the type differs from the NEAR example.)

Actually getting and setting the value is pretty self-explanatory here.

## Cosmos with CosmWasm

Cosmos differs from the other chains here because it's meant to be a network of chains, not a single chain. The CosmosSDK maintained by the core team helps you build your own _blockchain_, not just a smart contract. This means it helps you write the software that all the validators in your blockchain will run. Let's call this the _validator runtime_. Then you need to run your own network of validator nodes, and run that validator runtime on each.

In the early days of Cosmos, in order to make smart contracts, you needed to hard-code the contracts into your validator runtime. This meant that simple smart contract changes essentially required a hard-fork of the network. This is fine for app-specific chains with well-staffed teams that understand the whole stack and operate the whole network, but made Cosmos an impractical choice for simpler apps that didn't need a whole chain of their own.

CosmWasm aims to split the difference between this app-specific chain model and the one-chain, many-contracts model of blockchains like Ethereum (or NEAR or Soroban). It's a plugin for CosmosSDK that makes it easy to add support for generic smart contracts on whatever blockchain you want to build. Like NEAR and Soroban, CosmWasm compiles smart contracts to WebAssembly, aka Wasm. This gives these smart contracts the same characteristics you're used to from other blockchains: they can be upgraded without hard-forking the network; they each run safely in their own sandbox, unable to access protected parts of the validator runtime host environment.

So CosmWasm does a lot more than something like near-sdk-rs. near-sdk-rs gets to focus just on helping you write smart contracts for NEAR, but CosmWasm also needs to define the whole "backend" part that plugs the Wasm-host logic into the larger CosmosSDK. It actually handles [even more than that](https://github.com/Web3-Builders-Alliance/ClusterOneCodeJournal.W22MTW.Chad/blob/main/standards.md).

And, aside from all this, CosmWasm also encourages many more conventions around smart contract authoring. If you start with the [recommended template](https://github.com/CosmWasm/cw-template), you'll end up with more than five files instead of just `src/lib.rs`, splitting your contract logic into _state_, _messages_, _errors_, and then the actual contract logic.

For the sake of side-by-side comparison, I've [consolidated all of this into one file](https://github.com/AhaLabs/cosmwasm-single-file).

Without further ado, here it is, the "simple" CosmWasm incrementer:

```rust
use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{
    entry_point, to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdError, StdResult,
};
use cw_storage_plus::Item;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use thiserror::Error;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct State {
    pub count: i8,
}

pub const STATE: Item<State> = Item::new("state");

#[cw_serde]
pub struct InstantiateMsg {
    pub count: i8,
}

#[cw_serde]
pub enum ExecuteMsg {
    Increment {},
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    // GetNum returns the current count as a json-encoded number
    #[returns(GetNumResponse)]
    GetNum {},
}

// We define a custom struct for each query response
#[cw_serde]
pub struct GetNumResponse {
    pub count: i8,
}

#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),
}

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    let state = State { count: msg.count };
    STATE.save(deps.storage, &state)?;
    Ok(Response::new())
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::Increment {} => {
            STATE.update(deps.storage, |mut state| -> Result<_, ContractError> {
                state.count += 1;
                Ok(state)
            })?;

            Ok(Response::new())
        }
    }
}

#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetNum {} => {
            let state = STATE.load(deps.storage)?;
            let raw_response = GetNumResponse { count: state.count };
            to_binary(&raw_response)
        }
    }
}
```

Phew! Still with me? Let's step through it.

### Imports

Casual.

```rust
use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{
    entry_point, to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdError, StdResult,
};
use cw_storage_plus::Item;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use thiserror::Error;
```

Something interesting is just the number of dependencies. 

1. `cosmwasm_schema`
2. `cosmwasm_std`
3. `cw_storage_plus`
4. `schemars`
5. `serde`
6. `thiserror`

You might think this results in large contract file sizes, but with the [CosmWasm optimizer](https://github.com/CosmWasm/rust-optimizer), it's actually not too far out of [what I've come to expect](https://github.com/stellar/sorobanathon/discussions/26) with NEAR contracts. Somewhere in the 150kB range.

And that optimizer gives you something the NEAR ecosystem sorely lacks: **reproducible builds!** The same contract results in the same optimized Wasm, no matter who builds it when. Which leads us right into the next interesting thing:

### Initialization

Unlike NEAR and Soroban, every CosmWasm contract needs to be initialized before it can be called. Here's all the stuff from above that's just there to deal with initialization:

```rust
#[cw_serde]
pub struct InstantiateMsg {
    pub count: i8,
}

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    let state = State { count: msg.count };
    STATE.save(deps.storage, &state)?;
    Ok(Response::new())
}
```

You probably noticed this `cw_serde` macro on all the structs and enums. It works together with a [`cargo schema` alias](https://github.com/CosmWasm/cw-template/blob/main/.cargo/config) and [accompanying embedded package](https://github.com/CosmWasm/cw-template/blob/231956d54770137fc0c5147f0128c9afd572eaf1/src/bin/schema.rs#L1) to generate JSON schemas for all your contract calls. These work like Ethereum's ABIs (or, you know, [like RAEN](https://youtu.be/VenoNgWdvw0) for NEAR 😏).

Anyhow, the interesting part is that it **needs** to be initialized. Why?

Because a given set of Wasm bytes is **only deployed once**, in CosmWasm.

Let me say that again; it's super cool.

If you deploy the same NFT contract a second or tenth or thousandth time on CosmWasm, _no new bytes will be stored_.

The on-chain storage _will not get bloated_ with a bunch of repetitive contract code.

This comes at the cost of requiring contracts to be instantiated. Why? Because you might not need to deploy a contract at all. If the contract you want to "deploy" already has its bytes stored on-chain, you can find the code ID, or address, of those bytes. Then you reference that code ID when you instantiate.

And anyhow, this barely counts as an added cost. Any contract of realistic size probably needs some initialization code, anyhow. The only contracts I've seen that don't require initialization are toy contracts like this incrementer.

So this demo contract seems a little more complicated than the NEAR and Soroban versions, because you need to explicitly initialize the contract, setting the `counter` to `0` while you do so. NEAR and Soroban let you default `counter` to `0`, rather than explicitly setting it. But they also both require duplicating contract bytes on-chain over and over. Score one for CosmWasm, imho. (Update: Soroban now has [similar](https://github.com/stellar/soroban-tools/issues/280) behavior](https://github.com/stellar/rs-soroban-env/pull/572) to CosmWasm here!)

### Errors

One last thing to get out of the way we focus in on storage manipulation.

The CosmWasm template comes with a bunch of error handling stuff. Most notably:

```rust
#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),
}
```

You can add your own errors to this enum, and include user-facing messages using [thiserror](https://docs.rs/thiserror/1.0.21/thiserror/).

Then it gets returned throughout calls to the contract in all those `Result`s. For example:

```rust
pub fn execute(…) -> Result<Response, ContractError> {…}
```

This is another area where it kinda seems like CosmWasm requires a lot of ceremony, but it's actually just establishing firm conventions (and great usability) for something that all realistic contracts will need. Once you get your bearings, Soroban encourages a [similar approach to CosmWasm](https://soroban.stellar.org/docs/examples/errors), but less baked-in. And NEAR doesn't have any conventions around this; most people [use the `require!` macro](https://docs.near.org/sdk/rust/best-practices) and throw user-facing messages right in the contract logic. This has worked alright to a point, but makes it hard for consumers of NEAR contracts and builders of NEAR tooling to know what possible errors a contract can throw.

### Getting and setting state!

Finally what we came here to see!

Here's how you define the shape of the state you're going to store:

```rust
use schemars::JsonSchema;
use cw_storage_plus::Item;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct State {
    pub count: i8,
}

pub const STATE: Item<State> = Item::new("state");
```

With a simple `State` struct like this, CosmWasm looks pretty similar to near-sdk-rs. Reminder of what that looked like:

```rust
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::near_bindgen;

#[near_bindgen]
#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct Contract {
    counter: i8,
}
```

A powerful thing about CosmWasm, though, is that you can store multiple top-level `Item`s. In NEAR, if you want to add more state, you add more keys to that `Contract` struct. This means that any function in NEAR that accesses state needs to pay the gas cost to deserialize the whole object, even if it doesn't use some keys.

Then this is how you read and write the data stored in that `STATE` item:

```rust
#[entry_point]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::Increment {} => {
            STATE.update(deps.storage, |mut state| -> Result<_, ContractError> {
                state.count += 1;
                Ok(state)
            })?;
            Ok(Response::new())
        }
    }
}

#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetNum {} => {
            let state = STATE.load(deps.storage)?;
            let raw_response = GetNumResponse { count: state.count };
            to_binary(&raw_response)
        }
    }
}
```


<details>
<summary>If you want a refresher on how those <code>ExecuteMsg</code> and <code>QueryMsg</code> enums were defined, scroll up or click here.</summary>

```rust
#[cw_serde]
pub struct InstantiateMsg {
    pub count: i8,
}

#[cw_serde]
pub enum ExecuteMsg {
    Increment {},
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    // GetNum returns the current count as a json-encoded number
    #[returns(GetNumResponse)]
    GetNum {},
}

// We define a custom struct for each query response
#[cw_serde]
pub struct GetNumResponse {
    pub count: i8,
}
```
</details>

But really, this is just one way to read and write the data stored in that `STATE` item. `STATE` is a fully-typed Rust struct, with fantastic type-ahead [documentation](https://docs.rs/cw-storage-plus/1.0.0/cw_storage_plus/struct.Item.html) in your editor, so you can quickly figure out other ways to update state, if `update` doesn't fit your situation.

# Complex data

Now that we know our way around these different SDKs, let's do a quick side-by-side for how to store more realistic data. We'll look at how each network's standard Fungible Token contract stores its set of tokens. These will be simplified code samples to show the core storage operations.

## NEAR

`near-sdk-rs` provides [collections](https://docs.rs/near-sdk/latest/near_sdk/collections/index.html) and, more recently, [store](https://docs.rs/near-sdk/latest/near_sdk/store/index.html) modules with efficient data structures to store large sets of data in the key-value store. Most code in the wild, including [the example fungible token example](https://github.com/near/near-sdk-rs/tree/master/examples/fungible-token), still use `collections`.

```rust
use near_sdk::collections::LookupMap;

// this comes from the standards library:
#[derive(BorshDeserialize, BorshSerialize)]
pub struct FungibleToken {
    /// AccountID -> Account balance.
    pub accounts: LookupMap<AccountId, Balance>,
}

// then, in your contract, this is your main struct:
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    token: FungibleToken,
}
```

You need to initialize these collections with a prefix. Here's how to prefix it with a single byte using a [byte string](https://doc.rust-lang.org/rust-by-example/std/str.html):

```rust
let token = FungibleToken {
    accounts: LookupMap::new(b"a")
};
let contract = Contract { token };
```

Every value in the collection will be added to a separate key in the key-value store, and all of these keys will be prefixed with whatever prefix you used, so it's best to keep it short! You can also [use `BorshStorageKey`](https://github.com/near/near-sdk-rs/blob/aaf9d5e77a1c35ecca584f6aa1e6d74c138ee4b0/examples/fungible-token/ft/src/lib.rs#L39-L43) to DRY up the code and avoid accidentally re-using the same byte for multiple collections.

Later, inside a method definition like `increment` above, you access those accounts using [LookupMap methods](https://docs.rs/near-sdk/latest/near_sdk/collections/struct.LookupMap.html). Some examples:

```rust
// add a new account to the map
self.token.accounts.insert(&tmp_account_id, &0u128);

// remove one
self.token.accounts.remove(&tmp_account_id);

// reduce someone's balance
if let Some(new_balance) = balance.checked_sub(amount) {
    self.token.accounts.insert(account_id, &new_balance);
}
```

## Soroban

Soroban also has [an reference Fungible Token implementation](https://github.com/stellar/soroban-examples/tree/main/token).

`Identifier` is an account identifier, like a public key or account address.

```rust
use soroban_auth::Identifier;
use soroban_sdk::contracttype;

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Balance(Identifier),
}
```

This is using [custom types](https://soroban.stellar.org/docs/examples/custom-types), which the simple example didn't need. The full reference implementation includes several other variants on this enum.

Then, to use `DataKey`:

```rust
use soroban_sdk::Env;

/// Get an account's balance, defaulting to zero
pub fn read_balance(e: &Env, id: Identifier) -> i128 {
    let key = DataKey::Balance(id);
    e.data().get(key).unwrap_or_else(|| 0)
}

/// Update an account's balance:
fn write_balance(e: &Env, id: Identifier, amount: i128) {
    let key = DataKey::Balance(id);
    e.data().set(key, amount);
}
```

As with the simple example, all data manipulations go through the [`e.data()`](https://docs.rs/soroban-sdk/0.2.1/soroban_sdk/data/struct.Data.html) interface.

Like CosmWasm, and unlike NEAR, this avoids loading all contract state every time you need to access even just one field from your main contract struct.

I mostly like the feel of the [contracttype](https://docs.rs/soroban-sdk/0.2.1/soroban_sdk/attr.contracttype.html) macro, though it's a little bit harder to get a sense of the user-facing data than the NEAR approach. NEAR's `LookupMap` associates an account with a balance in a central place. In Soroban, if you just look at the file where `DataKey` is defined, you're not really sure what kinds of values will be associated with those keys. To figure that out, you need to look at how the keys are used. This makes the code a little bit harder to understand, gives poorer type-ahead documentation in your editor, and probably makes it easier to introduce bugs.

## CosmWasm

The CosmWasm core team also maintains a [reference fungible token implementation](https://github.com/CosmWasm/cw-plus/tree/main/contracts/cw20-base). Let's focus on balance manipulation only. In the code below, `Addr` is CosmWasm's wrapper around a validated wallet address.

```rust
use cosmwasm_std::{Addr, Uint128};
use cw_storage_plus::Map;

pub const BALANCES: Map<&Addr, Uint128> = Map::new("balance");
```

[`Map`](https://docs.rs/cw-storage-plus/1.0.0/cw_storage_plus/struct.Map.html) is similar to the `Item` that we saw before, but contains powerful interfaces for querying and managing a whole collection of information, kind of like NEAR's `collections` and `state` interfaces. You can also use compound keys with `Map`:

```rust
pub const ALLOWANCES: Map<(&Addr, &Addr), AllowanceResponse> = Map::new("allowance");
```

You can achieve similar functionality in NEAR using [nested collections](https://docs.near.org/sdk/rust/contract-structure/nesting). This results in identical storage efficiency, but feels somewhat less ergonomic, in my opinion.

However, be careful with compound keys! It can get [tricky](https://github.com/Web3-Builders-Alliance/Cluster3CodeChallenge2.W22MTW.Chad/commit/eeb7cc013f97b31f12d42dbbbec568518d7da5e2) to get the order of those keys correct.

Manipulating these `Map`s looks similar to the simple CosmWasm `Item` manipulation that we looked at above. The biggest difference is the ability to query a [range](https://docs.rs/cw-storage-plus/1.0.0/cw_storage_plus/struct.Map.html#method.range):

```rust
// Build reverse map of allowances per spender
let data = ALLOWANCES
    .range(deps.storage, None, None, Ascending)
    .collect::<StdResult<Vec<_>>>()?;
```

# Summary

In this post we looked at how different Rust/Wasm-based chains provide hooks into similar underlying key-value stores.

Perhaps because it is the youngest, Soroban has the most straightforward implementation.

CosmWasm has the strongest opinions, and the most verbose syntax. It's also mature and powerful.

NEAR strikes a balance between the two, though it might feel a little too magical for some people.

I don't find any of these approaches particularly better or worse. And certainly, all of the teams maintaining these SDKs can learn from each other and borrow features that provide better UX.

This post provides a good starting point for people doing Developer Experience research for Rust/Wasm-based blockchains, as well as people who want to compare these platforms and learn more Rust.
