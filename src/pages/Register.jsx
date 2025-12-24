import { useState } from "react";
import { fetchPost } from "../api/api";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetchPost("/auth/register", {
        username,
        email,
        password,
      });

      if (res?.success) {
        navigate("/login");
      }
    } catch (err) {
      // err = ValidationProblemDetails
      if (err?.errors) {
        const msg = Object.values(err.errors)[0][0];
        setError(msg);
      } else if (err?.title) {
        setError(err.title);
      } else {
        setError("Registration failed. Enter valid data!");
      }
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      {error && <div className="register-error">{error}</div>}
      <form onSubmit={submit} className="register-form">
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="register-input"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="register-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="register-input"
          required
        />
        <button type="submit" className="register-button">
          Register
        </button>
      </form>
      <div class="register-container" style={{ textAlign: "center" }}>
        <button className="register-button" onClick={() => navigate("/login")}>
          Login
        </button>
      </div>
    </div>
  );
}
