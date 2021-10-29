import { KyaUrl } from "../../src/config";
import { KyaConnector } from "../../src/kyasshu";

describe("Kyasshu Integration", () => {
  describe("dev", () => {
    let kya: KyaConnector;

    beforeAll(async () => {
      kya = new KyaConnector(KyaUrl("dev"));
    });

    test("request", async () => {
      const LastEvaluatedKey = { data: "dafsd" };

      const result = await kya.request({
        path: `cap/user/txns/zxt4e-ian3w-g4ll2-3n5mz-lfqkc-eyj7k-yg6jl-rsbud-f6sft-zdfq3-pae`,
        params: [LastEvaluatedKey],
      });
    });
  });

  describe("prod", () => {
    let kya: KyaConnector;

    beforeAll(async () => {
      kya = new KyaConnector(KyaUrl("prod"));
    });

    test("request", async () => {
      const LastEvaluatedKey = { data: "dafsd" };

      const result = await kya.request({
        path: `cap/user/txns/zxt4e-ian3w-g4ll2-3n5mz-lfqkc-eyj7k-yg6jl-rsbud-f6sft-zdfq3-pae`,
        params: [LastEvaluatedKey],
      });
    });
  });
});
