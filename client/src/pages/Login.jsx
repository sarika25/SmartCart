import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authServices";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await loginUser(form);

      // Save user + token
      login(data.user, data.token);

      // Redirect to Home page
      navigate("/");
    } catch (error) {
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden grid md:grid-cols-2">
        {/* ================= LEFT SIDE ================= */}
        <div className="bg-black text-white p-7 md:p-8 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">SmartCart</h1>

            <p className="text-gray-400 text-sm mt-1">
              Shop smarter. Buy better.
            </p>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-3">
              Welcome back.
            </h2>

            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Continue your smarter shopping journey with personalized product
              recommendations powered by AI.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 shrink-0 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold">
                ✓
              </div>

              <div>
                <h3 className="font-semibold text-sm">
                  Personalized Recommendations
                </h3>

                <p className="text-gray-400 text-xs mt-1">
                  Discover products based on your needs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 shrink-0 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold">
                ✓
              </div>

              <div>
                <h3 className="font-semibold text-sm">
                  Shop Within Your Budget
                </h3>

                <p className="text-gray-400 text-xs mt-1">
                  Find products that fit your budget.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 shrink-0 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold">
                ✓
              </div>

              <div>
                <h3 className="font-semibold text-sm">AI-Powered Shopping</h3>

                <p className="text-gray-400 text-xs mt-1">
                  Make smarter buying decisions with AI.
                </p>
              </div>
            </div>
          </div>

          <p className="text-gray-500 text-xs mt-7">
            Your smarter shopping experience starts here.
          </p>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="p-7 md:p-8 flex items-center">
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-1">Welcome Back</h2>

            <p className="text-gray-500 text-sm mb-5">Login to SmartCart</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-3 py-2 mb-3 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                autoComplete="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mb-3 text-sm outline-none focus:ring-2 focus:ring-black"
              />

              {/* Password */}
              <div className="relative mb-2">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  autoComplete="current-password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-11 text-sm outline-none focus:ring-2 focus:ring-black"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black text-sm"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <i className="ri-eye-off-fill"></i>
                  ) : (
                    <i className="ri-eye-fill"></i>
                  )}
                </button>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs text-gray-500 hover:text-black hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Login */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* Register */}
            <p className="text-center text-xs text-gray-500 mt-4">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-black font-semibold hover:underline"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
