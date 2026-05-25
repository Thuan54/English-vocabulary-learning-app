import { RotateCcw, Trophy } from "lucide-react";

type Props = {
  knownCount: number;
  unknownCount: number;
  onRestart: () => void;
};

export default function ReviewComplete({ knownCount, unknownCount, onRestart }: Props) {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200 text-center">
        <div className="bg-gradient-to-br from-yellow-100 to-orange-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-12 h-12 text-yellow-600" />
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-4">Great Job! 🎉</h1>

        <p className="text-xl text-gray-600 mb-8">You've completed all your reviews for today</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-green-50 rounded-xl p-6">
            <p className="text-sm text-gray-600 mb-1">Known</p>
            <p className="text-4xl font-bold text-green-600">{knownCount}</p>
          </div>

          <div className="bg-blue-50 rounded-xl p-6">
            <p className="text-sm text-gray-600 mb-1">Review Again</p>
            <p className="text-4xl font-bold text-blue-600">{unknownCount}</p>
          </div>
        </div>

        <button onClick={onRestart} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-medium hover:shadow-lg transition-shadow inline-flex items-center gap-2">
          <RotateCcw className="w-5 h-5" />
          Practice Again
        </button>
      </div>
    </div>
  );
}
