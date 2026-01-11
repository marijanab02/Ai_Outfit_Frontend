import api from "../api/axios";
import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await api.post("/login", { email, password });
      console.log(res.data); // vidiš token i user objekt
      localStorage.setItem("token", res.data.token);
      alert("Login uspješan!");
    } catch (err) {
      console.error(err.response.data);
      alert("Login neuspješan!");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
        value={email}
      />
      <input
        placeholder="Password"
        type="password"
        onChange={e => setPassword(e.target.value)}
        value={password}
      />
      <button onClick={login}>Login</button>
    </div>
  );
}

export default Login;
