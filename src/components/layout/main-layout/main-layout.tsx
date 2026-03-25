import { Outlet, Navigate } from "react-router";
import { useAuthStore } from "@/store/auth.store";
import { Sidebar } from "../sidebar/sidebar";
import { Header } from "../header/header";
import { Loading } from "@/pages/app/loading";

export function MainLayout() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="w-full flex h-dvh">
      <div className="h-full flex">
        <Sidebar />
      </div>

      <div className="flex flex-1 h-full flex-col">
        <Header />
        <div className="flex-1 relative overflow-y-auto overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
