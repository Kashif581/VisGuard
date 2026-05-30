import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import SignInPage from "./SignInPage";
import SignUpPage from "./SignUpPage";

export default function AuthPage({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSignUp, setIsSignUp] = useState(
    location.pathname === "/signup"
  );

  useEffect(() => {
    setIsSignUp(location.pathname === "/signup");
  }, [location.pathname]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.email && form.password) {
      onLogin();
      navigate("/config");
    }
  };

  const switchMode = () => {
    if (isSignUp) {
      navigate("/login");
    } else {
      navigate("/signup");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090f] text-white relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Border */}
      {/* <div className="absolute inset-4 border border-white/10 pointer-events-none" /> */}

      {/* Logo */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-3">

        <img
          src="/images/logo1-removebg-preview.png"
          alt="VisGuard Logo"
          className="w-10 h-10 object-contain"
        />

        <h1 className="text-xl font-bold tracking-widest text-white/90">
          VISGUARD
        </h1>

      </div>

      {/* Main */}
      <div className="min-h-screen flex items-center justify-center px-6">

        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-20 items-center">

          {/* LEFT SIDE */}
          <div className="flex justify-center overflow-hidden">
            <div className="relative w-full max-w-md min-h-[700px]">

              <AnimatePresence mode="wait">
                {isSignUp ? (
                  <motion.div
                    key="signup"
                    initial={{ opacity: 0, x: 80, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -80, scale: 0.98 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute w-full"
                  >
                    <SignUpPage
                      form={form}
                      setForm={setForm}
                      handleSubmit={handleSubmit}
                      switchMode={switchMode}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="signin"
                    initial={{ opacity: 0, x: -80, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 80, scale: 0.98 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute w-full"
                  >
                    <SignInPage
                      form={form}
                      setForm={setForm}
                      handleSubmit={handleSubmit}
                      switchMode={switchMode}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="hidden lg:flex flex-col justify-center">

            <div className="mb-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-white/10" />

                <p className="text-xs tracking-[0.3em] text-white/40 uppercase whitespace-nowrap">
                  Trusted by AI Teams
                </p>

                <div className="flex-1 h-px bg-white/10" />
              </div>

              <div className="grid grid-cols-3 gap-10 text-white/80">

                <div className="text-2xl font-semibold">OpenAI</div>
                <div className="text-2xl font-semibold">NVIDIA</div>
                <div className="text-2xl font-semibold">Tesla</div>

                <div className="text-2xl font-semibold">Intel</div>
                <div className="text-2xl font-semibold">Meta</div>
                <div className="text-2xl font-semibold">Anthropic</div>

                <div className="text-2xl font-semibold">Scale</div>
                <div className="text-2xl font-semibold">Databricks</div>
                <div className="text-2xl font-semibold">AWS</div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}