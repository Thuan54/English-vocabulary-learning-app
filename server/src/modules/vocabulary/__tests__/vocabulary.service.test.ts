import { createWord } from "../vocabulary.service";

jest.mock("../vocabulary.repository", () => ({
  insertWord: jest.fn().mockResolvedValue({ id: "123", word: "apple", meaning: "a fruit" })
}));

describe("createWord", () => {

  it("should create word", async () => {

    const result = await createWord({
      word: "apple",
      meaning: "a fruit"
    });

    expect(result.word).toBe("apple");

  });

  it("should throw error if input is invalid", async () => {
    // Thêm meaning: "" để khớp với định nghĩa của hàm createWord
    await expect(
      createWord({ word: "", meaning: "" })
    ).rejects.toThrow("Invalid input");
  });

});