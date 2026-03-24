import React, { useEffect, useState } from "react";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
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

  return isAuthenticated ? (
    <Home onLogout={handleLogout} />
  ) : (
    <Auth onLogin={() => setIsAuthenticated(true)} />
  );
};

export default App;