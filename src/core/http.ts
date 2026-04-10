import type { ClientConfig, RequestOptions } from "./types.js";

type QueryParams = Record<string, string | number | boolean | undefined>;

export type HttpClient = {
  getResource: <T>(path: string, options?: RequestOptions<QueryParams>) => Promise<T>;
};

const appendQueryParams = (url: URL, query: QueryParams): void => {
  Object.entries(query).forEach(([key, value]) => {
    if (value != null) url.searchParams.set(key, String(value));
  });
};

export const createHttpClient = (config: ClientConfig): HttpClient => {
  const baseUrl = new URL(config.baseUrl);
  if (!baseUrl.pathname.endsWith("/")) {
    baseUrl.pathname += "/";
  }

  const termUrl = new URL(`term${config.term}/`, baseUrl);

  const getResource = async <T>(path: string, options?: RequestOptions<QueryParams>): Promise<T> => {
    const url = new URL(path, termUrl);
    if (options?.query) appendQueryParams(url, options.query);
    const finalUrl = url.href;

    const response = await fetch(finalUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...options?.headers,
      },
      signal: options?.signal,
    });

    const contentType = response.headers.get("content-type") ?? "";
    const body: unknown = contentType.includes("application/json") ? await response.json() : await response.text();

    if (!response.ok) {
      const detail = typeof body === "string" ? body : JSON.stringify(body);
      throw new Error(`Request failed ${response.status} ${response.statusText} — ${finalUrl}\n${detail}`);
    }

    return body as T;
  };

  return { getResource };
};
