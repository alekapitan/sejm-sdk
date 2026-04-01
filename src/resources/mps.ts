import type { HttpClient } from "../core/http.js";
import type { RequestOptions } from "../core/types.js";
import type { components } from "../gen/openapi.js";

export type MP = components["schemas"]["MP"];
export type MPsOptions = RequestOptions;

export type MPsResource = {
  getAll: (options?: MPsOptions) => Promise<MP[]>;
  getById: (id: number, options?: MPsOptions) => Promise<MP>;
};

export const createMPsResource = (http: HttpClient): MPsResource => {
  const getAll: MPsResource["getAll"] = (options) => {
    return http.getResource<MP[]>("MP", options);
  };

  const getById: MPsResource["getById"] = (id, options?: MPsOptions) => {
    return http.getResource<MP>(`MP/${id}`, options);
  };

  return {
    getAll,
    getById,
  };
};
