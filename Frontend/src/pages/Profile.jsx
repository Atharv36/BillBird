import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUserAPI, logoutAPI } from "../api/index.js";
import { fetchUser } from "../store/reducers/userReducer";
import { logout } from "../store/reducers/userReducer";
import toast from "react-hot-toast";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading: userLoading, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await logoutAPI();
      await new Promise((resolve) => setTimeout(resolve, 100));
      dispatch(logout());
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout error", err);
      toast.error(
        "Failed to sign out properly. You may need to clear cookies manually.",
        {
          icon: "⚠️",
        }
      );
      dispatch(logout());
      navigate("/login", { replace: true });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ✅ ADDITION: password length must be exactly 6
    if (formData.password && formData.password.length !== 6) {
      toast.error("Password must be exactly 6 characters long", {
        icon: "🔒",
      });
      setLoading(false);
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match", {
        icon: "❌",
      });
      setLoading(false);
      return;
    }

    try {
      const updateData = {};
      if (formData.username && formData.username.trim()) {
        updateData.username = formData.username.trim();
      }
      if (formData.email && formData.email.trim()) {
        updateData.email = formData.email.trim();
      }
      if (formData.password && formData.password.trim()) {
        updateData.password = formData.password.trim();
      }

      const usernameChanged =
        updateData.username &&
        user &&
        updateData.username !== user.username;
      const emailChanged =
        updateData.email && user && updateData.email !== user.email;

      await updateUserAPI(updateData);

      toast.success("Profile updated successfully! Signing you out...", {
        icon: "✅",
      });

      await new Promise((resolve) => setTimeout(resolve, 200));

      try {
        await logoutAPI();
      } catch (logoutErr) {
        console.error("Logout error:", logoutErr);
      }

      await new Promise((resolve) => setTimeout(resolve, 100));

      dispatch(logout());

      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));

      setIsEditing(false);
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Profile update error:", err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.", {
          icon: "🔒",
        });
      } else {
        const backend = err.response?.data;
        const rawMessage =
          (backend &&
            typeof backend === "object" &&
            (backend.message || backend.error)) ||
          (typeof backend === "string" ? backend : null);

        if (rawMessage === "Username already taken") {
          toast.error(
            "Username already taken. Please choose a different one.",
            {
              icon: "⚠️",
            }
          );
        } else {
          const errorMessage =
            rawMessage ||
            "Failed to update profile. Please try again.";
          toast.error(errorMessage, {
            icon: "❌",
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
      });
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <button
          type="button"
          onClick={() => {
            navigate("/dashboard");
          }}
          className="mb-4 px-4 py-2 rounded-md border border-gray-400 hover:bg-gray-400 hover:text-white transition cursor-pointer flex items-center gap-2"
        >
          <span>←</span> Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-center mb-8 text-black">
          Profile
        </h1>

        {!isEditing ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {user?.username || "N/A"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {user?.email || "N/A"}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex-1 py-2 rounded-md border-2 border-green-500 hover:bg-green-500 hover:text-white transition cursor-pointer"
              >
                Edit Profile
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="flex-1 py-2 rounded-md border-2 border-red-500 hover:bg-red-500 hover:text-white transition cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password (leave blank to keep current)
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 py-2 rounded-md border-2 border-gray-400 hover:bg-gray-400 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-2 rounded-md border-2 border-green-500 transition ${
                  loading
                    ? "opacity-50 cursor-not-allowed bg-gray-300"
                    : "hover:bg-green-500 hover:text-white cursor-pointer"
                }`}
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
