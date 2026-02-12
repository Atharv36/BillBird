import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { registerAPI } from "../api/index";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const backendBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8181";
  const googleAuthUrl = `${backendBaseUrl}/oauth2/authorization/google`;

  //  ONE toggle for both fields
  const [showPassword, setShowPassword] = useState(false);

  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await registerAPI(data);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      // Axios interceptor already showed a toast.
      // Here we just make sure we never set a non-string (object) into state.
      const backend = err.response?.data;
      const safeMessage =
        (backend && typeof backend === "object" && (backend.message || backend.error)) ||
        (typeof backend === "string" ? backend : null) ||
        "Registration failed. Please try again.";

      setError(safeMessage);
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Link
        to="/"
        className="cursor-pointer m-3 hover:bg-black hover:text-white duration-300 transition-all bg-white p-3 shadow-2xl absolute top-2 left-2 rounded-2xl"
      >
        ← Back to Landing Page
      </Link>

      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-8">
        <h1 className="text-2xl font-semibold text-center mb-2">
          Create Your Account
        </h1>
        <p className="text-sm text-gray-600 text-center mb-7">
          Sign up to start managing your invoices
        </p>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 text-green-700">
            {success}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <button
            type="button"
            onClick={() => window.location.assign(googleAuthUrl)}
            className="w-full border border-gray-300 py-2 rounded-md transition-all duration-250 hover:bg-gray-100"
          >
            Continue with Google
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200"></div>
            <span className="text-xs text-gray-500">OR</span>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.username
                  ? "border-red-300 focus:ring-red-200"
                  : "border-gray-300 focus:ring-green-200"
              }`}
              placeholder="Eg :- Atharv"
              {...register("username", {
                required: "Username is required",
                minLength: { value: 3, message: "Minimum 3 characters" },
              })}
            />
            {errors.username && (
              <p className="text-sm text-red-600 mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-300 focus:ring-red-200"
                  : "border-gray-300 focus:ring-green-200"
              }`}
              placeholder="Eg :- atharv@gmail.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email",
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full pr-12 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-200"
                placeholder="Enter Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
              />

              <button
                type="button"
                tabIndex={-1}
                onMouseDown={(e) => e.preventDefault()}
                onClick={togglePassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>

            {errors.password && (
              <p className="text-sm text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full pr-12 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-200"
                placeholder="Confirm Password"
                {...register("confirmPassword", {
                  required: "Please confirm password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />

              <button
                type="button"
                tabIndex={-1}
                onMouseDown={(e) => e.preventDefault()}
                onClick={togglePassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="text-sm text-red-600 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            disabled={loading}
            type="submit"
            className={`w-full border border-green-600 border-2 py-2 mt-6 rounded-md ${
              loading
                ? "opacity-50 cursor-not-allowed bg-gray-300"
                : "hover:bg-green-400 hover:text-white"
            }`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
