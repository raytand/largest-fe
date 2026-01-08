import { useEffect, useState } from "react";
import { fetchGet, setToken } from "../api/api";
import "./styles/Home.css";

export default function Home() {
  const [balances, setBalances] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) setToken(token);
    fetchGet("/balances")
      .then(setBalances)
      .catch(() => {});

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${yyyy}-${mm}-${dd}`;
    fetchGet(`/transactions?from=${formattedDate}&to=${formattedDate}`)
      .then(setTransactions)
      .catch(() => {});
  }, []);

  return (
    <div className="home-layout">
      {/* LEFT */}
      <div className="side-box">
        <h3>Balances</h3>
        {balances.length === 0 && <p className="muted">No balances</p>}
        {balances.map((b) => (
          <div key={b.id} className="item">
            <strong>{b.name}</strong>
            <span>
              {b.amount} {b.currency}
            </span>
          </div>
        ))}
      </div>

      {/* CENTER */}
      <div className="page-container">
        <h1 className="page-title">Welcome!</h1>
        <p className="page-text">
          This is your personal finance app. Track balances, categories, and
          transactions all in one place.
        </p>
      </div>

      {/* RIGHT */}
      <div className="side-box">
        <h3>Recent transactions</h3>
        {transactions.length === 0 && <p className="muted">No transactions</p>}
        {transactions.map((t) => (
          <div key={t.id} className="item">
            <strong>
              {t.amount} {t.currency}
            </strong>
            <span>{t.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
