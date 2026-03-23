import type { HttpClient, RequestOptions } from "../core/http.js";
import type { components } from "../gen/openapi.js";
import { MP_URL } from "../core/constants.js";

export type MP = components["schemas"]["MP"];

export type MPsResource = {
  /**
   * GET /sejm/term10/MP
   */
  getAll: (options?: RequestOptions) => Promise<MP[]>;

  /**
   * GET /sejm/term10/MP/{id}
   */
  getById: (id: number, options?: RequestOptions) => Promise<MP>;
};

export const createMPsResource = (http: HttpClient): MPsResource => {
  const getAll: MPsResource["getAll"] = (options) => {
    return http.getResource<MP[]>(MP_URL, options);
  };

  const getById: MPsResource["getById"] = (id, options) => {
    return http.getResource<MP>(`${MP_URL}/${id}`, options);
  };

  return {
    getAll,
    getById,
  };
};