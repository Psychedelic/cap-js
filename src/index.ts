import fetch from "cross-fetch";
import {
  Actor,
  ActorSubclass,
  HttpAgent,
  HttpAgentOptions,
} from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

import { KyaConnector } from "./kyasshu";
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
  DetailValue,
  EventStatus,
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

import {
  CanisterInfo,
  KyaUrl,
  DFX_JSON_HISTORY_ROUTER_KEY_NAME,
} from "./config";
import { KyaStage } from "./types";

export { CanisterInfo };

export const Hosts = {
  mainnet: "https://ic0.app",
  local: "http://localhost:8000",
};

type IdlFactory = ({ IDL }: { IDL: any }) => any;

export interface ActorParams {
  host: string;
  canisterId: string;
  idlFactory: IdlFactory;
}

export class CapBase<T> {
  public actor: ActorSubclass<T>;

  public cache: KyaConnector | undefined;

  constructor(actor: ActorSubclass<T>, cache?: KyaConnector) {
    this.actor = actor;
    if (cache) {
      this.cache = cache;
    }
  }

  private static createActor<T>({
    host,
    canisterId,
    idlFactory,
  }: {
    host: string;
    canisterId: string;
    idlFactory: IdlFactory;
  }): ActorSubclass<T> {
    const agent = new HttpAgent({
      host,
      fetch,
    } as unknown as HttpAgentOptions);
    if (process.env.NODE_ENV !== "production") {
      try {
        agent.fetchRootKey();
      } catch (err) {
        console.warn(
          "Oops! Unable to fetch root key, is the local replica running?"
        );
        console.error(err);
      }
    }

    return Actor.createActor(idlFactory, {
      agent,
      canisterId,
    });
  }

  public static inititalise<T>({ host, canisterId, idlFactory }: ActorParams) {
    return (() => {
      const actor = CapBase.createActor<T>({
        host,
        canisterId,
        idlFactory,
      });

      return actor;
    })();
  }
}

export class CapRouter extends CapBase<_ROUTER_SERVICE> {
  public static init({
    host = Hosts.mainnet,
    canisterId = CanisterInfo[DFX_JSON_HISTORY_ROUTER_KEY_NAME].mainnet,
  }: {
    host?: string;
    canisterId?: string;
  }) {
    return (() => {
      const actor = CapBase.inititalise<_ROUTER_SERVICE>({
        host,
        canisterId,
        idlFactory: routerFactory,
      });

      const cap = new CapRouter(actor);

      return cap;
    })();
  }

  public async get_index_canisters({
    witness = false,
  }: {
    witness?: boolean;
  }): Promise<GetIndexCanistersResponse> {
    return this.actor.get_index_canisters({
      witness,
    });
  }

  public async get_token_contract_root_bucket({
    tokenId,
    witness = false,
  }: {
    tokenId: Principal;
    witness?: boolean;
  }): Promise<GetTokenContractRootBucketResponse> {
    return this.actor.get_token_contract_root_bucket({
      canister: tokenId,
      witness,
    });
  }

  public async get_user_root_buckets({
    user,
    witness = false,
  }: {
    user: Principal;
    witness?: boolean;
  }): Promise<GetUserRootBucketsResponse> {
    return this.actor.get_user_root_buckets({
      user,
      witness,
    });
  }

  public async insert_new_users(
    contractId: Principal,
    users: Principal[]
  ): Promise<undefined> {
    return this.actor.insert_new_users(contractId, users);
  }

  public async install_bucket_code(canisterId: Principal) {
    return this.actor.install_bucket_code(canisterId);
  }
}

export class CapRoot extends CapBase<_ROOT_SERVICE> {
  public static init({
    host = Hosts.mainnet,
    canisterId,
  }: {
    host?: string;
    canisterId: string;
  }) {
    return (() => {
      const actor = CapBase.inititalise<_ROOT_SERVICE>({
        host,
        canisterId,
        idlFactory: rootFactory,
      });

      // ToDo cache flag
      const cache = new KyaConnector(KyaUrl("dev"));
      const cap = new CapRoot(actor, cache);

      return cap;
    })();
  }

  public async get_transaction(
    id: bigint,
    witness = false
  ): Promise<GetTransactionResponse> {
    return this.actor.get_transaction({
      id,
      witness,
    });
  }

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

  public async get_user_transactions({
    page,
    user,
    witness = false,
  }: {
    page?: number;
    user: Principal;
    witness?: boolean;
  }): Promise<GetTransactionsResponseBorrowed> {
    return this.actor.get_user_transactions({
      page: page ? [page] : [],
      user,
      witness,
    });
  }

  public async insert({
    status,
    operation,
    details,
    caller,
  }: IndefiniteEvent): Promise<bigint> {
    return this.actor.insert({
      status,
      operation,
      details,
      caller,
    });
  }
}

export class CapCache extends CapBase<_ROOT_SERVICE> {
  constructor(cacheStage?: KyaStage) {
    const actor = CapBase.inititalise<_ROOT_SERVICE>({
      host: Hosts.mainnet,
      canisterId: CanisterInfo[DFX_JSON_HISTORY_ROUTER_KEY_NAME].mainnet,
      idlFactory: rootFactory,
    });

    const cache = new KyaConnector(KyaUrl(cacheStage));

    super(actor, cache);
  }

  public async get_all_user_transactions({
    user,
    LastEvaluatedKey,
  }: {
    user: Principal;
    LastEvaluatedKey?: unknown;
  }): Promise<unknown> {
    return this.cache?.request({
      path: `cap/user/txns/${user.toString()}`,
      params: [LastEvaluatedKey],
    });
  }
}
