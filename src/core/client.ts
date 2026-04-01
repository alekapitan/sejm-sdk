import { createBillsResource } from "../resources/bills.js";
import { createClubsResource } from "../resources/clubs.js";
import { createMPsResource } from "../resources/mps.js";
import { createHttpClient } from "./http.js";

export const createSejmClient = () => {
  const http = createHttpClient();

  return {
    mps: createMPsResource(http),
    clubs: createClubsResource(http),
    bills: createBillsResource(http),
  };
};

export type SejmClient = ReturnType<typeof createSejmClient>;