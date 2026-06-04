import { Flame } from "lucide-react";

export default function StreakCard({ streak }: { streak: number }) {
  return (
    <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-orange-400 to-red-500 p-2 rounded-lg">
          <Flame className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-600">Current Streak</p>
          <p className="text-2xl font-bold text-orange-600">{streak} days</p>
        </div>
      </div>
    </div>
  );
}
