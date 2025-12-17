import { useEffect, useState } from "react";
import { fetchGet, fetchPost, fetchDelete, setToken } from "../api/api";
import "./Transactions.css";

export default function Transactions() {
  const token = localStorage.getItem("authToken");
  if (token) setToken(token);

  const [transactions, setTransactions] = useState([]);
  const [balances, setBalances] = useState([]);
  const [categories, setCategories] = useState([]);

  const [balanceId, setBalanceId] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isIncome, setIsIncome] = useState(false);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 7))
      .toISOString()
      .slice(0, 10)
  );
  const [toDate, setToDate] = useState(new Date().toISOString().slice(0, 10));

  const loadTransactions = async () => {
    try {
      const data = await fetchGet(
        `/transactions?from=${fromDate}&to=${toDate}`
      );
      setTransactions(data);
    } catch (e) {
      setError(e.message);
    }
  };

  const loadBalances = async () => {
    try {
      const data = await fetchGet("/balances");
      setBalances(data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await fetchGet("/categories");
      setCategories(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadBalances();
    loadCategories();
    loadTransactions();
  }, []);

  const create = async () => {
    setError(null);
    if (!balanceId || !categoryId || !amount) {
      setError("Fill all required fields");
      return;
    }

    try {
      await fetchPost("/transactions", {
        balanceId: Number(balanceId),
        amount: Number(amount),
        categoryId: Number(categoryId),
        isIncome,
        description,
        date: new Date(date).toISOString(),
      });

      setAmount("");
      setDescription("");
      setCategoryId("");
      loadTransactions();
    } catch (e) {
      if (e?.errors) {
        const first = Object.values(e.errors)[0][0];
        setError(first);
      } else {
        setError(e.message);
      }
    }
  };

  const remove = async (id) => {
    try {
      await fetchDelete(`/transactions/${id}`);
      loadTransactions();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="transactions-container">
      <h2 className="transactions-title">Transactions</h2>

      {error && <div className="transactions-error">{error}</div>}

      <div className="transactions-date-filter">
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="transactions-input"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="transactions-input"
        />
        <button onClick={loadTransactions} className="transactions-button">
          Load
        </button>
      </div>

      <div className="transactions-form">
        <select
          value={balanceId}
          onChange={(e) => setBalanceId(e.target.value)}
          className="transactions-input"
        >
          <option value="">Select balance</option>
          {balances.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="transactions-input"
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="transactions-input"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="transactions-input"
        />

        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="transactions-input"
        />

        <div className="transactions-checkbox">
          <input
            type="checkbox"
            checked={isIncome}
            onChange={(e) => setIsIncome(e.target.checked)}
          />
          <label>Income</label>
        </div>

        <button onClick={create} className="transactions-button">
          Create
        </button>
      </div>

      <ul className="transactions-list">
        {transactions.map((t) => (
          <li key={t.id} className="transactions-item">
            <div className="transactions-info">
              <div>
                {t.isIncome ? "+" : "-"}
                {t.amount}
              </div>
              <div className="transactions-meta">
                {t.description} | {t.categoryName} | {t.balanceName}
              </div>
              <div className="transactions-date">{t.date.slice(0, 10)}</div>
            </div>
            <button
              onClick={() => remove(t.id)}
              className="transactions-action-button"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
