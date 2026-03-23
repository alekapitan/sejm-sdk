import { createClubsResource } from "./clubs.js";
import type { HttpClient } from "../core/http.js";
import { CLUB_URL } from "../core/constants.js";

const mockClubs = [
  {
    id: "KPT",
    name: "Klub Parlamentarny Test",
    membersCount: 111,
    email: "klub@kluby.fake.pl",
    fax: "(22) 123-23-34",
    phone: "",
  },
  {
    id: "KT",
    name: "Klub Test",
    membersCount: 222,
    email: "kp@kluby.fake.pl",
    fax: "(22) 123-33-44",
    phone: "",
  },
];

const createMockHttp = (returnValue: unknown): HttpClient => ({
  getResource: vi.fn().mockResolvedValue(returnValue),
});

describe("createClubsResource", () => {
  afterEach(() => vi.resetAllMocks());

  describe("getAll", () => {
    it("returns list of clubs", async () => {
      const http = createMockHttp(mockClubs);
      const clubs = createClubsResource(http);

      const result = await clubs.getAll();

      expect(http.getResource).toHaveBeenCalledWith(CLUB_URL, undefined);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("KPT");
      expect(result[1].id).toBe("KT");
    });

    it("forwards options to http client", async () => {
      const http = createMockHttp(mockClubs);
      const clubs = createClubsResource(http);
      const options = { signal: new AbortController().signal };

      await clubs.getAll(options);

      expect(http.getResource).toHaveBeenCalledWith(CLUB_URL, options);
    });
  });

  describe("getById", () => {
    it("returns a single club", async () => {
      const http = createMockHttp(mockClubs[1]);
      const clubs = createClubsResource(http);

      const result = await clubs.getById("KT");

      expect(http.getResource).toHaveBeenCalledWith(`${CLUB_URL}/KT`, undefined);
      expect(result.id).toBe("KT");
      expect(result.membersCount).toBe(222);
    });
  });
});
