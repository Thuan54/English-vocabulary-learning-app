import { DueReview } from "../types/review"

export async function fetchDueCards() : Promise<DueReview[]> {

  const res = await fetch("api/reviews/due")

  if (!res.ok) {
    throw new Error("Failed to fetch cards")
  }

  return res.json()
}

export async function submitReview(wordReviewId: string, difficulty: string) {

  const res = await fetch("api/reviews/feedback", {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      wordReviewId: wordReviewId,
      difficulty: difficulty
    })

  });

  if (!res.ok) {
    throw new Error("Review failed");
  }

  return res.json();
}
