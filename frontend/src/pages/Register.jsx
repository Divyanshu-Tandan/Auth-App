import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Register = ({ setUser }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/api/users/register`, formData);
      const token = res.data.token
      setUser(res.data);
      toast.success("Registration successful!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="relative min-h-dvh overflow-hidden flex items-center justify-center overflow-hidden bg-[#0b0f0d] text-white">

      {/* Animated Blobs */}
      <div className="absolute w-105 h-105 bg-emerald-500/40 blur-[120px] rounded-full animate-blob top-1/4 left-1/4" />
      <div className="absolute w-75 h-75 bg-emerald-400/30 blur-[120px] rounded-full animate-blob animation-delay-2000 bottom-1/4 right-1/4" />

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[60px_60px] opacity-30" />

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-md mx-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-[0_0_80px_rgba(16,185,129,0.25)] animate-fadeInUp">

        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6">
          <span className="text-emerald-400">Create</span> Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              onChange={handleChange}
              value={formData.username}
              className="bg-black/40 border border-white/20 rounded-md px-3 py-2 outline-none focus:border-emerald-400 transition"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              value={formData.email}
              className="bg-black/40 border border-white/20 rounded-md px-3 py-2 outline-none focus:border-emerald-400 transition"
              required
            />
          </div>

          <div className="flex flex-col gap-1 relative">
            <label className="text-sm text-gray-300">Password</label>
            <input
              type={showPassword ? "text" : "password" }
              name="password"
              placeholder="Create a password"
              onChange={handleChange}
              value={formData.password}
              className="bg-black/40 border border-white/20 rounded-md px-3 py-2 outline-none focus:border-emerald-400 transition"
              required
            />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2"
              >
                {formData.password == "" ? "" : showPassword ? <img src="/eyeIcon.svg" /> : <img src="/eyeOffIcon.svg" /> }
              </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/30 transition cursor-pointer"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
