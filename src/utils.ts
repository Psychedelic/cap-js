import { Principal } from "@dfinity/principal";
import { Event, DetailValue } from "./declarations/cap/root";

type DetailType =
  | Principal
  | bigint
  | boolean
  | string
  | number
  | Array<number>
  | Array<DetailType>;
type PrettyDetail = { [key: string]: DetailType };
type DetailVector = { Vec: Array<DetailValue> };
type GeneralValue = { [key: string]: any };

const decodeDetailValue = (value: DetailValue): DetailType => {
  const type = Object.keys(value)?.[0];
  switch (type) {
    case "Vec":
      return (value as DetailVector)?.["Vec"]?.map(decodeDetailValue);
    case "True":
      return true;
    case "False":
      return false;
    default:
      return (value as GeneralValue)?.[type];
  }
};

export const prettifyCapTransactions = (transaction: Event) => {
  const details = transaction?.details?.reduce<PrettyDetail>(
    (acum, [key, value]) => ({
      ...acum,
      [key]: decodeDetailValue(value),
    }),
    {} as PrettyDetail
  );
  return {
    details,
    to: details?.to,
    from: details?.from,
    caller: transaction.caller,
    operation: transaction.operation,
    time: transaction.time,
  };
};
