import type { HttpClient } from "../core/http.js";
import type { RequestOptions } from "../core/types.js";
import type { components } from "../gen/openapi.js";
import type { QueryParamsDynamic } from "../core/types.js";

export type Bill = components["schemas"]["Bill"];
export type BillsOptions = RequestOptions<QueryParamsDynamic<"/sejm/term{term}/bills">>;

export type BillsResource = {
  getAll: (options?: BillsOptions) => Promise<Bill[]>;
};

export const createBillsResource = (http: HttpClient): BillsResource => {
  const getAll: BillsResource["getAll"] = (options) => {
    return http.getResource<Bill[]>("bills", options);
  };

  return {
    getAll,
  };
};
