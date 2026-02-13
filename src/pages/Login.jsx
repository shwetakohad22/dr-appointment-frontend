import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";
import {
  FaStethoscope,
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaCheckCircle,
  FaUserShield,
} from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/api/user/login", { email, password });

      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.user._id);

        // Quick role check based on response if available or fetch
        // Assuming the login response might be simple, let's fetch profile to be sure or check if user object has isAdmin
        if (response.data.user.isAdmin) {
          navigate("/admin/dashboard");
        } else if (response.data.user.isDoctor) {
          navigate("/doctor/dashboard");
        } else {
          navigate("/home");
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("Invalid credentials or server error");
    } finally {
      setLoading(false);
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-poppins text-text">
      {/* Main Card */}
      <div className="w-full max-w-6xl bg-white rounded-[3rem] shadow-custom overflow-hidden flex flex-col md:flex-row h-[600px]">
        {/* Left Side - Hero Section Style */}
        <div className="hidden md:flex flex-1 flex-col justify-center bg-deep-blue text-white p-10 relative overflow-hidden">
          {/* Large Background Text */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center z-0 pointer-events-none opacity-10">
            <h1 className="text-[8rem] font-bold leading-none tracking-tighter select-none">
              Login
            </h1>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-xl font-bold mb-6">
              <span className="text-2xl">🩺</span> MediCare
            </div>

            <h2 className="text-4xl font-bold leading-tight mb-4">
              Welcome <br /> Back!
            </h2>
            <p className="text-gray-300 text-base leading-relaxed max-w-sm">
              Your health journey continues here. Access your records, book
              appointments, and stay connected.
            </p>

            {/* Floating Badges (Similar to Landing Page) */}
            <div className="mt-8 relative h-24">
              <div className="absolute top-0 left-0 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-3 border border-white/10 animate-bounce delay-100">
                <span className="bg-white text-deep-blue p-1.5 rounded-full">
                  <FaCheckCircle className="text-sm" />
                </span>
                <span className="font-medium text-sm">Secure Access</span>
              </div>

              <div className="absolute bottom-0 right-0 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-3 border border-white/10 animate-bounce delay-700">
                <span className="bg-card-pink text-deep-blue p-1.5 rounded-full">
                  <FaUserShield className="text-sm" />
                </span>
                <span className="font-medium text-sm">Patient Portal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-white relative">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-6">
              <div className="inline-block p-3 rounded-full bg-gray-50 mb-3 md:hidden">
                <span className="text-3xl">🩺</span>
              </div>
              <h2 className="text-2xl font-bold text-deep-blue mb-1">
                Sign In
              </h2>
              <p className="text-gray-500 text-sm">
                Please enter your details to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400 group-focus-within:text-deep-blue transition-colors text-sm" />
                  </div>
                  <input
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-deep-blue/20 rounded-xl focus:bg-white transition-all outline-none font-medium text-gray-700 text-sm"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400 group-focus-within:text-deep-blue transition-colors text-sm" />
                  </div>
                  <input
                    type="password"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-deep-blue/20 rounded-xl focus:bg-white transition-all outline-none font-medium text-gray-700 text-sm"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="flex justify-end mt-1">
                  <button
                    type="button"
                    className="text-[10px] text-gray-500 hover:text-deep-blue font-medium transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-deep-blue text-white font-bold py-3 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md hover:shadow-deep-blue/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base mt-2"
              >
                {loading ? (
                  <span className="animate-pulse">Signing In...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <div className="bg-white/20 p-1 rounded-full">
                      <FaArrowRight className="text-xs" />
                    </div>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 font-medium text-sm">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-deep-blue font-bold hover:underline ml-1"
                >
                  Create Account
                </Link>
              </p>
            </div>

            {/* Back to Home Link */}
            <div className="text-center mt-6">
              <button
                onClick={() => navigate("/")}
                className="text-gray-400 hover:text-deep-blue text-xs font-medium transition-colors duration-200 flex items-center justify-center gap-2 mx-auto"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
