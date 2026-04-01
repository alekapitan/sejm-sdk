import { createBillsResource } from "../resources/bills.js";
import { createClubsResource } from "../resources/clubs.js";
import { createMPsResource } from "../resources/mps.js";
import { DEFAULT_BASE_URL, DEFAULT_TERM } from "./constants.js";
import { createHttpClient } from "./http.js";
import type { ClientConfig } from "./types.js";

export const createSejmClient = (options?: Partial<ClientConfig>) => {
  const term = options?.term ?? DEFAULT_TERM;
  const baseUrl = options?.baseUrl ?? DEFAULT_BASE_URL;
  const http = createHttpClient({ baseUrl, term });

  return {
    mps: createMPsResource(http),
    clubs: createClubsResource(http),
    bills: createBillsResource(http),
  };
};

export type SejmClient = ReturnType<typeof createSejmClient>;
