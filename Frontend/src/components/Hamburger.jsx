import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/reducers/userReducer";
import { logoutAPI } from "../api";
import toast from 'react-hot-toast';

const Hamburger = ({ hamburger, setHamburger }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call backend to clear the httpOnly cookie
      await logoutAPI(); // Backend clears cookie via Set-Cookie header

      // Since the cookie is httpOnly, we can't delete it via JavaScript
      // The backend should have already cleared the auth-token cookie

      // Wait a bit to ensure cookie is cleared
      await new Promise(resolve => setTimeout(resolve, 100));

      dispatch(logout()); // reset redux
      setHamburger(false);
      toast.success('Successfully signed out!', {
        icon: '👋',
      });
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout error", err);
      toast.error('Error signing out. Please try again.', {
        icon: '❌',
      });
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 ${
        hamburger ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        onClick={() => setHamburger(false)}
        className={`absolute inset-0 bg-black/40 transition-opacity
        ${hamburger ? "opacity-100" : "opacity-0"}`}
      />

      {/* Sidebar */}
      <div
        className={`absolute top-0 right-0 h-screen w-64 bg-white shadow-lg
        transform transition-transform duration-300 flex flex-col
        ${hamburger ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Close */}
        <div
          onClick={() => setHamburger(false)}
          className="w-12 h-12 flex justify-center items-center cursor-pointer text-xl"
        >
          ✕
        </div>

        {/* User Info */}
        <div className="px-4 pb-4 border-b">
          <p className="font-semibold text-lg">{user?.username}</p>
          <p className="text-sm text-gray-600">{user?.email}</p>
        </div>

        {/* Menu */}
        <div className="p-4 flex flex-col flex-1">
          <ul className="space-y-4">
            <li
              onClick={() => {
                navigate("/profile");
                setHamburger(false);
              }}
              className="cursor-pointer hover:text-blue-600"
            >
              Profile
            </li>
          </ul>

          <div className="flex-grow" />

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hamburger;
