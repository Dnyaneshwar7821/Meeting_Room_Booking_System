import { useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { getErrorMessage } from "../utils/errors";
import PasswordInput from "../components/PasswordInput";
import { showSuccess, showError } from "../utils/toast";
import { BackIcon } from "../components/ui/Icons";

const EmployeeLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showError("Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await API.post("/users/employee-login", { email, password });
      localStorage.setItem("user", JSON.stringify(response.data));
      showSuccess("Employee Login Successful");
      setPassword("");
      navigate("/employee/dashboard", { replace: true });
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.4),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.35),_transparent_45%)]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblRyYW5zZm9ybT0ic2NhbGUoMC4wNSkiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-30" />
      
      {/* Animated background blobs */}
      <div className="absolute -left-24 top-20 h-72 w-72 animate-pulse rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-80 w-80 animate-pulse rounded-full bg-cyan-500/20 blur-3xl animation-delay-2000" />
      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-teal-500/10 blur-3xl animation-delay-4000" />

      <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-white/95 p-8 shadow-2xl shadow-emerald-950/50 backdrop-blur-xl sm:p-10 animate-scale-in">
        <div className="mb-8">
          <Link
            to="/"
            className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition-all duration-300 hover:text-emerald-800 hover:gap-3"
          >
            <BackIcon className="h-4 w-4" />
            Back to home
          </Link>
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-cyan-600 text-2xl font-black text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-110 hover:shadow-xl">
            EP
          </div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
            Workplace Portal
          </p>
          <h1 className="text-3xl font-black text-gray-900">
            Employee Login
          </h1>
          <p className="mt-2 text-gray-600">
            Access meeting room bookings.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3.5 text-gray-900 transition-all duration-300 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 hover:border-gray-300 hover:shadow-md"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <PasswordInput
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3.5 pr-12 text-gray-900 transition-all duration-300 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 hover:border-gray-300 hover:shadow-md"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 py-4 font-bold text-white shadow-xl shadow-emerald-600/30 transition-all duration-300 hover:from-emerald-700 hover:to-cyan-700 hover:shadow-2xl hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Signing in...</span>
              </span>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="mt-4 text-center">
            <Link
              to="/set-password"
              className="font-medium text-emerald-600 transition-all duration-300 hover:text-emerald-800 hover:underline"
            >
              First-time access? Create Password
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EmployeeLogin;