import React, { useState } from "react";
import { signupUser } from "../services/authApi";

type Props = {
  onSwitch: () => void;
};

const Signup: React.FC<Props> = ({ onSwitch }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signupUser({ name, email, password });

      alert("Signup successful 🎉");
      onSwitch(); // go to login
    } catch {
      alert("Signup failed ❌");
    }
  };

  return (
    <>
      <h2>Sign Up</h2>

      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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

        <button type="submit">Sign Up</button>
      </form>

      <p onClick={onSwitch} className="toggle-text">
        Already have an account? Login
      </p>
    </>
  );
};

export default Signup;