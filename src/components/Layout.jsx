import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div>
      <nav style={{ marginBottom: "1rem" }}>
        <Link to="/home">Home</Link> | <Link to="/auth">Auth</Link> |{" "}
        <Link to="/balances">Balances</Link> |{" "}
        <Link to="/categories">Categories</Link> |{" "}
        <Link to="/transactions">Transactions</Link>
      </nav>
      <Outlet />
    </div>
  );
}
