import { fetchDueCards, submitReview } from "../../api/review.api";

// Mock the global fetch function
globalThis.fetch = jest.fn();

describe("review.api", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchDueCards", () => {
    it("should fetch due cards successfully", async () => {
      const mockData = [{ id: "1", word: "test" }];
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await fetchDueCards();
      
      expect(globalThis.fetch).toHaveBeenCalledWith("/reviews/due");
      expect(result).toEqual(mockData);
    });

    it("should throw an error if fetching fails", async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(fetchDueCards()).rejects.toThrow("Failed to fetch cards");
      expect(globalThis.fetch).toHaveBeenCalledWith("/reviews/due");
    });
  });

  describe("submitReview", () => {
    it("should submit a review successfully", async () => {
      const mockData = { success: true };
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await submitReview("word123", "easy");

      expect(globalThis.fetch).toHaveBeenCalledWith("/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wordId: "word123",
          difficulty: "easy",
        }),
      });
      expect(result).toEqual(mockData);
    });

    it("should throw an error if submitting review fails", async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(submitReview("word123", "hard")).rejects.toThrow("Review failed");
    });
  });
});
