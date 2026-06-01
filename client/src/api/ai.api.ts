export async function getAiExplanation(word: string): Promise<string> {
  const res = await fetch(`/api/ai/explain`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ word }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = body?.error || "Failed to fetch AI explanation";
    throw new Error(message);
  }

  const data = await res.json();
  return data.explanation;
}
