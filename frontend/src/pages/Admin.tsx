import axios from "axios";

const Admin = () => {
  const deleteAll = async () => {
    await axios.delete("http://localhost:3000/users/removeAllUsers", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    alert("All users deleted");
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      <button onClick={deleteAll}>Delete All Users</button>
    </div>
  );
};

export default Admin;
