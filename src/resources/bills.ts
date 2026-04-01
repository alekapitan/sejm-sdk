import type { HttpClient } from "../core/http.js";
import type { RequestOptions } from "../core/types.js";
import type { components } from "../gen/openapi.js";
import type { QueryParamsDynamic } from "../core/types.js";

export type Bill = components["schemas"]["Bill"];
export type BillsOptions = RequestOptions<QueryParamsDynamic<"/sejm/term{term}/bills">>;

export type BillsResource = {
  /**
   * Returns a paginated list of bills.
   * Use `limit` and `offset` to control pagination.
   */
  list: (options?: BillsOptions) => Promise<Bill[]>;
};

export const createBillsResource = (http: HttpClient): BillsResource => {
  const list: BillsResource["list"] = (options) => {
    return http.getResource<Bill[]>("bills", options);
  };

  return { list };
};
