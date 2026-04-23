import { NavLink } from "react-router-dom";

const Home = ({ user, error }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0f0d] text-white">

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[60px_60px] opacity-30" />

      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.25),transparent_60%)]" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center text-center px-6">

        {error && (
          <p className="absolute top-24 text-red-400 text-sm">
            {error}
          </p>
        )}

        {user ? (
          <div className="backdrop-blur-xl bg-white/5 border border-emerald-400/30 rounded-3xl p-10 shadow-[0_0_80px_rgba(16,185,129,0.2)] animate-fadeInUp">
            <h2 className="text-3xl font-semibold text-emerald-400 mb-2">
              Welcome {user.username}
            </h2>
            <p className="text-gray-300 text-lg">
              Email: {user.email}
            </p>
          </div>
        ) : (
          <div className="max-w-3xl animate-fadeInUp">
            <h1 className="text-6xl md:text-7xl font-serif leading-tight mb-6">
              <span className="block text-white">Secure</span>
              <span className="block text-emerald-400">Login & User</span>
              <span className="block text-white">Management</span>
            </h1>

            <p className="text-gray-400 text-lg mb-10">
              Build modern, elegant interfaces with smooth interactions and
              high-impact design systems.
            </p>

            <div className="flex justify-center gap-6">
              <NavLink
                to="/login"
                className="px-6 py-3 rounded-full bg-emerald-500/20 border border-emerald-400/40 backdrop-blur-md hover:bg-emerald-500/30 transition"
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="px-6 py-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 transition"
              >
                Register
              </NavLink>
            </div>
          </div>
        )}
      </div>

      {/* Floating Buttons */}
      <div className="absolute right-12 z-12 top-40 backdrop-blur-md bg-emerald-500/20 border border-emerald-400/40 px-6 py-3 rounded-full text-sm animate-float">
        <NavLink
          to='https://github.com/Divyanshu-Tandan/Auth-App'>
          View Source
        </NavLink>
      </div>

      <div className="absolute left-12 z-12 bottom-32 backdrop-blur-md bg-white/10 border border-white/20 px-6 py-3 rounded-full text-sm animate-floatSlow">
        <NavLink
          to='https://www.linkedin.com/in/divyanshu-tandan-675a62261/'>
          Connect
        </NavLink>
      </div>

      <div className="absolute right-12 z-12 bottom-24 backdrop-blur-md bg-white/10 border border-white/20 px-6 py-3 rounded-full text-sm animate-float">
        <NavLink
          to='https://picsum.photos/800/600'>
          Images
        </NavLink>
      </div>
    </div>
  );
};

export default Home;
