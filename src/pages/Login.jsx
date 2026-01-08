import { useState } from "react";
import { fetchPost, setToken } from "../api/api";
import { useNavigate } from "react-router-dom";
import "./styles/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetchPost("/auth/login", { email, password });

      if (res?.token) {
        localStorage.setItem("authToken", res.token);
        setToken(res.token);
        navigate("/transactions");
      }
    } catch (err) {
      if (err?.status === 401) {
        setError("Invalid email or password");
      } else if (err?.errors) {
        setError(Object.values(err.errors)[0][0]);
      } else if (err?.title) {
        setError(err.title);
      } else {
        setError("Login failed");
      }
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>

      {error && <div className="login-error">{error}</div>}

      <form onSubmit={submit} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          required
        />

        <button type="submit" className="login-button">
          Login
        </button>
      </form>
      <div class="login-container" style={{ textAlign: "center" }}>
        <button className="login-button" onClick={() => navigate("/register")}>
          Register
        </button>
      </div>
    </div>
  );
}
