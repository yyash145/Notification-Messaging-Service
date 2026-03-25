import React, { useEffect, useState } from "react";

type Users = {
  name: string;
  email: string;
  role: string;
};

const User: React.FC = () => {
  const [user, setUser] = useState<Users | null>(null);

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

export default User;