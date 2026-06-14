import axios from "axios";
import { useState } from "react";
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
  const API_BASE = import.meta.env.VITE_API_URL;
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendLink = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await axios.post(
        `${API_BASE}/api/users/forgot-password`,
        { email }
      );

      toast.success("Password reset link sent to your email");
      setEmail("");

    } catch(err){
      toast.error(
        err.response?.data?.message ||
        "Failed to send reset link"
      );
    } finally{
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
            Forgot
          </span>{" "}
          Password
        </h2>

        <form onSubmit={handleSendLink} className="space-y-5">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-black/40 border border-white/20 rounded-md px-3 py-2 outline-none focus:border-emerald-400"
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-2 rounded-full bg-emerald-500/20 border border-emerald-400/40 hover:bg-emerald-500/30"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

      </div>
   </div>
  );
};

export default ForgotPassword;