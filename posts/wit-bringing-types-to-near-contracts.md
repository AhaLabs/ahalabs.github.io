---
title: "`wit`: Bringing types to NEAR smart contracts"
date: "2022-02-03"
author: "@willemneal"
---

# NEAR and WebAssembly

Under the hood, NEAR uses WebAssembly (Wasm) to run smart contracts. While this is
great, it has some pain points. For normal Wasm binaries, functions exported can
only have float and integer types. So more complex types like strings have to be
passed via a pointer, `pass_string(len: u32, ptr: u32)`. This makes it hard to
tell from the function signature that a string is being passed, it could be
any binary blob.

For NEAR Wasm binaries this problem is made worse because all export functions have the same
type signature, `foo()`, that is they take no arguments and return nothing. The reason
for this is because the arguments are serialized in JSON[note], so the function first
asks the host for a binary blob and then deserializes it.

So if you can download a contract's binary and inspect it, you'll only have the function names
with no other information.

## Introducing the `wit` format

[WebAssembly Interface Types]() seeks to solve the passing of more complex types at a low level.

Until this is complete the `wit-bindgen` project allows `adapters` to be generated for handling
these types at boundaries.

For example, in JavaScript strings are encoded as `UTF-16`[note], but is `UTF-8` in Rust. So
passing the binary blob of the string from a Rust Wasm binary is not a simple copy/pasted.

For our use case we need `remote adapters`.  Whereas `wit-bindgen` expects to pass values
via a normal function call, we are serializing values and then deserializing them.

## `witme` a CLI tool for generating to and from `.wit`

So after that introduction let's walk through a real example. First `witme` is a Rust binary that can be installed with `cargo`:

```bash
cargo install witme
```

Assume that you have a Rust smart contract like the following:

```rust
use near_sdk::{witgen, near_bindgen}

#[witgen]
#[derive(Serialize)] // Needed to serialize to JSON
pub struct Message {
  text: String,
}

//...
pub struct Contract {
  message: Message
}

#[near_bindgen]
pub impl Contract {
  //...

  pub get_message() -> Message {
    self.message
  }
}

```

The view method `get_message` returns a `Message` struct. `#[witgen]` is a Rust macro is needed to generate corresponding `wit` record. Furthermore the `#[near_bindgen]` macro has been updated to generate function types in `wit`.

Next you can use `witme` to generate a `.wit` file for the contract.

```bash
witme near wit
```

generates `index.wit`

```wit
record message {
  text: string
}

get_message: function() -> Message
```

This `wit` file now describes the Contract's interface in a language agnostic way. This means we can now generate source code for a different language.  For example, TypeScript:

```bash
witme near ts
```

By default this command looks for an `index.wit` and puts the generated TS in it's own `./ts` folder.


```typescript
export interface Message {
  text: string
}

export class Contract {
  //...
  get_message() -> Promise<Message>{
    ///
  }
}

```
