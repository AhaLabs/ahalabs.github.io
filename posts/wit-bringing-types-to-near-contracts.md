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
tell from the function signature that a string is being passed; it could be
any binary blob.

For NEAR Wasm binaries this problem is made worse because all export functions have the same
type signature, `foo()`, that is they take no arguments and return nothing. The reason
for this is because the arguments are serialized in JSON, so the function first
asks the host for a binary blob and then deserializes it.

So if you can download a contract's binary and inspect it, you'll only have the function names
with no other information.

## Introducing the `wit` format

[WebAssembly Interface Types](https://hacks.mozilla.org/2019/08/webassembly-interface-types/) seeks to solve the task of passing of more complex types at a low level.

Until this is complete the `wit-bindgen` project created a [`.wit`](https://github.com/bytecodealliance/wit-bindgen/blob/main/WIT.md) format that can be used to generate the needed source "`adapters`" to handle passing the complex types.

For example, in JavaScript strings are encoded as `UTF-16`[note], but `UTF-8` in Rust. So
passing the binary blob of the string from a Rust Wasm binary is not a simple copy/paste.

For our use case we need `remote adapters`.  Whereas `wit-bindgen` expects to pass values
via a normal function call, we are serializing values on one side of an RPC call and then deserializing them on the other.

## `witme` a CLI tool for generating to and from `.wit`

So after that introduction let's walk through a real example. First `witme` is a Rust binary that can be installed with `cargo`:

```bash
cargo install witme
```

Assume that you have a Rust smart contract:

```rust
use near_sdk::{witgen, near_bindgen}

/// A message that contains some text
#[witgen]
pub struct Message {
  /// Inner string value
  text: String,
}

//...
pub struct Contract {
  message: Message
}

#[near_bindgen]
impl Contract {
  
  /// A change call to set the message
  pub fn set_message(&mut self, message: Message) {
    self.mesage = message;
  }

  /// A view call to get the current message
  pub fn get_message(self) -> Message {
    self.message
  }
}

```

The view method `get_message` returns a `Message` struct. `#[witgen]` is a Rust macro that generates a corresponding [`wit` record](https://github.com/bytecodealliance/wit-bindgen/blob/main/WIT.md#item-record-bag-of-named-fields). See the [witgen repo](https://github.com/bnjjj/witgen) to learn more about generating `.wit` files from existing code.

Furthermore the `#[near_bindgen]` macro has been updated to generate [function types in `wit`](https://github.com/bytecodealliance/wit-bindgen/blob/main/WIT.md#item-function).

Next you can use `witme` to generate a `.wit` file for the contract.

```bash
witme near wit
```

generates `index.wit`

```wit
///  A message that contains some text
record message {
    ///  Inner string value
    text: string
}

///  A change call to set the message
///  change
set-message: function(message: message)

///  A view call to get the current message
get-message: function() -> message

```

This `wit` file now describes the Contract's interface in a language agnostic way. This means we can now generate source code for a different language.  For example, TypeScript:

```bash
witme near ts
```

By default this command looks for an `index.wit` and puts the generated TS in it's own `./ts` folder.

```typescript
/**
* A message that contains some text
*/
export interface Message {
  /**
  * Inner string value
  */
  text: string;
}

export class Contract {
  /** Account calling the contract and the contractId to call */
  constructor(public account: Account, public readonly contractId: string){}
  
  /**
  * A change call to set the message
  */
  async set_message(args: {
    message: Message;
  }, options?: ChangeMethodOptions): Promise<void> {}

  /**
  * A view call to get the current message
  */
  get_message(args = {}, options?: ViewFunctionOptions): Promise<Message> {}
}
```

This means the contract's interface is now available to use with `near-api-js` to interact with the contract.

```ts
import {Contract, Message} from "message/contract";
import {Account} from "near-api-js";

async function getMessage(currentAccount: Account): Promise<Message> {
  let contract = new Contract(currentAccount, "contract.testnet");
  return contract.get_message();
}
```

Since the original comments in the rust code are preserved you can also get hover over docs in your IDE, or generate a documentation website (see [TenK's docs](https://tenk-dao.github.io/tenk/docs/) for an example).

## JSON Schema

Taking this a step further we can generate a [json-schema](https://json-schema.org/), basically a JSON object that defines the constraints of the data to allow a JSON object to be validated.

```bash
witme near json
```

Currently this is supported by using a [ts-json-schema-generator](https://github.com/vega/ts-json-schema-generator). Though this too could be generated directly from the `.wit`.  This command defaults to find a `./ts/index.ts`, which it uses to generate a `index.schema.json`.

Which would look something like

```json
{
  "GetMessage": {
    "additionalProperties": false,
    "contractMethod": "view",
    "description": "A view call to get the current message",
    "properties": {
      "args": {
        "additionalProperties": false,
        "type": "object"
      }
    },
    "required": [
      "args"
    ],
    "type": "object"
  },
 "SetMessage": {
      "additionalProperties": false,
      "contractMethod": "change",
      "description": "A change call to set the message",
      "properties": {
        "args": {
          "additionalProperties": false,
          "properties": {
            "message": {
              "$ref": "#/definitions/Message"
            }
          },
          "required": [
            "message"
          ],
          "type": "object"
        },
        "options": {
          "additionalProperties": false,
          "properties": {
            "attachedDeposit": {
              "$ref": "#/definitions/Balance",
              "default": "0",
              "description": "Units in yoctoNear"
            },
            "gas": {
              "default": "30000000000000",
              "description": "Units in gas",
              "pattern": "[0-9]+",
              "type": "string"
            }
          },
          "type": "object"
        }
      },
      "required": [
        "args",
        "options"
      ],
      "type": "object"
    },
  "Message": {
      "additionalProperties": false,
      "description": "A message that contains some text",
      "properties": {
        "text": {
          "description": "Inner string value",
          "type": "string"
        }
      },
      "required": [
        "text"
      ],
      "type": "object"
    },
}
```

First we can see `GetMessage`, is a `view` function and requires an `args` object that has no properties. Next `SetMessage` requires an `args` object with one field "`message`", the type of which is a reference to the `Message` type defined in the schema. Since `SetMeassage` is a `change` function an `options` field is also required for how much gas and deposit to attached to the transaction.

Whereas the Typescript would provide compile time checks that the types used in the contract call are valid, this allows the arguments passed to a contract method at runtime to be validated, thus preventing errors before they reach a NEAR node.


### Forms for free

Now that we have a schema and know all of the input types a react form can be autogenerated to validate and interact with the contract.  Not only are the types validated, but extra annotations can be used to add additional constraints.

For example, if the text of every message had to start with "`TEXT:`" a regular expression can be added to the comments.

```rust
/// A message that contains some text
#[witgen]
pub struct Message {
  /// Inner string value
  /// @pattern ^TEXT:
  text: String,
}
```

```typescript

/**
* A message that contains some text
*/
export interface Message {
  /**
  * Inner string value
  * @pattern ^TEXT:
  */
  text: string;
}

```

```json
{
///
  "Message": {
      "additionalProperties": false,
      "description": "A message that contains some text",
      "properties": {
        "text": {
          "description": "Inner string value",
          "pattern": "^TEXT:",
          "type": "string"
        }
      },
      "required": [
        "text"
      ],
      "type": "object"
    },
///
}
```

This is showcased in the TenK repo's admin panel: [https://tenk-dao.github.io/tenk](https://tenk-dao.github.io/tenk/#/mint_rate_limit.tenk.testnet/NftTokensForOwner). Try entering "." for the `account_id` and hit submit or check `live validation` and you'll get the following error

``` js
.args.account_id should NOT be shorter than 2 characters
.args.account_id should match pattern "^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$"
```
