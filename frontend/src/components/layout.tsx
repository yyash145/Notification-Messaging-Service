import React from "react";
import Sidebar from "./sidebar";
import { jwtDecode } from "jwt-decode";
// import "";

const Layout = ({ children, onLogout }: any) => {
  const token = localStorage.getItem("token");

  let user: any = null;
  if (token) {
    user = jwtDecode(token);
  }

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        {/* Top Bar */}
        <div className="topbar">
          <div>Welcome {user?.email || "User"}</div>
          <button onClick={onLogout}>Logout</button>
        </div>

        {/* Content */}
        <div className="content">{children}</div>

        {/* Footer */}
        <div className="footer">© 2026 MyApp</div>
      </div>
    </div>
  );
};

export default Layout;