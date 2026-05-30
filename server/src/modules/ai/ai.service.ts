type GeminiTextPart = {
  text?: string;
};

type GeminiGenerateContentResponse = {
  candidates?: Array<{
    content?: {
      parts?: GeminiTextPart[];
    };
  }>;
};

export class AiService {
  async explainWord(word: string): Promise<{ explanation: string }> {
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const geminiModel = "gemini-3.5-flash";

    const prompt = `
    Bạn là trợ lý học từ vựng tiếng Anh trong một ứng dụng học từ.

    Hãy giải thích từ tiếng Anh sau: "${word}"

    Yêu cầu bắt buộc:
    - Bạn chỉ cần ghi một chữ tiếng anh, sau đó hai chấm và giải thích nghĩa, sau đó xuống dòng cho một ví dụ và ngữ cảnh để người dùng sử dụng
    // - Trả lời bằng tiếng Việt.
    // - Viết rõ ràng, dễ hiểu cho người học tiếng Anh.
    - Dùng markdown.
    - Không dùng dấu **.
    - Đừng cố gắng viết Hoa hay những ký hiệu để tạo hiệu ứng đặc biệt, vì nếu không được thì sẽ làm giao diện khó nhìn
    // - Không dùng dấu #.
    // - Không dùng bảng.
    // - Không dùng bullet phức tạp.
    // - Mỗi ý nên xuống dòng rõ ràng.
    // - Nội dung ngắn gọn, tự nhiên, dễ đọc.

    // Định dạng trả lời chính xác như sau:

    // Nghĩa tiếng Việt: ...

    // Giải thích dễ hiểu: ...

    // Ví dụ tiếng Anh: ...

    // Dịch nghĩa ví dụ: ...
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": geminiApiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorDetail = await response.text();
      throw new Error(
        `Gemini API request failed with status ${response.status}: ${errorDetail}`
      );
    }

    const data = (await response.json()) as GeminiGenerateContentResponse;

    const explanation = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("\n")
      .trim();

    return {
      explanation: explanation || "No explanation generated.",
    };
  }
}