import type { ClientConfig, RequestOptions } from "./types.js";

type QueryParams = Record<string, string | number | boolean | undefined>;

export type HttpClient = {
  getResource: <T>(path: string, options?: RequestOptions<QueryParams>) => Promise<T>;
};

const appendQueryParams = (url: URL, query: QueryParams): string => {
  Object.entries(query).forEach(([key, value]) => {
    if (value != null) url.searchParams.set(key, String(value));
  });
  return url.toString();
};

export const createHttpClient = (config: ClientConfig): HttpClient => {
  const baseUrl = new URL(config.baseUrl);
  if (!baseUrl.pathname.endsWith("/")) {
    baseUrl.pathname += "/";
  }

  const termUrl = new URL(`term${config.term}/`, baseUrl);

  const getResource = async <T>(path: string, options?: RequestOptions<QueryParams>): Promise<T> => {
    const url = new URL(path, termUrl);
    const finalUrl = options?.query ? appendQueryParams(url, options.query) : url.href;

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
      throw new Error(`Request ${finalUrl} failed with status ${response.status}`);
    }

    return body as T;
  };

  return { getResource };
};
