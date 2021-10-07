import fetch from "node-fetch";
import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

import { routerFactory } from "./router.did.js";
import _ROUTER_SERVICE, {
  GetTokenContractRootBucketArg,
  GetTokenContractRootBucketResponse,
  GetUserRootBucketsArg,
  GetUserRootBucketsResponse,
} from "./router";

import { rootFactory } from "./root.did.js";
import _ROOT_SERVICE, {
  GetTransactionResponse,
  GetTransactionsArg,
  GetTransactionsResponseBorrowed,
  GetUserTransactionsArg,
  WithIdArg,
} from "./root";

export const rootActor = async (): Promise<ActorSubclass<_ROOT_SERVICE>> => {
  const agent = new HttpAgent({ host: "https://ic0.app", fetch });

  if (process.env.NODE_ENV !== "production") {
    agent.fetchRootKey().catch((err) => {
      console.warn(
        "Unable to fetch root key. Check to ensure that your local replica is running"
      );
      console.error(err);
    });
  }

  return Actor.createActor(rootFactory, {
    agent,
    canisterId: "aanaa-xaaaa-aaaah-aaeiq-cai",
  });
};

export const routerActor = async (): Promise<
  ActorSubclass<_ROUTER_SERVICE>
> => {
  const agent = new HttpAgent({ host: "https://ic0.app", fetch });

  if (process.env.NODE_ENV !== "production") {
    agent.fetchRootKey().catch((err) => {
      console.warn(
        "Unable to fetch root key. Check to ensure that your local replica is running"
      );
      console.error(err);
    });
  }

  return Actor.createActor(routerFactory, {
    agent,
    canisterId: "aanaa-xaaaa-aaaah-aaeiq-cai",
  });
};

export const cap = {
  /**
   * Router Canister
   */
  async get_token_contract_root_bucket(
    args: GetTokenContractRootBucketArg
  ): Promise<GetTokenContractRootBucketResponse> {
    return (await routerActor()).get_token_contract_root_bucket(args);
  },
  async get_user_root_buckets(
    args: GetUserRootBucketsArg
  ): Promise<GetUserRootBucketsResponse> {
    return (await routerActor()).get_user_root_buckets(args);
  },

  /**
   * Root Canister
   */
  async get_transaction(args: WithIdArg): Promise<GetTransactionResponse> {
    return (await rootActor()).get_transaction(args);
  },
  async get_transactions(
    args: GetTransactionsArg
  ): Promise<GetTransactionsResponseBorrowed> {
    return (await rootActor()).get_transactions(args);
  },
  async get_user_transactions(
    user: Principal,
    witness: boolean,
    page?: number
  ): Promise<GetTransactionsResponseBorrowed> {
    return (await rootActor()).get_user_transactions({
      ...(page && { page: [page] }),
      user,
      witness,
    } as GetUserTransactionsArg);
  },
};
