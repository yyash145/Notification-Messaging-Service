import React, { useState } from "react";
import "./Auth.css";
import Login from "./Login";
import Signup from "./Signup";

type Props = {
  onLogin: () => void;
};

const Auth: React.FC<Props> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container">
      <div className="auth-box">
        {isLogin ? (
          <Login
            onSwitch={() => setIsLogin(false)}
            onLogin={onLogin}
          />
        ) : (
          <Signup onSwitch={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};

export default Auth;