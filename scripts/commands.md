# deploy the canister - use this or the 3 commands below
dfx deploy

# create router canister
dfx canister create ic-history-router

# build build canister
dfx build ic-history-router

# install router wasm
dfx canister install ic-history-router

/////////////////////////////////////////

# create root bucket canister
dfx canister --wallet=$(dfx identity get-wallet) call aaaaa-aa create_canister "(record { cycles=(4_000_000_000_000:nat64); controller=(opt principal \"$(dfx identity get-principal)\") })"

# set cap as the controller for the root bucket
dfx canister --wallet=$(dfx identity get-wallet) call aaaaa-aa update_settings "(record { canister_id=(principal \"r7inp-6aaaa-aaaaa-aaabq-cai\"); settings=(record { controller = opt principal \"rrkah-fqaaa-aaaaa-aaaaq-cai\"; null; null; null; }) })"

# Check controller of bucket canister
dfx canister info r7inp-6aaaa-aaaaa-aaabq-cai

# install bucket code
dfx canister call rrkah-fqaaa-aaaaa-aaaaq-cai install_bucket_code "(principal \"r7inp-6aaaa-aaaaa-aaabq-cai\")"

# insert transaction
dfx canister call r7inp-6aaaa-aaaaa-aaabq-cai insert "(record { to=(principal \"avesb-mgo2l-ds25i-g7kd4-3he5l-z7ary-3biiq-sojiw-xjgbk-ich5l-mae\"); fee=(1:nat64); from=(opt principal \"avesb-mgo2l-ds25i-g7kd4-3he5l-z7ary-3biiq-sojiw-xjgbk-ich5l-mae\"); memo=(0:nat32); operation=(variant {\"Approve\"}); caller=(principal \"avesb-mgo2l-ds25i-g7kd4-3he5l-z7ary-3biiq-sojiw-xjgbk-ich5l-mae\"); amount=(10:nat64); })"

# get all transactions
dfx canister call r7inp-6aaaa-aaaaa-aaabq-cai get_transactions "(record {page=(0:nat32); witness=(false:bool)})"
dfx canister call r7inp-6aaaa-aaaaa-aaabq-cai get_transactions "(record {page=null; witness=(false:bool)})"

# Get user transactions
dfx canister call r7inp-6aaaa-aaaaa-aaabq-cai get_user_transactions "(record {user=(principal \"$(dfx identity get-principal)\"); witness=(false:bool)})"

# get user root buckets
dfx canister call ic-history-router get_user_root_buckets "(record { user=(principal \"avesb-mgo2l-ds25i-g7kd4-3he5l-z7ary-3biiq-sojiw-xjgbk-ich5l-mae\"); witness=(false:bool)})"

# Get all root buckets in Cap
dfx canister call ic-history-router get_user_root_buckets "(record { user=(principal \"aaaaa-aa\"); witness=(false:bool)})"

# Index canisters
dfx canister call ic-history-router get_index_canisters "(record {witness=(false:bool)})"

# get_next_canisters
dfx canister call r7inp-6aaaa-aaaaa-aaabq-cai get_next_canisters "(record {witness=(false:bool)})"

# print
dfx canister call ic-history-router print_out "()"

# Contract root buckets
dfx canister call ic-history-router get_token_contract_root_bucket "(record { canister=(principal \"avesb-mgo2l-ds25i-g7kd4-3he5l-z7ary-3biiq-sojiw-xjgbk-ich5l-mae\"); witness=(false:bool)})"

dfx canister --network ic call o3aoo-taaaa-aaaad-qayza-cai get_transactions "(record {page=(0:nat32); witness=(false:bool)})"
