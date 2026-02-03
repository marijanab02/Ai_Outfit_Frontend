import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { SketchPicker } from "react-color";
import "./Login.css";
import "./Register.css";
import fashionImg from "../assets/nova2.jpeg";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [colors, setColors] = useState([]);
  const [showPicker, setShowPicker] = useState(false);

  const navigate = useNavigate();

  const handleAddColor = (color) => {
    setColors((prev) => [...prev, color.hex]);
  };

  const removeColor = (indexToRemove) => {
    setColors((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const register = async () => {
    if (password !== passwordConfirmation) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await api.post("/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        location_city: city,
        location_country: country,
        color_preferences: colors,
      });

      localStorage.setItem("token", res.data.token);
      alert("Sign up successful!");
      navigate("/dashboard");
    } catch (err) {
      alert("Sign up failed!");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card register-card">
        <div
          className="login-left"
          style={{ backgroundImage: `url(${fashionImg})` }}
        >
          <div className="login-left-overlay">
            <div className="login-left-content">
              <h2>CLUELESS WARDROBE</h2>
              <p>SIGN UP</p>
            </div>
          </div>
        </div>

        <div className="login-right register-right">
          <div className="avatar">👤</div>
          <h2>SIGN UP</h2>

          <div className="form-grid">
            <div className="input-group">
              <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="input-group">
              <input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="input-group">
              <input
                placeholder="Confirm password"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
            </div>

            <div className="input-group">
              <input
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div className="input-group">
              <input
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>

          <div className="colors-block">
            <div className="colors-label">Color preferences</div>

            <div
              className="color-trigger"
              onClick={() => setShowPicker(!showPicker)}
            >
              {colors.length === 0 ? "Choose colors" : "Edit colors"}
            </div>

            {showPicker && (
              <div className="picker-popup">
                <SketchPicker color="#fff" onChangeComplete={handleAddColor} />
              </div>
            )}

            <div className="colors-preview">
              {colors.map((c, idx) => (
                <span
                  key={`${c}-${idx}`}
                  className="color-dot"
                  style={{ background: c, cursor: "pointer" }}
                  onClick={() => removeColor(idx)}
                  title="Remove color"
                />
              ))}
            </div>
          </div>

          <span className="forgot" onClick={() => navigate("/login")}>
            Already have an account? SIGN IN
          </span>

          <button onClick={register} className="login-btn">
            SIGN UP
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
