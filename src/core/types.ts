import type { paths } from "../gen/openapi.js";

export type QueryParamsDynamic<Path extends keyof paths> =
  paths[Path]["get"] extends { parameters: { query?: infer Q } }
    ? NonNullable<Q>
    : never;
