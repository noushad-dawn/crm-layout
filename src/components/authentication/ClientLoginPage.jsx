import { useState, useEffect } from "react";
import api from "../../api/axios";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import logo from "../../assets/logo.jpg";
import config from "../config";

const ClientLogin = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const navigate = useNavigate();

  // Check for valid token on component mount
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      const clientValidated =
        localStorage.getItem("clientValidated") === "true";

      if (!token || !clientValidated) {
        setCheckingSession(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp > currentTime) {
          navigate("/login");
        } else {
          // Clear invalid token
          localStorage.removeItem("token");
          localStorage.removeItem("clientValidated");
          setCheckingSession(false);
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("clientValidated");
        setCheckingSession(false);
      }
    };

    checkToken();
  }, [navigate]);

  // Validate form on input change
  useEffect(() => {
    const isValid = emailOrPhone.trim() && password.trim();
    setFormValid(isValid);
  }, [emailOrPhone, password]);

  const validateInputs = () => {
    if (!emailOrPhone.trim()) {
      setError("Please enter your email or phone number");
      return false;
    }

    if (!password.trim()) {
      setError("Please enter your password");
      return false;
    }

    // Email validation
    if (
      emailOrPhone.includes("@") &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrPhone)
    ) {
      setError("Please enter a valid email address");
      return false;
    }

    // Phone validation (minimum 10 digits)
    if (!emailOrPhone.includes("@") && !/^[\d\s+-]{10,}$/.test(emailOrPhone)) {
      setError("Please enter a valid phone number (at least 10 digits)");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateInputs()) return;

    setIsLoading(true);

    try {
      const res = await api.post(`${config.baseURL}/api/auth/login`, {
        email: emailOrPhone.includes("@") ? emailOrPhone : undefined,
        phone: !emailOrPhone.includes("@") ? emailOrPhone : undefined,
        password,
      });

      const { token, tenant } = res.data;

      // Save authentication data
      localStorage.setItem("token", token);
      localStorage.setItem("tenant", JSON.stringify(tenant));
      localStorage.setItem("clientValidated", "true");

      // Set default auth header
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      navigate("/login");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Login failed. Please check your credentials and try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center p-8 bg-white rounded-xl shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Checking your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Client Portal
          </h2>
          <p className="text-gray-600">Sign in to continue</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label
              htmlFor="emailOrPhone"
              className="text-sm font-medium text-gray-700"
            >
              Email or Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {emailOrPhone.includes("@") ? (
                  <FiMail className="text-gray-400" />
                ) : (
                  <FiPhone className="text-gray-400" />
                )}
              </div>
              <input
                id="emailOrPhone"
                name="emailOrPhone"
                type="text"
                autoComplete="username"
                placeholder="Enter email or phone"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FiEyeOff className="text-gray-400 hover:text-gray-600" />
                ) : (
                  <FiEye className="text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>
            <a
              href="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Forgot password?
            </a>
          </div>

          <motion.button
            type="submit"
            disabled={!formValid || isLoading}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition ${
              formValid && !isLoading
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Contact support
            </a>
          </p>
        </div>
      </motion.div>

      <div className="absolute bottom-8 left-[35vw] px-6 m-5">
        <div className="flex items-center justify-center ">
          <img src={logo} alt="CleanwiD Logo" className="h-auto w-30" />
          <div>
            <div>Laundry Management Software by DIS</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientLogin;
