
type Props = {
  isFlipped: boolean;
  onReview: (difficulty: string) => void;
};

export function ReviewControls({ isFlipped, onReview }: Props) {
  if (!isFlipped) return null;

  return (
    <div className="grid grid-cols-4 gap-4">
      <button onClick={() => onReview('forget')} className="bg-red-100 hover:bg-red-200 text-red-700 py-4 rounded-xl font-medium">Forget</button>
      <button onClick={() => onReview('hard')} className="bg-orange-100 hover:bg-orange-200 text-orange-700 py-4 rounded-xl font-medium">Hard</button>
      <button onClick={() => onReview('medium')} className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 py-4 rounded-xl font-medium">Medium</button>
      <button onClick={() => onReview('easy')} className="bg-green-100 hover:bg-green-200 text-green-700 py-4 rounded-xl font-medium">Easy</button>
    </div>
  );
}

export default ReviewControls;
