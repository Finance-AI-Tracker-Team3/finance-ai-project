import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddExpenseModal from "../components/AddExpenseModal";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  FiHome,
  FiPieChart,
  FiDollarSign,
  FiTarget,
  FiSettings,
  FiLogOut,
  FiAlertTriangle,
  FiPlusCircle,
} from "react-icons/fi";
import {
  getExpenses,
  getBudgets,
  getCategories,
} from "../services/apiService";

const COLORS = ["#4F46E5", "#6366F1", "#A855F7", "#22C55E", "#F97316"];

const Dashboard = () => {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [loading, setLoading] = useState(true);

  /* ---------- AUTH ---------- */
  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, [navigate]);

  /* ---------- THEME ---------- */
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  /* ---------- LOAD DATA ---------- */
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      const [expenseRes, budgetRes, categoryRes] = await Promise.all([
        getExpenses(),
        getBudgets(),
        getCategories(),
      ]);

      setExpenses(expenseRes.data || []);
      setBudgets(budgetRes.data || []);
      setCategories(categoryRes.data || []);
    } catch (err) {
      console.error("Dashboard load failed", err);
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  /* ---------- CATEGORY MAP ---------- */
  const categoryMap = useMemo(() => {
    const map = {};
    categories.forEach((c) => {
      map[c.categoryId] = c.categoryName;
    });
    return map;
  }, [categories]);

  /* ---------- KPI ---------- */
  const monthlySpend = useMemo(() => {
    const now = new Date();
    return expenses
      .filter(
        (e) =>
          e.type === "EXPENSE" &&
          new Date(e.transactionDate).getMonth() === now.getMonth() &&
          new Date(e.transactionDate).getFullYear() === now.getFullYear()
      )
      .reduce((sum, e) => sum + Math.abs(e.amount), 0);
  }, [expenses]);

  const totalBudget = useMemo(
    () => budgets.reduce((sum, b) => sum + Number(b.amountLimit || 0), 0),
    [budgets]
  );

  const isOverBudget = totalBudget > 0 && monthlySpend > totalBudget;

  /* ---------- CATEGORY PIE ---------- */
  const categoryData = useMemo(() => {
    const map = {};
    expenses
      .filter((e) => e.type === "EXPENSE")
      .forEach((e) => {
        const name = categoryMap[e.categoryId] || "Others";
        map[name] = (map[name] || 0) + Math.abs(e.amount);
      });

    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }));
  }, [expenses, categoryMap]);

  /* ---------- TREND ---------- */
  const trendData = useMemo(() => {
    const map = {};
    expenses
      .filter((e) => e.type === "EXPENSE")
      .forEach((e) => {
        const d = new Date(e.transactionDate);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        map[key] = (map[key] || 0) + Math.abs(e.amount);
      });

    return Object.keys(map)
      .sort()
      .map((k) => {
        const [y, m] = k.split("-");
        return {
          month: new Date(y, m).toLocaleString("en-US", { month: "short" }),
          spent: map[k],
          budget: totalBudget,
        };
      });
  }, [expenses, totalBudget]);

  const recentExpenses = useMemo(
    () =>
      [...expenses]
        .sort(
          (a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)
        )
        .slice(0, 5),
    [expenses]
  );

  /* ---------- LOGOUT ---------- */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-900 text-black dark:text-white">
      {/* SIDEBAR */}
      <aside className="hidden md:flex w-64 flex-col border-r">
        <nav className="px-4 py-6 space-y-2">
          <SidebarItem icon={<FiHome />} label="Dashboard" active />
          <Link to="/expenses">
            <SidebarItem icon={<FiPieChart />} label="Expenses" />
          </Link>
          <Link to="/budgets">
            <SidebarItem icon={<FiDollarSign />} label="Budgets" />
          </Link>
          <Link to="/goals">
            <SidebarItem icon={<FiTarget />} label="Goals" />
          </Link>
          <Link to="/settings">
            <SidebarItem icon={<FiSettings />} label="Settings" />
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="m-4 py-2 rounded bg-rose-500/20 text-rose-400"
        >
          <FiLogOut /> Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6 space-y-6">
        <header className="flex justify-between">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? "🌞" : "🌙"}
          </button>
        </header>

        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          <>
            <section className="grid sm:grid-cols-3 gap-4">
              <KpiCard label="Monthly Spend" value={`₹${monthlySpend}`} />
              <KpiCard label="Total Budget" value={`₹${totalBudget}`} />
              <AlertCard isOver={isOverBudget} />
            </section>

            <section className="grid xl:grid-cols-3 gap-4">
              <CategoryChart data={categoryData} />
              <TrendChart data={trendData} />
            </section>

            <RecentTransactions
              expenses={recentExpenses}
              categoryMap={categoryMap}
            />
          </>
        )}

        <button
          onClick={() => setOpenModal(true)}
          className="fixed bottom-6 right-6 bg-indigo-500 text-white px-4 py-2 rounded"
        >
          <FiPlusCircle /> Add Expense
        </button>

        {openModal && (
          <AddExpenseModal
            close={() => setOpenModal(false)}
            refresh={loadDashboardData}
          />
        )}
      </main>
    </div>
  );
};

/* ---------- COMPONENTS ---------- */

const SidebarItem = ({ icon, label, active }) => (
  <div
    className={`flex items-center gap-3 px-3 py-2 rounded ${
      active ? "bg-indigo-500 text-white" : ""
    }`}
  >
    {icon} {label}
  </div>
);

const KpiCard = ({ label, value }) => (
  <div className="p-4 rounded bg-gray-100 dark:bg-white/5">
    <p className="text-xs uppercase">{label}</p>
    <h2 className="text-xl font-semibold">{value}</h2>
  </div>
);

const AlertCard = ({ isOver }) => (
  <div
    className={`p-4 rounded ${isOver ? "bg-rose-500/20" : "bg-emerald-500/20"}`}
  >
    <FiAlertTriangle /> {isOver ? "Over Budget ⚠️" : "Within Budget ✅"}
  </div>
);

const CategoryChart = ({ data }) => (
  <div className="p-4 rounded bg-gray-100 dark:bg-white/5">
    <h3>Spending by Category</h3>
    <ResponsiveContainer height={250}>
      <PieChart>
        <Pie data={data} dataKey="value" innerRadius={50}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

const TrendChart = ({ data }) => (
  <div className="p-4 rounded bg-gray-100 dark:bg-white/5">
    <h3>Spending Trend</h3>
    <ResponsiveContainer height={250}>
      <LineChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line dataKey="spent" stroke="#6366F1" />
        <Line dataKey="budget" stroke="#22C55E" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const RecentTransactions = ({ expenses, categoryMap }) => (
  <div className="p-4 rounded bg-gray-100 dark:bg-white/5">
    <h3>Recent Transactions</h3>
    <table className="w-full text-sm">
      <tbody>
        {expenses.map((e) => (
          <tr key={e.transactionId}>
            <td>{e.description}</td>
            <td>{categoryMap[e.categoryId] || "Others"}</td>
            <td className="text-right">₹{Math.abs(e.amount)}</td>
            <td className="text-right">
              {new Date(e.transactionDate).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Dashboard;
