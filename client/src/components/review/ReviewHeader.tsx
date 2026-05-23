import ProgressBar from "./ProgressBar";

type Props = {
  currentIndex: number;
  total: number;
};

export default function ReviewHeader({ currentIndex, total }: Props) {
  const progress = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Review Session</h1>
          <p className="text-gray-600 mt-2">Test your knowledge with flashcards</p>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-600">Progress</p>
          <p className="text-2xl font-bold text-purple-600">{currentIndex + 1} / {total}</p>
        </div>
      </div>

      <ProgressBar progress={progress} />
    </div>
  );
}
