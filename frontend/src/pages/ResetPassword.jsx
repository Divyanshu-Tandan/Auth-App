import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast';

const ResetPassword = () => {
  const API_BASE = import.meta.env.VITE_API_URL;
  const { token } = useParams();
  const navigate = useNavigate();

  const [resetData, setResetData] = useState({
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setResetData({
      ...resetData,
      [e.target.name]: e.target.value
    });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (resetData.password !== resetData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);

    try {
      await axios.post(
        `${API_BASE}/api/users/reset-password/${token}`,
        {
          password: resetData.password,
          confirmPassword: resetData.confirmPassword
        }
      );

      toast.success("Password reset successful");

      setResetData({
        password: "",
        confirmPassword: ""
      });

      navigate('/login');

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-dvh flex items-center justify-center overflow-hidden bg-[#0b0f0d] text-white px-4">

      <div className="absolute w-72 sm:w-96 h-72 sm:h-96 bg-emerald-500/30 blur-[100px] sm:blur-[120px] rounded-full top-1/4 left-1/4 sm:left-1/3" />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[60px_60px] opacity-30" />

      <div className="relative z-10 w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-[0_0_80px_rgba(16,185,129,0.25)]">

        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6">
          <span className="text-emerald-400">
            Set New
          </span>{" "}
          Password
        </h2>

        <form onSubmit={handleResetPassword} className="space-y-5">
          <div className="flex flex-col gap-1 relative">
            <label className="text-sm text-gray-300">
              New Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={resetData.password}
              onChange={handleChange}
              required
              className="bg-black/40 border border-white/20 rounded-md px-3 py-2 outline-none focus:border-emerald-400"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2"
            >
              {resetData.password === "" ? "" : showPassword ? <img src="/eyeIcon.svg" alt="show" /> : <img src="/eyeOffIcon.svg" alt="hide" />}
            </button>
          </div>

          <div className="flex flex-col gap-1 relative">
            <label className="text-sm text-gray-300">
              Confirm Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={resetData.confirmPassword}
              onChange={handleChange}
              required
              className="bg-black/40 border border-white/20 rounded-md px-3 py-2 outline-none focus:border-emerald-400"
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-2 rounded-full bg-emerald-500/20 border border-emerald-400/40 hover:bg-emerald-500/30"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default ResetPassword;
