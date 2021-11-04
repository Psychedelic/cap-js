<!-- omit in toc -->

![](https://storageapi.fleek.co/fleek-team-bucket/logos/capjs.png)

<h1 align="center">CAP-js</h1>

<h3 align="center">The client library for CAP - the Open Internet Service (OIS).</h3>

> A client library for the [CAP](https://cap.ooo/) Open Internet Service (OIS), implemented in JavaScript. The interface is based on the candid file [Cap Candid](https://github.com/Psychedelic/cap/tree/main/candid) allowing dApps to interact with the main canister. In addition, this client library will support endpoint caching using Kyasshu.

The CAP-js library is utilized to integrate UIs/FEs/Apps to CAP to **query & surface data** from CAP. Any frontend can query **the transaction/activity history for any Token or NFTs that uses CAP.** (Instead of having to integrate manually with each asset!)

- Visit [our website](https://cap.ooo)
- Read [our announcement](https://medium.com/@cap_ois/db9bdfe9129f?source=friends_link&sk=924b190ea080ed4e4593fc81396b0a7a)
- Visit [CAP's main repository](https://github.com/psychedelic/cap)
- Visit [CAP-SDK repository](https://github.com/Psychedelic/cap/tree/cap-sdk/sdk) 

>**IMPORTANT:** CAP is currently in development 🚧 and will release in the first week of November, thus it is not on mainnet or usable yet. You might see our documentation is light on the SDK/Main repo still. We're delayed in this to focus on testing, but will soon update this page with guides & detailed examples for developers.

## Table of Contents 

- [Table of Contents](#table-of-contents)
- [Getting Started](#getting-started)
	- [Install](#install)
- [Usage](#usage)
	- [Quick usage examples](#quick-usage-examples)
	- [Router Canister](#router-canister)
	- [`capRouter.get_index_canisters(witness)`](#caprouterget_index_canisterswitness)
		- [Parameters](#parameters)
		- [Returns](#returns)
		- [Example](#example)
	- [`capRouter.get_token_contract_root_bucket({canister, witness})`](#caprouterget_token_contract_root_bucketcanister-witness)
		- [Parameters](#parameters-1)
		- [Returns](#returns-1)
		- [Example](#example-1)
	- [`capRouter.get_user_root_buckets({user, witness})`](#caprouterget_user_root_bucketsuser-witness)
		- [Parameters](#parameters-2)
		- [Returns](#returns-2)
		- [Example](#example-2)
	- [`capRouter.insert_new_users(contractId, users)`](#caprouterinsert_new_userscontractid-users)
		- [Parameters](#parameters-3)
		- [Returns](#returns-3)
	- [`capRouter.install_bucket_code(principal)`](#caprouterinstall_bucket_codeprincipal)
		- [Parameters](#parameters-4)
		- [Returns](#returns-4)
		- [Example](#example-3)
		- [Notes](#notes)
	- [Root Canister](#root-canister)
	- [`capRoot.get_transaction(id, witness)`](#caprootget_transactionid-witness)
		- [Parameters](#parameters-5)
		- [Returns](#returns-5)
		- [Example](#example-4)
		- [Notes](#notes-1)
	- [`capRoot.get_transactions({page, witness})`](#caprootget_transactionspage-witness)
		- [Parameters](#parameters-6)
		- [Returns](#returns-6)
		- [Example](#example-5)
		- [Notes](#notes-2)
	- [`capRoot.get_user_transactions(({page, user, witness})`](#caprootget_user_transactionspage-user-witness)
		- [Returns](#returns-7)
		- [Example](#example-6)
	- [`capRoot.insert({to, fee, from, memo, operation, caller, amount})`](#caprootinsertto-fee-from-memo-operation-caller-amount)
		- [Returns](#returns-8)
		- [Notes](#notes-3)
	- [`capRoot.get_bucket_for({})`](#caprootget_bucket_for)
	- [`capRoot.get_next_canisters({})`](#caprootget_next_canisters)
	- [`capRoot.time([options])`](#caproottimeoptions)
	- [API](#api)
- [Roadmap](#roadmap)
- [Testing](#testing)
- [Roadmap](#roadmap-1)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

⚠️ ⚠️ Library not stable, will stay unstable until **Cap** is finalized ⚠️ ⚠️ 

### Install
```bash
yarn add @psychedelic/cap-js
```

## Usage

To interface with **Router** and **Root** toolkits, you have to instantiate them in the client application.

The **Router** instance is long lived and can persist across your application lifetime, as the `Canister Id` it depends on is of fixed value (e.g. calls to the method get_index_canisters will be sent to the same `canister id` in the network you're connected to). For this reason, it's recommended ⚡️ to create the instance in the application top-level and reuse during the application lifetime.

The **Root** instance in the other hand is short-lived and only useful during the token contract use cases (e.g. calls to the method get_transaction are sent to the particular token contract `canister id` which is unique). As such, it's necessary 🤝 to create a new instance for each token contract `canister id` and reuse the instance in the context of the token contract.

These are available as:

```js
import { CapRouter, CapRoot } from '@psychedelic/cap-js';
```

Here's an example of how to instantiate the `CapRouter`, which is similar to `CapRoot`:

```js
import { CapRouter } from '@psychedelic/cap-js';

const getCapRouterInstance = async ({
  canisterId,
  host,
}: {
  canisterId?: string,
  host?: string,
}) => await CapRouter.init({
  host,
  canisterId,
});

// On a hypotetical application top-level or entry-point
(async () => {
	const capRouter = new getCapRouterInstance({
		canisterId: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
		host: 'http://localhost:8000',
	});
})();
```

💡 The root `canister id` and `host` can be computed by an environment variable. Although, these parameters can be omited and the `mainnet` values are set by default.

Also, there's a `Hosts` object that can be used to retrieve defaults:

```js
import { Hosts } from '@psychedelic/cap-js';

// The Mainnet
const mainnetHost = Hosts.mainnet;
```

Similarily, a CAP `CanisterInfo` object is available that provides defaults:

```js
import { CanisterInfo } from '@psychedelic/cap-js';

// The `ic-history-router` mainnet canister id
const ICHistoryRouterCanisterId = CanisterInfo['ic-history-router'].mainnet;
```
### Quick usage examples

In order to get transactions of a particular token (e.g: XTC token):

```js
const tokenId = 'aanaa-xaaaa-aaaah-aaeiq-cai'	// XTC Canister Id

const { canister: rootTokenId } = capRouter.get_token_contract_root_bucket({canister: tokenId, witness})

const capRootXTC = await CapRoot.init({
  canisterId: rootTokenId[0],
})

const xtcTransactions = await capRootXTC.get_transactions()
```

Or instead, pass an instance of capRouter to have the inner call to `get_token_contract_root_bucket` handled for you:

```js
const tokenId = 'aanaa-xaaaa-aaaah-aaeiq-cai'	// XTC Canister Id

const capRootXTC = await CapRoot.init({ tokenId, router: capRouter })

const xtcTransactions = await capRootXTC.get_transactions()
```

Alternatively, for the case where you don't have a `CapRouter` instance:

```js
const tokenId = 'aanaa-xaaaa-aaaah-aaeiq-cai'	// XTC Canister Id

const capRootXTC = await CapRoot.init({
	tokenId,
	routerCanisterId: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
	host: 'http://localhost:8000'
})

const xtcTransactions = await capRootXTC.get_transactions()
```

You're advised to understand [Candid](https://sdk.dfinity.org/docs/candid-guide/candid-intro.html), the interface description language
for the Dfinity Internet Computer Services, because ultimately, that's where the latest method signatures for the Service endpoints are
defined, to avoid any typos described in the documentation.

Once you start looking at the original source-code, you might start questioning some decisions.

For example, why `cap-js` at time of writing is wrapping the `Actor` methods which are accessible
directly in the actor (e.g. `capRoot.actor.get_transactions()`)?

As it's mainly a wrapper to original method accessible in the actor and
that's for your own convenience (e.g. provides default values) it also provides a chance to the Cache layer to intercept and handle
those requests.

Since Cache is available (optionally) it helps to have a common API to switch between.

```js
const tnx = await caRoot.get_transactions(...);
const tnx = await capCache.get_transactions(...);
```

Find more about [here](#kyasshu-layer)

### Router Canister

### `capRouter.get_index_canisters(witness)`
> Return all Cap index canisters

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| witness | [boolean?](#boolean?) | The optional Certified response, defaults to `false` |

#### Returns

| Type | Description |
| ---- | ----------- |
| `GetIndexCanistersResponse` | An object returning all index canisters. If witness = `true` the certified response will be appended to the response |

#### Example

```JavaScript
const indexCanisters = await capRouter.get_index_canisters(false);
console.log(indexCanisters);
```
```bash
{
	witness: [] | [Witness];
	canisters: Array<Principal>;
}
```

### `capRouter.get_token_contract_root_bucket({canister, witness})`
> For a given token contract, return the entry root bucket

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| canister | [Principal](#boolean) | The `canister` Id of the requested root bucket |
| witness | [boolean?](#boolean?) | The optional `witness` for the Certified response |

#### Returns

| Type | Description |
| ---- | ----------- |
| `GetTokenContractRootBucketResponse` | An object returning root canister for a given token. If witness = `true` the certified response will be appended to the response |

#### Example

```JavaScript
const tokenRootBucket = await capRouter.get_token_contract_root_bucket({
 canister: "aaaa-aa",
 witness: false,
});
console.log(tokenRootBucket);
```
```bash
{
	witness: [] | [Witness];
	canister: [] | [Principal];
}
```
 
### `capRouter.get_user_root_buckets({user, witness})`
> query a users root bucket, each user root bucket exposes an interface to interact with and get transactions

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| user | [Principal](#principal) | The `user` Id of the requested root bucket |
| witness | [boolean?](#boolean?) | The optional `witness` for the Certified response |

#### Returns

| Type | Description |
| ---- | ----------- |
| `GetUserRootBucketsResponse` | An object returning root canister for a given user. If witness = `true` the certified response will be appended to the response |

#### Example

```JavaScript
const userRootBucket = await capRouter.get_user_root_buckets({
 user: "avesb-mgo2l-ds25i-g7kd4-3he5l-z7ary-3biiq-sojiw-xjgbk-ich5l-mae",
 witness: false,
});
console.log(userRootBucket);
```
```bash
{
	witness: [] | [Witness];
	contracts: Array<Principal>;
}
```

### `capRouter.insert_new_users(contractId, users)`
> insert new users for a token contract

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| contractId | [Principal](#principal) | The token `contract` Id |
| users | [Array of Principal](#array_of_principal) | A list of user `principal` |

#### Returns

| Type | Description |
| ---- | ----------- |
| `Promise<undefined>` | an empty response `()` |

### `capRouter.install_bucket_code(principal)`
> instantiate a new bucket canister for a token

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| principal | [Principal](#principal) | principal Id of a newly created empty canister  |

#### Returns

| Type | Description |
| ---- | ----------- |
| `Promise<undefined>` | an empty response `()` |

#### Example

```bash
# create root bucket canister
dfx canister --wallet=$(dfx identity get-wallet) call aaaaa-aa create_canister "(record { cycles=(4_000_000_000_000:nat64); controller=(opt principal \"$(dfx identity get-principal)\") })"

# set cap as the controller for the root bucket
dfx canister --wallet=$(dfx identity get-wallet) call aaaaa-aa update_settings "(record { canister_id=(principal \"r7inp-6aaaa-aaaaa-aaabq-cai\"); settings=(record { controller = opt principal \"rrkah-fqaaa-aaaaa-aaaaq-cai\"; null; null; null; }) })"

# Check controller of bucket canister
dfx canister info r7inp-6aaaa-aaaaa-aaabq-cai
```

#### Notes
- It is better to programmatically execute this `install_bucket_code` from your canister or through DFX. 

### Root Canister

### `capRoot.get_transaction(id, witness)`
> Return a specifc transaction based on global transaction `Id` from a token contract (tokenId)

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | [bigint](#bigint) | The global txnId of a transaction to return |
| witness | [boolean?](#boolean?) | The optional `witness` for the Certified response |

#### Returns

| Type | Description |
| ---- | ----------- |
| `GetTransactionResponse` | An object returning either `Delegate` or `Found`. If witness = `true` the certified response will be appended to the response |

#### Example

```JavaScript
const transaction = await capRoot.get_transaction(
	BigInt(1), 
	false,
)
console.log(transaction);
```
```bash
{
	Delegate: [Principal, [] | [Witness]];
}
# or
{ 
	Found: [[] | [Event], [] | [Witness]] 
}
```

#### Notes
- Unstable endpoint


### `capRoot.get_transactions({page, witness})`
> Get all transactions for a single token contract

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| page | [number?](#number?) | The optional `number` of the page to query for transctions, each page can hold up to 64 transactions. Defaults to page `0`. |
| witness | [boolean?](#boolean?) | The optional `witness` for the Certified response |

#### Returns

| Type | Description |
| ---- | ----------- |
| `GetTransactionsResponseBorrowed` | An object returning an array of `data` as well as the page queried. If witness = `true` the certified response will be appended to the response |

#### Example

```JavaScript
const tokenTxns = await capRoot.get_transactions({
 page: 4,
 witness: false,
});

// or

const tokenTxns = await capRoot.get_transactions({
 witness: false,
}); // this will default to page 0

console.log(tokenTxns);
```
```bash
{
	data: Array<Event>;
	page: number;
	witness: [] | [Witness];
}
```

#### Notes
- If no `page` param provided, we will query the first page, this is oppposite to what the main canister does which is query the last page transactions.


### `capRoot.get_user_transactions(({page, user, witness})`
> Get all user transactions for the token contract

| Name | Type | Description |
| ---- | ---- | ----------- |
| page | [number?](#number?) | The optional `number` of the page to query for transctions, each page can hold up to 64 transactions. Defaults to page `0`. |
| user | [Principal](#principal) | The user `principal` of the requested transactions 
| witness | [boolean?](#boolean?) | The optional `witness` for the Certified response |

#### Returns

| Type | Description |
| ---- | ----------- |
| `GetTransactionsResponseBorrowed` | An object returning an array of `data` as well as the page queried. If witness = `true` the certified response will be appended to the response |


#### Example

```JavaScript
import { cap } from '@psychedelic/cap-js'

const userTxns = await capRoot.get_user_transactions({
 userId: "avesb-mgo2l-ds25i-g7kd4-3he5l-z7ary-3biiq-sojiw-xjgbk-ich5l-mae",
 page: 4,
 witness: false,
});

// or

const userTxns = await capRoot.get_user_transactions({
 userId: "avesb-mgo2l-ds25i-g7kd4-3he5l-z7ary-3biiq-sojiw-xjgbk-ich5l-mae",
}); // this will default to page `0` and witness `false`

console.log(userTxns);
```
```bash
{
	data: Array<Event>;
	page: number;
	witness: [] | [Witness];
}
```

### `capRoot.insert({operation, caller, details})`
> Insert a transaction event to the token contract

| Name | Type | Description |
| ---- | ---- | ----------- |
| operation | [operation](#operation) |
| caller | [principal](#principal) |
| details | [vec record](#vec-record)

#### Returns

| Type | Description |
| ---- | ----------- |
| `Promise<bigint>` | a number |


#### Notes
- If no `page` param provided, we will query the first page, this is oppposite to what the main canister does which is query the last page transactions.

### `capRoot.get_bucket_for({})`
> ToDo

### `capRoot.get_next_canisters({})`
> ToDo

  time : () -> (nat64) query;
### `capRoot.time([options])`
> ToDo

### Kyasshu Layer

[kyasshu](https://github.com/Psychedelic/kyasshu) is a cache layer, that is originally used in the for xtc token service by utilizing lambda, sqs, redis and dynamodb.
Why would you want to use Kyasshu? Because caching allows you to efficiently reuse previously retrieved data, improving your application performance.

### `capRoot.get_all_user_transactions(userId, LastEvaluatedKey)`
> Return all of the user transactions for `userId`, if `LastEvaluatedKey` is returned, you must provide it in subsequent calls to query the rest of the data.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| userId | [principal](#principal) | 	The user Id of the requested transactions |
| LastEvaluatedKey | [string?](#string?) | The optional `LastEvaluatedKey`, If LastEvaluatedKey is empty, then the "last page" of results has been processed and there is no more data to be retrieved. If LastEvaluatedKey is not empty, it does not necessarily mean that there is more data in the result set. The only way to know when you have reached the end of the result set is when LastEvaluatedKey is empty. |

#### Returns

| Type | Description |
| ---- | ----------- |
| `GetTransactionsResponseBorrowed` | An object returning an array of `data` as well as the page queried. If witness = `true` the certified response will be appended to the response |

#### Example

```JavaScript
const capCache = new CapCache();

let userTxns = await capCache.get_all_user_transactions({
	user: Principal.from("zxt4e-ian3w-g4ll2-3n5mz-lfqkc-eyj7k-yg6jl-rsbud-f6sft-zdfq3-pae"),
});

userTxns = await capCache.get_all_user_transactions({
	user: Principal.from("zxt4e-ian3w-g4ll2-3n5mz-lfqkc-eyj7k-yg6jl-rsbud-f6sft-zdfq3-pae"),
	LastEvaluatedKey: userTxns.LastEvaluatedKey,
});

console.log(userTxns);
```
```bash
{
	Items?: {
			[key: string]: Event;
	}[] | undefined;
	LastEvaluatedKey?: {
			[key: string]: any;
	} | undefined;
}
```

#### Notes
- Unstable endpoint

### API

- ToDo
  
## Local Development

- ToDo

## Roadmap

- Cache every endpoint with Kyasshu

- Support update calls to the main Cap canister

## Testing

- ToDo
 
To run tests, run the following command

```bash
  npm run test
```

## Roadmap

- Cache every endpoint with Kyasshu or with a cache canister

- Support update calls to the main Cap canister

## Contributing

Contributions are always welcome!
  
## License

[MIT](https://choosealicense.com/licenses/mit/)

  