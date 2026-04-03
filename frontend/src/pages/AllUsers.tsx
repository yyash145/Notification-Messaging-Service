import { useEffect, useState } from "react";
import "../index.css"

export default function AllUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

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

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: number, role: string) => {
    console.log("UserId -", userId)
    console.log("Role -", role)
    await fetch(`${BASE_URL}/users/setUserRole`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
            "id": userId,   // ✅ FIXED
            "role": role,
        }),
    });

    fetchUsers();
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const res = await fetch(`${BASE_URL}/users/removeUser/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        // ❌ backend error
        alert(data.message || "Something went wrong");
        return;
      }

      // ✅ success
      alert(data.message || "User deleted successfully");
      fetchUsers();

    } catch (err) {
      console.error(err);
      alert("Network error");
    }

    fetchUsers();
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


  const filteredUsers = Array.isArray(users)
  ? users.filter(
      (u) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    )
  : [];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Users</h2>

      {/* 🔍 Search */}
      <div className="top-bar">
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <button
          className="delete-btn delete-all"
          onClick={handleDeleteAllUsers}
        >
          Delete All Users
        </button>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>

              <td>
                <select
                  value={user.role}
                  onChange={(e) =>
                    handleRoleChange(user.id, e.target.value)
                  }
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                </select>
              </td>

              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}