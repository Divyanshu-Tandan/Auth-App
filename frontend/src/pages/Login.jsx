import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // NEW
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // START LOADING

    try {
      const payload = {
        password: formData.password,
        ...(formData.login.includes('@') ?
        { email: formData.login } :
        { username: formData.login })
      };

      const res = await axios.post(
        `${API_BASE}/api/users/login`,
        payload, { withCredentials: true }
      );

      setUser(res.data);
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong")
      navigate("/login");
    } finally {
      setLoading(false); // STOP LOADING
    }
  };
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0b0f0d] text-white">

      {/* Animated Blob */}
      <div className="absolute w-105 h-105 bg-emerald-500/40 blur-[120px] rounded-full animate-blob top-1/4 left-1/3" />
      <div className="absolute w-75 h-75 bg-emerald-400/30 blur-[120px] rounded-full animate-blob animation-delay-2000 top-1/2 right-1/4" />

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[60px_60px] opacity-30" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-[0_0_80px_rgba(16,185,129,0.25)] animate-fadeInUp">

        <h2 className="text-3xl font-semibold text-center mb-6">
          <span className="text-emerald-400">Welcome</span> Back
        </h2>

        {error && (
          <p className="text-red-400 text-sm text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">Email or Username</label>
            <input
              type="text"
              name="login"
              onChange={handleChange}
              value={formData.email}
              disabled={loading}
              className="bg-black/40 border border-white/20 rounded-md px-3 py-2 outline-none focus:border-emerald-400 transition disabled:opacity-50"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              value={formData.password}
              disabled={loading}
              className="bg-black/40 border border-white/20 rounded-md px-3 py-2 outline-none focus:border-emerald-400 transition disabled:opacity-50"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/30 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-emerald-300 border-t-transparent rounded-full animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
