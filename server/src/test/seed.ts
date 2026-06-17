import { reverse } from "node:dns";
import { AiService } from "../modules/ai/ai.service";
import { MlClient } from "../modules/ai/ml.client";
import { ReviewRepository } from "../modules/review/review.repo";
import { WordRepository } from "../modules/word/word.repo";
import { WordService } from "../modules/word/word.service";

const { ObjectId } = require("mongodb");

const words = [
  {
    word: "abandon",
    meaning: "từ bỏ, bỏ rơi",
    pronunciation: "/əˈbændən/",
    example: "He decided to abandon the project."
  },
  {
    word: "achieve",
    meaning: "đạt được, hoàn thành",
    pronunciation: "/əˈtʃiːv/",
    example: "She worked hard to achieve her goals."
  },
  {
    word: "ancient",
    meaning: "cổ đại, rất lâu đời",
    pronunciation: "/ˈeɪnʃənt/",
    example: "They visited an ancient temple."
  },
  {
    word: "benefit",
    meaning: "lợi ích",
    pronunciation: "/ˈbenɪfɪt/",
    example: "Exercise provides many health benefits."
  },
  {
    word: "capture",
    meaning: "bắt giữ, ghi lại",
    pronunciation: "/ˈkæptʃər/",
    example: "The camera captured a beautiful moment."
  },
  {
    word: "declare",
    meaning: "tuyên bố, công bố",
    pronunciation: "/dɪˈkler/",
    example: "The president declared a national holiday."
  },
  {
    word: "efficient",
    meaning: "hiệu quả",
    pronunciation: "/ɪˈfɪʃənt/",
    example: "This machine is very efficient."
  },
  {
    word: "frequent",
    meaning: "thường xuyên",
    pronunciation: "/ˈfriːkwənt/",
    example: "He is a frequent visitor."
  },
  {
    word: "generate",
    meaning: "tạo ra, sinh ra",
    pronunciation: "/ˈdʒenəreɪt/",
    example: "Solar panels generate electricity."
  },
  {
    word: "honest",
    meaning: "trung thực",
    pronunciation: "/ˈɒnɪst/",
    example: "She gave an honest answer."
  },
  {
    word: "identify",
    meaning: "xác định, nhận diện",
    pronunciation: "/aɪˈdentɪfaɪ/",
    example: "Can you identify this bird?"
  },
  {
    word: "journey",
    meaning: "hành trình, chuyến đi",
    pronunciation: "/ˈdʒɜːrni/",
    example: "The journey took three days."
  },
  {
    word: "knowledge",
    meaning: "kiến thức",
    pronunciation: "/ˈnɒlɪdʒ/",
    example: "Knowledge is power."
  },
  {
    word: "maintain",
    meaning: "duy trì, bảo trì",
    pronunciation: "/meɪnˈteɪn/",
    example: "It is important to maintain good habits."
  },
  {
    word: "observe",
    meaning: "quan sát",
    pronunciation: "/əbˈzɜːrv/",
    example: "Scientists observe the stars."
  },
  {
    word: "prevent",
    meaning: "ngăn chặn",
    pronunciation: "/prɪˈvent/",
    example: "Vaccines help prevent diseases."
  },
  {
    word: "require",
    meaning: "yêu cầu, đòi hỏi",
    pronunciation: "/rɪˈkwaɪər/",
    example: "This job requires experience."
  },
  {
    word: "sufficient",
    meaning: "đủ, đầy đủ",
    pronunciation: "/səˈfɪʃənt/",
    example: "We have sufficient resources."
  },
  {
    word: "transfer",
    meaning: "chuyển giao, chuyển khoản",
    pronunciation: "/trænsˈfɜːr/",
    example: "He transferred the money yesterday."
  },
  {
    word: "valuable",
    meaning: "có giá trị, quý giá",
    pronunciation: "/ˈvæljuəbl/",
    example: "This experience is very valuable."
  }
];

export async function seed(db: any) {
  await db.collection('words').deleteMany({});
  await db.collection('review_records').deleteMany({});
  await db.collection('word_review').deleteMany({});
  const baseUrl = process.env.ML_SERVER_URL || 'http://localhost:8000';
  const aiService= new AiService(new MlClient(baseUrl), db)
  const wordRepo = new WordRepository(db)
  const reviewRepo = new ReviewRepository(db)
  const wordService = new WordService(wordRepo, reviewRepo, aiService)
  words.forEach((word) => {
    wordService.createWord(word)
  })
}