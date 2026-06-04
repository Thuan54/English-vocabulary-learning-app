type Props = { progress: number };

export function ProgressBar({ progress }: Props) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div
        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export default ProgressBar;
