import { Outlet } from "react-router-dom";

import AppSidebar from "../components/layout/AppSidebar";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AppSidebar />

      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}