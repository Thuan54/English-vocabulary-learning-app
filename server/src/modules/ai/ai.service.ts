export class AiService {
  /**
   * Provides a mock explanation for a given word.
   * In the future, this will integrate with an actual AI service.
   * @param word The word to explain
   * @returns A mock explanation string
   */
  async explainWord(word: string): Promise<{ explanation: string }> {
    // Basic mock response
    return {
      explanation: `This is a simple mock explanation for the word '${word}'. It means something interesting!`
    };
  }
}
