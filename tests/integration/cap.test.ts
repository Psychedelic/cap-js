import { Principal } from "@dfinity/principal";
import { CapCache, CapRoot, CapRouter } from "../../src";

const getCapRouterInstance = async ({
  canisterId,
  host,
}: {
  canisterId: string;
  host: string;
}) =>
  CapRouter.init({
    host,
    canisterId,
  });

const getCapRootInstance = async ({
  canisterId,
  host,
}: {
  canisterId: string;
  host: string;
}) =>
  CapRoot.init({
    host,
    canisterId,
  });

describe("Cap Integration", () => {
  let capRouter: CapRouter;

  beforeAll(async () => {
    capRouter = await getCapRouterInstance({
      canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
      host: "http://localhost:8000",
    });
  });

  describe("Cap Router", () => {
    test("some test", async () => {});
  });

  describe("Cap Root", () => {
    let capRoot: CapRoot;

    beforeAll(async () => {
      capRoot = await getCapRootInstance({
        canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
        host: "http://localhost:8000",
      });
    });

    test("some test", async () => {});
  });

  describe("Cap Cache", () => {
    describe("dev", () => {
      let capCache: CapCache;

      beforeAll(async () => {
        capCache = new CapCache("dev");
      });

      test("get_all_user_transactions", async () => {
        const result = await capCache.get_all_user_transactions({
          user: Principal.from(
            "zxt4e-ian3w-g4ll2-3n5mz-lfqkc-eyj7k-yg6jl-rsbud-f6sft-zdfq3-pae"
          ),
        });
      });
    });

    describe("prod", () => {
      let capCache: CapCache;

      beforeAll(async () => {
        capCache = new CapCache();
      });

      test("get_all_user_transactions", async () => {
        const result = await capCache.get_all_user_transactions({
          user: Principal.from(
            "zxt4e-ian3w-g4ll2-3n5mz-lfqkc-eyj7k-yg6jl-rsbud-f6sft-zdfq3-pae"
          ),
        });
      });
    });
  });
});
