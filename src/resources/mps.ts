import type { HttpClient } from "../core/http.js";
import type { RequestOptions } from "../core/types.js";
import type { components } from "../gen/openapi.js";

export type MP = components["schemas"]["MP"];
export type VotingStat = components["schemas"]["VotingStat"];

export type MPsResource = {
  /** GET /sejm/term{term}/MP */
  getAll: (options?: RequestOptions) => Promise<MP[]>;
  /** GET /sejm/term{term}/MP/{id} */
  getById: (id: number, options?: RequestOptions) => Promise<MP>;
  /** GET /sejm/term{term}/MP/{id}/votings/stats */
  getVotingsStatistics: (id: number, options?: RequestOptions) => Promise<VotingStat[]>;
};

export const createMPsResource = (http: HttpClient): MPsResource => {
  const getAll: MPsResource["getAll"] = (options) => {
    return http.getResource<MP[]>("MP", options);
  };

  const getById: MPsResource["getById"] = (id, options) => {
    return http.getResource<MP>(`MP/${id}`, options);
  };

  const getVotingsStatistics: MPsResource["getVotingsStatistics"] = (id, options) => {
    return http.getResource<VotingStat[]>(`MP/${id}/votings/stats`, options);
  };

  return {
    getAll,
    getById,
    getVotingsStatistics,
  };
};
