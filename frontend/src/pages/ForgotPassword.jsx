import axios from "axios";
import { useState } from "react";
import { useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
  const API_BASE = import.meta.env.VITE_API_URL;

  const navigate = useNavigate()
  const [step, setStep] = useState(1);

  const [resetData, setResetData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  const [loading,setLoading] = useState(false);
  const [message,setMessage] = useState("");
  const [error,setError] = useState("");

  const handleChange = (e) => {
    setResetData({
      ...resetData,
      [e.target.name]: e.target.value
    });
  };

  // STEP 1 SEND OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {

      await axios.post(
        `${API_BASE}/api/users/forgot-password/send-otp`,
        {
          email: resetData.email
        }
      );

      setMessage("OTP sent to your email");
      setStep(2);

    } catch(err){
      setError(
        err.response?.data?.message ||
        "Failed to send OTP"
      );
    } finally{
      setLoading(false);
    }
  };


  // STEP 2 VERIFY OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try{

      await axios.post(
        `${API_BASE}/api/users/forgot-password/verify-otp`,
        {
          email: resetData.email,
          otp: resetData.otp
        }
      );

      setMessage("OTP verified");
      setStep(3);

    } catch(err){
      setError(
        err.response?.data?.message ||
        "Invalid OTP"
      );
    } finally{
      setLoading(false);
    }
  };


  // STEP 3 RESET PASSWORD
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if(
      resetData.newPassword !==
      resetData.confirmPassword
    ){
      return setError(
        "Passwords do not match"
      );
    }

    setLoading(true);
    setError("");
    setMessage("");

    try{

      await axios.post(
        `${API_BASE}/api/users/forgot-password/reset-password`,
        {
          email: resetData.email,
          otp: resetData.otp,
          newPassword: resetData.newPassword
        }
      );

      setMessage(
       "Password reset successful"
      );

      setResetData({
        email:"",
        otp:"",
        newPassword:"",
        confirmPassword:""
      });

      setStep(1);
      navigate('/login')

    } catch(err){
      setError(
       err.response?.data?.message ||
       "Reset failed"
      );
    } finally{
      setLoading(false);
    }
  };


  return (
   <div className="relative min-h-dvh overflow-hidden flex items-center justify-center overflow-hidden bg-[#0b0f0d] text-white px-4">

      <div className="absolute w-72 sm:w-96 h-72 sm:h-96 bg-emerald-500/30 blur-[100px] sm:blur-[120px] rounded-full top-1/4 left-1/4 sm:left-1/3" />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[60px_60px] opacity-30" />

      <div className="relative z-10 w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-[0_0_80px_rgba(16,185,129,0.25)]">

        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6">
          <span className="text-emerald-400">
            Reset
          </span>{" "}
          Password
        </h2>

        {message && (
         <p className="text-emerald-400 text-center mb-4 text-sm">
          {message}
         </p>
        )}

        {error && (
         <p className="text-red-400 text-center mb-4 text-sm">
          {error}
         </p>
        )}


        {/* STEP 1 EMAIL */}
        {step===1 && (
          <form
           onSubmit={handleSendOTP}
           className="space-y-5"
          >
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-300">
                Email
              </label>

              <input
               type="email"
               name="email"
               value={resetData.email}
               onChange={handleChange}
               required
               className="bg-black/40 border border-white/20 rounded-md px-3 py-2 outline-none focus:border-emerald-400"
              />
            </div>

            <button
             disabled={loading}
             className="w-full py-2 rounded-full bg-emerald-500/20 border border-emerald-400/40 hover:bg-emerald-500/30"
            >
              {loading ?
                "Sending..." :
                "Send OTP"
              }
            </button>

          </form>
        )}


        {/* STEP 2 OTP */}
        {step===2 && (
          <form
           onSubmit={handleVerifyOTP}
           className="space-y-5"
          >

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-300">
                Enter OTP
              </label>

              <input
               type="text"
               name="otp"
               value={resetData.otp}
               onChange={handleChange}
               maxLength="6"
               required
               className="bg-black/40 border border-white/20 rounded-md px-3 py-2 text-center tracking-[10px] outline-none focus:border-emerald-400"
              />
            </div>

            <button
             disabled={loading}
             className="w-full py-2 rounded-full bg-emerald-500/20 border border-emerald-400/40"
            >
             {loading ?
              "Verifying..." :
              "Verify OTP"
             }
            </button>

          </form>
        )}



       {/* STEP 3 NEW PASSWORD */}
       {step===3 && (
         <form
          onSubmit={handleResetPassword}
          className="space-y-5"
         >

          <div className="flex flex-col gap-1 relative">
           <label className="text-sm text-gray-300">
             New Password
           </label>

           <input
            type={
             showPassword
             ? "text"
             : "password"
            }
            name="newPassword"
            value={resetData.newPassword}
            onChange={handleChange}
            required
            className="bg-black/40 border border-white/20 rounded-md px-3 py-2 outline-none focus:border-emerald-400"
           />

           <button
            type="button"
            onClick={()=>
             setShowPassword(
              !showPassword
             )
            }
            className="absolute right-3 top-1/2"
           >
             {resetData.newPassword == "" ? "" : showPassword ? <img src="/eyeIcon.svg" /> : <img src="/eyeOffIcon.svg" /> }
           </button>
          </div>



          <div className="flex flex-col gap-1 relative">
           <label className="text-sm text-gray-300">
             Confirm Password
           </label>

           <input
            type={
             showPassword
             ? "text"
             : "password"
            }
            name="confirmPassword"
            value={resetData.confirmPassword}
            onChange={handleChange}
            required
            className="bg-black/40 border border-white/20 rounded-md px-3 py-2 outline-none focus:border-emerald-400"
           />

           <button
            type="button"
            onClick={()=>
             setShowPassword(
              !showPassword
             )
            }
            className="absolute right-3 top-9"
           >
           </button>

          </div>

          <button
           disabled={loading}
           className="w-full py-2 rounded-full bg-emerald-500/20 border border-emerald-400/40"
          >
            {loading ?
             "Updating..." :
             "Reset Password"
            }
          </button>

         </form>
       )}

      </div>
   </div>
  );
};

export default ForgotPassword;