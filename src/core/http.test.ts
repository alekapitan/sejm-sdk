import { createHttpClient } from "./http.js";

const mockFetch = (
  body: unknown,
  options: { status?: number; contentType?: string } = {},
) => {
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

  it("calls fetch with correct URL and headers", async () => {
    mockFetch([]);
    const client = createHttpClient();
    await client.getResource("https://api.sejm.gov.pl/sejm/term10/MP");

    expect(fetch).toHaveBeenCalledWith(
      "https://api.sejm.gov.pl/sejm/term10/MP",
      {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: undefined,
      },
    );
  });

  it("appends query params to URL", async () => {
    mockFetch([]);
    const client = createHttpClient();
    await client.getResource("https://api.sejm.gov.pl/sejm/term10/MP", {
      query: { active: true, limit: 10 },
    });

    const calledUrl = (fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string;
    expect(calledUrl).toContain("active=true");
    expect(calledUrl).toContain("limit=10");
  });

  it("skips undefined query params", async () => {
    mockFetch([]);
    const client = createHttpClient();
    await client.getResource("https://api.sejm.gov.pl/sejm/term10/MP", {
      query: { active: undefined, limit: 10 },
    });

    const calledUrl = (fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string;
    expect(calledUrl).not.toContain("active");
    expect(calledUrl).toContain("limit=10");
  });

  it("throws on non-ok response", async () => {
    mockFetch({ message: "Not found" }, { status: 404 });
    const client = createHttpClient();

    await expect(
      client.getResource("https://api.sejm.gov.pl/sejm/term10/MP/9999"),
    ).rejects.toThrow("failed with status 404");
  });

  it("returns text body when content-type is not JSON", async () => {
    mockFetch("plain text", { contentType: "text/plain" });
    const client = createHttpClient();
    const result = await client.getResource<string>("https://api.sejm.gov.pl/");
    expect(result).toBe("plain text");
  });
});
