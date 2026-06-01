import { Outlet } from "react-router";
import Sidebar from "./layout/Sidebar";

export function Layout() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
