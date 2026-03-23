import type { HttpClient, RequestOptions } from "../core/http.js";
import type { components } from "../gen/openapi.js";
import { CLUB_URL } from "../core/constants.js";

export type Club = components["schemas"]["Club"];

export type ClubsResource = {
  /**
   * GET /sejm/term10/clubs
   */
  getAll: (options?: RequestOptions) => Promise<Club[]>;

  /**
   * GET /sejm/term10/clubs/{id}
   */
  getById: (id: string, options?: RequestOptions) => Promise<Club>;
};

export const createClubsResource = (http: HttpClient): ClubsResource => {
  const getAll: ClubsResource["getAll"] = (options) => {
    return http.getResource<Club[]>(CLUB_URL, options);
  };

  const getById: ClubsResource["getById"] = (id, options) => {
    return http.getResource<Club>(`${CLUB_URL}/${id}`, options);
  };

  return {
    getAll,
    getById,
  };
};