import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";

type Props = {
  mode: "login" | "signup";
  onSubmit: (data: any) => Promise<any>;
};

const AuthForm: React.FC<Props> = ({ mode, onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await onSubmit(form);

    if (res?.data?.access_token) {
      localStorage.setItem("token", res.data.access_token);
      navigate("/home"); // ✅ fixed
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>
          {mode === "login" ? "Welcome Back 👋" : "Create Account 🚀"}
        </h2>

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <input
              name="name"
              placeholder="Name"
              onChange={handleChange}
              required
            />
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button type="submit">
            {mode === "login" ? "Login" : "Signup"}
          </button>
        </form>

        <p>
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}

          <span
            onClick={() =>
              navigate(mode === "login" ? "/signup" : "/")
            }
          >
            {mode === "login" ? " Signup" : " Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;