
type Props = {
  current: number;
  total: number;
};

export function ReviewHeader({ current, total }: Props) {
  const percent = total === 0 ? 0 : ((current + 1) / total) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Review Session</h1>
          <p className="text-gray-600 mt-2">Test your knowledge with flashcards</p>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-600">Progress</p>
          <p className="text-2xl font-bold text-purple-600">{current + 1} / {total}</p>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default ReviewHeader;
