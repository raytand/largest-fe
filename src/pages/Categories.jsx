import { useEffect, useState } from "react";
import { fetchGet, fetchPost, fetchDelete, setToken } from "../api/api";
import { useNavigate } from "react-router-dom";
import "./styles/Categories.css";

export default function Categories() {
  const token = localStorage.getItem("authToken");
  if (token) setToken(token);

  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      const data = await fetchGet("/categories");
      setCategories(data);
    } catch (e) {
      navigate("/login");
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

    try {
      await fetchPost("/categories", { name });
      setName("");
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

  const remove = async (id) => {
    try {
      await fetchDelete(`/categories/${id}`);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="categories-container">
      <h2 className="categories-title">Categories</h2>

      {error && <div className="categories-error">{error}</div>}

      <div className="categories-form">
        <input
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="categories-input"
        />
        <button onClick={create} className="categories-button">
          Create
        </button>
      </div>

      <ul className="categories-list">
        {categories.map((c) => (
          <li key={c.id} className="categories-item">
            <span className="categories-text">
              {c.name} {c.isIncome ? "➕" : "➖"}
            </span>

            <button
              onClick={() => remove(c.id)}
              className="categories-action-button"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
