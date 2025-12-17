import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-center">
        <NavLink
          to="/"
          className={({ isActive }) =>
            "navbar-link" + (isActive ? " active" : "")
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/balances"
          className={({ isActive }) =>
            "navbar-link" + (isActive ? " active" : "")
          }
        >
          Balances
        </NavLink>
        <NavLink
          to="/categories"
          className={({ isActive }) =>
            "navbar-link" + (isActive ? " active" : "")
          }
        >
          Categories
        </NavLink>
        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            "navbar-link" + (isActive ? " active" : "")
          }
        >
          Transactions
        </NavLink>
      </div>

      <div className="navbar-right">
        <NavLink
          to="/login"
          className={({ isActive }) =>
            "navbar-link" + (isActive ? " active" : "")
          }
        >
          Login
        </NavLink>
        <NavLink
          to="/register"
          className={({ isActive }) =>
            "navbar-link" + (isActive ? " active" : "")
          }
        >
          Register
        </NavLink>
      </div>
    </nav>
  );
}
