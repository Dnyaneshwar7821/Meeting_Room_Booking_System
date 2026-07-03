import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogoutIcon, MenuIcon, XIcon } from "./ui/Icons";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dashboardPath =
    user?.role === "ADMIN" ? "/admin/dashboard" : "/employee/dashboard";

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const links = [
    { label: "Dashboard", to: dashboardPath },

    ...(user?.role === "ADMIN"
      ? [
          {
            label: user?.systemAdmin
              ? "User Management"
              : "Employee Management",
            to: "/users",
          },

          { label: "Rooms", to: "/rooms" },

          { label: "Bookings", to: "/bookings" },
        ]
      : [
          { label: "Rooms", to: "/rooms" },
          { label: "My Bookings", to: "/my-bookings" },
        ]),
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/95 shadow-lg backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-xl font-black text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40">
              MR
            </div>
            <div>
              <p className="font-black tracking-tight text-slate-900">
                Meeting Rooms
              </p>
              <p className="text-xs font-medium text-slate-500">
                {user?.name} · {user?.role}
              </p>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="lg:hidden flex items-center justify-center rounded-xl p-2 text-slate-600 transition-all duration-300 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <XIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <nav
          className={`${
            isMobileMenuOpen ? "flex" : "hidden"
          } lg:flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-1.5 transition-all duration-300`}
        >
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `relative rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-50 to-violet-50 text-blue-700 shadow-md"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <button
            type="button"
            onClick={logout}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-800/30 transition-all duration-300 hover:from-red-600 hover:to-red-700 hover:shadow-xl hover:shadow-red-600/30"
          >
            <LogoutIcon className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;