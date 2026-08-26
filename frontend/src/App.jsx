import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import "./styles/global.css";

import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

// Lazy-loaded route components
const LandingPage = lazy(() => import("./pages/LandingPage.jsx"));
const MainPage = lazy(() => import("./pages/MainPage.jsx"));

// Small fallback for lazy-loaded route chunks
function PageLoader() {
  return (
    <div
      className="
        flex h-[100dvh]
        items-center justify-center
        bg-[#f8f9fb]
        dark:bg-[#0a0a0c]
      "
    >
      <div
        className="
          h-8 w-8
          animate-spin
          rounded-full
          border-2
          border-[#ff7a18]/30
          border-t-[#ff7a18]
        "
      />
    </div>
  );
}

function AppContent() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-full overflow-x-hidden bg-[#0a0a0c] text-[#f5f5f7]">
        <AppContent />
      </div>
    </AuthProvider>
  );
}
