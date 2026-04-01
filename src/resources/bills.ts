import type { HttpClient, RequestOptions } from "../core/http.js";
import type { components } from "../gen/openapi.js";
import { BILLS_URL } from "../core/constants.js";
import type { QueryParamsDynamic } from "../core/types.js";

export type Bill = components["schemas"]["Bill"];
export type BillsOptions = RequestOptions<QueryParamsDynamic<"/sejm/term{term}/bills">>;

export type BillsResource = {
  /**
   * GET /sejm/term10/bills
   */
  getAll: (options?: BillsOptions) => Promise<Bill[]>;
};

export const createBillsResource = (http: HttpClient): BillsResource => {
  const getAll: BillsResource["getAll"] = (options) => {
    return http.getResource<Bill[]>(BILLS_URL, options);
  };

  return {
    getAll,
  };
};
