import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

/* AUTH */
import Login from "./pages/Login";
import Signup from "./pages/Signup";

/* CORE PAGES */
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Expenses from "./pages/Expenses";
import Budgets from "./pages/Budgets";
import Goals from "./pages/Goals";
import Settings from "./pages/Settings";

/* AI PAGES */
import AiDashboard from "./pages/AI/Dashboard";
import CategoryTrends from "./pages/AI/CategoryTrends";
import MonthlyForecast from "./pages/AI/MonthlyForecast";
import PeakDays from "./pages/AI/PeakDays";
import AdvancedInsights from "./pages/AI/AdvancedInsights";

function App() {
  return (
    <Router>
      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ================= PROTECTED ================= */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/accounts"
          element={
            <ProtectedRoute>
              <Accounts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <Expenses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/budgets"
          element={
            <ProtectedRoute>
              <Budgets />
            </ProtectedRoute>
          }
        />

        <Route
          path="/goals"
          element={
            <ProtectedRoute>
              <Goals />
            </ProtectedRoute>
          }
        />

        {/* ================= AI ================= */}
        <Route
          path="/ai-insights"
          element={
            <ProtectedRoute>
              <AiDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-category"
          element={
            <ProtectedRoute>
              <CategoryTrends />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-forecast"
          element={
            <ProtectedRoute>
              <MonthlyForecast />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-peaks"
          element={
            <ProtectedRoute>
              <PeakDays />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-advanced"
          element={
            <ProtectedRoute>
              <AdvancedInsights />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
 