
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

/* ---------------- Mouse Hook ---------------- */
function useMouse() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return pos;
}

/* ---------------- Theme Toggle ---------------- */
// function ThemeToggle({ theme, setTheme }) {
//   const isDark = theme === "dark";

//   return (
//     <div
//       onClick={() => setTheme(isDark ? "light" : "dark")}
//       className={`w-14 h-7 rounded-full p-1 cursor-pointer relative ${
//         isDark ? "bg-zinc-700" : "bg-gray-300"
//       }`}
//     >
//       <motion.div
//         layout
//         className={`w-5 h-5 rounded-full absolute ${
//           isDark ? "bg-black left-7" : "bg-white left-1"
//         }`}
//       />
//     </div>
//   );
// }

/* ---------------- Grid Background ---------------- */
function GridBackground({ mouse, theme }) {
  const isDark = theme === "dark";
  const gridSize = 40;

  const x = Math.floor(mouse.x / gridSize) * gridSize;
  const y = Math.floor(mouse.y / gridSize) * gridSize;

  const cols = Math.ceil(window.innerWidth / gridSize);
  const rows = Math.ceil(window.innerHeight / gridSize);
  const total = cols * rows;

  return (
    <>
      <div
        className="fixed top-0 left-0 z-0 pointer-events-none"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${gridSize}px)`,
        }}
      >
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            style={{
              width: gridSize,
              height: gridSize,
              border: isDark
                ? "1px solid rgba(255,255,255,0.03)"
                : "1px solid rgba(0,0,0,0.05)",
            }}
          />
        ))}
      </div>

      <motion.div
        animate={{ x, y }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="fixed z-0 pointer-events-none backdrop-blur"
        style={{
          width: gridSize,
          height: gridSize,
          background: isDark
            ? "rgba(120,120,255,0.15)"
            : "rgba(0,0,0,0.06)",
          border: isDark
            ? "1px solid rgba(255,255,255,0.15)"
            : "1px solid rgba(0,0,0,0.1)",
        }}
      />
    </>
  );
}

/* ---------------- CARD ---------------- */
function PageCard({ title, image, route, center, theme, width, height }) {
  const navigate = useNavigate();
  const isDark = theme === "dark";

  return (
    <motion.div
      whileHover={{ y: center ? -18 : -10, scale: center ? 1.08 : 1.04 }}
      onClick={() => navigate(route)}
      className={`cursor-pointer overflow-hidden rounded-2xl ${width} 
      backdrop-blur-xl ${
        isDark
          ? "bg-white/5 border border-white/10"
          : "bg-white border border-gray-200"
      } shadow-xl`}
    >
      {/* IMAGE */}
      <div className={`${height} w-full overflow-hidden relative`}>
        <img
          src={image}
          alt={title}
          className="w-full h-full object-contain transition duration-500"
        />

        {/* OVERLAY */}
        {/* <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center">
          <span className="text-white font-semibold">
            Open {title}
          </span>
        </div> */}
      </div>

      {/* TITLE */}
      {/* <div className="p-4">
        <h4 className="font-semibold">{title}</h4>
      </div> */}
    </motion.div>
  );
}


/* ---------------- MAIN ---------------- */
export default function LandingPage() {
  const [theme, setTheme] = useState("dark");
  const mouse = useMouse();
  const navigate = useNavigate();

  const [openFAQ, setOpenFAQ] = useState(null);


  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen ${
        isDark ? "bg-slate-950 text-white" : "bg-sky-50 text-black"
      } relative `}
    >
      {/* GRID */}
      <GridBackground mouse={mouse} theme={theme} />

      {/* NAVBAR */}
      <div className="flex items-center px-10 py-10 sticky top-0 z-50 backdrop-blur-xl relative">

        {/* Center Navigation */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6 text-sm">
          <span className="cursor-pointer hover:text-blue-400 transition">
            Platform
          </span>

          <span className="cursor-pointer hover:text-blue-400 transition">
            Solutions
          </span>

          <img
            src="/images/logo1-removebg-preview.png"
            alt="Brand Logo"
            className="h-8 w-auto cursor-pointer hover:scale-105 transition"
          />

          <button
            onClick={() => navigate("/login")}
            className={`px-4 py-2 rounded-xl transition border ${
              isDark
                ? "border-white/10 hover:bg-white/10"
                : "border-gray-300 hover:bg-gray-200"
            }`}
          >
            Sign In
          </button>
          
          <button
            onClick={() => navigate("/signup")}
            className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition"
          >
            Get Started
          </button>
        </div>
          
        {/* Theme Toggle on Right */}
        {/* <div className="ml-auto">
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div> */}
      </div>
      {/* HERO VIDEO SECTION */}
      <section className="relative w-full h-[40vh] overflow-hidden">
              
        
        {/* <video
          autoPlay
          muted
          loop
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video> */}
              
        {/* TEXT OVER VIDEO */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center">
          <h1 className="text-5xl font-bold mb-4 text-white">
            AI Video Intelligence Platform
          </h1>
          <p className="text-gray-200">
            Search, analyze and monitor video streams with AI
          </p>
        </div>
      </section>
      {/* HERO */}
      
      

      <section className="flex justify-center relative z-20 -mt-24">
        <div className="flex items-center">
              
          <div className="mt-20 -mr-58">
            <PageCard
              title="Dashboard"
              route="/dashboard"
              image="/images/NotificationPage.png"
              theme={theme}
              width="w-[475px]"
              height="h-[280px]"
            />
          </div>
              
          <div className="z-10">
            <PageCard
              title="AI Chat"
              route="/chat"
              image="/images/AnalyticPage.png"
              center
              theme={theme}
              width="w-[475px]"
              height="h-[280px]"
            />
          </div>
              
          <div className="mt-20 -ml-58">
            <PageCard
              title="Notifications"
              route="/notification"
              image="/images/LiveStreamingPage.png"
              theme={theme}
              width="w-[475px]"
              height="h-[280px]"
            />
          </div>
              
        </div>
      </section>

      {/* SECOND SECTION */}
      <section className="mt-140 px-10 relative z-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
              
          {/* LEFT TEXT (UNCHANGED) */}
          <div className="text-left">
            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Connected AI <br /> Workflows
            </h2>
              
            <p className="text-gray-400 text-lg mb-8 max-w-lg">
              Build intelligent surveillance systems with automation,
              real-time monitoring, AI-powered insights, and seamless
              workflow integration for smarter security operations.
            </p>
          </div>
              
          {/* RIGHT OVERLAPPING CARDS */}
          <div className="flex justify-center md:justify-end">
            <div className="relative w-[520px] h-[380px]">
              
              {/* BACK CARD */}
              <div className="absolute top-0 left-0 z-10">
                <PageCard
                  title="Map View"
                  route="/map"
                  image="/images/NotificationPage_white.png"
                  theme={theme}
                  width="w-[550px]"
                  height="h-[330px]"
                />
              </div>
              
              {/* FRONT CARD (shifted for corner overlap) */}
              <div className="absolute top-30 left-60 z-20">
                <PageCard
                  title="Dashboard"
                  route="/dashboard"
                  image="/images/NotificationPage.png"
                  theme={theme}
                  width="w-[550px]"
                  height="h-[330px]"
                />
              </div>
              
            </div>
          </div>
              
        </div>
      </section>
      {/* THIRD SECTION */}
      <section className="mt-140 px-10 relative z-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
              
          {/* LEFT SIDE OVERLAPPING CARDS (UNCHANGED) */}
          <div className="flex justify-center md:justify-start">
            <div className="relative w-[520px] h-[380px]">
              
              {/* BACK CARD */}
              <div className="absolute top-30 right-60 z-20">
                <PageCard
                  title="Map View"
                  route="/map"
                  image="/images/NotificationPage_white.png"
                  theme={theme}
                  width="w-[550px]"
                  height="h-[330px]"
                />
              </div>
              
              {/* FRONT CARD */}
              <div className="absolute top-0 left-0 z-10">
                <PageCard
                  title="Configuration"
                  route="/config"
                  image="/images/AnalyticPage.png"
                  theme={theme}
                  width="w-[550px]"
                  height="h-[330px]"
                />
              </div>
              
            </div>
          </div>
              
          {/* RIGHT TEXT (FIXED ALIGNMENT) */}
          <div className="text-left md:ml-auto">
            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Smart System <br /> Configuration
            </h2>
              
            <p className="text-gray-400 text-lg mb-8 max-w-lg">
              Configure AI pipelines, detection models, camera integrations,
              and alert systems with a flexible dashboard built for modern
              intelligent surveillance environments.
            </p>
          </div>
              
        </div>
      </section>
      {/* FAQ SECTION */}
      <section className="mt-150 px-10 pb-32 relative z-10">
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400 text-lg">
              Everything you need to know about the AI video platform
            </p>
          </div>

          <div className="space-y-5">

            {[
              {
                q: "How does AI video monitoring work?",
                a: "Our platform uses computer vision and machine learning models to analyze live video streams, detect events, and generate intelligent insights in real time."
              },
              {
                q: "Can I connect multiple cameras?",
                a: "Yes, you can integrate multiple IP cameras, RTSP streams, and surveillance devices into one unified dashboard."
              },
              {
                q: "Does it support real-time alerts?",
                a: "Yes. Instant notifications can be triggered for detections, anomalies, motion tracking, and custom AI events."
              },
              {
                q: "Is configuration customizable?",
                a: "Absolutely. You can configure AI models, alert thresholds, workflows, and camera zones based on your surveillance requirements."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                layout
                className={`rounded-2xl border backdrop-blur-xl overflow-hidden ${
                  isDark
                    ? "bg-white/5 border-white/10"
                    : "bg-white border-gray-200"
                }`}
              >
                <button
                  onClick={() =>
                    setOpenFAQ(openFAQ === index ? null : index)
                  }
                  className="w-full px-8 py-6 flex justify-between items-center text-left"
                >
                  <span className="text-lg font-medium">{faq.q}</span>
                  <span className="text-2xl">
                    {openFAQ === index ? "−" : "+"}
                  </span>
                </button>
                
                {openFAQ === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-8 pb-6 text-gray-400"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </motion.div>
            ))}

          </div>
        </div>
      </section>


      {/* FOOTER */}
      <footer
        className={`relative z-10 border-t px-10 py-16 ${
          isDark ? "border-white/10 backdrop-blur-xl" : "border-gray-200 bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
      
          {/* BRAND */}
          <div>
            <img
              src="/images/logo1-removebg-preview.png"
              alt="Brand Logo"
              className="h-10 mb-4"
            />

            <p className="text-gray-400 leading-relaxed">
              AI-powered video intelligence platform for smarter
              surveillance, analytics, and automated monitoring.
            </p>
          </div>
      
          {/* PLATFORM */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Platform</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="hover:text-blue-400 cursor-pointer transition">
                Dashboard
              </li>
              <li className="hover:text-blue-400 cursor-pointer transition">
                Analytics
              </li>
              <li className="hover:text-blue-400 cursor-pointer transition">
                Live Monitoring
              </li>
              <li className="hover:text-blue-400 cursor-pointer transition">
                Map View
              </li>
            </ul>
          </div>
      
          {/* SOLUTIONS */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Solutions</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="hover:text-blue-400 cursor-pointer transition">
                Security Automation
              </li>
              <li className="hover:text-blue-400 cursor-pointer transition">
                Smart Detection
              </li>
              <li className="hover:text-blue-400 cursor-pointer transition">
                Event Alerts
              </li>
              <li className="hover:text-blue-400 cursor-pointer transition">
                Workflow Integration
              </li>
            </ul>
          </div>
      
          {/* CONTACT */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Contact</h4>
            <ul className="space-y-3 text-gray-400">
              <li>support@aivision.com</li>
              <li>+92 300 1234567</li>
              <li>Punjab, Pakistan</li>
            </ul>
          </div>
      
        </div>
      
        {/* BOTTOM BAR */}
        <div
          className={`mt-14 pt-8 border-t text-center text-sm ${
            isDark
              ? "border-white/10 text-gray-500"
              : "border-gray-200 text-gray-500"
          }`}
        >
          © 2026 AI Vision Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

