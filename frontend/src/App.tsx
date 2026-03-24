import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Layout from "./components/layout";
import Admin from "./pages/Admin";
import { isTokenExpired } from "./utils/jwt";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && !isTokenExpired(token)) {
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH PAGE */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/home" />
            ) : (
              <Auth onLogin={() => setIsAuthenticated(true)} />
            )
          }
        />

        {/* HOME PAGE */}
        <Route
          path="/home"
          element={
            isAuthenticated ? (
              <Home onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
        path="/admin"
        element={
          <Layout onLogout={handleLogout}>
            <Admin />
          </Layout>
        }
      />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/upload" element={<div>Upload Page</div>} />
        <Route path="/contact" element={<div>Contact Page</div>} />
        <Route path="/payment" element={<div>Payment Page</div>} />
        <Route path="/profile" element={<div>User Profile</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;