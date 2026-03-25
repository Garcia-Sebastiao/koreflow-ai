import { Route, Routes } from "react-router";
import { SignInPage } from "./pages/auth/sign-in";
import { MainLayout } from "./components/layout/main-layout/main-layout";
import { DashboardPage } from "./pages/app/dashboard/dashboard-page";
import { useEffect } from "react";
import { auth } from "./config/firebase.config";
import { userService } from "./services/firebase/user.service";
import { useAuthStore } from "./store/auth.store";
import BoardPage from "./pages/app/boards/board";

export function App() {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        const userProfile = await userService.syncUserProfile(firebaseUser);
        useAuthStore.getState().setUser(userProfile, token);
      } else {
        useAuthStore.getState().logout();
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <Routes>
      <Route index path="/" element={<SignInPage />} />

      <Route element={<MainLayout />}>
        <Route path="/app/dashboard" element={<DashboardPage />} />
        <Route path="/app/board/:id" element={<BoardPage />} />
      </Route>
    </Routes>
  );
}
