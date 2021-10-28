export default {};

//kyasshu
export const KyaUrl = (stage: string = "prod") => {
  const resp: { [key: string]: string } = {
    prod: "https://kyasshu-prod.fleek.co",
    dev: "https://kyasshu-dev.fleek.co",
  };

  return resp[stage];
};

// To edit or maintain
export const DFX_JSON_HISTORY_ROUTER_KEY_NAME = "ic-history-router";
const IC_HISTORY_ROUTER_CANISTER_ID_MAINNET = "rrkah-fqaaa-aaaaa-aaaaq-cai";

// The CanisterInfo is exported to the application
// As such, might require maintenance of `mainnet` canister id
export const CanisterInfo = {
  [DFX_JSON_HISTORY_ROUTER_KEY_NAME]: {
    mainnet: IC_HISTORY_ROUTER_CANISTER_ID_MAINNET,
    local: IC_HISTORY_ROUTER_CANISTER_ID_MAINNET,
  },
};
