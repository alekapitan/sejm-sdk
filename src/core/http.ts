export type QueryParams = Record<string, string | number | boolean | undefined>;

export type RequestOptions = {
  query?: QueryParams;
  headers?: HeadersInit;
  signal?: AbortSignal;
};

export type HttpClient = {
  getResource: <T>(url: string, options?: RequestOptions) => Promise<T>;
};

const appendQueryParams = (url: string, query: QueryParams): string => {
  const u = new URL(url);
  Object.entries(query).forEach(([key, value]) => {
    if (value != null) u.searchParams.set(key, String(value));
  });
  return u.toString();
}; 

export const createHttpClient = (): HttpClient => {
  const getResource = async <T>(url: string, options?: RequestOptions): Promise<T> => {
    const finalUrl = options?.query ? appendQueryParams(url, options.query) : url;

    const response = await fetch(finalUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...options?.headers,
      },
      signal: options?.signal,
    });

    const contentType = response.headers.get("content-type") ?? "";
    const body: unknown = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      throw new Error(`Request ${finalUrl} failed with status ${response.status}`);
    }

    return body as T;
  };

  return { getResource };
};