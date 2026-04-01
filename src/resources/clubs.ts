import type { HttpClient } from "../core/http.js";
import type { RequestOptions } from "../core/types.js";
import type { components } from "../gen/openapi.js";

export type Club = components["schemas"]["Club"];
export type ClubsOptions = RequestOptions;

export type ClubsResource = {
  getAll: (options?: ClubsOptions) => Promise<Club[]>;
  getById: (id: string, options?: ClubsOptions) => Promise<Club>;
};

export const createClubsResource = (http: HttpClient): ClubsResource => {
  const getAll: ClubsResource["getAll"] = (options) => {
    return http.getResource<Club[]>("clubs", options);
  };

  const getById: ClubsResource["getById"] = (id, options?: ClubsOptions) => {
    return http.getResource<Club>(`clubs/${id}`, options);
  };

  return {
    getAll,
    getById,
  };
};
