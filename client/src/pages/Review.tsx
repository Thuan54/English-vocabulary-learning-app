import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { fetchDueCards, submitReview } from "../api/review.api";
import { DueReview } from "../types/review";

import ReviewHeader from "../components/review/ReviewHeader";
import Flashcard from "../components/review/Flashcard";
import ReviewControls from "../components/review/ReviewControls";
import CompletedView from "../components/review/CompletedView";

export function Review() {

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const [reviewWords, setReviewWords] = useState<DueReview[]>([]);

  const [knownCount, setKnownCount] = useState(0);
  const [unknownCount, setUnknownCount] = useState(0);

  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadCards = async () => {
    setIsLoading(true);
    try {
      const data : DueReview[] = await fetchDueCards();

      if (Array.isArray(data)) {
        setReviewWords(data);
      }
    } catch (err) {
      console.error("Failed to load review cards:", err);
      // Fallback: filter words locally

      
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  useEffect(() => {
    if (!isLoading && reviewWords.length === 0 && !isComplete) {
      setIsComplete(true);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [reviewWords, isComplete, isLoading]);

  const currentWord = reviewWords[currentIndex];

  const handleFlip = () => setIsFlipped(prev => !prev);

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
      await submitReview(currentWord.wordReviewId, difficulty);
    } catch (err) {
      console.log("API error fallback local");
    }

    if (difficulty === "forget") {
      setUnknownCount(prev => prev + 1);
    } else {
      setKnownCount(prev => prev + 1);
    }

    setIsFlipped(false);
    moveToNext();
  };

  const handleRestart = () => {
    loadCards();
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCount(0);
    setUnknownCount(0);
    setIsComplete(false);
  };

  if (isLoading) return <div className="p-8 text-center text-xl text-gray-600">Loading...</div>;
  if (!currentWord && !isComplete) return <div className="p-8 text-center text-xl text-gray-600">No cards to review</div>;

  if (isComplete || reviewWords.length === 0) {
    return <CompletedView knownCount={knownCount} unknownCount={unknownCount} onRestart={handleRestart} />;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <ReviewHeader current={currentIndex} total={reviewWords.length} />
      <Flashcard word={currentWord} isFlipped={isFlipped} onFlip={handleFlip} />
      <ReviewControls isFlipped={isFlipped} onReview={handleReview} />
    </div>
  );
}

export default Review;
