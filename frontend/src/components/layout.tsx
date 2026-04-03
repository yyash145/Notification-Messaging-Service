import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../index.css"

type Props = {
  onLogout: () => void;
};

const Layout: React.FC<Props> = ({ onLogout }) => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  const handleLogoutClick = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <div className="page-container">
      <div className="navbar">
        <div className="nav-left">
          <div className="logo" onClick={() => navigate("/home")}>
            🚀 MyApp
          </div>

          <div className="nav-links">
            <span onClick={() => navigate("/upload")}>Upload Excel</span>
            <span onClick={() => navigate("/contact")}>Contact Us</span>
            <span onClick={() => navigate("/payment")}>Payment</span>
          </div>
        </div>

        <div className="nav-right">
          {userRole === "SUPER_ADMIN" && (
            <button
              className="admin-btn"
              onClick={() => navigate("/allusers")}
            >
              Show All Users
            </button>
          )}

          <span onClick={() => navigate("/user")} className="user">
            👤 My Profile
          </span>
          <button onClick={handleLogoutClick} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      
      <div className="content">
        <Outlet />
      </div>

      <div className="footer">© 2026 MyApp</div>
    </div>
  );
};

export default Layout;