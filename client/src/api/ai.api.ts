export type AiExplainResponse = {
  explanation: string;
};

export async function explainText(text: string): Promise<AiExplainResponse> {
  const response = await fetch('/api/ai/explain', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(
      errorBody?.error?.message || 'Unable to get explanation from the AI service',
    );
  }

  return response.json();
}
