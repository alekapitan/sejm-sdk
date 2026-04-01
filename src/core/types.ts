import type { paths } from "../gen/openapi.js";

export type ClientConfig = {
  baseUrl: string | URL;
  term: number;
};

export type QueryParamsDynamic<Path extends keyof paths> = paths[Path]["get"] extends {
  parameters: { query?: infer Q };
}
  ? NonNullable<Q>
  : never;

export type RequestOptions<TQuery = never> = {
  headers?: HeadersInit;
  signal?: AbortSignal;
} & ([TQuery] extends [never] ? { query?: never } : { query?: TQuery });
