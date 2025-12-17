import { useEffect, useState } from "react";
import {
  fetchGet,
  fetchPost,
  fetchPut,
  fetchDelete,
  setToken,
} from "../api/api";
import "./Balances.css";

export default function Balances() {
  const token = localStorage.getItem("authToken");
  if (token) setToken(token);

  const [balances, setBalances] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState("UAH");
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      const data = await fetchGet("/balances");
      setBalances(data);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    setError(null);
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (amount <= 0) {
      setError("Initial amount must be greater than zero");
      return;
    }

    try {
      await fetchPost("/balances", {
        name,
        initialAmount: parseFloat(amount),
        currency,
      });
      setName("");
      setAmount(0);
      setCurrency("UAH");
      load();
    } catch (e) {
      if (e?.errors) {
        const msg = Object.values(e.errors)[0][0];
        setError(msg);
      } else {
        setError(e.message);
      }
    }
  };

  const update = async (balance) => {
    setError(null);
    const newAmount = prompt("New amount?", balance.amount);
    if (!newAmount) return;
    const newName = prompt("New name?", balance.name);
    const newCurrency = prompt("New currency?", balance.currency);

    try {
      await fetchPut("/balances", {
        balanceId: balance.id,
        amount: parseFloat(newAmount),
        name: newName,
        currency: newCurrency,
      });
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const remove = async (id) => {
    setError(null);
    try {
      await fetchDelete(`/balances/${id}`);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="balances-container">
      <h2 className="balances-title">Balances</h2>

      {error && <div className="balances-error">{error}</div>}

      <div className="balances-form">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="balances-input"
        />
        <input
          placeholder="Initial Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
          className="balances-input"
        />
        <input
          placeholder="Currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="balances-input"
        />
        <button onClick={create} className="balances-button">
          Create
        </button>
      </div>

      <ul className="balances-list">
        {balances.map((b) => (
          <li key={b.id} className="balances-item">
            <span className="balances-text">
              {b.name}: {b.amount} {b.currency}
            </span>
            <div className="balances-actions">
              <button
                onClick={() => update(b)}
                className="balances-action-button"
              >
                Edit
              </button>
              <button
                onClick={() => remove(b.id)}
                className="balances-action-button"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
