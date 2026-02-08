import React, { useEffect } from "react";
import { TypeAnimation } from "react-type-animation";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Footer from "../components/Footer";
import { DotPattern } from "../components/ui/dot-pattern.jsx";
import AuthButtons from "../components/AuthButtons";
import toast from 'react-hot-toast';
import { logout } from '../store/reducers/userReducer';
import { logoutAPI } from '../api';

const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, initialized, loading, user } = useSelector((state) => state.auth);

  // Show welcome message for authenticated users (only once per page load)
  useEffect(() => {
    if (isAuthenticated && user && initialized) {
      toast.success(`Welcome back, ${user.username || user.email}!`, {
        icon: '👋',
      });
    } else if (!isAuthenticated && initialized) {
      // Show welcome message for non-authenticated users
      toast('Welcome to Invoice App! Create professional invoices with ease.', {
        icon: '📄',
      });
    }
  }, [isAuthenticated, initialized]); // Removed 'user' dependency to prevent duplicate toasts

  // Handle sign out
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

  // If still initializing authentication state, show loading state
  // Don't show loading after logout (when initialized is false but user is not authenticated)
  if (!initialized && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-gray-800">

      {/* Navbar */}
      <nav className="flex justify-between items-center text-white px-10 py-6 border-b bg-gray-900">
        <h1 className="text-4xl  font-extralight  flex items-center gap-2">
          BillBird
         
        </h1>

        <AuthButtons />
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 text-center">
        <DotPattern
                className="fixed inset-0 opacity-10 pointer-events-none z-0"
              />
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight">
          Simple invoicing for freelancers  
          <br /> and small businesses
        </h2>

        <div className="mt-4 text-xl text-gray-600">
          <TypeAnimation
            sequence={[
              "Create invoices quickly",
              2000,
              "Keep track of clients",
              2000,
              "Download clean PDFs",
              2000
            ]}
            speed={50}
            repeat={Infinity}
            cursor
          />
        </div>

        <p className="mt-6 mb-2 text-gray-500">
          BillBird helps you create professional invoices, manage clients,
          and keep everything in one place — without complicated software.
        </p>

        <span className="mt-2 text-sm bg-green-200 w-fit p-1.5 rounded-xl text-green-700">
          100% free. No watermarks. No hidden limits.
        </span>

        <div className="mt-8 flex justify-center gap-4">
          {isAuthenticated ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="cursor-pointer px-6 py-3 rounded-md bg-black text-white hover:bg-gray-800"
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/register")}
                className="cursor-pointer px-6 py-3 rounded-md bg-black text-white hover:bg-gray-800"
              >
                Get started
              </button>
              <button
                onClick={() => navigate("/login")}
                className="cursor-pointer px-6 py-3 rounded-md border border-gray-300 hover:border-gray-500"
              >
                Login
              </button>
            </>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto mt-24 px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className=" rounded-2xl bg-slate-50 border-[.75px] p-4  border-gray-700">
          <h3 className="font-semibold mb-2 text-center">Easy invoices</h3>
          <p className="text-gray-500">
            Create GST-ready invoices with automatic totals and clean layouts.
          </p>
        </div>

        <div className=" rounded-2xl bg-slate-50 border-[.75px] p-4  border-gray-700">
          <h3 className="font-semibold mb-2 text-center">Client records</h3>
          <p className="text-gray-500">
            Store customer names, addresses and GST numbers in one place.
          </p>
        </div>

        <div className=" rounded-2xl bg-slate-50 border-[.75px] p-4  border-gray-700">
          <h3 className="font-semibold mb-2 text-center">PDF downloads</h3>
          <p className="text-gray-500">
            Download and share professional invoices anytime.
          </p>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="mt-28 pb-20 text-center">
        {isAuthenticated ? (
          <>
            <h3 className="text-3xl font-semibold">
              Welcome back!
            </h3>
            <p className="text-gray-500 mt-2">
              You're already logged in. Ready to create more invoices?
            </p>

            <button
              onClick={() => navigate("/dashboard")}
              className="cursor-pointer mt-6 px-8 py-3 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Go to Dashboard
            </button>
          </>
        ) : (
          <>
            <h3 className="text-3xl font-semibold">
              Want to try it out?
            </h3>
            <p className="text-gray-500 mt-2">
              Create a free account and generate your first invoice in minutes.
            </p>

            <button
              onClick={() => navigate("/register")}
              className="cursor-pointer mt-6 px-8 py-3 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Create free account
            </button>
          </>
        )}
      </section>
        <Footer></Footer>

    </div>
  );
};

export default LandingPage;
