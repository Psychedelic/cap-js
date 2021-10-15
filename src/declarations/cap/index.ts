import fetch from "cross-fetch";
import { Actor, ActorSubclass, HttpAgent, HttpAgentOptions } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

import { routerFactory } from "./router.did.js";
import _ROUTER_SERVICE, {
  GetTokenContractRootBucketResponse,
  GetUserRootBucketsResponse,
} from "./router";

import { rootFactory } from "./root.did.js";
import _ROOT_SERVICE, {
  GetTransactionResponse,
  GetTransactionsArg,
  GetTransactionsResponseBorrowed,
  GetUserTransactionsArg,
} from "./root";

export const rootActor = async (
  canisterId: Principal
): Promise<ActorSubclass<_ROOT_SERVICE>> => {
  // const agent = new HttpAgent({ host: "https://ic0.app", fetch });
  const agent = new HttpAgent({
    host: "http://localhost:8000",
    fetch,
  } as unknown as HttpAgentOptions);

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
    canisterId,
  });
};

export const routerActor = async (): Promise<
  ActorSubclass<_ROUTER_SERVICE>
> => {
  // const agent = new HttpAgent({ host: "https://ic0.app", fetch });
  const agent = new HttpAgent({
    host: "http://localhost:8000",
    fetch,
  } as unknown as HttpAgentOptions);

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
    canisterId: "rrkah-fqaaa-aaaaa-aaaaq-cai",
  });
};

export const cap = {
  /**
   * Router Canister
   */
  async get_token_contract_root_bucket({
    tokenId,
    witness,
  }: {
    tokenId: Principal;
    witness: boolean;
  }): Promise<GetTokenContractRootBucketResponse> {
    return (await routerActor()).get_token_contract_root_bucket({
      canister: tokenId,
      witness,
    });
  },
  async get_user_root_buckets({
    user,
    witness,
  }: {
    user: string,
    witness: boolean,
  }): Promise<GetUserRootBucketsResponse> {
    return (await routerActor()).get_user_root_buckets({
      user: Principal.fromText(user),
      witness,
    });
  },

  /**
   * Root Canister
   */
  async get_transaction(
    tokenId: Principal,
    txnId: bigint,
    witness: boolean
  ): Promise<GetTransactionResponse> {
    return (await rootActor(tokenId)).get_transaction({
      id: txnId,
      witness,
    });
  },
  async get_transactions({
    tokenId,
    witness,
    page,
  }: {
    tokenId: Principal;
    witness: boolean;
    page?: number;
  }): Promise<GetTransactionsResponseBorrowed> {
    return (await rootActor(tokenId)).get_transactions({
      page: page ? [page] : [],
      witness,
    } as GetTransactionsArg);
  },
  async get_user_transactions({
    tokenId,
    userId,
    page = 0,
    witness,
  }: {
    tokenId: Principal;
    userId: Principal;
    page?: number;
    witness: boolean;
  }): Promise<GetTransactionsResponseBorrowed> {
    return (await rootActor(tokenId)).get_user_transactions(
      {
        page: page ? [page] : [],
        user: userId,
        witness,
      } as GetUserTransactionsArg
    );
  },
};
