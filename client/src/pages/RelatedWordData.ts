export interface WordData {
  word: string;
  meaning: string;
  pronunciation: string;
  synonyms: string[];
  example: string;
}

export interface TopicInfo {
  description: string;
  words: WordData[];
  relatedTopics: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content: string;
  words?: WordData[];
  relatedTopics?: string[];
  topic?: string;
}

export const topicDatabase: Record<string, TopicInfo> = {
  character: {
    description:
      "Words related to personality traits and moral qualities that describe who a person is.",
    words: [
      {
        word: "Tenacious",
        meaning: "Tending to keep a firm hold of something; persistent",
        pronunciation: "/təˈneɪʃəs/",
        synonyms: ["persistent", "determined", "resolute"],
        example: "She was tenacious in her pursuit of excellence.",
      },
      {
        word: "Benevolent",
        meaning: "Well meaning and kindly; showing goodwill",
        pronunciation: "/bəˈnevələnt/",
        synonyms: ["kind", "generous", "compassionate"],
        example: "The benevolent ruler was loved by all citizens.",
      },
      {
        word: "Resilient",
        meaning: "Able to recover quickly from difficult conditions",
        pronunciation: "/rɪˈzɪliənt/",
        synonyms: ["tough", "adaptable", "hardy"],
        example: "Children are remarkably resilient and can adapt to change.",
      },
      {
        word: "Pragmatic",
        meaning: "Dealing with things sensibly and realistically",
        pronunciation: "/præɡˈmætɪk/",
        synonyms: ["practical", "realistic", "sensible"],
        example: "She took a pragmatic approach to solving the problem.",
      },
    ],
    relatedTopics: ["determination", "kindness", "leadership"],
  },
  determination: {
    description: "Words that express firmness of purpose and the drive to achieve goals.",
    words: [
      {
        word: "Tenacious",
        meaning: "Tending to keep a firm hold of something; persistent",
        pronunciation: "/təˈneɪʃəs/",
        synonyms: ["persistent", "determined", "steadfast"],
        example: "She was tenacious in her pursuit of excellence.",
      },
      {
        word: "Steadfast",
        meaning: "Resolutely or dutifully firm and unwavering",
        pronunciation: "/ˈstɛdfæst/",
        synonyms: ["loyal", "faithful", "committed"],
        example: "He remained steadfast in his beliefs despite opposition.",
      },
      {
        word: "Indefatigable",
        meaning: "Persisting tirelessly; untiring",
        pronunciation: "/ˌɪndɪˈfætɪɡəbəl/",
        synonyms: ["tireless", "unrelenting", "unwearied"],
        example: "Her indefatigable efforts finally paid off.",
      },
      {
        word: "Persevering",
        meaning: "Continuing in a course of action despite difficulty",
        pronunciation: "/ˌpɜːrsɪˈvɪərɪŋ/",
        synonyms: ["persistent", "determined", "tenacious"],
        example: "The persevering student eventually mastered the language.",
      },
    ],
    relatedTopics: ["character", "goals", "courage"],
  },
  kindness: {
    description: "Words that describe acts of goodwill, compassion, and generosity toward others.",
    words: [
      {
        word: "Benevolent",
        meaning: "Well meaning and kindly; showing goodwill",
        pronunciation: "/bəˈnevələnt/",
        synonyms: ["kind", "generous", "charitable"],
        example: "She made a benevolent donation to the charity.",
      },
      {
        word: "Compassionate",
        meaning: "Feeling or showing sympathy and concern for others",
        pronunciation: "/kəmˈpæʃənət/",
        synonyms: ["empathetic", "caring", "tender"],
        example: "The compassionate nurse cared for every patient.",
      },
      {
        word: "Altruistic",
        meaning: "Showing selfless concern for the well-being of others",
        pronunciation: "/ˌæltruˈɪstɪk/",
        synonyms: ["selfless", "generous", "charitable"],
        example: "Her altruistic nature led her to volunteer every weekend.",
      },
      {
        word: "Magnanimous",
        meaning: "Very generous or forgiving, especially toward rivals",
        pronunciation: "/mæɡˈnænɪməs/",
        synonyms: ["generous", "forgiving", "noble"],
        example: "He was magnanimous in victory, praising his opponent.",
      },
    ],
    relatedTopics: ["character", "emotions", "relationships"],
  },
  communication: {
    description: "Words related to the exchange of information, ideas, and feelings.",
    words: [
      {
        word: "Eloquent",
        meaning: "Fluent or persuasive in speaking or writing",
        pronunciation: "/ˈɛləkwənt/",
        synonyms: ["articulate", "fluent", "persuasive"],
        example: "The speaker gave an eloquent speech about climate change.",
      },
      {
        word: "Articulate",
        meaning: "Able to express ideas clearly and effectively",
        pronunciation: "/ɑːrˈtɪkjələt/",
        synonyms: ["expressive", "fluent", "coherent"],
        example: "She was remarkably articulate for her age.",
      },
      {
        word: "Persuasive",
        meaning: "Good at convincing someone to do or believe something",
        pronunciation: "/pərˈsweɪsɪv/",
        synonyms: ["convincing", "compelling", "influential"],
        example: "His persuasive argument won over the jury.",
      },
      {
        word: "Lucid",
        meaning: "Expressed clearly; easy to understand",
        pronunciation: "/ˈluːsɪd/",
        synonyms: ["clear", "coherent", "intelligible"],
        example: "She gave a lucid explanation of the complex theory.",
      },
    ],
    relatedTopics: ["skills", "writing", "character"],
  },
  description: {
    description: "Words used to vividly depict or characterize people, places, and things.",
    words: [
      {
        word: "Ubiquitous",
        meaning: "Present, appearing, or found everywhere",
        pronunciation: "/juːˈbɪkwɪtəs/",
        synonyms: ["omnipresent", "pervasive", "universal"],
        example: "Smartphones have become ubiquitous in modern society.",
      },
      {
        word: "Ephemeral",
        meaning: "Lasting for a very short time",
        pronunciation: "/ɪˈfɛmərəl/",
        synonyms: ["fleeting", "transient", "momentary"],
        example: "The ephemeral beauty of cherry blossoms attracts millions.",
      },
      {
        word: "Pristine",
        meaning: "In its original condition; unspoiled",
        pronunciation: "/ˈprɪstiːn/",
        synonyms: ["unspoiled", "immaculate", "flawless"],
        example: "The pristine beach was untouched by tourism.",
      },
      {
        word: "Vivid",
        meaning: "Producing powerful feelings or clear images in the mind",
        pronunciation: "/ˈvɪvɪd/",
        synonyms: ["striking", "graphic", "intense"],
        example: "She gave a vivid description of the sunset.",
      },
    ],
    relatedTopics: ["nature", "common", "writing"],
  },
  skills: {
    description: "Words describing abilities, competencies, and ways of thinking.",
    words: [
      {
        word: "Adept",
        meaning: "Very skilled or proficient at something",
        pronunciation: "/əˈdɛpt/",
        synonyms: ["skilled", "proficient", "expert"],
        example: "She is adept at solving complex puzzles.",
      },
      {
        word: "Astute",
        meaning: "Having an ability to accurately assess situations",
        pronunciation: "/əˈstjuːt/",
        synonyms: ["shrewd", "perceptive", "sharp"],
        example: "The astute investor spotted the trend early.",
      },
      {
        word: "Methodical",
        meaning: "Done according to a systematic or established procedure",
        pronunciation: "/məˈθɒdɪkəl/",
        synonyms: ["systematic", "organized", "structured"],
        example: "His methodical approach ensured no detail was missed.",
      },
      {
        word: "Versatile",
        meaning: "Able to adapt or be adapted to many different functions",
        pronunciation: "/ˈvɜːrsətaɪl/",
        synonyms: ["adaptable", "flexible", "multifaceted"],
        example: "She is a versatile musician who plays five instruments.",
      },
    ],
    relatedTopics: ["communication", "character", "learning"],
  },
};
