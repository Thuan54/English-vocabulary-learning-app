import { useState, useEffect } from "react";
import { useVocabulary } from "../contexts/VocabularyContext";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy } from "lucide-react";
import confetti from "canvas-confetti";
import { fetchDueCards, submitReview } from "../api/review.api";

export function Review() {

  const { words } = useVocabulary();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const [reviewWords, setReviewWords] = useState<any[]>([]);

  const [knownCount, setKnownCount] = useState(0);
  const [unknownCount, setUnknownCount] = useState(0);

  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ===============================
  // ISSUE 9 — Fetch Due Cards
  // ===============================

  useEffect(() => {

    const loadCards = async () => {
      try {
        const data = await fetchDueCards();

        if (data && data.length > 0) {
          setReviewWords(data);
        } else {

          // fallback local logic nếu API chưa có
          setReviewWords(
            words.filter(
              w => w.nextReview && new Date(w.nextReview) <= new Date()
            )
          );

        }

      } catch (err) {

        // fallback local
        setReviewWords(
          words.filter(
            w => w.nextReview && new Date(w.nextReview) <= new Date()
          )
        );

      } finally {
        setIsLoading(false);
      }
    };

    loadCards();

  }, [words]);


  // ===============================
  // Complete review
  // ===============================

  useEffect(() => {
    if (!isLoading && reviewWords.length === 0 && !isComplete) {

      setIsComplete(true);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

    }
  }, [reviewWords, isComplete]);


  const currentWord = reviewWords[currentIndex];


  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };


  // ===============================
  // ISSUE 10 — Submit Review Result
  // ===============================

  /*
  const handleKnow = async () => {

    if (!currentWord) return;

    try {

      await submitReview(currentWord.id, "easy");

    } catch (err) {
      console.log("API review failed, fallback local update");
    }

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + 7);

    updateWord(currentWord.id, {
      lastReviewed: new Date(),
      reviewCount: currentWord.reviewCount + 1,
      nextReview: nextReviewDate
    });

    setKnownCount(knownCount + 1);

    moveToNext();
  };


  const handleDontKnow = async () => {

    if (!currentWord) return;

    try {

      await submitReview(currentWord.id, "again");

    } catch (err) {
      console.log("API review failed, fallback local update");
    }

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + 1);

    updateWord(currentWord.id, {
      lastReviewed: new Date(),
      reviewCount: currentWord.reviewCount + 1,
      nextReview: nextReviewDate
    });

    setUnknownCount(unknownCount + 1);

    moveToNext();
  };
*/

  // ===============================
  // ISSUE 11 — Next Card Flow
  // ===============================

  const moveToNext = () => {

    setIsFlipped(false);

    if (currentIndex < reviewWords.length - 1) {

      setCurrentIndex((prev) => prev + 1);

    } else {

      setReviewWords([]);

    }
  };
  const handleReview = async (difficulty: string) => {

    if (!currentWord) return;

    try {

      await submitReview(currentWord.id, difficulty);

    } catch (err) {

      console.log("API error fallback local");

    }

    if (difficulty === "forget" || difficulty === "again") {
      setUnknownCount(prev => prev + 1);
    } else {
      setKnownCount(prev => prev + 1);
    }

    setIsFlipped(false); //reset flip trước khi next
    moveToNext();
  };

  const handleRestart = () => {

    setReviewWords(
      words.filter(
        w => w.nextReview && new Date(w.nextReview) <= new Date()
      )
    );

    setCurrentIndex(0);
    setIsFlipped(false);

    setKnownCount(0);
    setUnknownCount(0);

    setIsComplete(false);
  };


  // ===============================
  // ISSUE 12 — Empty State
  // ===============================

  if (isLoading) {
    return <div className="p-8 text-center text-xl text-gray-600">Loading...</div>;
  }

  if (!currentWord && !isComplete) {
    return (
      <div className="p-8 text-center text-xl text-gray-600">
        No cards to review
      </div>
    );
  }


  if (isComplete || reviewWords.length === 0) {

    return (
      <div className="p-8 max-w-2xl mx-auto">

        <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200 text-center">

          <div className="bg-gradient-to-br from-yellow-100 to-orange-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-12 h-12 text-yellow-600" />
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Great Job! 🎉
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            You've completed all your reviews for today
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">

            <div className="bg-green-50 rounded-xl p-6">
              <p className="text-sm text-gray-600 mb-1">Known</p>
              <p className="text-4xl font-bold text-green-600">
                {knownCount}
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <p className="text-sm text-gray-600 mb-1">
                Review Again
              </p>
              <p className="text-4xl font-bold text-blue-600">
                {unknownCount}
              </p>
            </div>

          </div>

          <button
            onClick={handleRestart}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-medium hover:shadow-lg transition-shadow inline-flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Practice Again
          </button>

        </div>

      </div>
    );
  }


  return (
    <div className="p-8 max-w-2xl mx-auto">

      {/* Header */}

      <div className="mb-8">

        <div className="flex items-center justify-between mb-4">

          <div>

            <h1 className="text-4xl font-bold text-gray-800">
              Review Session
            </h1>

            <p className="text-gray-600 mt-2">
              Test your knowledge with flashcards
            </p>

          </div>

          <div className="text-right">

            <p className="text-sm text-gray-600">
              Progress
            </p>

            <p className="text-2xl font-bold text-purple-600">
              {currentIndex + 1} / {reviewWords.length}
            </p>

          </div>

        </div>

        {/* Progress Bar */}

        <div className="w-full bg-gray-200 rounded-full h-3">

          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
            style={{
              width:
                `${((currentIndex + 1) / reviewWords.length) * 100}%`
            }}
          />

        </div>

      </div>


      {/* Flashcard */}

      <div className="perspective-1000 mb-8">

        <AnimatePresence mode="wait">

          <motion.div
            key={currentWord.id + (isFlipped ? "-back" : "-front")}
            initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleFlip}
            className="cursor-pointer"
          >

            <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 min-h-[400px] flex flex-col items-center justify-center p-12">

              {!isFlipped ? (

                <div className="text-center">

                  <p className="text-sm text-gray-500 mb-4 uppercase tracking-wide">
                    Word
                  </p>

                  <h2 className="text-6xl font-bold text-gray-800 mb-4">
                    {currentWord.word}
                  </h2>

                  <p className="text-xl text-gray-500 mb-8">
                    {currentWord.pronunciation}
                  </p>

                  <p className="text-sm text-purple-600 font-medium">
                    Click to reveal meaning
                  </p>

                </div>

              ) : (

                <div className="w-full">

                  <p className="text-sm text-gray-500 mb-4 uppercase tracking-wide">
                    Meaning
                  </p>

                  <p className="text-2xl text-gray-800 mb-6">
                    {currentWord.meaning}
                  </p>

                </div>

              )}

            </div>

          </motion.div>

        </AnimatePresence>

      </div>


      {/* Buttons */}

      {isFlipped && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-4 gap-4"
        >

          <button
            onClick={() => handleReview("forget")}
            className="bg-red-100 hover:bg-red-200 text-red-700 py-4 rounded-xl font-medium"
          >
            Forget
          </button>

          <button
            onClick={() => handleReview("hard")}
            className="bg-orange-100 hover:bg-orange-200 text-orange-700 py-4 rounded-xl font-medium"
          >
            Hard
          </button>

          <button
            onClick={() => handleReview("medium")}
            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 py-4 rounded-xl font-medium"
          >
            Medium
          </button>

          <button
            onClick={() => handleReview("easy")}
            className="bg-green-100 hover:bg-green-200 text-green-700 py-4 rounded-xl font-medium"
          >
            Easy
          </button>

        </motion.div>
      )}

    </div>
  );
}