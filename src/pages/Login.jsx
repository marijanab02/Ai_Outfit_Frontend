import api from "../api/axios";
import { useState } from "react";
import "./Login.css";
import fashionImg from "../assets/nova2.jpeg"; 
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);
      alert("Sign in successful!");
    } catch (err) {
      alert("Sign in failed!");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* LIJEVO */}
        <div
          className="login-left"
          style={{ backgroundImage: `url(${fashionImg})` }}
        >
          <div className="login-left-overlay">
            <div className="login-left-content">
              <h2>CLUELESS WARDROBE</h2>
              <p>SIGN IN</p>
            </div>
          </div>
        </div>

        {/* DESNO */}
        <div className="login-right">
          <div className="avatar">👤</div>
          <h2>SIGN IN</h2>

          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <span
            className="forgot"
            onClick={() => navigate("/register")}
          >
            SIGN UP
          </span>

          <button onClick={login} className="login-btn">
            SIGN IN
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
