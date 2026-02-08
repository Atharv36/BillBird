import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import ConfirmDialog from "./ConfirmDialogue";
import { CgProfile } from "react-icons/cg";
import Hamburger from "./Hamburger.jsx";

const Header = () => {
  const [hamburger, setHamburger] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isLoggedIn = true; // replace later with auth context
  const navigate = useNavigate();
  const location = useLocation();

  // Reset confirm dialog when route changes
  useEffect(() => {
    if (location.pathname !== "/dashboard/new") {
      setShowConfirm(false);
    }
  }, [location.pathname]);

  const handleNewClick = () => {
    if (location.pathname === "/dashboard/new") {
      setShowConfirm(true);
    } else {
      navigate("/dashboard/new");
    }
  };

  const confirmNew = () => {
    setShowConfirm(false);
    navigate("/dashboard/new", { state: { reset: true } });
  };

  return (
    <>
      {/* Header */}
      <header className="relative isolate z-50 flex justify-between items-center px-10 py-6 bg-gray-900 text-white">
        {/* Logo / Title */}
        <h2
          className={`font-[Tajawal] text-center pt-2 text-4xl font-extralight ml-7 ${
            location.pathname !== "/dashboard" ? "cursor-pointer" : ""
          }`}
          onClick={() =>
            location.pathname !== "/dashboard" && navigate("/dashboard")
          }
        >
          BillBird
        </h2>

        {/* Navigation */}
        <nav className="flex items-center">
          <button
            onClick={handleNewClick}
            className="cursor-pointer p-2 px-4 mr-4 rounded-md border border-green-500 hover:bg-green-500 hover:text-black transition"
          >
            New
          </button>

          {isLoggedIn ? (
            <CgProfile
              onClick={() => setHamburger(true)}
              className="w-10 h-10 cursor-pointer"
            />
          ) : (
            <>
              <NavLink to="/login" className={styles.navLink}>
                Login
              </NavLink>
              <NavLink to="/register" className={styles.navLink}>
                Register
              </NavLink>
            </>
          )}
        </nav>
      </header>

      {/* Confirm Dialog */}
      {showConfirm && location.pathname === "/dashboard/new" && (
        <ConfirmDialog
          message="Are you sure you want to create a new Invoice? Clicking 'OK' will clear all the form data"
          onConfirm={confirmNew}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {/* Hamburger Menu (always mounted for animation) */}
      <Hamburger hamburger={hamburger} setHamburger={setHamburger} />
    </>
  );
};

const styles = {
  navLink:
    "p-2 px-4 mr-4 rounded-md border border-green-500 hover:bg-green-500 hover:text-black transition",
};

export default Header;
