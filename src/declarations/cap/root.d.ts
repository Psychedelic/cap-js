import type { Principal } from "@dfinity/principal";

export interface Event {
  to: Principal;
  fee: bigint;
  from: [] | [Principal];
  memo: number;
  time: bigint;
  operation: Operation;
  caller: Principal;
  amount: bigint;
}
export interface GetBucketResponse {
  witness: [] | [Witness];
  canister: Principal;
}
export interface GetNextCanistersResponse {
  witness: [] | [Witness];
  canisters: Array<Principal>;
}
export type GetTransactionResponse =
  | {
      Delegate: [Principal, [] | [Witness]];
    }
  | { Found: [[] | [Event], [] | [Witness]] };
export interface GetTransactionsArg {
  page: [] | [number];
  witness: boolean;
}
export interface GetTransactionsResponseBorrowed {
  data: Array<Event>;
  page: number;
  witness: [] | [Witness];
}
export interface GetUserTransactionsArg {
  page: [] | [number];
  user: Principal;
  witness: boolean;
}
export interface IndefiniteEvent {
  to: Principal;
  fee: bigint;
  from: [] | [Principal];
  memo: number;
  operation: Operation;
  caller: Principal;
  amount: bigint;
}
export type Operation =
  | { Approve: null }
  | { Burn: null }
  | { Mint: null }
  | { Transfer: null };
export interface WithIdArg {
  id: bigint;
  witness: boolean;
}
export interface WithWitnessArg {
  witness: boolean;
}
export interface Witness {
  certificate: Array<number>;
  tree: Array<number>;
}
// eslint-disable-next-line @typescript-eslint/naming-convention
export default interface _SERVICE {
  get_bucket_for: (arg_0: WithIdArg) => Promise<GetBucketResponse>;
  get_next_canisters: (
    arg_0: WithWitnessArg
  ) => Promise<GetNextCanistersResponse>;
  get_transaction: (arg_0: WithIdArg) => Promise<GetTransactionResponse>;
  get_transactions: (
    arg_0: GetTransactionsArg
  ) => Promise<GetTransactionsResponseBorrowed>;
  get_user_transactions: (
    arg_0: GetUserTransactionsArg
  ) => Promise<GetTransactionsResponseBorrowed>;
  insert: (arg_0: IndefiniteEvent) => Promise<bigint>;
  time: () => Promise<bigint>;
}
