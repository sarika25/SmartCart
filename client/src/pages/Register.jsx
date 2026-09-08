import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authServices";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });

    setError("");
  };

  const validatePassword = () => {
    const { name, email, password, confirmPassword } = form;

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      return "Please fill in all fields.";
    }

    if (password.length < 8 || password.length > 12) {
      return "Password must be between 8 and 12 characters.";
    }

    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one capital letter.";
    }

    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one numeric character.";
    }

    if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/;'`~+=]/.test(password)) {
      return "Password must contain at least one special character.";
    }

    if (
      name.trim() &&
      password.toLowerCase().includes(name.trim().toLowerCase())
    ) {
      return "Password must not contain your name.";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validatePassword();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { confirmPassword, ...registerData } = form;

      const data = await registerUser(registerData);

      console.log("Registration successful:", data);

      navigate("/login");
    } catch (error) {
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const password = form.password;
  const name = form.name.trim();

  const passwordRequirements = {
    length: password.length >= 8 && password.length <= 12,
    capital: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>_\-\\[\]/;'`~+=]/.test(password),
    noName: !name || !password.toLowerCase().includes(name.toLowerCase()),
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-4">
      {/* Main Container */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden grid md:grid-cols-2">
        {/* ================= LEFT SIDE ================= */}
        <div className="bg-black text-white p-7 md:p-8 flex flex-col justify-center">
          {/* Logo */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold">SmartCart</h1>

            <p className="text-gray-400 text-sm mt-1">
              Shop smarter. Buy better.
            </p>
          </div>

          {/* Main Message */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-3">
              Your smarter way to shop.
            </h2>

            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Create your SmartCart account and get personalized product
              recommendations based on your needs and budget.
            </p>
          </div>

          {/* Benefits */}
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
                  Find products that match your needs.
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
                  Get recommendations that fit your budget.
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
            Start your smarter shopping journey today.
          </p>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="p-7 md:p-8">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-1">Create Account</h2>

            <p className="text-gray-500 text-sm mb-5">
              Join SmartCart and start shopping smarter.
            </p>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-3 py-2 mb-3 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Name */}
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full name"
                autoComplete="name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mb-3 text-sm outline-none focus:ring-2 focus:ring-black"
              />

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
              <div className="relative mb-3">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  autoComplete="new-password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-11 text-sm outline-none focus:ring-2 focus:ring-black"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black text-sm"
                >
                  {showPassword ? (
                    <i class="ri-eye-off-fill"></i>
                  ) : (
                    <i class="ri-eye-fill"></i>
                  )}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative mb-3">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-11 text-sm outline-none focus:ring-2 focus:ring-black"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black text-sm"
                >
                  {showConfirmPassword ? (
                    <i class="ri-eye-off-fill"></i>
                  ) : (
                    <i class="ri-eye-fill"></i>
                  )}
                </button>
              </div>

              {/* Password Requirements */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                <p className="font-semibold text-xs mb-2">
                  Password requirements
                </p>

                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                  <p
                    className={
                      passwordRequirements.length
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    {passwordRequirements.length ? "✓" : "○"} 8–12 characters
                  </p>

                  <p
                    className={
                      passwordRequirements.capital
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    {passwordRequirements.capital ? "✓" : "○"} 1 capital letter
                  </p>

                  <p
                    className={
                      passwordRequirements.number
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    {passwordRequirements.number ? "✓" : "○"} 1 number
                  </p>

                  <p
                    className={
                      passwordRequirements.special
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    {passwordRequirements.special ? "✓" : "○"} 1 special
                    character
                  </p>

                  <p
                    className={
                      passwordRequirements.noName
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    {passwordRequirements.noName ? "✓" : "○"} Don't use your
                    name
                  </p>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            {/* Login */}
            <p className="text-center text-xs text-gray-500 mt-4">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-black font-semibold hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
