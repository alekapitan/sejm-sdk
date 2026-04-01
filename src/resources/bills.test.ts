import { createBillsResource, type Bill } from "./bills.js";
import type { HttpClient } from "../core/http.js";

const mockBills: Bill[] = [
  {
    number: "RPW/1/2026",
    title: "Test bill one",
    status: "ACTIVE",
    submissionType: "BILL",
  },
  {
    number: "RPW/2/2026",
    title: "Test resolution",
    status: "ADOPTED",
    submissionType: "DRAFT_RESOLUTION",
  },
];

const createMockHttp = (returnValue: unknown): HttpClient => ({
  getResource: vi.fn().mockResolvedValue(returnValue),
});

describe("createBillsResource", () => {
  afterEach(() => vi.resetAllMocks());

  describe("list", () => {
    it("returns one page of bills", async () => {
      const http = createMockHttp(mockBills);
      const bills = createBillsResource(http);

      const result = await bills.list();

      expect(http.getResource).toHaveBeenCalledOnce();
      expect(http.getResource).toHaveBeenCalledWith("bills", undefined);

      expect(result).toHaveLength(2);
      expect(result[0].number).toBe("RPW/1/2026");
      expect(result[1].status).toBe("ADOPTED");
    });

    it("forwards options to http client", async () => {
      const http = createMockHttp(mockBills);
      const bills = createBillsResource(http);
      const options = { signal: new AbortController().signal };

      await bills.list(options);

      expect(http.getResource).toHaveBeenCalledOnce();
      expect(http.getResource).toHaveBeenCalledWith("bills", options);
    });

    it("forwards query in options to http client", async () => {
      const http = createMockHttp(mockBills);
      const bills = createBillsResource(http);
      const options = {
        query: { limit: 10, status: "ACTIVE" as const, title: "podatku" },
      };

      await bills.list(options);

      expect(http.getResource).toHaveBeenCalledOnce();
      expect(http.getResource).toHaveBeenCalledWith("bills", options);
    });
  });
});
