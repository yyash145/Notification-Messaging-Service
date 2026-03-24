import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

type Props = {
  onLogout: () => void;
};

const Home: React.FC<Props> = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      {/* 🔝 NAVBAR */}
      <div className="navbar">
        <div className="nav-left">
          <div className="logo" onClick={() => navigate("/home")}>
            🚀 MyApp
          </div>

          <div className="nav-links">
            <span onClick={() => navigate("/upload")}>Upload Excel</span>
            <span onClick={() => navigate("/contact")}>Contact</span>
            <span onClick={() => navigate("/payment")}>Payment</span>
          </div>
        </div>

        <div className="nav-right">
          <span onClick={() => navigate("/profile")}>👤 User</span>
          <button onClick={onLogout}>Logout</button>
        </div>
      </div>

      {/* 🧩 MAIN CONTENT */}
      <div className="content">
        <h1>Welcome 🎉</h1>
        <p>You are successfully logged in.</p>
      </div>

      {/* 🔻 FOOTER */}
      <div className="footer">
        © 2026 MyApp. All rights reserved.
      </div>
    </div>
  );
};

export default Home;