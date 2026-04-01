import { createHttpClient } from "./http.js";

const mockFetch = (body: unknown, options: { status?: number; contentType?: string } = {}) => {
  const { status = 200, contentType = "application/json" } = options;
  const fetchMock = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => contentType },
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(String(body)),
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
};

describe("createHttpClient", () => {
  afterEach(() => {
    vi.resetAllMocks();
    vi.unstubAllGlobals();
  });

  it("resolves paths under urlWithTerm", () => {
    mockFetch([]);
    const client = createHttpClient({
      baseUrl: "https://example.test/sejm/",
      term: 9,
    });
    return client.getResource("MP").then(() => {
      expect(fetch).toHaveBeenCalledWith("https://example.test/sejm/term9/MP", expect.any(Object));
    });
  });

  it("calls fetch with Accept header", async () => {
    mockFetch([]);
    const client = createHttpClient({
      baseUrl: "https://example.test/sejm/",
      term: 10,
    });
    await client.getResource("MP");

    expect(fetch).toHaveBeenCalledWith("https://example.test/sejm/term10/MP", {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: undefined,
    });
  });

  it("appends query params to URL", async () => {
    mockFetch([]);
    const client = createHttpClient({
      baseUrl: "https://example.test/sejm/",
      term: 10,
    });
    await client.getResource("MP", {
      query: { active: true, limit: 10 },
    });

    const calledUrl = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(calledUrl).toContain("active=true");
    expect(calledUrl).toContain("limit=10");
  });

  it("skips undefined query params", async () => {
    mockFetch([]);
    const client = createHttpClient({
      baseUrl: "https://example.test/sejm/",
      term: 10,
    });
    await client.getResource("MP", {
      query: { active: undefined, limit: 10 },
    });

    const calledUrl = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(calledUrl).not.toContain("active");
    expect(calledUrl).toContain("limit=10");
  });

  it("throws on non-ok response", async () => {
    mockFetch({ message: "Not found" }, { status: 404 });
    const client = createHttpClient({
      baseUrl: "https://example.test/sejm",
      term: 10,
    });

    await expect(client.getResource("MP/9999")).rejects.toThrow("failed with status 404");
  });

  it("returns text body when content-type is not JSON", async () => {
    mockFetch("plain text", { contentType: "text/plain" });
    const client = createHttpClient({
      baseUrl: "https://example.test/sejm/",
      term: 3,
    });
    const result = await client.getResource<string>("prints/1");
    expect(result).toBe("plain text");
    expect(fetch).toHaveBeenCalledWith("https://example.test/sejm/term3/prints/1", expect.any(Object));
  });
});
