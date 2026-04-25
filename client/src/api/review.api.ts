
export async function fetchDueCards() {

  const res = await fetch("/reviews/due");

  if (!res.ok) {
    throw new Error("Failed to fetch cards");
  }

  return res.json();
}

export async function submitReview(wordId: string, difficulty: string) {

  const res = await fetch("/reviews", {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      wordId,
      difficulty
    })

  });

  if (!res.ok) {
    throw new Error("Review failed");
  }

  return res.json();
}

