import { useVocabulary } from "../contexts/VocabularyContext";
import { BookOpen, Target, TrendingUp, Calendar, CheckCircle2, Clock } from "lucide-react";
import { Link } from "react-router";

const progressData = [
  { day: "Mon", words: 5 },
  { day: "Tue", words: 8 },
  { day: "Wed", words: 12 },
  { day: "Thu", words: 10 },
  { day: "Fri", words: 15 },
  { day: "Sat", words: 18 },
  { day: "Sun", words: 22 },
];

export function Dashboard() {
  const { words, totalLearned, reviewDue, streak } = useVocabulary();

  const todayWords = words
    .filter(w => w.nextReview && new Date(w.nextReview).toDateString() === new Date().toDateString())
    .slice(0, 3);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Welcome back! 👋</h1>
        <p className="text-gray-600 mt-2">Let's continue your learning journey</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Words Learned */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm">Words Learned</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">{totalLearned}</p>
              <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +12% this week
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Review Due */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm">Review Due</p>
              <p className="text-4xl font-bold text-purple-600 mt-2">{reviewDue}</p>
              <Link to="/review" className="text-purple-600 text-sm mt-2 inline-flex items-center gap-1 hover:underline">
                Start reviewing →
              </Link>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Daily Goal */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm">Daily Goal</p>
              <p className="text-4xl font-bold text-green-600 mt-2">8/10</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link 
          to="/search"
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Learn New Words</h3>
              <p className="text-sm text-gray-600">Search and discover</p>
            </div>
          </div>
        </Link>

        <Link 
          to="/relate"
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-xl group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Explore Connections</h3>
              <p className="text-sm text-gray-600">View word relationships</p>
            </div>
          </div>
        </Link>

        <Link 
          to="/review"
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Practice Review</h3>
              <p className="text-sm text-gray-600">Test your knowledge</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
