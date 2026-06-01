import { motion, AnimatePresence } from 'framer-motion';
import { Word } from '../../types/word';

type Props = {
  word?: Word | null;
  isFlipped: boolean;
  onFlip: () => void;
};

export function Flashcard({ word, isFlipped, onFlip }: Props) {
  if (!word) return null;

  return (
    <div className="perspective-1000 mb-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={word.id + (isFlipped ? "-back" : "-front")}
          initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onFlip}
          className="cursor-pointer"
        >
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 min-h-[400px] flex flex-col items-center justify-center p-12">
            {!isFlipped ? (
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-4 uppercase tracking-wide">Word</p>
                <h2 className="text-6xl font-bold text-gray-800 mb-4">{word.word}</h2>
                <p className="text-xl text-gray-500 mb-8">{word.pronunciation}</p>
                <p className="text-sm text-purple-600 font-medium">Click to reveal meaning</p>
              </div>
            ) : (
              <div className="w-full">
                <p className="text-sm text-gray-500 mb-4 uppercase tracking-wide">Meaning</p>
                <p className="text-2xl text-gray-800 mb-6">{word.meaning}</p>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default Flashcard;
