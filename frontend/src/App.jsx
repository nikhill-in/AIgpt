import { Routes, Route } from "react-router-dom";
import "./styles/global.css";
import { AuthProvider} from "./context/AuthContext.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import MainPage from "./pages/MainPage.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";


 function AppContent() {
  const { authLoading } = AuthProvider.useAuth();

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#9c9c9c] dark:bg-[#0a0a0c]">
        <p className="text-black dark:text-[#8a8a92]">Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={<ProtectedRoute><MainPage /></ProtectedRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen overflow-x-hidden bg-[#0a0a0c] text-[#f5f5f7]">
        <AppContent />
      </div>
    </AuthProvider>
  );
}