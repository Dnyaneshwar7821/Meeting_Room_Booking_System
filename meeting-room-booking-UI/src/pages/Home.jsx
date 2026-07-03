import { Link } from "react-router-dom";

const Home = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.4),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.35),_transparent_45%)]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblRyYW5zZm9ybT0ic2NhbGUoMC4wNSkiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-30" />
      <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />

      <section className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-16 lg:px-10">
        <div className="grid w-full items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-4 py-2 text-sm font-semibold text-blue-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Simple workplace room reservations
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight sm:text-6xl">
              Your meeting room,
              <span className="block bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                ready when you are.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Employees can reserve available rooms in seconds. Administrators
              can manage rooms, employees, and every active booking from one
              clear dashboard.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/admin-login"
                className="group rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-7 py-3.5 font-bold shadow-lg shadow-blue-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                Admin Login
              </Link>

              <Link
                to="/employee-login"
                className="group rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-7 py-3.5 font-bold shadow-lg shadow-emerald-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                Employee Login
              </Link>
              <Link
                to="/set-password"
                className="group rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 font-bold transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
              >
                Create password
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-blue-950/50 backdrop-blur-xl sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
              How it works
            </p>
            <div className="mt-6 space-y-4">
              {[
                ["01", "Admin adds employees and meeting rooms"],
                [
                  "02",
                  "Employee creates a password using their registered email",
                ],
                ["03", "Employee books an available room for a meeting"],
                ["04", "Cancellation makes the room available again"],
              ].map(([number, text]) => (
                <div
                  key={number}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/40 p-4 transition-all duration-300 hover:bg-slate-900/60"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 font-black text-blue-300">
                    {number}
                  </span>
                  <p className="font-medium text-slate-200">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;