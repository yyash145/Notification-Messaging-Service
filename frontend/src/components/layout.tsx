import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../index.css"

type Props = {
  onLogout: () => void;
};

const Layout: React.FC<Props> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const userRole = localStorage.getItem("userRole");
  const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

  const handleLogoutClick = () => {
    onLogout();
    navigate("/login");
  };

  const fetchUsers = async () => {
    try {
        const res = await fetch(`${BASE_URL}/users/getAllUsers`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        });

        const data = await res.json();

        // 🔥 handle all possible shapes
        if (Array.isArray(data)) {
            setUsers(data);
        } else if (Array.isArray(data.data)) {
            setUsers(data.data);
        } else if (Array.isArray(data.users)) {
            setUsers(data.users);
        } else {
            setUsers([]); // ✅ always array
        }
        
      } catch (err) {
          console.error(err);
          setUsers([]); // fallback
      }

    };

  const handleDeleteAllUsers = async () => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete all users except yourself?"
      );

      if (!confirmDelete) return;

      await fetch(`${BASE_URL}/users/removeAllUsers`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      alert("All users (except you) deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Error deleting users");
    }
    finally{
      fetchUsers()
    }
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