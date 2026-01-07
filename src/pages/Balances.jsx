import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchGet,
  fetchPost,
  fetchPut,
  fetchDelete,
  setToken,
} from "../api/api";
import "./Balances.css";

const roleLabel = (r) => (r === 0 ? "Owner" : r === 1 ? "Editor" : "Viewer");

export default function Balances() {
  const token = localStorage.getItem("authToken");
  if (token) setToken(token);

  const navigate = useNavigate();
  const [balances, setBalances] = useState([]);
  const [error, setError] = useState(null);

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const [createForm, setCreateForm] = useState({
    name: "",
    amount: 0,
    currency: "UAH",
  });

  const [shareForms, setShareForms] = useState({});

  const load = async () => {
    try {
      setBalances(await fetchGet("/balances"));
    } catch {
      navigate("/login");
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* ---------- CREATE ---------- */

  const create = async () => {
    if (!createForm.name.trim()) return;

    await fetchPost("/balances", {
      name: createForm.name,
      initialAmount: createForm.amount,
      currency: createForm.currency,
    });

    setCreateForm({ name: "", amount: 0, currency: "UAH" });
    load();
  };

  /* ---------- EDIT ---------- */

  const startEdit = (b) => {
    if (b.role === 2) return;
    setEditId(b.id);
    setEditForm({
      name: b.name,
      amount: b.amount,
      currency: b.currency,
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm({});
  };

  const saveEdit = async (b) => {
    await fetchPut("/balances", {
      balanceId: b.id,
      name: editForm.name,
      amount: editForm.amount,
      currency: editForm.currency,
    });

    cancelEdit();
    load();
  };

  /* ---------- DELETE ---------- */

  const remove = async (b) => {
    if (b.role !== 0) return alert("Only owner");
    await fetchDelete(`/balances/${b.id}`);
    load();
  };

  const removeUser = async (balanceId, targetUserId) => {
    await fetchDelete(`/balances/${balanceId}/share/${targetUserId}`);
    load();
  };

  /* ---------- SHARE ---------- */

  const share = async (b) => {
    const f = shareForms[b.id];
    if (!f?.email) return;

    await fetchPost(`/balances/share/${b.id}`, {
      email: f.email,
      role: f.role,
    });

    setShareForms((s) => ({ ...s, [b.id]: { email: "", role: 2 } }));
    load();
  };

  return (
    <div className="balances-container">
      <h2 className="balances-title">Balances</h2>

      {/* CREATE */}
      <div className="balances-form">
        <input
          className="balances-input"
          placeholder="Name"
          value={createForm.name}
          onChange={(e) =>
            setCreateForm({ ...createForm, name: e.target.value })
          }
        />
        <input
          className="balances-input"
          type="number"
          placeholder="Amount"
          value={createForm.amount}
          onChange={(e) =>
            setCreateForm({ ...createForm, amount: +e.target.value })
          }
        />
        <input
          className="balances-input"
          placeholder="Currency"
          value={createForm.currency}
          onChange={(e) =>
            setCreateForm({ ...createForm, currency: e.target.value })
          }
        />
        <button className="balances-button" onClick={create}>
          Create
        </button>
      </div>

      {/* LIST */}
      <ul className="balances-list">
        {balances.map((b) => (
          <li key={b.id} className="balances-item">
            {/* HEADER */}
            <div className="balances-header">
              {editId === b.id ? (
                <>
                  <input
                    className="balances-input"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                  />
                  <input
                    className="balances-input"
                    type="number"
                    value={editForm.amount}
                    onChange={(e) =>
                      setEditForm({ ...editForm, amount: +e.target.value })
                    }
                  />
                  <input
                    className="balances-input"
                    value={editForm.currency}
                    onChange={(e) =>
                      setEditForm({ ...editForm, currency: e.target.value })
                    }
                  />
                </>
              ) : (
                <>
                  <strong>{b.name}</strong>
                  <span>
                    {b.amount} {b.currency}
                  </span>
                </>
              )}

              <span className="role-badge">{roleLabel(b.role)}</span>
            </div>

            {/* USERS */}
            <div className="balances-users">
              {b.users.map((u, i) => (
                <div key={i}>
                  {u.email} — {roleLabel(u.role)}{" "}
                  <button onClick={() => removeUser(b.id, u.userId)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* ACTIONS */}
            <div className="balances-actions">
              {editId === b.id ? (
                <>
                  <button onClick={() => saveEdit(b)}>Save</button>
                  <button onClick={cancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(b)}>Edit</button>
                  <button onClick={() => remove(b)}>Delete</button>
                </>
              )}
            </div>

            {/* SHARE */}
            {b.role === 0 && (
              <div className="share-form">
                <input
                  placeholder="User email"
                  value={shareForms[b.id]?.email || ""}
                  onChange={(e) =>
                    setShareForms((s) => ({
                      ...s,
                      [b.id]: { ...(s[b.id] || {}), email: e.target.value },
                    }))
                  }
                />
                <select
                  value={shareForms[b.id]?.role ?? 2}
                  onChange={(e) =>
                    setShareForms((s) => ({
                      ...s,
                      [b.id]: { ...(s[b.id] || {}), role: +e.target.value },
                    }))
                  }
                >
                  <option value={1}>Editor</option>
                  <option value={2}>Viewer</option>
                </select>
                <button onClick={() => share(b)}>Share</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
