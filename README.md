<!-- omit in toc -->

<h1 align="center">Cap-js</h1>

<h3 align="center">The client library for Cap Open Internet Service (OIS).</h3>

> A client library for the Cap Open Internet Service (OIS), implemented in JavaScript. The interface is based on the candid file [Cap Candid](https://github.com/Psychedelic/cap/tree/main/candid) allowing dApps to interact with the main canister. In addition, this client library will support endpoint caching using Kyasshu.

## Table of Contents 

- [Getting Started](#getting-started)
  - [Install](#install)
- [Usage](#usage)
    - [`cap.get_index_canisters(witness)`](#capget_index_canisters-witness)
	    - [Parameters](#parameters)
		- [Returns](#returns)
		- [Example](#example)
    - [`cap.get_token_contract_root_bucket({canister, witness})`](#capget_token_contract_root_bucketcanister-witness)
		- [Parameters](#parameters-1)
		- [Returns](#returns-1)
		- [Example](#example-1)
    - [`cap.get_user_root_buckets({user, witness})`](#capget_user_root_bucketsuser-witness)
		- [Parameters](#parameters-2)
		- [Returns](#returns-2)
		- [Example](#example-2)
    - [`cap.install_bucket_code(principal)`](#capinstall_bucket_codeprincipal)
		- [Parameters](#parameters-3)
		- [Returns](#returns-3)
		- [Example](#example-3)
    - [`cap.get_transaction({tokenId, txnId, witness})`](#capget_transactiontokenId-txnId-witness)
		- [Parameters](#parameters-4)
		- [Returns](#returns-4)
		- [Example](#example-4)
    - [`cap.get_transactions({tokenId, page, witness})`](#capget_transactionstokenId-page-witness) 
		- [Parameters](#parameters-5)
		- [Returns](#returns-5)
		- [Example](#example-5)
    - [`cap.get_user_transactions({tokenId, userId, page, witness})`](#capget_user_transactionstokenId-userId-page-witness) 
		- [Parameters](#parameters-6)
		- [Returns](#returns-6)
		- [Example](#example-6)
  - [API](#api)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

⚠️ ⚠️ Library not stable, will stay unstable until **Cap** is finalized ⚠️ ⚠️ 

### Install
```bash
yarn add @psychedelic/cap-js
```

## Usage

### Router Canister

### `cap.get_index_canisters(witness)`
> Return all Cap index canisters

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| witness | [boolean](#boolean) | Certified response |

#### Returns

| Type | Description |
| ---- | ----------- |
| `GetIndexCanistersResponse` | An object returning all index canisters. If witness = `true` the certified response will be appended to the response |

#### Example

```JavaScript
import { cap } from '@psychedelic/cap-js'

const indexCanisters = await cap.get_index_canisters(false);
console.log(indexCanisters);
```
```bash
{
	witness: [] | [Witness];
	canisters: Array<Principal>;
}
```

### `cap.get_token_contract_root_bucket({canister, witness})`
> For a given token contract, return the entry root bucket

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| canister | [Principal](#boolean) | The `canister` Id of the requested root bucket |
| witness | [boolean](#boolean) | Certified response |

#### Returns

| Type | Description |
| ---- | ----------- |
| `GetTokenContractRootBucketResponse` | An object returning root canister for a given token. If witness = `true` the certified response will be appended to the response |

#### Example

```JavaScript
import { cap } from '@psychedelic/cap-js'

const tokenRootBucket = await cap.get_token_contract_root_bucket({
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
 
### `cap.get_user_root_buckets({user, witness})`
> query a users root bucket, each user root bucket exposes an interface to interact with and get transactions

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| user | [Principal](#principal) | The `user` Id of the requested root bucket |
| witness | [boolean](#boolean) | Certified response |

#### Returns

| Type | Description |
| ---- | ----------- |
| `GetUserRootBucketsResponse` | An object returning root canister for a given user. If witness = `true` the certified response will be appended to the response |

#### Example

```JavaScript
import { cap } from '@psychedelic/cap-js'

const userRootBucket = await cap.get_user_root_buckets({
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

### `cap.insert_new_users([options])`
> ToDo

### `cap.install_bucket_code(principal)`
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

### `cap.get_transaction({tokenId, txnId, witness})`
> Return a specifc transaction based on global `txnId` from a token contract (tokenId)

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | [bigint](#bigint) | The `tokenId` of the contract to be queried for the transaction |
| txnId | [bigint](#bigint) | The global txnId of a transaction to return |
| witness | [boolean](#boolean) | Certified response |

#### Returns

| Type | Description |
| ---- | ----------- |
| `GetTransactionResponse` | An object returning either `Delegate` or `Found`. If witness = `true` the certified response will be appended to the response |

#### Example

```JavaScript
import { cap } from '@psychedelic/cap-js'

const transaction = await cap.get_transaction({
	tokenId: "aaaa-aa", 
	txnId: BigInt(1), 
	witness: false,
})
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


### `cap.get_transactions({tokenId, page, witness})`
> Get all transactions for a single token contract

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | [Principal](#principal) | The `tokenId` of the contract to be querid for the transactions |
| page | [number?](#number?) | The optional `number` of the page to query for transctions, each page can hold up to 64 transactions. Defaults to page `0`. |
| witness | [boolean](#boolean) | Certified response |

#### Returns

| Type | Description |
| ---- | ----------- |
| `GetTransactionsResponseBorrowed` | An object returning an array of `data` as well as the page queried. If witness = `true` the certified response will be appended to the response |

#### Example

```JavaScript
import { cap } from '@psychedelic/cap-js'

const tokenTxns = await cap.get_transactions({
 tokenId: "aaaa-aa",
 page: 4,
 witness: false,
});

// or

const tokenTxns = await cap.get_transactions({
 tokenId: "aaaa-aa",
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


### `cap.get_user_transactions({tokenId, userId, page, witness})`
> Get all transactions for the provide `user`

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | [Principal](#principal) | The `tokenId` of the contract to be queried for the transactions |
| user | [Principal](#principal) | The `user` Id of the requested transactions 
| page | [number?](#number?) | The optional `number` of the page to query for transctions, each page can hold up to 64 transactions. Defaults to page `0`. |
| witness | [boolean](#boolean) | Certified response |


#### Returns

| Type | Description |
| ---- | ----------- |
| `GetTransactionsResponseBorrowed` | An object returning an array of `data` as well as the page queried. If witness = `true` the certified response will be appended to the response |


#### Example

```JavaScript
import { cap } from '@psychedelic/cap-js'

const userTxns = await cap.get_user_transactions({
 tokenId: "aaaa-aa",
 userId: "avesb-mgo2l-ds25i-g7kd4-3he5l-z7ary-3biiq-sojiw-xjgbk-ich5l-mae",
 page: 4,
 witness: false,
});

// or

const userTxns = await cap.get_user_transactions({
 tokenId: "aaaa-aa",
 userId: "avesb-mgo2l-ds25i-g7kd4-3he5l-z7ary-3biiq-sojiw-xjgbk-ich5l-mae",
 witness: false,
}); // this will default to page 0

console.log(userTxns);
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

### `cap.get_bucket_for({})`
> ToDo

### `cap.get_next_canisters({})`
> ToDo

### `cap.insert([options])`
> ToDo

  time : () -> (nat64) query;
### `cap.time([options])`
> ToDo

### API

- ToDo
  
## Roadmap

- Cache every endpoitn with Kyasshu

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

  