import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import LandingPage from "../pages/LandingPage";
import LiveStreamingPage from "../pages/LiveStreamingPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import ConfigurationPage from "../pages/ConfigurationPage";
import NotificationPage from "../pages/NotificationPage";
import MapPage from "../pages/MapPage";
import ChatPage from "../pages/ChatPage";
import AuthPage from "../pages/AuthPage";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";


/* ================= LAYOUT ================= */
function Layout({ children, dark, setDark }) {
  const [open, setOpen] = useState(true);

  return (
    <div className={`${dark ? "bg-black text-white" : "bg-gray-100 text-black"} flex h-screen`}>
      
      <Sidebar open={open} dark={dark} />

      <div className="flex-1 flex flex-col">
        <Navbar
          onToggle={() => setOpen(!open)}
          dark={dark}
          setDark={setDark}
        />

        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ================= PROTECTED ROUTE ================= */
function PrivateRoute({ isAuth, children }) {
  return isAuth ? children : <Navigate to="/" />;
}

/* ================= APP ================= */
function App() {
  const [isAuth, setIsAuth] = useState(false); 
  const [dark, setDark] = useState(true);

  return (
    <BrowserRouter>

      <Routes>

        {/* PUBLIC ROUTE (NO LAYOUT) */}
        <Route
          path="/"
          element={<LandingPage onLogin={() => setIsAuth(true)} />}
        />
        
        <Route
          path="/login"
          element={<AuthPage onLogin={() => setIsAuth(true)} />}
        />

        <Route
          path="/signup"
          element={<AuthPage onLogin={() => setIsAuth(true)} />}
        />

        {/* PROTECTED ROUTES */}
        <Route
          path="/livestream"
          element={
            <PrivateRoute isAuth={isAuth}>
              <Layout dark={dark} setDark={setDark}>
                <LiveStreamingPage dark={dark}/>
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <PrivateRoute isAuth={isAuth}>
              <Layout dark={dark} setDark={setDark}>
                <AnalyticsPage dark={dark}/>
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/config"
          element={
            <PrivateRoute isAuth={isAuth}>
              <Layout dark={dark} setDark={setDark}>
                <ConfigurationPage dark={dark}/>
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/notification"
          element={
            <PrivateRoute isAuth={isAuth}>
              <Layout dark={dark} setDark={setDark}>
                <NotificationPage dark={dark} />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/map"
          element={
            <PrivateRoute isAuth={isAuth}>
              <Layout dark={dark} setDark={setDark}>
                <MapPage dark={dark}/>
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <PrivateRoute isAuth={isAuth}>
              <Layout dark={dark} setDark={setDark}>
                <ChatPage dark={dark}/>
              </Layout>
            </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;