import React, { useEffect, useState } from "react";

type User = {
  name: string;
  email: string;
  role: string;
};

const User: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));

        setUser({
          name: payload.name || "N/A",
          email: payload.email,
          role: payload.role,
        });
      } catch {
        console.error("Invalid token");
      }
    }
  }, []);

  if (!user) {
    return <div className="text-center mt-10">Loading user...</div>;
  }

  return (
    <div className="user-container">
      <div className="user-card">
        <h2 className="user-title">👤 User Profile</h2>

        <div className="user-row">
          <span className="user-label">Name:</span>
          <span className="user-value">{user.name}</span>
        </div>

        <div className="user-row">
          <span className="user-label">Email:</span>
          <span className="user-value">{user.email}</span>
        </div>

        <div className="user-row">
          <span className="userlabel">Role:</span>
          <span className="user-value">{user.role}</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
    background: "#f5f7fa",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    width: "350px",
  },
  title: {
    marginBottom: "20px",
    textAlign: "center" as const,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px",
  },
  label: {
    fontWeight: "bold",
    color: "#555",
  },
  value: {
    color: "#222",
  },
};

export default User;