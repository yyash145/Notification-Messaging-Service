import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import Login from "./Login";
import Signup from "./Signup";

type Props = {
  onLogin: () => void;
};

const Auth: React.FC<Props> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    onLogin();
    navigate("/home");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        {isLogin ? (
          <Login
            onSwitch={() => setIsLogin(false)}
            onLogin={handleLoginSuccess}
          />
        ) : (
          <Signup onSwitch={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};

export default Auth;