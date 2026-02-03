// src/components/Layout.jsx
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { pageTransition } from "../animations/motionVariants";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Layout({ children }) {
  const location = useLocation();
  const { user } = useContext(AuthContext);

const auth = JSON.parse(localStorage.getItem("dc_user"));
  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      
      {/* HEADER */}
      <header className="border-b border-gray-300 bg-white backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 rounded-xl bg-gray-600/10 border border-gray-300 items-center justify-center text-gray-600 font-bold">
              DC
            </span>
            <span className="font-semibold tracking-wide">
              Drive<span className="text-gray-600">Connect</span>
            </span>
          </Link>

          {/* NAVIGATION */}
         
         

<nav className="flex items-center gap-4 text-sm">
  <Link to="/" className={`px-3 py-1 rounded-full ${location.pathname === "/" ? "bg-gray-600 text-white" : "text-gray-600 hover:bg-gray-200"}`}>Home</Link>

  {!auth && (
    <>
      <Link to="/choose-role" className="px-3 py-1 rounded-full text-gray-600 hover:bg-gray-200">Get Started</Link>
      <Link to="/login" className="px-3 py-1 rounded-full text-gray-600 hover:bg-gray-200">Login</Link>
    </>
  )}

  {auth && (
    <>
      <Link to="/profile" className={`px-3 py-1 rounded-full ${location.pathname === "/profile" ? "bg-gray-600 text-white" : "text-gray-600 hover:bg-gray-200"}`}>My Profile</Link>

      {auth.role === "driver" && (
        <Link to="/applications" className="px-3 py-1 rounded-full text-gray-600 hover:bg-gray-200">My Applications</Link>
      )}

      {auth.role === "recruiter" && (
        <Link to="/dashboard/recruiter" className="px-3 py-1 rounded-full text-gray-600 hover:bg-gray-200">Dashboard</Link>
      )}

      <button
        onClick={() => {
          localStorage.removeItem("dc_token");
          localStorage.removeItem("dc_user");
          window.location.href = "/";
        }}
        className="px-3 py-1 rounded-full bg-red-500 text-white font-semibold"
      >
        Logout
      </button>
    </>
  )}
</nav>


        </div>
      </header>

      
      

      {/* PAGE CONTENT */}
      <motion.main
        key={location.pathname}
        variants={pageTransition}
        initial="hidden"
        animate="show"
        exit="exit"
        className="flex-1"
      >
        {children}
      </motion.main>

      {/* FOOTER */}
      <footer className="border-t border-gray-300 text-xs text-gray-600">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between">
          <span>© {new Date().getFullYear()} DriveConnect</span>
          <span>Built with ❤️ + MERN</span>
        </div>
      </footer>

    </div>
  );
}
