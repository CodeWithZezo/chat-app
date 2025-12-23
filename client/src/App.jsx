import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useAuthStore } from "./zustand/auth";

import Signup from "./pages/signup/signup";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";

const App = () => {
  const { getProfile, isAuthChecked } = useAuthStore();

  useEffect(() => {
    getProfile(); // 🔥 only once on app load
  }, []);

  // ⛔ wait until auth check completes
  if (!isAuthChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>

      <Toaster position="top-right" />
    </>
  );
};

export default App;
