export default {};

// To edit or maintain
export const DFX_JSON_HISTORY_ROUTER_KEY_NAME = "ic-history-router";
const IC_HISTORY_ROUTER_CANISTER_ID_MAINNET = "lj532-6iaaa-aaaah-qcc7a-cai";

// The CanisterInfo is exported to the application
// As such, might require maintenance of `mainnet` canister id
export const CanisterInfo = {
  [DFX_JSON_HISTORY_ROUTER_KEY_NAME]: {
    mainnet: IC_HISTORY_ROUTER_CANISTER_ID_MAINNET,
    local: IC_HISTORY_ROUTER_CANISTER_ID_MAINNET,
  },
};
