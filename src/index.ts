import fetch from "cross-fetch";
import {
  Actor,
  ActorSubclass,
  HttpAgent,
  HttpAgentOptions,
} from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

import _ROUTER_SERVICE from "./declarations/cap/router";
import _ROOT_SERVICE from "./declarations/cap/root";
import { routerFactory } from "./declarations/cap/router.did.js";
import { rootFactory } from "./declarations/cap/root.did.js";

import {
  GetUserRootBucketsResponse,
  GetTokenContractRootBucketResponse,
  GetTransactionResponse,
  GetTransactionsResponseBorrowed,
  GetIndexCanistersResponse,
  IndefiniteEvent,
} from "./declarations/cap";

export {
  Root,
  Event,
  GetBucketResponse,
  GetNextCanistersResponse,
  GetTransactionResponse,
  GetTransactionsArg,
  GetTransactionsResponseBorrowed,
  GetUserTransactionsArg,
  IndefiniteEvent,
  Operation,
  WithIdArg,
  WithWitnessArg,
  Witness,
  Router,
  GetIndexCanistersResponse,
  GetTokenContractRootBucketArg,
  GetTokenContractRootBucketResponse,
  GetUserRootBucketsArg,
  GetUserRootBucketsResponse,
} from "./declarations/cap";

export const Hosts = {
  mainnet: 'https://ic0.app',
  local: 'http://localhost:8000',
};

// TODO: Temporary used as a reference while refactoring
export const Canisters = {
  mainnet: "rrkah-fqaaa-aaaaa-aaaaq-cai",
  local: "rrkah-fqaaa-aaaaa-aaaaq-cai",
}

type IdlFactory = ({ IDL }: { IDL: any; }) => any;

export interface ActorParams {
  host: string,
  canisterId: string,
  idlFactory: IdlFactory,
}

export class CapBase <T>{
  public actor: ActorSubclass<T>;

  constructor(
    actor: ActorSubclass<T>,
  ) {
    this.actor = actor;
  }

  private static async createActor<T>({
    host,
    canisterId,
    idlFactory,
  }: {
    host: string,
    canisterId: string,
    idlFactory: IdlFactory,
  }): Promise<ActorSubclass<T>> {
    const agent = new HttpAgent({
      host,
      fetch,
    } as unknown as HttpAgentOptions);

    if (process.env.NODE_ENV !== "production") {
      try {
        agent.fetchRootKey();
      } catch (err) {
        console.warn('Oops! Unable to fetch root key, is the local replica running?');
        console.error(err);
      }
    }

    return Actor.createActor(idlFactory, {
      agent,
      canisterId,
    });
  }

  public static inititalise <T>({
    host,
    canisterId,
    idlFactory,
  }: ActorParams) {
    return (async () => {
      const actor = await CapBase.createActor<T>({
        host,
        canisterId,
        idlFactory,
      });

      return actor;
    })();
  }
}

export class CapRouter extends CapBase <_ROUTER_SERVICE>{
  public static init({
    host = Hosts.mainnet,
    canisterId = Canisters.mainnet,
  }: {
    host?: string,
    canisterId: string,
  }) {
    return (async () => {
      const actor = await CapBase.inititalise<_ROUTER_SERVICE>({
        host,
        canisterId,
        idlFactory: routerFactory,
      });

      const cap = new CapRouter(
        actor,
      );

      return cap;
    })();
  }

  // TODO: Isn't it best to use the Actor directly? no point on this method wrappers
  public async get_index_canisters({
    witness = false,
  }: {
    witness?: boolean,
  }): Promise<GetIndexCanistersResponse> {
    return this.actor.get_index_canisters({
      witness,
    })
  }

  // TODO: Isn't it best to use the Actor directly? no point on this method wrappers
  public async get_token_contract_root_bucket({
    tokenId,
    witness,
  }: {
    tokenId: Principal;
    witness: boolean;
  }): Promise<GetTokenContractRootBucketResponse> {
    return this.actor.get_token_contract_root_bucket({
      canister: tokenId,
      witness,
    });
  }

  // TODO: Isn't it best to use the Actor directly? no point on this method wrappers
  public async get_user_root_buckets({
    user,
    witness,
  }: {
    user: Principal,
    witness: boolean,
  }): Promise<GetUserRootBucketsResponse> {
    return this.actor.get_user_root_buckets({
      user,
      witness,
    });
  }

  // TODO: Isn't it best to use the Actor directly? no point on this method wrappers
  public async insert_new_users(
    contractId: Principal,
    users: Principal[],
  ): Promise<undefined> {
    return this.actor.insert_new_users(contractId, users);
  }

  // TODO: Isn't it best to use the Actor directly? no point on this method wrappers
  public async install_bucket_code(canisterId: Principal) {
    return this.actor.install_bucket_code(canisterId);
  }
}

export class CapRoot extends CapBase <_ROOT_SERVICE>{
  public static init({
    host = Hosts.mainnet,
    canisterId,
  }: {
    host?: string,
    canisterId: string,
  }) {
    return (async () => {
      const actor = await CapBase.inititalise<_ROOT_SERVICE>({
        host,
        canisterId,
        idlFactory: rootFactory,
      });

      const cap = new CapRoot(
        actor,
      );

      return cap;
    })();
  }

  // TODO: Best to use the Actor direclty, no point on this method wrappers
  public async get_transaction(
    id: bigint,
    witness: boolean
  ): Promise<GetTransactionResponse> {
    return this.actor.get_transaction({
      id,
      witness,
    });
  }

  // TODO: Best to use the Actor direclty, no point on this method wrappers
  public async get_transactions({
    witness = false,
    page,
  }: {
    witness?: boolean;
    page?: number;
  }): Promise<GetTransactionsResponseBorrowed> {
    return this.actor.get_transactions({
      page: page ? [page] : [],
      witness,
    });
  }

  // TODO: Best to use the Actor direclty, no point on this method wrappers
  public async get_user_transactions({
    page,
    user,
    witness = false,
  }: {
    page?: number,
    user: Principal,
    witness?: boolean,
  }): Promise<GetTransactionsResponseBorrowed> {
    return this.actor.get_user_transactions({
      page: page ? [page] : [],
      user,
      witness,
    })
  }

  // TODO: Best to use the Actor direclty, no point on this method wrappers
  public async insert({
    to,
    fee,
    from,
    memo,
    operation,
    caller,
    amount,
  }: IndefiniteEvent): Promise<bigint> {
    return this.actor.insert({
      to,
      fee,
      from,
      memo,
      operation,
      caller,
      amount,
    })
  }
}
