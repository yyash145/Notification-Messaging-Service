import React from "react";

type Props = {
  onLogout: () => void;
};

const Home: React.FC<Props> = ({ onLogout }) => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>Welcome 🎉</h1>
        <p>You are successfully logged in.</p>

        <button onClick={onLogout} style={styles.button}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Home;

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f9",
  },
  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    background: "#dc3545",
    color: "#fff",
    cursor: "pointer",
  },
};