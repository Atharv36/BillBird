import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { logout } from '../store/reducers/userReducer';
import { logoutAPI } from '../api';

const AuthButtons = () => {
  const { isAuthenticated, initialized, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logoutAPI();
      dispatch(logout());
      toast.success('Successfully signed out!', {
        icon: '👋',
      });
      navigate('/');
    } catch (error) {
      // Error will be handled by axios interceptor
      console.error('Sign out error:', error);
    }
  };

  // Don't show anything while loading
  if (!initialized || loading) {
    return null;
  }

  if (isAuthenticated) {
    // User is logged in - show Dashboard and Logout buttons
    return (
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800 transition-all cursor-pointer"
        >
          Dashboard
        </button>
        <button
          onClick={handleSignOut}
          className="text-white border-2 px-4 rounded hover:bg-white cursor-pointer hover:text-black transition-all"
        >
          Logout
        </button>
      </div>
    );
  } else {
    // User is not logged in - show Login and Register buttons
    return (
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/login")}
          className="text-white border-2 px-4 rounded hover:bg-white cursor-pointer hover:text-black transition-all"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/register")}
          className="px-4 py-2 rounded-md bg-black border-2 border-black hover:text-black text-white cursor-pointer transition-all hover:bg-white"
        >
          Register
        </button>
      </div>
    );
  }
};

export default AuthButtons;