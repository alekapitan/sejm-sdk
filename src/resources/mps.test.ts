import { createMPsResource, MP } from "./mps.js";
import type { HttpClient } from "../core/http.js";
import { MP_URL } from "../core/constants.js";

const mockMPs: MP[] = [
  {
    accusativeName: "Annę Kowalską",
    active: true,
    birthDate: "1991-11-11",
    birthLocation: "Toruń",
    club: "KTP",
    districtName: "Toruń",
    districtNum: 1,
    educationLevel: "wyższe",
    email: "anna.kowalska@fake-mail-in-test.pl",
    firstLastName: "Anna Kowalska",
    firstName: "Anna",
    genitiveName: "Anny Kowalskiej",
    id: 95,
    lastFirstName: "Kowalska Anna",
    lastName: "Kowalska",
    numberOfVotes: 55553,
    profession: "prawnik",
    secondName: "Maria",
    voivodeship: "kujawsko-pomorskie",
  },
  {
    id: 58,
    firstLastName: "John Czech",
    firstName: "John",
    lastName: "Cz",
    club: "KT",
    active: true,
    districtName: "Warszawa",
    districtNum: 32,
    birthDate: "1965-05-05",
    birthLocation: "Warszawa",
    educationLevel: "wyższe",
    email: "John.Czech@fake-mail-in-test.pl",
    numberOfVotes: 22222,
    profession: "politolog",
    voivodeship: "świętokrzyskie",
  },
];

const createMockHttp = (returnValue: unknown): HttpClient => ({
  getResource: vi.fn().mockResolvedValue(returnValue),
});

describe("createMPsResource", () => {
  afterEach(() => vi.resetAllMocks());

  describe("getAll", () => {
    it("returns list of MPs", async () => {
      const http = createMockHttp(mockMPs);
      const mps = createMPsResource(http);

      const result = await mps.getAll();

      expect(http.getResource).toHaveBeenCalledWith(MP_URL, undefined);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(95);
      expect(result[1].club).toBe("KT");
    });

    it("forwards options to http client", async () => {
      const http = createMockHttp(mockMPs);
      const mps = createMPsResource(http);
      const options = { signal: new AbortController().signal };

      await mps.getAll(options);

      expect(http.getResource).toHaveBeenCalledWith(MP_URL, options);
    });
  });

  describe("getById", () => {
    it("returns a single MP", async () => {
      const http = createMockHttp(mockMPs[0]);
      const mps = createMPsResource(http);

      const result = await mps.getById(95);

      expect(http.getResource).toHaveBeenCalledWith(`${MP_URL}/95`, undefined);
      expect(result.id).toBe(95);
      expect(result.firstLastName).toBe("Anna Kowalska");
    });

    it("forwards options to http client", async () => {
      const http = createMockHttp(mockMPs[0]);
      const mps = createMPsResource(http);
      const options = { query: { lang: "pl" } };

      await mps.getById(56, options);

      expect(http.getResource).toHaveBeenCalledWith(`${MP_URL}/56`, options);
    });
  });
});
