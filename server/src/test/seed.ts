const { ObjectId } = require("mongodb");

const words = [
  {
    _id: new ObjectId("686000000000000000000001"),
    word: "abandon",
    meaning: "từ bỏ, bỏ rơi",
    pronunciation: "/əˈbændən/",
    example: "He decided to abandon the project."
  },
  {
    _id: new ObjectId("686000000000000000000002"),
    word: "achieve",
    meaning: "đạt được, hoàn thành",
    pronunciation: "/əˈtʃiːv/",
    example: "She worked hard to achieve her goals."
  },
  {
    _id: new ObjectId("686000000000000000000003"),
    word: "ancient",
    meaning: "cổ đại, rất lâu đời",
    pronunciation: "/ˈeɪnʃənt/",
    example: "They visited an ancient temple."
  },
  {
    _id: new ObjectId("686000000000000000000004"),
    word: "benefit",
    meaning: "lợi ích",
    pronunciation: "/ˈbenɪfɪt/",
    example: "Exercise provides many health benefits."
  },
  {
    _id: new ObjectId("686000000000000000000005"),
    word: "capture",
    meaning: "bắt giữ, ghi lại",
    pronunciation: "/ˈkæptʃər/",
    example: "The camera captured a beautiful moment."
  },
  {
    _id: new ObjectId("686000000000000000000006"),
    word: "declare",
    meaning: "tuyên bố, công bố",
    pronunciation: "/dɪˈkler/",
    example: "The president declared a national holiday."
  },
  {
    _id: new ObjectId("686000000000000000000007"),
    word: "efficient",
    meaning: "hiệu quả",
    pronunciation: "/ɪˈfɪʃənt/",
    example: "This machine is very efficient."
  },
  {
    _id: new ObjectId("686000000000000000000008"),
    word: "frequent",
    meaning: "thường xuyên",
    pronunciation: "/ˈfriːkwənt/",
    example: "He is a frequent visitor."
  },
  {
    _id: new ObjectId("686000000000000000000009"),
    word: "generate",
    meaning: "tạo ra, sinh ra",
    pronunciation: "/ˈdʒenəreɪt/",
    example: "Solar panels generate electricity."
  },
  {
    _id: new ObjectId("68600000000000000000000a"),
    word: "honest",
    meaning: "trung thực",
    pronunciation: "/ˈɒnɪst/",
    example: "She gave an honest answer."
  },
  {
    _id: new ObjectId("68600000000000000000000b"),
    word: "identify",
    meaning: "xác định, nhận diện",
    pronunciation: "/aɪˈdentɪfaɪ/",
    example: "Can you identify this bird?"
  },
  {
    _id: new ObjectId("68600000000000000000000c"),
    word: "journey",
    meaning: "hành trình, chuyến đi",
    pronunciation: "/ˈdʒɜːrni/",
    example: "The journey took three days."
  },
  {
    _id: new ObjectId("68600000000000000000000d"),
    word: "knowledge",
    meaning: "kiến thức",
    pronunciation: "/ˈnɒlɪdʒ/",
    example: "Knowledge is power."
  },
  {
    _id: new ObjectId("68600000000000000000000e"),
    word: "maintain",
    meaning: "duy trì, bảo trì",
    pronunciation: "/meɪnˈteɪn/",
    example: "It is important to maintain good habits."
  },
  {
    _id: new ObjectId("68600000000000000000000f"),
    word: "observe",
    meaning: "quan sát",
    pronunciation: "/əbˈzɜːrv/",
    example: "Scientists observe the stars."
  },
  {
    _id: new ObjectId("686000000000000000000010"),
    word: "prevent",
    meaning: "ngăn chặn",
    pronunciation: "/prɪˈvent/",
    example: "Vaccines help prevent diseases."
  },
  {
    _id: new ObjectId("686000000000000000000011"),
    word: "require",
    meaning: "yêu cầu, đòi hỏi",
    pronunciation: "/rɪˈkwaɪər/",
    example: "This job requires experience."
  },
  {
    _id: new ObjectId("686000000000000000000012"),
    word: "sufficient",
    meaning: "đủ, đầy đủ",
    pronunciation: "/səˈfɪʃənt/",
    example: "We have sufficient resources."
  },
  {
    _id: new ObjectId("686000000000000000000013"),
    word: "transfer",
    meaning: "chuyển giao, chuyển khoản",
    pronunciation: "/trænsˈfɜːr/",
    example: "He transferred the money yesterday."
  },
  {
    _id: new ObjectId("686000000000000000000014"),
    word: "valuable",
    meaning: "có giá trị, quý giá",
    pronunciation: "/ˈvæljuəbl/",
    example: "This experience is very valuable."
  }
];

const reviewRecords = [
  {
    _id: new ObjectId("687000000000000000000001"),
    reviewedAt: new Date("2026-06-01T08:00:00Z")
  },
  {
    _id: new ObjectId("687000000000000000000002"),
    reviewedAt: new Date("2026-06-02T08:00:00Z")
  }
];

const wordReviews = [
  {
    reviewId: new ObjectId("687000000000000000000001"),
    wordId: new ObjectId("686000000000000000000001"),
    nextReview: new Date("2026-06-04T08:00:00Z"),
    interval: 3,
    ease: 2.5,
    repetition: 1
  },
  {
    reviewId: new ObjectId("687000000000000000000001"),
    wordId: new ObjectId("686000000000000000000002"),
    nextReview: new Date("2026-06-05T08:00:00Z"),
    interval: 4,
    ease: 2.7,
    repetition: 2
  },
  {
    reviewId: new ObjectId("687000000000000000000002"),
    wordId: new ObjectId("686000000000000000000003"),
    nextReview: new Date("2026-06-06T08:00:00Z"),
    interval: 4,
    ease: 2.5,
    repetition: 2
  },
  {
    reviewId: new ObjectId("687000000000000000000002"),
    wordId: new ObjectId("686000000000000000000004"),
    nextReview: new Date("2026-06-07T08:00:00Z"),
    interval: 5,
    ease: 2.8,
    repetition: 3
  }
];

export async function seed(db: any) {
  await db.collection('words').deleteMany({});
  await db.collection('review_records').deleteMany({});
  await db.collection('word_review').deleteMany({});
  
  const wordsWithEmbeddings = words.map((w, wIdx) => ({
    ...w,
    embedding: Array.from({ length: 384 }, (_, idx) => {
      // Stable mock embedding values using Math.sin
      const val = Math.sin(idx + wIdx + 1);
      return parseFloat(val.toFixed(4));
    }),
    search_count: 0
  }));
  
  await db.collection('words').insertMany(wordsWithEmbeddings);
  await db.collection('review_records').insertMany(reviewRecords);
  await db.collection('word_review').insertMany(wordReviews);
}