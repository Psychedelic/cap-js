export const rootFactory = ({ IDL }: { IDL: any }) => {
  const WithIdArg = IDL.Record({ id: IDL.Nat64, witness: IDL.Bool });
  const Witness = IDL.Record({
    certificate: IDL.Vec(IDL.Nat8),
    tree: IDL.Vec(IDL.Nat8),
  });
  const GetBucketResponse = IDL.Record({
    witness: IDL.Opt(Witness),
    canister: IDL.Principal,
  });
  const WithWitnessArg = IDL.Record({ witness: IDL.Bool });
  const GetNextCanistersResponse = IDL.Record({
    witness: IDL.Opt(Witness),
    canisters: IDL.Vec(IDL.Principal),
  });
  const Operation = IDL.Variant({
    Approve: IDL.Null,
    Burn: IDL.Null,
    Mint: IDL.Null,
    Transfer: IDL.Null,
  });
  const Event = IDL.Record({
    to: IDL.Principal,
    fee: IDL.Nat64,
    from: IDL.Opt(IDL.Principal),
    memo: IDL.Nat32,
    time: IDL.Nat64,
    operation: Operation,
    caller: IDL.Principal,
    amount: IDL.Nat64,
  });
  const GetTransactionResponse = IDL.Variant({
    Delegate: IDL.Tuple(IDL.Principal, IDL.Opt(Witness)),
    Found: IDL.Tuple(IDL.Opt(Event), IDL.Opt(Witness)),
  });
  const GetTransactionsArg = IDL.Record({
    page: IDL.Opt(IDL.Nat32),
    witness: IDL.Bool,
  });
  const GetTransactionsResponseBorrowed = IDL.Record({
    data: IDL.Vec(Event),
    page: IDL.Nat32,
    witness: IDL.Opt(Witness),
  });
  const GetUserTransactionsArg = IDL.Record({
    page: IDL.Opt(IDL.Nat32),
    user: IDL.Principal,
    witness: IDL.Bool,
  });
  const IndefiniteEvent = IDL.Record({
    to: IDL.Principal,
    fee: IDL.Nat64,
    from: IDL.Opt(IDL.Principal),
    memo: IDL.Nat32,
    operation: Operation,
    caller: IDL.Principal,
    amount: IDL.Nat64,
  });
  return IDL.Service({
    get_bucket_for: IDL.Func([WithIdArg], [GetBucketResponse], ["query"]),
    get_next_canisters: IDL.Func(
      [WithWitnessArg],
      [GetNextCanistersResponse],
      ["query"]
    ),
    get_transaction: IDL.Func([WithIdArg], [GetTransactionResponse], ["query"]),
    get_transactions: IDL.Func(
      [GetTransactionsArg],
      [GetTransactionsResponseBorrowed],
      ["query"]
    ),
    get_user_transactions: IDL.Func(
      [GetUserTransactionsArg],
      [GetTransactionsResponseBorrowed],
      ["query"]
    ),
    insert: IDL.Func([IndefiniteEvent], [IDL.Nat64], ["query"]),
    time: IDL.Func([], [IDL.Nat64], ["query"]),
  });
};
export const init = () => [];
