import { Outlet } from "react-router-dom";
import Sidebar from "../assets/components/Sidebar";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}