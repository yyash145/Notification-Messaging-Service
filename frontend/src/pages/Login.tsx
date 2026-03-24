import React, { useState } from "react";
import { loginUser } from "../services/authApi";

type Props = {
  onSwitch: () => void;
  onLogin: () => void;
};

const Login: React.FC<Props> = ({ onSwitch }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await loginUser(email, password);

      // 🔐 Store JWT
      localStorage.setItem("token", data.access_token);

      alert("Login successful 🚀");

      // TODO: redirect to dashboard
    } catch (err) {
      alert("Invalid credentials ❌");
    }
  };

  return (
    <>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      <p onClick={onSwitch} className="toggle-text">
        Don't have an account? Sign Up
      </p>
    </>
  );
};

export default Login;