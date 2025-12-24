import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Balances from "./pages/Balances.jsx";
import Categories from "./pages/Categories.jsx";
import Transactions from "./pages/Transactions.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { useLocation, Routes, Route } from "react-router-dom";

export default function App() {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";
  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/balances" element={<Balances />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}
