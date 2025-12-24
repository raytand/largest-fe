import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const logout = () => {
    localStorage.removeItem("authToken");

    setMessage("Logging out...");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const linkClass = ({ isActive }) =>
    "navbar-link" + (isActive ? " active" : "");

  return (
    <nav className="navbar">
      <div className="navbar-center">
        <NavLink to="/" className={linkClass}>
          Home
        </NavLink>
        <NavLink to="/balances" className={linkClass}>
          Balances
        </NavLink>
        <NavLink to="/categories" className={linkClass}>
          Categories
        </NavLink>
        <NavLink to="/transactions" className={linkClass}>
          Transactions
        </NavLink>
      </div>

      <div className="navbar-right">
        {message && <span className="navbar-link">{message}</span>}
        <NavLink to="/login" className={linkClass}>
          Login
        </NavLink>
        <NavLink to="/register" className={linkClass}>
          Register
        </NavLink>

        <button className="navbar-link navbar-logout" onClick={logout}>
          Log Out
        </button>
      </div>
    </nav>
  );
}
