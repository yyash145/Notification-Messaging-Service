import React from "react";
import { useNavigate } from "react-router-dom";
// import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <h2 className="logo" onClick={() => navigate("/home")}>🚀 MyApp</h2>

      <div className="menu">
        <div onClick={() => navigate("/home")}>🏠 Home</div>
        <div onClick={() => navigate("/upload")}>📤 Upload</div>
        <div onClick={() => navigate("/contact")}>📞 Contact</div>
        <div onClick={() => navigate("/payment")}>💳 Payment</div>
        <div onClick={() => navigate("/admin")}>🛠 Admin</div>
      </div>
    </div>
  );
};

export default Sidebar;