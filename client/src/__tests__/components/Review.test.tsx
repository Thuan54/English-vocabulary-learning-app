import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { jest } from "@jest/globals";

import { Review } from "../../pages/review";
import * as reviewApi from "../../api/review.api";
import * as vocabHook from "../../contexts/VocabularyContext";

jest.mock("canvas-confetti", () => jest.fn());

jest.mock("../../api/review.api");

const mockCards = [
  {
    id: "1",
    word: "apple",
    meaning: "a fruit",
    pronunciation: "",
    reviewCount: 0,
    nextReview: new Date().toISOString()
  }
];

describe("Review Page - Handle user review input", () => {

  beforeEach(() => {

    jest.spyOn(vocabHook, "useVocabulary").mockReturnValue({
      words: mockCards,
      updateWord: jest.fn()
    } as any);

    jest.spyOn(reviewApi, "fetchDueCards").mockResolvedValue(mockCards as any);

  });

  test("should flip card and show meaning", async () => {

    render(<Review />);

    const word = await screen.findByText("apple");

    fireEvent.click(word);

    expect(await screen.findByText("a fruit")).toBeInTheDocument();

  });

  test("should show review buttons after flip", async () => {

    render(<Review />);

    const word = await screen.findByText("apple");

    fireEvent.click(word);

    expect(await screen.findByText("Easy")).toBeInTheDocument();
    expect(await screen.findByText("Hard")).toBeInTheDocument();
    expect(await screen.findByText("Medium")).toBeInTheDocument();
    expect(await screen.findByText("Forget")).toBeInTheDocument();

  });

  test("should call POST /review when clicking Easy", async () => {

    jest.spyOn(reviewApi, "submitReview").mockResolvedValue({ success: true } as any);

    render(<Review />);

    const word = await screen.findByText("apple");

    fireEvent.click(word);

    const easyBtn = await screen.findByText("Easy");

    fireEvent.click(easyBtn);

    await waitFor(() => {
      expect(reviewApi.submitReview).toHaveBeenCalledWith("1", "easy");
    });

  });

  test("should update counts and show completion screen (UI reflects changes)", async () => {
    jest.spyOn(reviewApi, "submitReview").mockResolvedValue({ success: true } as any);
    render(<Review />);

    const word = await screen.findByText("apple");
    fireEvent.click(word);

    const forgetBtn = await screen.findByText("Forget");
    fireEvent.click(forgetBtn);

    await waitFor(() => {
      expect(reviewApi.submitReview).toHaveBeenCalledWith("1", "forget");
    });

    expect(await screen.findByText(/Great Job/i)).toBeInTheDocument();
  });

});