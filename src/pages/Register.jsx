import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { SketchPicker } from "react-color";

function Register() {


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

// unutar komponente
    const [colors, setColors] = useState([]);

    const handleAddColor = (color) => {
    setColors([...colors, color.hex]);
    };

  const navigate = useNavigate();

  const register = async () => {
    if (password !== passwordConfirmation) {
      alert("Lozinke se ne podudaraju!");
      return;
    }

    try {
      const res = await api.post("/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation, // Laravel koristi ovo za "confirmed"
        location_city: city,
        location_country: country,
        color_preferences: colors
      });

      console.log(res.data);
      localStorage.setItem("token", res.data.token);
      alert("Registracija uspješna!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data);
      alert("Registracija nije uspjela!");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Registracija</h2>
      <input placeholder="Ime" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Lozinka" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input placeholder="Potvrdi lozinku" type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} />
      <input placeholder="Grad" value={city} onChange={(e) => setCity(e.target.value)} />
      <input placeholder="Država" value={country} onChange={(e) => setCountry(e.target.value)} />
      <label>Boje koje volim</label>
        <SketchPicker
            color="#fff"
            onChangeComplete={handleAddColor}
        />
        <div>
            Odabrane boje: {colors.map(c => <span key={c} style={{background:c, width:20, height:20, display:"inline-block", marginRight:5}}></span>)}
        </div>

      <button onClick={register}>Registriraj se</button>
    </div>
  );
}

export default Register;
