import React from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { Outlet } from "react-router-dom";
import { DotPattern } from "../components/ui/dot-pattern.jsx";
const MainLayout = () => {
  return (
    <>
      <Header />

      {/* 🔥 FIXED BACKGROUND LAYER */}
      <DotPattern
        className="fixed inset-0 opacity-40 pointer-events-none z-0"
      />

      {/* 🔑 SCROLLING CONTENT */}
      <main className="relative bg-[var(--blue)] z-10 min-h-screen">
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

export default MainLayout;
