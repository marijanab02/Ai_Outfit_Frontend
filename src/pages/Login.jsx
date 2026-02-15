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
      localStorage.setItem("user", JSON.stringify(res.data.user)); // <-- dodaj ovo
      alert("Sign in successful!");

      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );

        const geoData = await geoRes.json();
        const city =
          geoData.address.city ||
          geoData.address.town ||
          geoData.address.village;

        if (city) {
          await fetch(`http://localhost:8000/api/users/${res.data.user.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${res.data.token}`,
            },
            body: JSON.stringify({
              location_city: city,
            }),
          });
        }
        alert(`Grad je uspješno promijenjen u: ${city}`);
      });
      navigate("/dashboard");
    } catch (err) {
      alert("Sign in failed!");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
      
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
            Don’t have an account? Sign up
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
