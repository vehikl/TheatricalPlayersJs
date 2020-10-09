import IPerformance from "./IPerformance";

export default interface IInvoice {
  "customer": string,
  "performances": IPerformance[]
}
