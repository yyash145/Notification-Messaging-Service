import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Layout from "./components/layout";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Contact from "./pages/contactUs";
import Payment from "./pages/payment";
import User from "./pages/UserProfile";
import Auth from "./pages/Auth";

const isTokenExpired = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token && !isTokenExpired(token)) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // ✅ Login
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* 🔓 Public Route */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/home" />
            ) : (
              <Auth onLogin={handleLogin} />
            )
          }
        />

        {/* 🔒 Protected Routes */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Layout onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route path="home" element={<Home />} />
          <Route path="upload" element={<Upload />} />
          <Route path="contact" element={<Contact />} />
          <Route path="payment" element={<Payment />} />
          <Route path="user" element={<User />} />
        </Route>

        {/* 🔁 Catch all */}
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? "/home" : "/login"} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;