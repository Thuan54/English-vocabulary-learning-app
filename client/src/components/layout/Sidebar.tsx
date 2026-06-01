import { Link, useLocation } from "react-router";
import {
  Home,
  Search,
  Network,
  BookOpen,
  Flame
} from "lucide-react";
import StreakCard from "./StreakCard";
import { useVocabulary } from "../../contexts/VocabularyContext";

export default function Sidebar() {
  const location = useLocation();
  const { streak } = useVocabulary();

  const navItems = [
    { path: "/", icon: Home, label: "Dashboard" },
    { path: "/search", icon: Search, label: "Search" },
    { path: "/relate", icon: Network, label: "Related Words" },
    { path: "/review", icon: BookOpen, label: "Review" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          VocabMind
        </h1>
        <p className="text-sm text-gray-500 mt-1">Learn smarter, not harder</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-purple-200"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <StreakCard streak={streak} />
      </div>
    </aside>
  );
}
